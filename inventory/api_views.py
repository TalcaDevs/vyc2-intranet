# inventory/api_views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
import json

from .models import Category, Supplier, Part

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

@require_POST
@login_required
def supplier_add_ajax(request):
    """API endpoint to add a supplier via AJAX"""
    try:
        data = json.loads(request.body)
        name = data.get('name')
        contact_person = data.get('contact_person', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        
        if not name:
            return JsonResponse({'success': False, 'error': 'Supplier name is required'})
        
        supplier = Supplier.objects.create(
            name=name, 
            contact_person=contact_person,
            email=email,
            phone=phone
        )
        
        return JsonResponse({
            'success': True, 
            'supplier_id': supplier.id,
            'supplier_name': supplier.name
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})