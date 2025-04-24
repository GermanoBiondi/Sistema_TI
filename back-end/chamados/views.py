from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Chamado
from .serializers import ChamadoSerializer

class ChamadoViewSet(viewsets.ModelViewSet):
    queryset = Chamado.objects.all().order_by('-data_criacao')
    serializer_class = ChamadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'prioridade']  # campos exatos para filtro
    search_fields = ['titulo', 'descricao']      # campos para busca
    ordering_fields = ['data_criacao']   