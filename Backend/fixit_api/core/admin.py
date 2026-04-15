from django.contrib import admin
from .models import Service, Order, Prestador, DadosBancarios, Avaliacao, SolicitacaoSaque




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

class DadosBancariosInline(admin.StackedInline):
    model = DadosBancarios
    can_delete = False
    verbose_name = 'Dados Bancários'
    verbose_name_plural = 'Dados Bancários'
    extra = 1

@admin.register(Prestador)
class PrestadorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'servico', 'cidade', 'email', 'anos_experiencia', 'ativo', 'cadastrado_em')
    list_filter = ('servico', 'ativo')
    search_fields = ('nome', 'email', 'cpf')
    inlines = [DadosBancariosInline]

@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display  = ['order', 'nota', 'avaliador_user', 'avaliador_prestador',
                     'prestador_avaliado', 'user_avaliado', 'criado_em']
    list_filter   = ['nota', 'criado_em']
    search_fields = ['order__id', 'avaliador_user__email', 'prestador_avaliado__nome']

@admin.register(SolicitacaoSaque)
class SolicitacaoSaqueAdmin(admin.ModelAdmin):
    list_display  = ['prestador', 'valor', 'status', 'solicitado_em', 'processado_em']
    list_filter   = ['status']
    search_fields = ['prestador__nome']
    list_editable = ['status']   # permite aprovar/recusar direto na listagem
 

