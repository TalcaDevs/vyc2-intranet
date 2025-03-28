# inventory/templatetags/__init__.py
# Empty file to make the directory a Python package

# inventory/templatetags/inventory_tags.py
from django import template
from django.utils.html import format_html
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def stock_status_badge(part):
    """Display a colored badge based on stock status"""
    if part.is_low_stock:
        return format_html('<span class="badge bg-danger">Stock bajo: {}</span>', part.stock_quantity)
    else:
        return format_html('<span class="badge bg-success">{}</span>', part.stock_quantity)

@register.filter
def movement_type_badge(movement_type):
    """Display a colored badge based on movement type"""
    if movement_type == 'in':
        return format_html('<span class="badge bg-success">Ingresar stock</span>')
    elif movement_type == 'out':
        return format_html('<span class="badge bg-warning">Stock agotado</span>')
    else:
        return format_html('<span class="badge bg-secondary">Ajuste</span>')

@register.filter
def active_status_badge(is_active):
    """Display a colored badge based on active status"""
    if is_active:
        return format_html('<span class="badge bg-success">Activo</span>')
    else:
        return format_html('<span class="badge bg-danger">Inactivo</span>')