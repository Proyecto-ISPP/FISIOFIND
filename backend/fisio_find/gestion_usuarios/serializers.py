from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from gestion_usuarios.models import AppUser

class AppUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=AppUser.objects.all())]
    )

    class Meta:
        model = AppUser
        fields = '__all__'