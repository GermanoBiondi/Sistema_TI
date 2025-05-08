from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.db.models import Q

from .models import Chamado
from .serializers import ChamadoSerializer

class ChamadoViewSet(viewsets.ModelViewSet):
    queryset = Chamado.objects.all().order_by('-data_criacao')
    serializer_class = ChamadoSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        if user.groups.filter(name='tecnico').exists():
            return self.queryset.filter(
                Q(tecnico_responsavel=user) | 
                Q(status='aberto', tecnico_responsavel__isnull=True)
            )
        return self.queryset.filter(solicitante=user)

    @action(detail=True, methods=['post'])
    def atribuir(self, request, pk=None):
        chamado = self.get_object()
        if not request.user.is_superuser and not request.user.groups.filter(name='tecnico').exists():
            raise PermissionDenied("Sem permissão para atribuir chamados")
        
        tecnico_id = request.data.get('tecnico_id')
        if tecnico_id and not request.user.is_superuser:
            raise PermissionDenied("Apenas administradores podem atribuir a outros técnicos")
        
        try:
            chamado = Chamado.atribuir_tecnico(chamado.id, tecnico_id)
            return Response(self.get_serializer(chamado).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def classificar(self, request, pk=None):
        chamado = self.get_object()
        if chamado.solicitante != request.user and not request.user.is_superuser:
            raise PermissionDenied("Apenas o solicitante pode classificar")
        
        prioridade = request.data.get('prioridade')
        if prioridade not in dict(Chamado.PRIORIDADE_CHOICES).keys():
            return Response({'error': 'Prioridade inválida'}, status=status.HTTP_400_BAD_REQUEST)
        
        chamado.prioridade = prioridade
        chamado.save()
        return Response(self.get_serializer(chamado).data)