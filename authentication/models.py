from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class WorkshopUser(AbstractUser):
    """Custom User Model for workshop employees"""
    ROLE_CHOICES = [
        ('admin', _('Administración')),
        ('mechanic', _('Mecanico')),
        ('inventory_manager', _('Encargado de inventario')),
        ('receptionist', _('Recepcionista')),
    ]
    
    phone = models.CharField(_("Phone Number"), max_length=20, blank=True)
    role = models.CharField(_("Role"), max_length=20, choices=ROLE_CHOICES, default='mechanic')
    is_active = models.BooleanField(_("Active"), default=True)
    profile_image = models.ImageField(_("Profile Image"), upload_to="profile_pics/", blank=True, null=True)
    
    class Meta:
        verbose_name = _("Workshop User")
        verbose_name_plural = _("Workshop Users")
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"