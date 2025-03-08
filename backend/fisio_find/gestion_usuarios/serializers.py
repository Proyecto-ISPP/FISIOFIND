from rest_framework import serializers
from rest_framework.validators import UniqueValidator  # Importación correcta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError
from .models import AppUser, Patient
import re
from datetime import date  # Importar para obtener la fecha de hoy

class PatientRegisterSerializer(serializers.ModelSerializer):
    # Validación para campos únicos con `UniqueValidator`
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=AppUser.objects.all(), message="El nombre de usuario ya está en uso.")]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=AppUser.objects.all(), message="El email ya está registrado.")]
    )
    dni = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=AppUser.objects.all(), message="El DNI ya está registrado.")]
    )

    password = serializers.CharField(write_only=True, required=True)
    phone_number = serializers.CharField(required=True)
    postal_code = serializers.CharField(required=True)
    first_name = serializers.CharField(
        required=True, 
        error_messages={'required': 'El campo nombre es obligatorio.'}
    )
    last_name = serializers.CharField(
        required=True, 
        error_messages={'required': 'El campo apellido es obligatorio.'}
    )
    birth_date = serializers.DateField(required=True)

    class Meta:
        model = Patient
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'dni', 'phone_number', 'postal_code', 'gender', 'birth_date'
        ]
        
    def validate_password(self, value):
        username = self.initial_data.get("username", "")
        user = AppUser(username=username)  
        validate_password(value, user=user)  
        return value
    
    def validate(self, data):
        """Validaciones adicionales para DNI, teléfono y código postal."""
        dni_pattern = re.compile(r'^\d{8}[A-HJ-NP-TV-Z]$')
        if not dni_pattern.match(data['dni']):
            raise serializers.ValidationError({"dni": "El DNI debe tener 8 números seguidos de una letra válida."})
        
        if len(data['phone_number']) != 9:
            raise serializers.ValidationError({"phone_number": "El número de teléfono debe tener 9 caracteres."})
        
        if len(data['postal_code']) != 5:
            raise serializers.ValidationError({"postal_code": "El código postal debe tener 5 caracteres."})

        if not data['first_name']:
            raise serializers.ValidationError({"first_name": "El campo nombre es obligatorio."})
        
        if not data['last_name']:
            raise serializers.ValidationError({"last_name": "El campo apellido es obligatorio."})
        
        today = date.today()
        if data['birth_date'] > today:
            raise serializers.ValidationError({"birth_date": "La fecha de nacimiento no puede ser posterior a la fecha actual."})

        return data

    def create(self, validated_data):
        """Manejo de `IntegrityError` al crear el usuario."""
        try:
            user = AppUser.objects.create(
                username=validated_data.pop('username'),
                email=validated_data.pop('email'),
                first_name=validated_data.pop('first_name'),
                last_name=validated_data.pop('last_name'),
                dni=validated_data.pop('dni'),
                phone_number=validated_data.pop('phone_number'),
                postal_code=validated_data.pop('postal_code'),
                password=make_password(validated_data.pop('password'))  # Encripta la contraseña
            )
            
            gender = validated_data.pop('gender')
            birth_date = validated_data.pop('birth_date')

            # Crear el paciente y asociarlo al usuario
            patient = Patient.objects.create(user=user, gender=gender, birth_date=birth_date)
            return patient

        except IntegrityError as e:
            raise serializers.ValidationError({"error": "Error de integridad en la base de datos. Posible duplicado de datos."})

