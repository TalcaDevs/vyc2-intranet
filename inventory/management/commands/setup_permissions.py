# Create a management command to set up permissions
# Save this in inventory/management/commands/setup_permissions.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from inventory.models import Category, Supplier, Part, StockMovement
from authentication.models import WorkshopUser

class Command(BaseCommand):
    help = 'Establecer grupos y permisos para el sistema de gestión de inventario'

    def handle(self, *args, **options):
        # Create groups if they don't exist
        admin_group, _ = Group.objects.get_or_create(name='Administrators')
        mechanic_group, _ = Group.objects.get_or_create(name='Mechanics')
        inventory_group, _ = Group.objects.get_or_create(name='Inventory Managers')
        receptionist_group, _ = Group.objects.get_or_create(name='Receptionists')
        
        # Get content types for permissions
        category_ct = ContentType.objects.get_for_model(Category)
        supplier_ct = ContentType.objects.get_for_model(Supplier)
        part_ct = ContentType.objects.get_for_model(Part)
        movement_ct = ContentType.objects.get_for_model(StockMovement)
        user_ct = ContentType.objects.get_for_model(WorkshopUser)
        
        # Get all permissions
        category_permissions = Permission.objects.filter(content_type=category_ct)
        supplier_permissions = Permission.objects.filter(content_type=supplier_ct)
        part_permissions = Permission.objects.filter(content_type=part_ct)
        movement_permissions = Permission.objects.filter(content_type=movement_ct)
        user_permissions = Permission.objects.filter(content_type=user_ct)
        
        # Admin group gets all permissions
        admin_group.permissions.add(*category_permissions)
        admin_group.permissions.add(*supplier_permissions)
        admin_group.permissions.add(*part_permissions)
        admin_group.permissions.add(*movement_permissions)
        admin_group.permissions.add(*user_permissions)
        
        # Inventory Manager permissions
        inventory_view_permissions = [
            Permission.objects.get(codename='view_category', content_type=category_ct),
            Permission.objects.get(codename='add_category', content_type=category_ct),
            Permission.objects.get(codename='change_category', content_type=category_ct),
            Permission.objects.get(codename='view_supplier', content_type=supplier_ct),
            Permission.objects.get(codename='add_supplier', content_type=supplier_ct),
            Permission.objects.get(codename='change_supplier', content_type=supplier_ct),
            Permission.objects.get(codename='view_part', content_type=part_ct),
            Permission.objects.get(codename='add_part', content_type=part_ct),
            Permission.objects.get(codename='change_part', content_type=part_ct),
            Permission.objects.get(codename='view_stockmovement', content_type=movement_ct),
            Permission.objects.get(codename='add_stockmovement', content_type=movement_ct),
        ]
        inventory_group.permissions.add(*inventory_view_permissions)
        
        # Mechanic permissions
        mechanic_permissions = [
            Permission.objects.get(codename='view_category', content_type=category_ct),
            Permission.objects.get(codename='view_supplier', content_type=supplier_ct),
            Permission.objects.get(codename='view_part', content_type=part_ct),
            Permission.objects.get(codename='view_stockmovement', content_type=movement_ct),
            Permission.objects.get(codename='add_stockmovement', content_type=movement_ct),
        ]
        mechanic_group.permissions.add(*mechanic_permissions)
        
        # Receptionist permissions
        receptionist_permissions = [
            Permission.objects.get(codename='view_category', content_type=category_ct),
            Permission.objects.get(codename='view_supplier', content_type=supplier_ct),
            Permission.objects.get(codename='view_part', content_type=part_ct),
            Permission.objects.get(codename='view_stockmovement', content_type=movement_ct),
        ]
        receptionist_group.permissions.add(*receptionist_permissions)
        
        # Assign users to groups based on their role (if any users exist)
        for user in WorkshopUser.objects.all():
            # Remove from all groups first to avoid duplicates
            user.groups.clear()
            
            # Add to appropriate group based on role
            if user.role == 'admin':
                user.groups.add(admin_group)
            elif user.role == 'mechanic':
                user.groups.add(mechanic_group)
            elif user.role == 'inventory_manager':
                user.groups.add(inventory_group)
            elif user.role == 'receptionist':
                user.groups.add(receptionist_group)
        
        self.stdout.write(self.style.SUCCESS('Configurar correctamente grupos y permisos'))