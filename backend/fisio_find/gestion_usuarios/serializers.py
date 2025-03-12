from rest_framework import serializers
from rest_framework.validators import UniqueValidator  # Importación correcta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError
from django.db import transaction
from gestion_usuarios.validacionFisios import validar_colegiacion
from .models import AppUser, Patient, Physiotherapist, Admin
import re
from datetime import date  # Importar para obtener la fecha de hoy


class AppUserSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = AppUser
        fields = [
            'user_id', 'username', 'first_name', 'last_name', 'email', 
            'photo', 'dni', 'phone_number', 'postal_code'
        ]

class PhysioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Physiotherapist
        exclude = ['user']
        
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        exclude = ['user']

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

        # Validar que la letra del DNI es correcta
        dni_numbers = data['dni'][:-1]
        dni_letter = data['dni'][-1].upper()
        letters = "TRWAGMYFPDXBNJZSQVHLCKE"
        if letters[int(dni_numbers) % 23] != dni_letter:
            raise serializers.ValidationError({"dni": "La letra del DNI no coincide con el número."})
        
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
        """Manejo de IntegrityError con transactions para asegurar rollback en caso de fallo."""
        try:
            with transaction.atomic():
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
        

class PhysioRegisterSerializer(serializers.ModelSerializer):
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
    
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    postal_code = serializers.CharField(required=True)
    
    class Meta:
        model = Physiotherapist
        fields = [
            'username', 'email', 'password', 'dni', 'gender', 'first_name', 'last_name', 
            'birth_date', 'collegiate_number', 'autonomic_community', 'phone_number', 'postal_code'
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

        # Validar que la letra del DNI es correcta
        dni_numbers = data['dni'][:-1]
        dni_letter = data['dni'][-1].upper()
        letters = "TRWAGMYFPDXBNJZSQVHLCKE"
        if letters[int(dni_numbers) % 23] != dni_letter:
            raise serializers.ValidationError({"dni": "La letra del DNI no coincide con el número."})
        
        if len(data['phone_number']) != 9:
            raise serializers.ValidationError({"phone_number": "El número de teléfono debe tener 9 caracteres."})
        
        if len(data['postal_code']) != 5:
            raise serializers.ValidationError({"postal_code": "El código postal debe tener 5 caracteres."})
        
        return data
    
    def create(self, validated_data):
        """Manejo de IntegrityError con transactions para asegurar rollback en caso de fallo."""
        try:
            with transaction.atomic():
                first_name = validated_data.pop('first_name')
                last_name = validated_data.pop('last_name')
                
                gender = validated_data.pop('gender')
                birth_date = validated_data.pop('birth_date')
                collegiate_number = validated_data.pop('collegiate_number')
                autonomic_community = validated_data.pop('autonomic_community')
                
                full_name_uppercase = first_name.upper() + " " + last_name.upper()
                # Validar número de colegiado
                valid_physio = validar_colegiacion(full_name_uppercase, collegiate_number, autonomic_community)
                
                if not valid_physio:
                    raise serializers.ValidationError({"collegiate_number": "El número de colegiado o el nombre no es válido."})
                
                # Crear el fisioterapeuta y asociarlo al usuario
                app_user = AppUser.objects.create(
                    username=validated_data.pop('username'),
                    email=validated_data.pop('email'),
                    dni=validated_data.pop('dni'),
                    password=make_password(validated_data.pop('password')),  # Encripta la contraseña
                    phone_number=validated_data.pop('phone_number'),
                    postal_code=validated_data.pop('postal_code'),
                    first_name=first_name,
                    last_name=last_name
                )
                
                physio = Physiotherapist.objects.create(
                    user=app_user,
                    autonomic_community=autonomic_community,
                    birth_date=birth_date,
                    collegiate_number=collegiate_number,
                    gender=gender
                )
                
                return physio

        except IntegrityError as e:
            raise serializers.ValidationError({"error": "Error de integridad en la base de datos. Posible duplicado de datos."})

class AppUserAdminViewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = AppUser
        fields = '__all__'

class PatientAdminViewSerializer(serializers.ModelSerializer):
    
    user = AppUserAdminViewSerializer()
    
    class Meta:
        model = Patient
        fields = '__all__'
