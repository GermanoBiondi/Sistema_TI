from django.db import models
from django.conf import settings

class SolicitacaoEquipamento(models.Model):
    equipamento = models.ForeignKey('Equipamento', on_delete=models.CASCADE)
    descricao = models.TextField(blank=True)
    resposta = models.TextField(blank=True, null=True)
    data_solicitacao = models.DateTimeField(auto_now_add=True)
    solicitante = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, default='Pendente')

class Equipamento(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome
