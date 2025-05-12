from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from .models import Equipamento, SolicitacaoEquipamento
from .serializers import EquipamentoSerializer, SolicitacaoEquipamentoSerializer

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo == 'admin'

class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

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
