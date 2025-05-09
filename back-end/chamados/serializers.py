from rest_framework import serializers
from .models import Chamado
from contas.models import CustomUser  # Certifique-se de importar seu modelo de usuário

class ChamadoSerializer(serializers.ModelSerializer):
    solicitante = serializers.ReadOnlyField(source='solicitante.username')
    tecnico_responsavel_nome = serializers.ReadOnlyField(source='tecnico_responsavel.username')

    # Aqui está a parte nova: filtra para mostrar apenas técnicos
    tecnico_responsavel = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(tipo='tecnico'),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Chamado
        fields = '__all__'
        read_only_fields = ['solicitante']
