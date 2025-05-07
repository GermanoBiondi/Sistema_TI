from django.db import models
from django.conf import settings  # Substitui o User direto

class Chamado(models.Model):
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('em_andamento', 'Em Andamento'),
        ('encerrado', 'Encerrado'),
    ]

    PRIORIDADE_CHOICES = [
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta'),
    ]

    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aberto')
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES, default='media')
    data_criacao = models.DateTimeField(auto_now_add=True)
    solicitante = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='chamados_solicitados',
        on_delete=models.CASCADE
    )
    tecnico_responsavel = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='chamados_atendidos',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.titulo
