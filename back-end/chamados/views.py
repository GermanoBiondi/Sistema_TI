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

<<<<<<< HEAD
        if user.is_superuser or user.is_staff:
            return self._update_chamado(chamado, data)

        elif user.groups.filter(name='tecnicos').exists():
            allowed_fields = {'tecnico_responsavel', 'status', 'titulo', 'descricao', 'prioridade'}
            if not set(data.keys()).issubset(allowed_fields):
                raise PermissionDenied("Técnicos só podem editar status, se autoatribuir, prioridade, título e descrição.")

            if 'tecnico_responsavel' in data and str(data['tecnico_responsavel']) != str(user.id):
                raise PermissionDenied("Técnicos só podem se autoatribuir.")

            return self._update_chamado(chamado, data)

        elif chamado.solicitante == user and chamado.status == 'aberto':
            allowed_fields = {'titulo', 'descricao'}
            if not set(data.keys()).issubset(allowed_fields):
                raise PermissionDenied("Você só pode editar título e descrição de chamados abertos.")
            return self._update_chamado(chamado, data)

        raise PermissionDenied("Você não tem permissão para editar este chamado.")

    def _update_chamado(self, chamado, data):
        serializer = self.get_serializer(chamado, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
=======
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
>>>>>>> 851419670cee2e2ba4741d63aa4b1fe8ea44e7c4
