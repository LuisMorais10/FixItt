from django.contrib import admin
from .models import Service
from .models import Order


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("nome", "tipo", "ativo", "criado_em")
    list_filter = ("tipo", "ativo")
    search_fields = ("nome", "descricao")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'service', 'value', 'status', 'created_at')
    list_filter = ('status', 'service')
    search_fields = ('user__username',)

