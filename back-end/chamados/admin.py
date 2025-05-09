from django.contrib import admin
from .models import Chamado

@admin.register(Chamado)
class ChamadoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'solicitante', 'tecnico_responsavel', 'status', 'prioridade', 'data_criacao')
    list_filter = ('status', 'prioridade')
    search_fields = ('titulo', 'descricao')
    raw_id_fields = ('solicitante', 'tecnico_responsavel')
    date_hierarchy = 'data_criacao'