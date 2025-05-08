from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

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
    data_atribuicao = models.DateTimeField(null=True, blank=True)
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
        return f"{self.titulo} ({self.get_status_display()})"

    @classmethod
    def atribuir_tecnico(cls, chamado_id, tecnico_id=None):
        chamado = cls.objects.get(pk=chamado_id)
        User = get_user_model()
        
        if tecnico_id:
            tecnico = User.objects.get(pk=tecnico_id, groups__name='tecnico')
            chamado.tecnico_responsavel = tecnico
        else:
            # Atribuição automática balanceada
            tecnico = User.objects.filter(
                groups__name='tecnico'
            ).annotate(
                num_chamados=models.Count(
                    'chamados_atendidos',
                    filter=models.Q(chamados_atendidos__status='em_andamento')
                )
            ).order_by('num_chamados').first()
            
            if tecnico:
                chamado.tecnico_responsavel = tecnico
        
        if chamado.tecnico_responsavel:
            chamado.status = 'em_andamento'
            chamado.data_atribuicao = timezone.now()
            chamado.save()
        
        return chamado

    def usuario_pode_visualizar(self, user):
        if user.is_superuser:
            return True
        if self.solicitante == user:
            return True
        if user.groups.filter(name='tecnico').exists():
            return (self.tecnico_responsavel == user) or (self.status == 'aberto' and not self.tecnico_responsavel)
        return False