from django.db import models

class Chamado(models.Model):
    PRIORIDADE_CHOICES = [
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta')
    ]
    
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('em_atendimento', 'Em Atendimento'),
        ('concluido', 'Concluído')
    ]
    
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    prioridade = models.CharField(
        max_length=10,
        choices=PRIORIDADE_CHOICES,
        default='baixa',  # Valor padrão definido como 'baixa'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='aberto',  # Valor padrão para status
    )
    responsavel = models.CharField(max_length=100, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_conclusao = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.titulo
