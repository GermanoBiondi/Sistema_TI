# contas/urls.py
from django.urls import path
from .views import CustomTokenView, UserCreateView

urlpatterns = [
    path('token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('usuarios/', UserCreateView.as_view(), name='usuario_create'),
]
