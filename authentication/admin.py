from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import WorkshopUser

@admin.register(WorkshopUser)
class WorkshopUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Workshop Information', {'fields': ('phone', 'role', 'profile_image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Workshop Information', {'fields': ('phone', 'role', 'profile_image')}),
    )