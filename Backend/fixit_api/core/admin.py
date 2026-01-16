from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("nome", "tipo", "ativo", "criado_em")
    list_filter = ("tipo", "ativo")
    search_fields = ("nome", "descricao")


