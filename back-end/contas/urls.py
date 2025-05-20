from django.urls import path
from .views import UserCreateView
from .views import UserCreateView, TecnicosListView 


urlpatterns = [
    path('register/', UserCreateView.as_view(), name='user_register'),
    path('tecnicos/', TecnicosListView.as_view(), name='tecnicos_list'),
]
