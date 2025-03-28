# authentication/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import WorkshopUser

@receiver(post_save, sender=WorkshopUser)
def assign_user_to_group(sender, instance, created, **kwargs):
    """
    Assigns a user to the appropriate group based on their role when they are created or their role is changed.
    """
    # Skip for superusers to avoid restricting permissions
    if instance.is_superuser:
        return
    
    # Get or create the groups
    admin_group, _ = Group.objects.get_or_create(name='Administrators')
    mechanic_group, _ = Group.objects.get_or_create(name='Mechanics')
    inventory_group, _ = Group.objects.get_or_create(name='Inventory Managers')
    receptionist_group, _ = Group.objects.get_or_create(name='Receptionists')
    
    # Remove user from all groups first to avoid duplicates
    instance.groups.clear()
    
    # Add user to the appropriate group based on role
    if instance.role == 'admin':
        instance.groups.add(admin_group)
    elif instance.role == 'mechanic':
        instance.groups.add(mechanic_group)
    elif instance.role == 'inventory_manager':
        instance.groups.add(inventory_group)
    elif instance.role == 'receptionist':
        instance.groups.add(receptionist_group)