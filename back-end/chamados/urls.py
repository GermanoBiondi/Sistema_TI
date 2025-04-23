from django.urls import path
from . import views

urlpatterns = [
    # Exemplo temporário
    path('', views.index, name='index'),
]
