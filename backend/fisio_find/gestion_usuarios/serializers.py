from rest_framework import serializers
from rest_framework.validators import UniqueValidator  # Importación correcta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError
from django.db import transaction
from gestion_usuarios.validacionFisios import validar_colegiacion
from .models import AppUser, Patient, Physiotherapist, PhysiotherapistSpecialization, Specialization
import re
from datetime import *
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

class AppUserSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='id', read_only=True)

    phone_number = serializers.CharField(
        validators=[RegexValidator(regex=r'^\d{9}$', message="El número de teléfono debe tener exactamente 9 dígitos.")]
    )

    photo = serializers.ImageField(required=False)
    dni = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r'^\d{8}[A-Z]$',
                message="El DNI debe tener 8 números seguidos de una letra mayúscula."
            )
        ]
    )
    class Meta:
        model = AppUser
        fields = [
            'user_id', 'username', 'first_name', 'last_name', 'email', 
            'photo', 'dni', 'phone_number', 'postal_code'
        ]
        extra_kwargs = {
            'username': {'validators': []},  # Evita la validación de unicidad automática en updates
            'dni': {'validators': []},  # Evita la validación de unicidad automática en updates
        }

    def validate_username(self, value):
        """Verifica si el nombre de usuario ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user  
        if AppUser.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El nombre de usuario ya está en uso.")
        return value

    def validate_email(self, value):
        """Verifica si el email ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user 
        if AppUser.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El email ya está en uso.")
        return value

    def validate_phone_number(self, value):
        """Verifica si el teléfono ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user
        if AppUser.objects.filter(phone_number=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El número de teléfono ya está en uso.")
        return value

    def validate_postal_code(self, value):
        """Verifica que el código postal tenga 5 dígitos"""
        if len(value) != 5:
            raise serializers.ValidationError("El código postal debe tener 5 dígitos.")
        return value

    def validate_dni(self, value):
        """Verifica si el DNI ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user 
        if AppUser.objects.filter(dni=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El DNI ya está en uso.")
        return value

    def validate_image(image):
        if not image.name.endswith(('.jpg', '.jpeg', '.png')):
            raise ValidationError("La foto debe ser una imagen JPG, JPEG o PNG.")


    

class PhysioSerializer(serializers.ModelSerializer):
    specializations = serializers.SlugRelatedField(
        queryset=Specialization.objects.all(),
        slug_field='name',
        many=True
    )
    class Meta:
        model = Physiotherapist
        exclude = ['user']
        

class PatientSerializer(serializers.ModelSerializer):
    user = AppUserSerializer()

    class Meta:
        model = Patient
        fields = ['user', 'gender', 'birth_date']

    def validate_gender(self, value):
        """Verifica que el género no esté vacío"""
        if not value:
            raise serializers.ValidationError("El género es obligatorio.")
        return value

    def validate_birth_date(self, value):
        """Verifica que la fecha de nacimiento sea anterior a la fecha actual"""
        if value >= datetime.now().date():
            raise serializers.ValidationError("La fecha de nacimiento debe ser anterior a la fecha actual.")
        return value

    def validate(self, data):
        """Valida campos necesarios en el paciente"""
        user_data = data.get('user', {})

        if not user_data.get('username'):
            raise serializers.ValidationError({"username": "El nombre de usuario es obligatorio."})
        if not user_data.get('email'):
            raise serializers.ValidationError({"email": "El email es obligatorio."})
        if not user_data.get('phone_number'):
            raise serializers.ValidationError({"phone_number": "El teléfono es obligatorio."})
        if not user_data.get('dni'):
            raise serializers.ValidationError({"dni": "El DNI es obligatorio."})
        if not data.get('gender'):
            raise serializers.ValidationError({"gender": "El género es obligatorio."})
        if not data.get('birth_date'):
            raise serializers.ValidationError({"birth_date": "La fecha de nacimiento es obligatoria."})

        return data

    def update(self, instance, validated_data):
        """Actualiza tanto el paciente como su usuario"""
        user_data = validated_data.pop('user', None)
        user_instance = instance.user

        # Si hay datos de usuario, actualizar manualmente solo los campos proporcionados
        if user_data:
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
            user_instance.save()

        # Ahora actualizar el paciente
        return super().update(instance, validated_data)

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
    photo = serializers.ImageField(required=False)
    services = serializers.JSONField(required=False)
    specializations = serializers.ListField(
        child=serializers.CharField(), required=False  # Lista de nombres de especializaciones
    )
    schedule = serializers.JSONField(required=False)
    
    class Meta:
        model = Physiotherapist
        fields = [
            'username', 'email', 'password', 'dni', 'gender', 'first_name', 'last_name', 
            'birth_date', 'collegiate_number', 'autonomic_community', 'phone_number', 'postal_code', 'bio', 'photo', 'services', 'specializations', 'schedule'
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
        
        specializations_data = validated_data.pop('specializations', [])
        
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
                
                # Manejar especializaciones
                for spec_name in specializations_data:
                    specialization, created = Specialization.objects.get_or_create(name=spec_name)
                    PhysiotherapistSpecialization.objects.create(physiotherapist=physio, specialization=specialization)
                
                return physio

        except IntegrityError as e:
            raise serializers.ValidationError({"error": "Error de integridad en la base de datos. Posible duplicado de datos."})
        
    def update(self, instance, validated_data):
        """Actualiza los datos de un fisioterapeuta y su usuario asociado."""
        try:
            with transaction.atomic():
                # Actualizar datos del usuario (AppUser)
                user = instance.user
                user.email = validated_data.get("email", user.email)
                user.phone_number = validated_data.get("phone_number", user.phone_number)
                user.postal_code = validated_data.get("postal_code", user.postal_code)
                user.photo = validated_data.get("photo", user.photo)
                user.save()

                # Actualizar datos del fisioterapeuta (Physiotherapist)
                instance.bio = validated_data.get("bio", instance.bio)
                instance.services = validated_data.get("services", instance.services)
                instance.schedule = validated_data.get("schedule", instance.schedule)
                instance.save()

                return instance

        except IntegrityError:
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
