from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import WorkshopUser

class WorkshopUserCreationForm(UserCreationForm):
    class Meta:
        model = WorkshopUser
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'role']

class WorkshopUserChangeForm(UserChangeForm):
    class Meta:
        model = WorkshopUser
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_active', 'profile_image']