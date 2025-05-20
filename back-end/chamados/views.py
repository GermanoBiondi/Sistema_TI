from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Chamado
from .serializers import ChamadoSerializer

class ChamadoViewSet(viewsets.ModelViewSet):
    serializer_class = ChamadoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'prioridade']
    search_fields = ['titulo', 'descricao']
    ordering_fields = ['data_criacao']

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.tipo == 'admin':
            return Chamado.objects.all().order_by('-data_criacao')

        elif user.tipo == 'tecnico':
            return Chamado.objects.filter(
                Q(tecnico_responsavel=user) |
                Q(status='aberto', tecnico_responsavel__isnull=True)
            ).order_by('-data_criacao')

        return Chamado.objects.filter(solicitante=user).order_by('-data_criacao')

    def perform_create(self, serializer):
        serializer.save(solicitante=self.request.user)

    def update(self, request, *args, **kwargs):
        chamado = self.get_object()
        user = request.user
        data = request.data

        if user.is_superuser or user.tipo == 'admin':
            return self._update_chamado(chamado, data)

        elif user.tipo == 'tecnico':
            if chamado.tecnico_responsavel and chamado.tecnico_responsavel != user:
                raise PermissionDenied("Você não pode editar chamados atribuídos a outro técnico.")

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

    @action(detail=True, methods=['post'])
    def encerrar(self, request, pk=None):
        chamado = self.get_object()
        user = request.user

        # Verifica se já está encerrado
        if chamado.status == 'encerrado':
            return Response({'detail': 'Este chamado já está encerrado.'}, status=status.HTTP_400_BAD_REQUEST)

        # Admin ou superuser pode encerrar qualquer um
        if user.is_superuser or user.tipo == 'admin':
            chamado.status = 'encerrado'
            chamado.save()
            return Response({'detail': 'Chamado encerrado com sucesso.'})

        # Técnico pode encerrar apenas os chamados atribuídos a ele
        if user.tipo == 'tecnico':
            if chamado.tecnico_responsavel != user:
                raise PermissionDenied("Você só pode encerrar chamados atribuídos a você.")
            chamado.status = 'encerrado'
            chamado.save()
            return Response({'detail': 'Chamado encerrado com sucesso.'})

        # Usuário comum não pode encerrar
        raise PermissionDenied("Você não tem permissão para encerrar este chamado.")
