from rest_framework import serializers
from .models import Chamado

class ChamadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chamado
        # Listamos explicitamente os campos para ter controle sobre read_only_fields
        fields = [
            'id',
            'titulo',
            'descricao',
            'prioridade',
            'status',
            'responsavel',
            'data_criacao',
            'data_conclusao',
        ]
        read_only_fields = [
            'prioridade',      # será definido como 'baixa' por default
            'status',          # somente o técnico/admin poderá alterar
            'responsavel',     # atribuído pelo back-end
            'data_criacao',
            'data_conclusao',
        ]

    # Mantivemos a validação caso o campo venha a ser atualizado em outra endpoint
    def validate_prioridade(self, value):
        if value not in ['baixa', 'media', 'alta']:
            raise serializers.ValidationError("Prioridade inválida.")
        return value
