from rest_framework import serializers
from .models import SolicitacaoEquipamento

class SolicitacaoEquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitacaoEquipamento
        fields = '__all__'

    def validate(self, data):
        # Exemplo: colaborador e equipamento não podem ser iguais
        if data.get('colaborador') == data.get('equipamento'):
            raise serializers.ValidationError(
                "O colaborador e o equipamento devem ser diferentes."
            )
        return data