from rest_framework import serializers
from .models import Chamado

class ChamadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chamado
        fields = '__all__'

    def validate_prioridade(self, value):
        if value not in ['baixa', 'media', 'alta']:
            raise serializers.ValidationError("Prioridade inválida.")
        return value