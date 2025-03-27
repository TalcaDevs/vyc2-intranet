from django.urls import path
from . import views

app_name = 'inventory'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),

   # Category URLs
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/add/ajax/', views.category_add_ajax, name='category_add_ajax'),
    path('categories/<int:pk>/edit/', views.CategoryUpdateView.as_view(), name='category_edit'),
    path('categories/<int:pk>/delete/', views.CategoryDeleteView.as_view(), name='category_delete'),
    
    # Comentamos temporalmente las URLs de Part hasta implementar sus vistas
     path('parts/', views.PartListView.as_view(), name='part_list'),
     path('parts/add/', views.PartCreateView.as_view(), name='part_add'),
     path('parts/<int:pk>/', views.PartDetailView.as_view(), name='part_detail'),
     path('parts/<int:pk>/edit/', views.PartUpdateView.as_view(), name='part_edit'),
    
    # StockMovement URLs
    path('movements/add/', views.add_stock_movement, name='add_movement'),
    path('movements/add/<int:part_id>/', views.add_stock_movement, name='add_movement_for_part'),

    # Supplier URLs
    path('suppliers/', views.SupplierListView.as_view(), name='supplier_list'),
    path('suppliers/add/', views.SupplierCreateView.as_view(), name='supplier_add'),
    path('suppliers/<int:pk>/', views.SupplierUpdateView.as_view(), name='supplier_edit'),
    path('suppliers/<int:pk>/delete/', views.SupplierDeleteView.as_view(), name='supplier_delete'),
]