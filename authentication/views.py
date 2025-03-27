from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages
from .models import WorkshopUser
from .forms import WorkshopUserCreationForm, WorkshopUserChangeForm

@login_required
def profile_view(request):
    """View and edit the current user's profile"""
    if request.method == 'POST':
        form = WorkshopUserChangeForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('authentication:profile')
    else:
        form = WorkshopUserChangeForm(instance=request.user)
    
    return render(request, 'authentication/profile.html', {'form': form})

@login_required
@permission_required('auth.view_user')
def user_list(request):
    """List all workshop users"""
    users = WorkshopUser.objects.all()
    return render(request, 'authentication/user_list.html', {'users': users})

@login_required
@permission_required('auth.add_user')
def add_user(request):
    """Add a new workshop user"""
    if request.method == 'POST':
        form = WorkshopUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'User created successfully!')
            return redirect('authentication:user_list')
    else:
        form = WorkshopUserCreationForm()
    
    return render(request, 'authentication/user_form.html', {'form': form})

@login_required
@permission_required('auth.change_user')
def edit_user(request, user_id):
    """Edit an existing workshop user"""
    user = get_object_or_404(WorkshopUser, id=user_id)
    
    if request.method == 'POST':
        form = WorkshopUserChangeForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, 'User updated successfully!')
            return redirect('authentication:user_list')
    else:
        form = WorkshopUserChangeForm(instance=user)
    
    return render(request, 'authentication/user_form.html', {'form': form, 'edit_mode': True})

def logout_view(request):
    logout(request)
    return redirect('authentication:login')