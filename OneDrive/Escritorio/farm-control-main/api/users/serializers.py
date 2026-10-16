from rest_framework import serializers
from .models import User
from django.db import IntegrityError

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'username',
            'name',
            'rank',
            'farm'
        ]

    def get_name(self, obj):
        fname = obj.first_name.capitalize()
        lname = obj.last_name.capitalize()
        return fname + ' ' + lname

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'password',
            'farm',
            'rank',
            'creator'
        ]
        extra_kwargs = {
            'password': {
                # hace que cuando se serialize este dato, nunca se muestre
                'write_only': True
            }
        }
    
    def create(self, validated_data):
        # limpiar todos los valores y ponerlos en minuscula
        username = validated_data['username'].lower()
        first_name = validated_data['first_name'].lower()
        last_name = validated_data['last_name'].lower()
        farm = validated_data['farm'].lower()
        rank = validated_data['rank'].lower()
        creator = validated_data['creator']

        # crear nuevo usuario
        try:
            user = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
            farm=farm,
            rank=rank,
            creator=creator,
            )
            password = validated_data['password']
            user.set_password(password)
            user.save()
        except IntegrityError:
            message = {'title': 'Error', 'message': 'El nombre de usuario ya está en uso. Por favor, elige otro.', 'status': 'error'}
            return message
        return user



