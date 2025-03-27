from django import forms
from .models import Category, Supplier, Part, StockMovement

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }

class SupplierForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = ['name', 'contact_person', 'email', 'phone', 'address']
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
        }

class PartForm(forms.ModelForm):
    class Meta:
        model = Part
        fields = [
            'name', 'part_number', 'description', 'category', 
            'supplier', 'unit_price', 'stock_quantity', 
            'minimum_stock', 'location', 'image', 'is_active'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }

class StockMovementForm(forms.ModelForm):
    class Meta:
        model = StockMovement
        fields = ['part', 'quantity', 'movement_type', 'reference', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 3}),
        }