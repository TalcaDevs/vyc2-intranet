from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages
from django.db.models import Sum, Count, Q, F
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

from .models import Category, Supplier, Part, StockMovement
from .forms import CategoryForm, SupplierForm, PartForm, StockMovementForm

# Dashboard view
@login_required
def dashboard(request):
    """Display inventory dashboard with stats and alerts"""
    # Count metrics
    total_parts = Part.objects.count()
    total_categories = Category.objects.count()
    total_suppliers = Supplier.objects.count()
    
    # Low stock alerts
    low_stock_parts = Part.objects.filter(stock_quantity__lte=F('minimum_stock'))
    
    # Recent movements
    recent_movements = StockMovement.objects.select_related('part', 'performed_by').order_by('-created_at')[:10]
    
    # For modal forms
    categories = Category.objects.all()
    suppliers = Supplier.objects.all()
    all_parts = Part.objects.filter(is_active=True)
    
    context = {
        'total_parts': total_parts,
        'total_categories': total_categories,
        'total_suppliers': total_suppliers,
        'low_stock_parts': low_stock_parts,
        'recent_movements': recent_movements,
        'categories': categories,
        'suppliers': suppliers,
        'all_parts': all_parts,
    }
    return render(request, 'inventory/dashboard.html', context)

# Category views
class CategoryListView(LoginRequiredMixin, ListView):
    model = Category
    template_name = 'inventory/category_list.html'
    context_object_name = 'categories'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.GET.get('search', '')
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)
        return queryset.order_by('name')

class CategoryCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Category
    form_class = CategoryForm
    template_name = 'inventory/category_form.html'
    success_url = reverse_lazy('inventory:category_list')
    permission_required = 'inventory.add_category'
    
    def form_valid(self, form):
        messages.success(self.request, 'Category created successfully!')
        return super().form_valid(form)

class CategoryUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Category
    form_class = CategoryForm
    template_name = 'inventory/category_form.html'
    success_url = reverse_lazy('inventory:category_list')
    permission_required = 'inventory.change_category'
    
    def form_valid(self, form):
        messages.success(self.request, 'Category updated successfully!')
        return super().form_valid(form)

class CategoryDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Category
    template_name = 'inventory/category_confirm_delete.html'
    success_url = reverse_lazy('inventory:category_list')
    permission_required = 'inventory.delete_category'
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, 'Category deleted successfully!')
        return super().delete(request, *args, **kwargs)

# Part views
class PartListView(LoginRequiredMixin, ListView):
    model = Part
    template_name = 'inventory/part_list.html'
    context_object_name = 'parts'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.GET.get('search', '')
        category_filter = self.request.GET.get('category', '')
        
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(part_number__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        
        if category_filter:
            queryset = queryset.filter(category_id=category_filter)
            
        return queryset.select_related('category', 'supplier')
        
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class PartDetailView(LoginRequiredMixin, DetailView):
    model = Part
    template_name = 'inventory/part_detail.html'
    context_object_name = 'part'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Get stock movement history for this part
        context['movements'] = StockMovement.objects.filter(part=self.object).select_related('performed_by').order_by('-created_at')[:10]
        return context

class PartCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Part
    form_class = PartForm
    template_name = 'inventory/part_form.html'
    success_url = reverse_lazy('inventory:part_list')
    permission_required = 'inventory.add_part'
    
    def form_valid(self, form):
        messages.success(self.request, 'Part created successfully!')
        return super().form_valid(form)
    
    def form_invalid(self, form):
        messages.error(self.request, 'Error creating part. Please check the form.')
        return super().form_invalid(form)
    
    def get_success_url(self):
        return reverse_lazy('inventory:part_detail', kwargs={'pk': self.object.pk})

class PartUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Part
    form_class = PartForm
    template_name = 'inventory/part_form.html'
    permission_required = 'inventory.change_part'
    
    def form_valid(self, form):
        messages.success(self.request, 'Part updated successfully!')
        return super().form_valid(form)
    
    def get_success_url(self):
        return reverse_lazy('inventory:part_detail', kwargs={'pk': self.object.pk})

# Stock movement view
@login_required
@permission_required('inventory.add_stockmovement', raise_exception=True)
def add_stock_movement(request, part_id=None):
    """Add a stock movement (in/out/adjustment)"""
    # If part_id is provided, pre-select that part
    initial = {}
    if part_id:
        part = get_object_or_404(Part, id=part_id)
        initial = {'part': part}
    
    if request.method == 'POST':
        form = StockMovementForm(request.POST)
        if form.is_valid():
            movement = form.save(commit=False)
            movement.performed_by = request.user
            movement.save()
            
            # Get the part name for the success message
            part_name = movement.part.name
            
            messages.success(request, f'Stock movement for {part_name} recorded successfully!')
            return redirect('inventory:part_detail', pk=movement.part.id)
        else:
            # If form is invalid, show error messages
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'Error in {field}: {error}')
    else:
        form = StockMovementForm(initial=initial)
    
    return render(request, 'inventory/stock_movement_form.html', {'form': form})

@require_POST
@login_required
@permission_required('inventory.add_category')
def category_add_ajax(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        description = data.get('description', '')
        
        if not name:
            return JsonResponse({'success': False, 'error': 'Category name is required'})
        
        category = Category.objects.create(name=name, description=description)
        
        return JsonResponse({
            'success': True, 
            'category_id': category.id,
            'category_name': category.name
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# Supplier views
class SupplierListView(LoginRequiredMixin, ListView):
    model = Supplier
    template_name = 'inventory/supplier_list.html'
    context_object_name = 'suppliers'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.GET.get('search', '')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(contact_person__icontains=search_query) |
                Q(email__icontains=search_query)
            )
        return queryset.order_by('name')

class SupplierCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Supplier
    form_class = SupplierForm
    template_name = 'inventory/supplier_form.html'
    success_url = reverse_lazy('inventory:supplier_list')
    permission_required = 'inventory.add_supplier'
    
    def form_valid(self, form):
        messages.success(self.request, 'Supplier created successfully!')
        return super().form_valid(form)

class SupplierUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Supplier
    form_class = SupplierForm
    template_name = 'inventory/supplier_form.html'
    success_url = reverse_lazy('inventory:supplier_list')
    permission_required = 'inventory.change_supplier'
    
    def form_valid(self, form):
        messages.success(self.request, 'Supplier updated successfully!')
        return super().form_valid(form)

class SupplierDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Supplier
    template_name = 'inventory/supplier_confirm_delete.html'
    success_url = reverse_lazy('inventory:supplier_list')
    permission_required = 'inventory.delete_supplier'
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, 'Supplier deleted successfully!')
        return super().delete(request, *args, **kwargs)

def search_view(request):
    query = request.GET.get('q', '')
    # Lógica de búsqueda aquí
    results = []
    if query:
        results = Part.objects.filter(
            Q(name__icontains=query) | 
            Q(part_number__icontains=query) |
            Q(description__icontains=query)
        )
    return render(request, 'inventory/search_results.html', {
        'query': query,
        'results': results
    })

# API Views
@login_required
def part_detail_api(request, pk):
    """API endpoint to get part details for AJAX calls"""
    try:
        part = get_object_or_404(Part, pk=pk)
        data = {
            'id': part.id,
            'name': part.name,
            'part_number': part.part_number,
            'stock_quantity': part.stock_quantity,
            'minimum_stock': part.minimum_stock,
            'is_low_stock': part.is_low_stock,
            'unit_price': float(part.unit_price),
            'category': part.category.name,
            'supplier': part.supplier.name if part.supplier else None,
            'location': part.location,
        }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)