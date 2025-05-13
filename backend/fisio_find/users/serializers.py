from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError
from django.db import transaction
from users.validacionFisios import validar_colegiacion
from .models import (
    AppUser, Patient, 
    Physiotherapist, PhysiotherapistSpecialization, 
    Specialization, Pricing,
    add_dni_to_encryptedvalues,
    remove_dni_on_delete,validate_unique_DNI)
from datetime import date, datetime
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from users.util import validate_dni_match_letter, codigo_postal_no_mide_5, telefono_no_mide_9, validate_dni_structure, telefono_no_tiene_solo_digitos_numericos, codigo_postal_no_tiene_solo_digitos_numericos


class AppUserSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='id', read_only=True)
    photo = serializers.ImageField(required=False)  # Ensure photo is handled as an optional field

    phone_number = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[RegexValidator(regex=r'^\d{9}$', message="El número de teléfono debe tener exactamente 9 dígitos.")]
        )

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
            'photo', 'dni', 'phone_number', 'postal_code', 'account_status'
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
        # Si el valor es una cadena vacía, convertir a None y aceptar
        if value == "":
            return None

        # Si se proporciona un valor, validar el formato (9 dígitos)
        if value and len(value) != 9:
            raise serializers.ValidationError("El teléfono debe tener 9 dígitos")

        # Verificar si el número ya está en uso por otro usuario
        user = self.context.get('request').user
        if value and AppUser.objects.filter(phone_number=value).exclude(id=user.id).exists():
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
    user = AppUserSerializer()
    specializations = serializers.SlugRelatedField(
        queryset=Specialization.objects.all(),
        slug_field='name',
        many=True
    )
    services = serializers.JSONField(required=False)  # Ensure services are serialized as JSON

    class Meta:
        model = Physiotherapist
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    user = AppUserSerializer()

    class Meta:
        model = Patient
        fields = ['id', 'user', 'gender', 'birth_date']

    def validate_gender(self, value):
        """Verifica que el género no esté vacío"""
        if not value:
            raise serializers.ValidationError("El género es obligatorio.")
        return value

    def validate_birth_date(self, value):
        """Verifica que la fecha de nacimiento sea anterior a la fecha actual"""

        if value >= datetime.now().date():
            raise serializers.ValidationError("La fecha de nacimiento debe ser anterior a la fecha actual.")
        elif value < date(1900, 1, 1):
            raise serializers.ValidationError("La fecha de nacimiento no puede ser tan atrás en el tiempo.")
        elif (date.today().year - value.year - ((date.today().month, date.today().day) < (value.month, value.day))) < 18:
            raise serializers.ValidationError("Debes ser mayor de edad para registrarte.")
    
        return value

    def validate(self, data):
        """Valida campos necesarios en el paciente"""
        user_data = data.get('user', {})
        if not user_data.get('username'):
            raise serializers.ValidationError({"username": "El nombre de usuario es obligatorio."})
        if not user_data.get('email'):
            raise serializers.ValidationError({"email": "El email es obligatorio."})

        """
        if not user_data.get('dni'):
            raise serializers.ValidationError({"dni": "El DNI es obligatorio."})
        """

        if not data.get('gender'):
            raise serializers.ValidationError({"gender": "El género es obligatorio."})
        """
        if not data.get('birth_date'):
            raise serializers.ValidationError({"birth_date": "La fecha de nacimiento es obligatoria."})
        """

        return data

    def update(self, instance, validated_data):
        """Impide la modificación del DNI, fecha de nacimiento y status de la cuenta 
            y actualiza los demás datos
        """
        user_data = validated_data.pop('user', None)
        user_instance = instance.user

        # Impedir la modificación del DNI
        if user_data and 'dni' in user_data:
            user_data.pop('dni', None)

        if 'birth_date' in validated_data:
            validated_data.pop('birth_date', None)
        
        if 'account_status' in validated_data:
            validated_data.pop('account_status', None)

        # Si hay datos de usuario, actualizar solo los campos permitidos
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
    phone_number = serializers.CharField(required=False)
    postal_code = serializers.CharField(required=True)
    first_name = serializers.CharField(
        required=True
    )
    last_name = serializers.CharField(
        required=True
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
        validation_errors = dict()

        if not validate_dni_structure(data['dni']):
            validation_errors["dni"] = "El DNI debe tener 8 números seguidos de una letra válida."
        elif validate_dni_match_letter(data['dni']):
            validation_errors["dni"] = "La letra del DNI no coincide con el número."

        if validate_unique_DNI(data['dni']):
            validation_errors["dni"] = "Ya existe un usuario con este DNI registrado."

        if 'phone_number' in data and data['phone_number'] and telefono_no_mide_9(data['phone_number']):
            validation_errors["phone_number"] = "El número de teléfono debe tener 9 caracteres."

        if codigo_postal_no_mide_5(data['postal_code']):
            validation_errors["postal_code"] = "El código postal debe tener 5 caracteres."

        if not data['first_name']:
            validation_errors["first_name"] = "Este campo es requerido."

        if not data['last_name']:
            validation_errors["last_name"] = "Este campo es requerido."

        if data['birth_date'] > date.today():
            validation_errors["birth_date"] = "La fecha de nacimiento no puede ser posterior a la fecha actual."

        if data['birth_date'] < date(1900, 1, 1):
            validation_errors["birth_date"] = "La fecha no puede ser tan atrás en el tiempo"

        if (date.today().year - data['birth_date'].year - (
            (date.today().month, date.today().day) < (data['birth_date'].month, data['birth_date'].day))) < 18:
            validation_errors["birth_date"] = "Debes ser mayor de edad para registrarte."

        if validation_errors or len(validation_errors) > 1:
            raise serializers.ValidationError(validation_errors)

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
                    phone_number=validated_data.pop('phone_number', None),
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
    # Validación para campos únicos con UniqueValidator
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
    phone_number = serializers.CharField(required=False)
    postal_code = serializers.CharField(required=True)
    photo = serializers.ImageField(required=False)
    services = serializers.JSONField(required=False)
    specializations = serializers.ListField(
        child=serializers.CharField(), required=False  # Lista de nombres de especializaciones
    )
    schedule = serializers.JSONField(required=False)
    plan = serializers.SlugRelatedField(
        slug_field='name',  # Asume que el modelo Pricing tiene un campo 'name' con valores "blue" y "gold"
        queryset=Pricing.objects.all(),
        required=True,
        error_messages={
            'does_not_exist': 'El plan seleccionado no es válido',
            'invalid': 'Valor de plan inválido'
        }
    )

    # Campos nuevos de Stripe (solo lectura)
    stripe_subscription_id = serializers.CharField(read_only=True)
    subscription_status = serializers.CharField(read_only=True)

    class Meta:
        model = Physiotherapist
        fields = [
            'username', 'email', 'password', 'dni', 'gender', 'first_name', 'last_name',
            'birth_date', 'collegiate_number', 'autonomic_community', 'phone_number', 'postal_code',
            'bio', 'photo', 'services', 'specializations', 'schedule', 'plan',
            'stripe_subscription_id', 'subscription_status'
        ]

    def validate_password(self, value):
        username = self.initial_data.get("username", "")
        user = AppUser(username=username)
        validate_password(value, user=user)
        return value

    def validate(self, data):
        """Validaciones adicionales para DNI, teléfono, código postal y colegiación."""
        validation_errors = dict()
        if not validate_dni_structure(data['dni']):
            validation_errors["dni"] = "El DNI debe tener 8 números seguidos de una letra válida."
        elif validate_dni_match_letter(data['dni']):
            validation_errors["dni"] = "La letra del DNI no coincide con el número."
        elif validate_unique_DNI(data['dni']):
            validation_errors["dni"] = "Ya existe un usuario con este DNI registrado."

        if 'phone_number' in data and data['phone_number']:
            if telefono_no_tiene_solo_digitos_numericos(data['phone_number']):
                validation_errors["phone_number"] = "El teléfono solo puede contener dígitos numéricos."
            elif telefono_no_mide_9(data['phone_number']):
                validation_errors["phone_number"] = "El teléfono debe tener exactamente 9 dígitos."

        if codigo_postal_no_tiene_solo_digitos_numericos(data['postal_code']):
            validation_errors["postal_code"] = "El código postal solo puede contener números."
        elif codigo_postal_no_mide_5(data['postal_code']):
            validation_errors["postal_code"] = "El código postal debe tener exactamente 5 dígitos."

        if data['birth_date'] > date.today():
            validation_errors["birth_date"] = "La fecha de nacimiento no puede ser posterior a la fecha actual."

        if data['birth_date'] < date(1900, 1, 1):
            validation_errors["birth_date"] = "La fecha no puede ser tan atrás en el tiempo"

        if (date.today().year - data['birth_date'].year - (
            (date.today().month, date.today().day) < (data['birth_date'].month, data['birth_date'].day))) < 18:
            validation_errors["birth_date"] = "Debes ser mayor de edad para registrarte."


        # Validar colegiación (antes se hacía en create; ahora se valida aquí)
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        collegiate_number = data.get("collegiate_number", "")
        autonomic_community = data.get("autonomic_community", "")
        if Physiotherapist.objects.filter(
            user__first_name__iexact=first_name,  # Búsqueda insensible a mayúsculas
            user__last_name__iexact=last_name,
            collegiate_number=collegiate_number,
            autonomic_community=autonomic_community
        ).exists():
            validation_errors["collegiate_number"] = (
                "Ya existe un fisioterapeuta con este nombre, apellido, "
                "número de colegiado y comunidad autónoma."
            )

        full_name_uppercase = first_name.upper() + " " + last_name.upper()
        valid_physio = validar_colegiacion(full_name_uppercase, collegiate_number, autonomic_community)
        if not valid_physio:
            validation_errors["collegiate_number"] = "El número de colegiado o nombre no son válidos."

        if validation_errors:
            raise serializers.ValidationError(validation_errors)

        return data

    def create(self, validated_data):
        """Crea el fisioterapeuta; la validación de colegiación ya se realizó en validate."""
        specializations_data = validated_data.pop('specializations', [])
        try:
            with transaction.atomic():
                first_name = validated_data.pop('first_name')
                last_name = validated_data.pop('last_name')
                gender = validated_data.pop('gender')
                birth_date = validated_data.pop('birth_date')
                collegiate_number = validated_data.pop('collegiate_number')
                autonomic_community = validated_data.pop('autonomic_community')
                plan = validated_data.pop('plan')

                app_user = AppUser.objects.create(
                    username=validated_data.pop('username'),
                    email=validated_data.pop('email'),
                    dni=validated_data.pop('dni'),
                    password=make_password(validated_data.pop('password')),
                    phone_number=validated_data.pop('phone_number', None),
                    postal_code=validated_data.pop('postal_code'),
                    first_name=first_name,
                    last_name=last_name
                )

                physio = Physiotherapist.objects.create(
                    user=app_user,
                    autonomic_community=autonomic_community,
                    birth_date=birth_date,
                    collegiate_number=collegiate_number,
                    gender=gender,
                    plan=plan
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
                user = instance.user
                user.email = validated_data.get("email", user.email)
                user.phone_number = validated_data.get("phone_number", user.phone_number)
                user.postal_code = validated_data.get("postal_code", user.postal_code)
                user.photo = validated_data.get("photo", user.photo)
                user.save()

                instance.bio = validated_data.get("bio", instance.bio)
                instance.services = validated_data.get("services", instance.services)
                instance.schedule = validated_data.get("schedule", instance.schedule)
                instance.save()

                return instance

        except IntegrityError:
            raise serializers.ValidationError({
                "error": "Error de integridad en la base de datos. Posible duplicado de datos."
            })


class PhysioUpdateSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    postal_code = serializers.CharField(required=False)
    photo = serializers.ImageField(required=False)
    services = serializers.JSONField(required=False)
    specializations = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    schedule = serializers.JSONField(required=False)
    bio = serializers.CharField(required=False)
    plan = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Pricing.objects.all(),
        required=False,
        error_messages={
            'does_not_exist': 'El plan seleccionado no es válido',
            'invalid': 'Valor de plan inválido'
        }
    )
    degree = serializers.CharField(required=False)
    university = serializers.CharField(required=False)
    experience = serializers.CharField(required=False)
    workplace = serializers.CharField(required=False)

    class Meta:
        model = Physiotherapist
        fields = ['email', 'phone_number', 'postal_code', 'bio', 'photo', 'services',
                  'specializations', 'schedule', 'plan', 'degree',
                  'university', 'experience', 'workplace']

    def validate(self, data):
        """Validaciones solo para los campos proporcionados."""
        validation_errors = dict()

        # Validar que estos campos estén informados si aún no existen en el modelo
        """
        Comentado para que no haga falta meterlos
        required_fields = ['degree', 'university', 'experience', 'workplace']
        for field in required_fields:
            valor_actual = getattr(self.instance, field, None)
            nuevo_valor = data.get(field)

            if not valor_actual and not nuevo_valor:
                validation_errors[field] = f"El campo {field} es obligatorio."
        """
        if 'dni' in data:
            if not validate_dni_structure(data['dni']):
                validation_errors["dni"] = "El DNI debe tener 8 números seguidos de una letra válida."
            elif validate_dni_match_letter(data['dni']):
                validation_errors["dni"] = "La letra del DNI no coincide con el número."
            
            if validate_unique_DNI(data['dni']):
                validation_errors["dni"] = "Ya existe un usuario con este DNI registrado."


        if 'phone_number' in data and telefono_no_mide_9(data['phone_number']):
            validation_errors["phone_number"] = "El número de teléfono debe tener 9 caracteres."

        if 'postal_code' in data and codigo_postal_no_mide_5(data['postal_code']):
            validation_errors["postal_code"] = "El código postal debe tener 5 caracteres."

        if validation_errors or len(validation_errors) > 1:
            raise serializers.ValidationError(validation_errors)

        return data

    def validate_services(self, value):
        """Ensure services are in the correct format."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Los servicios deben ser un objeto JSON.")
        for service_name, service_data in value.items():
            if not isinstance(service_data, dict):
                raise serializers.ValidationError(
                    f"El servicio '{service_name}' debe contener un objeto con sus propiedades."
                )
        return value

    def update(self, instance, validated_data):
        """Update the physiotherapist's data, including services."""
        try:
            with transaction.atomic():
                # Update user data
                user = instance.user
                user.email = validated_data.get("email", user.email)
                user.phone_number = validated_data.get("phone_number", user.phone_number)
                user.postal_code = validated_data.get("postal_code", user.postal_code)
                if "photo" in validated_data:
                    user.photo = validated_data.get("photo")
                user.save()

                # Update physiotherapist data
                if "bio" in validated_data:
                    instance.bio = validated_data.get("bio")
                if "plan" in validated_data:
                    instance.plan = validated_data.get("plan")
                if "services" in validated_data:
                    instance.services = validated_data.get("services")  # Update services
                if "schedule" in validated_data:
                    instance.schedule = validated_data.get("schedule")
                if "specializations" in validated_data:
                    specializations_data = validated_data.get("specializations", [])
                    instance.physiotherapistspecialization_set.all().delete()
                    for spec_name in specializations_data:
                        specialization, _ = Specialization.objects.get_or_create(name=spec_name)
                        PhysiotherapistSpecialization.objects.create(physiotherapist=instance,
                                                                     specialization=specialization)
                if "degree" in validated_data:
                    instance.degree = validated_data.get("degree")
                if "university" in validated_data:
                    instance.university = validated_data.get("university")
                if "experience" in validated_data:
                    instance.experience = validated_data.get("experience")
                if "workplace" in validated_data:
                    instance.workplace = validated_data.get("workplace")

                instance.save()
                return instance

        except IntegrityError:
            raise serializers.ValidationError({"error":
                                              "Error de integridad en la base de datos. Posible duplicado de datos."})