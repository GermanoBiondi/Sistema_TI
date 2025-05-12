from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipamentoViewSet, SolicitacaoEquipamentoViewSet

router = DefaultRouter()
router.register(r'equipamentos', EquipamentoViewSet, basename='equipamento')
router.register(r'solicitacoes', SolicitacaoEquipamentoViewSet, basename='solicitacao')

urlpatterns = [
    path('', include(router.urls)),
]
