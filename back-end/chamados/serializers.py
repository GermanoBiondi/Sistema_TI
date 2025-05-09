# serializers.py
from rest_framework import serializers
from .models import Chamado

class ChamadoSerializer(serializers.ModelSerializer):
    solicitante = serializers.ReadOnlyField(source='solicitante.username')  # ou .id se preferir

    class Meta:
        model = Chamado
        fields = '__all__'
        read_only_fields = ['solicitante']
