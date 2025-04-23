from django.db import models

class Chamado(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    prioridade = models.CharField(max_length=10, choices=[
        ('baixa','Baixa'), ('media','Média'), ('alta','Alta')
    ])
    status = models.CharField(max_length=20, choices=[
        ('aberto','Aberto'), ('em_atendimento','Em Atendimento'), ('concluido','Concluído')
    ], default='aberto')
    responsavel = models.CharField(max_length=100, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_conclusao = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.titulo
