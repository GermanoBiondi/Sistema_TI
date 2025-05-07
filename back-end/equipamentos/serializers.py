from rest_framework import serializers
from .models import Equipamento, SolicitacaoEquipamento

class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = '__all__'

class SolicitacaoEquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitacaoEquipamento
        fields = '__all__'
        read_only_fields = ['solicitante', 'data_solicitacao']
