from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Equipamento, SolicitacaoEquipamento
from .serializers import EquipamentoSerializer, SolicitacaoEquipamentoSerializer

# views.py  
class SolicitacaoEquipamentoViewSet(viewsets.ModelViewSet):
    queryset = SolicitacaoEquipamento.objects.all()
    serializer_class = SolicitacaoEquipamentoSerializer

    def perform_create(self, serializer):
        serializer.save(solicitante=self.request.user)
