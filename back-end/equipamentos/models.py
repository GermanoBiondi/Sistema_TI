from django.db import models

class SolicitacaoEquipamento(models.Model):
    colaborador = models.CharField(max_length=100)
    equipamento = models.CharField(max_length=100)
    justificativa = models.TextField()
    status = models.CharField(max_length=10, choices=[
        ('pendente','Pendente'), ('aprovado','Aprovado'), ('negado','Negado')
    ], default='pendente')
    data_solicitacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.colaborador} - {self.equipamento}"