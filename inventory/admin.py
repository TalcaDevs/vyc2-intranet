from django.contrib import admin
from .models import Category, Supplier, Part, StockMovement

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'phone', 'email')
    search_fields = ('name', 'contact_person', 'email')

@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ('name', 'part_number', 'category', 'supplier', 'stock_quantity', 'unit_price', 'is_low_stock', 'is_active')
    list_filter = ('category', 'supplier', 'is_active')
    search_fields = ('name', 'part_number', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('part', 'movement_type', 'quantity', 'performed_by', 'created_at')
    list_filter = ('movement_type', 'created_at')
    search_fields = ('part__name', 'reference', 'notes')
    readonly_fields = ('created_at',)