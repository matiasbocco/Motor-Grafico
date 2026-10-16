from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, SignUpSerializer
from .models import User


def get_auth_for_user(user):
    tokens = RefreshToken.for_user(user)

    return {
        'user': UserSerializer(user).data,
        'tokens': {
            'access': str(tokens.access_token),
            'refresh': str(tokens),
        }
    }


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
            
        if not user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
            
        user_data = get_auth_for_user(user)

        return Response(user_data)

class SignUpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_user = SignUpSerializer(data=request.data)
        print("hola")
        try:
            if new_user.status:
                print("hola2")
                return Response(new_user)
        except:
            new_user.is_valid(raise_exception=True)
            print("hola3")
            new_user.save()
            print("hola4")

            message = { 'title': '¡Registro exitoso!', 'message': 'Se ha registrado el usuario correctamente.', 'status': 'success' }

            return Response(message)

class SavePushTokenAPIView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        user = User.objects.get(username=username)
        user.push_token = request.data.get('token')
        user.save()

        return Response(status=status.HTTP_200_OK)
    
class GetFarmersAPIView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        users = User.objects.filter(rank=1)
        data = []
        for user in users:
            data.append({
                'label': '{} {}'.format(user.first_name.capitalize(), user.last_name.capitalize()),
                'value': user.username,
            })
        return Response(data)
    
class GetTuckersAPIView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        users = User.objects.filter(rank=2)
        data = []
        for user in users:
            data.append({
                'label': '{} {}'.format(user.first_name.capitalize(), user.last_name.capitalize()),
                'value': user.username,
            })
        return Response(data)

class GetProducersAPIView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        users = User.objects.filter(rank=3)
        data = []
        for user in users:
            data.append({
                'label': '{} {}'.format(user.first_name.capitalize(), user.last_name.capitalize()),
                'value': user.username,
            })
        return Response(data)