from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from gestion_terminos.models import AppTerminos

class AppTerminosSerializer(serializers.ModelSerializer):

    modifier = serializers.StringRelatedField()
    content = serializers.CharField(
        required=True, 
        error_messages={'required': 'El campo contenido es obligatorio.'}
    )
    
    version = serializers.CharField(
        required=True, 
        max_length=100,
        error_messages={'required': 'El campo versión es obligatorio y más pequeño que 100 caracteres.'}
    )

    class Meta:
        model = AppTerminos
        fields = '__all__'