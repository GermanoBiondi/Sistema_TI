from rest_framework import serializers
from .models import Equipamento, SolicitacaoEquipamento

class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = '__all__'

class SolicitacaoEquipamentoSerializer(serializers.ModelSerializer):
    equipamento = EquipamentoSerializer(read_only=True)
    equipamento_id = serializers.PrimaryKeyRelatedField(
        queryset=Equipamento.objects.all(),
        source='equipamento',
        write_only=True
    )
    solicitante_nome = serializers.CharField(source='solicitante.username', read_only=True)

    class Meta:
        model = SolicitacaoEquipamento
        fields = '__all__'
        read_only_fields = ['solicitante', 'data_solicitacao']
