from rest_framework import generics
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView

class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
