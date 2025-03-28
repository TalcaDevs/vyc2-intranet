# Generated by Django 5.1.7 on 2025-03-20 05:15

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('contact_person', models.CharField(blank=True, max_length=100, verbose_name='Contact Person')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('phone', models.CharField(blank=True, max_length=20, verbose_name='Phone')),
                ('address', models.TextField(blank=True, verbose_name='Address')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
            ],
            options={
                'verbose_name': 'Supplier',
                'verbose_name_plural': 'Suppliers',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Part',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('part_number', models.CharField(max_length=50, unique=True, verbose_name='Part Number')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Unit Price')),
                ('stock_quantity', models.PositiveIntegerField(default=0, verbose_name='Stock Quantity')),
                ('minimum_stock', models.PositiveIntegerField(default=1, verbose_name='Minimum Stock Level')),
                ('location', models.CharField(blank=True, max_length=100, verbose_name='Storage Location')),
                ('image', models.ImageField(blank=True, null=True, upload_to='parts/', verbose_name='Image')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='parts', to='inventory.category', verbose_name='Category')),
                ('supplier', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='supplied_parts', to='inventory.supplier', verbose_name='Supplier')),
            ],
            options={
                'verbose_name': 'Part',
                'verbose_name_plural': 'Parts',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='StockMovement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(verbose_name='Quantity')),
                ('movement_type', models.CharField(choices=[('in', 'Stock In'), ('out', 'Stock Out'), ('adjustment', 'Adjustment')], max_length=20, verbose_name='Movement Type')),
                ('reference', models.CharField(blank=True, max_length=100, verbose_name='Reference')),
                ('notes', models.TextField(blank=True, verbose_name='Notes')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('part', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movements', to='inventory.part', verbose_name='Part')),
                ('performed_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stock_movements', to=settings.AUTH_USER_MODEL, verbose_name='Performed By')),
            ],
            options={
                'verbose_name': 'Stock Movement',
                'verbose_name_plural': 'Stock Movements',
                'ordering': ['-created_at'],
            },
        ),
    ]
