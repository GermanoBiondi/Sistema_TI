from rest_framework import generics
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class TecnicosListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tecnicos = CustomUser.objects.filter(tipo='tecnico')
        serializer = UserSerializer(tecnicos, many=True)
        return Response(serializer.data)