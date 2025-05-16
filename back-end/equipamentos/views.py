from rest_framework import viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from .models import Equipamento, SolicitacaoEquipamento
from .serializers import EquipamentoSerializer, SolicitacaoEquipamentoSerializer

# Permissão para liberar leitura para todos autenticados, mas escrita só para admins
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Se for um método de leitura (GET, HEAD, OPTIONS), qualquer usuário autenticado pode
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        # Para métodos de escrita (POST, PUT, DELETE), só admins
        return request.user.is_authenticated and request.user.tipo == 'admin'

# ViewSet para Equipamento
class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

# ViewSet para Solicitação de Equipamento
class SolicitacaoEquipamentoViewSet(viewsets.ModelViewSet):
    serializer_class = SolicitacaoEquipamentoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.tipo == 'admin':
            return SolicitacaoEquipamento.objects.all()
        return SolicitacaoEquipamento.objects.filter(solicitante=user)

    def perform_create(self, serializer):
        serializer.save(solicitante=self.request.user)
