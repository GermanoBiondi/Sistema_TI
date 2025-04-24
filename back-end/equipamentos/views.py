from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import SolicitacaoEquipamento
from .serializers import SolicitacaoEquipamentoSerializer

class SolicitacaoEquipamentoViewSet(viewsets.ModelViewSet):
    queryset = SolicitacaoEquipamento.objects.all().order_by('-data_solicitacao')
    serializer_class = SolicitacaoEquipamentoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['descricao']
    ordering_fields = ['data_solicitacao']