from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    TIPO_CHOICES = [
        ('admin', 'Administrador'),
        ('tecnico', 'Técnico'),
        ('usuario', 'Usuário Comum'),
    ]
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='usuario')

    def __str__(self):
        return self.username  # Ou você pode retornar o tipo se preferir: f"{self.username} ({self.get_tipo_display()})"
