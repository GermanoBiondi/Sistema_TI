from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from chamados.views import ChamadoViewSet
from equipamentos.views import SolicitacaoEquipamentoViewSet
from contas.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'chamados', ChamadoViewSet, basename='chamado')
router.register(r'equipamentos', SolicitacaoEquipamentoViewSet, basename='equipamento')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('contas.urls')),
]
