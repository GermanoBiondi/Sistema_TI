from rest_framework import serializers
from .models import Chamado
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']

class ChamadoSerializer(serializers.ModelSerializer):
    solicitante = UserSerializer(read_only=True)
    tecnico_responsavel = UserSerializer(read_only=True)
    status = serializers.CharField(read_only=True)
    data_criacao = serializers.DateTimeField(read_only=True)
    data_atribuicao = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Chamado
        fields = '__all__'
        extra_kwargs = {
            'prioridade': {'required': True}
        }