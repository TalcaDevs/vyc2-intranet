from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Category(models.Model):
    """Model for inventory categories"""
    name = models.CharField(_("Name"), max_length=100)
    description = models.TextField(_("Description"), blank=True)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)
    
    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ["name"]
    
    def __str__(self):
        return self.name

class Supplier(models.Model):
    """Model for parts suppliers"""
    name = models.CharField(_("Name"), max_length=100)
    contact_person = models.CharField(_("Contact Person"), max_length=100, blank=True)
    email = models.EmailField(_("Email"), blank=True)
    phone = models.CharField(_("Phone"), max_length=20, blank=True)
    address = models.TextField(_("Address"), blank=True)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)
    
    class Meta:
        verbose_name = _("Supplier")
        verbose_name_plural = _("Suppliers")
        ordering = ["name"]
    
    def __str__(self):
        return self.name

class Part(models.Model):
    """Model for inventory parts/items"""
    name = models.CharField(_("Name"), max_length=100)
    part_number = models.CharField(_("Part Number"), max_length=50, unique=True)
    description = models.TextField(_("Description"), blank=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT, 
        related_name="parts",
        verbose_name=_("Category")
    )
    supplier = models.ForeignKey(
        Supplier, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="supplied_parts",
        verbose_name=_("Supplier")
    )
    unit_price = models.DecimalField(_("Unit Price"), max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(_("Stock Quantity"), default=0)
    minimum_stock = models.PositiveIntegerField(_("Minimum Stock Level"), default=1)
    location = models.CharField(_("Storage Location"), max_length=100, blank=True)
    image = models.ImageField(_("Image"), upload_to="parts/", blank=True, null=True)
    is_active = models.BooleanField(_("Active"), default=True)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)
    
    class Meta:
        verbose_name = _("Part")
        verbose_name_plural = _("Parts")
        ordering = ["name"]
    
    def __str__(self):
        return f"{self.name} ({self.part_number})"
    
    @property
    def is_low_stock(self):
        """Check if the part has low stock"""
        return self.stock_quantity <= self.minimum_stock

class StockMovement(models.Model):
    """Model for tracking inventory movements"""
    MOVEMENT_TYPE_CHOICES = [
        ('in', _('Stock In')),
        ('out', _('Stock Out')),
        ('adjustment', _('Adjustment')),
    ]
    
    part = models.ForeignKey(
        Part, 
        on_delete=models.CASCADE,
        related_name="movements",
        verbose_name=_("Part")
    )
    quantity = models.IntegerField(_("Quantity"))
    movement_type = models.CharField(_("Movement Type"), max_length=20, choices=MOVEMENT_TYPE_CHOICES)
    reference = models.CharField(_("Reference"), max_length=100, blank=True)
    notes = models.TextField(_("Notes"), blank=True)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="stock_movements",
        verbose_name=_("Performed By")
    )
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    
    class Meta:
        verbose_name = _("Stock Movement")
        verbose_name_plural = _("Stock Movements")
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.part.name} ({self.quantity})"
    
    def save(self, *args, **kwargs):
        """Override save to update part stock quantity"""
        # For new movements only
        if not self.pk:
            if self.movement_type == 'in':
                self.part.stock_quantity += self.quantity
            elif self.movement_type == 'out':
                self.part.stock_quantity -= self.quantity
            elif self.movement_type == 'adjustment':
                # For adjustments, the quantity reflects the change
                self.part.stock_quantity += self.quantity
            
            self.part.save()
        
        super().save(*args, **kwargs)