from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
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

        if user.is_superuser or user.is_staff:
            return Chamado.objects.all().order_by('-data_criacao')

        elif user.groups.filter(name='tecnicos').exists():
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
