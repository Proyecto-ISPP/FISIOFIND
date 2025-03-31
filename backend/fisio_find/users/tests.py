from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from django.test import TestCase
from rest_framework import status
from django.urls import reverse
from users.validacionFisios import validar_colegiacion
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image
from users.serializers import (PatientRegisterSerializer,PatientSerializer, 
                               PhysioRegisterSerializer, AppUserSerializer, 
                               Specialization, PhysiotherapistSpecialization,
                               PhysioUpdateSerializer)
from users.models import AppUser, Patient, Physiotherapist, Pricing
from datetime import date, timedelta
from unittest.mock import patch

def get_fake_image(name="photo.jpg"):
    image = Image.new("RGB", (100, 100), color="red")
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    return SimpleUploadedFile(name=name, content=buffer.read(), content_type="image/jpeg")
"""
class AppUserRequiredFieldsTests(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.request = self.factory.post('/fake-url/')
        self.request.user = AppUser(id=999)

    def get_base_data(self):
        return {
            "username": "testuser",
            "email": "test@example.com",
            "password": "StrongPassword123",
            "first_name": "Ana",
            "last_name": "Martínez",
            "dni": "12345678Z",
            "phone_number": "600000000",
            "postal_code": "28001",
            "account_status": "ACTIVE"
        }

    def assert_missing_field(self, field_name):
        data = self.get_base_data()
        del data[field_name]
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn(field_name, serializer.errors)

    def test_missing_username(self):
        self.assert_missing_field("username")

    def test_missing_email(self):
        self.assert_missing_field("email")

    def test_missing_password(self):
        self.assert_missing_field("password")

    def test_missing_first_name(self):
        self.assert_missing_field("first_name")

    def test_missing_last_name(self):
        self.assert_missing_field("last_name")

    def test_missing_dni(self):
        self.assert_missing_field("dni")

    def test_missing_phone_number(self):
        self.assert_missing_field("phone_number")

    def test_missing_postal_code(self):
        self.assert_missing_field("postal_code")

    def test_missing_account_status(self):
        self.assert_missing_field("account_status")

class AppUserSerializerValidationTests(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.request = self.factory.post('/fake-url/')
        self.request.user = AppUser(id=999)  # Usuario simulado

    def get_base_data(self):
        return {
            "username": "testuser",
            "email": "test@example.com",
            "password": "StrongPassword123",
            "first_name": "Ana",
            "last_name": "Martínez",
            "photo": get_fake_image(),
            "dni": "12345678Z",
            "phone_number": "600000000",
            "postal_code": "28001",
            "account_status": "ACTIVE"
        }

    # ✅ USERNAME
    def test_valid_username(self):
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_duplicate_username(self):
        AppUser.objects.create_user(
            username="testuser",
            email="existing@example.com",
            password="Test1234",
            dni="11111111A",
            phone_number="611111111",
            postal_code="28001"
        )
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    # ✅ EMAIL
    def test_valid_email(self):
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_duplicate_email(self):
        AppUser.objects.create_user(
            username="another",
            email="test@example.com",
            password="Test1234",
            dni="11111111B",
            phone_number="611111112",
            postal_code="28001"
        )
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    # ✅ PHONE NUMBER
    def test_valid_phone_number(self):
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_duplicate_phone_number(self):
        AppUser.objects.create_user(
            username="phoneuser",
            email="phone@example.com",
            password="Test1234",
            dni="11111111C",
            phone_number="600000000",  # mismo número
            postal_code="28001"
        )
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("phone_number", serializer.errors)

    def test_invalid_phone_number_length(self):
        data = self.get_base_data()
        data["phone_number"] = "12345"
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("phone_number", serializer.errors)

    # ✅ POSTAL CODE
    def test_valid_postal_code(self):
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_postal_code_length(self):
        data = self.get_base_data()
        data["postal_code"] = "123"
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("postal_code", serializer.errors)

    # ✅ DNI
    def test_valid_dni(self):
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_dni_format(self):
        data = self.get_base_data()
        data["dni"] = "1234"  # formato inválido
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("dni", serializer.errors)

    def test_duplicate_dni(self):
        AppUser.objects.create_user(
            username="dnidup",
            email="dnidup@example.com",
            password="Test1234",
            dni="12345678Z",
            phone_number="611111113",
            postal_code="28001"
        )
        data = self.get_base_data()
        serializer = AppUserSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("dni", serializer.errors)



class PatientRegisterSerializerTests(APITestCase):

    def get_base_data(self):
        return {
            "username": "newpatient",
            "email": "patient@example.com",
            "password": "62e47ee81923638dcb2e16b4986b860b8755a2b5dbe3f900f08187fd553710eb",
            "first_name": "Laura",
            "last_name": "Pérez",
            "dni": "12345678Z",
            "phone_number": "600123456",
            "postal_code": "28001",
            "gender": "F",
            "birth_date": "1990-05-10"
        }

    # ---------- CAMPOS REQUIRED ----------

    def test_missing_required_fields(self):
        required_fields = [
            "username", "email", "password", "first_name", "last_name",
            "dni", "phone_number", "postal_code", "gender", "birth_date"
        ]
        for field in required_fields:
            data = self.get_base_data()
            data.pop(field)
            serializer = PatientRegisterSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertIn(field, serializer.errors)

    # ---------- VALOR POSITIVO ----------

    def test_valid_registration(self):
        data = self.get_base_data()
        serializer = PatientRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        patient = serializer.save()
        self.assertIsInstance(patient, Patient)
        self.assertEqual(patient.user.email, data["email"])

    # ---------- DNI STRUCTURE ----------

    def test_invalid_dni_format(self):
        data = self.get_base_data()
        data["dni"] = "1234A678Z"
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("dni", serializer.errors)
        self.assertIn("8 números seguidos de una letra válida", serializer.errors["dni"][0])

    def test_invalid_dni_letter(self):
        data = self.get_base_data()
        data["dni"] = "12345678A"  # Letra incorrecta
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("dni", serializer.errors)
        self.assertIn("no coincide", serializer.errors["dni"][0])

    # ---------- PHONE LENGTH ----------

    def test_invalid_phone_length(self):
        data = self.get_base_data()
        data["phone_number"] = "12345"
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("phone_number", serializer.errors)

    # ---------- POSTAL LENGTH ----------

    def test_invalid_postal_code_length(self):
        data = self.get_base_data()
        data["postal_code"] = "1234"
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("postal_code", serializer.errors)

    # ---------- BIRTH DATE ----------

    def test_birth_date_in_future(self):
        data = self.get_base_data()
        data["birth_date"] = (date.today() + timedelta(days=1)).isoformat()
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("birth_date", serializer.errors)

    def test_birth_date_too_old(self):
        data = self.get_base_data()
        data["birth_date"] = "1899-01-01"
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("birth_date", serializer.errors)

    def test_user_must_be_18_or_older(self):
        underage_date = date.today().replace(year=date.today().year - 17)  # 17 años
        data = self.get_base_data()
        data["birth_date"] = underage_date.isoformat()
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("birth_date", serializer.errors)

    # ---------- DUPLICADOS ----------

    def test_duplicate_username(self):
        AppUser.objects.create_user(
            username="newpatient",
            email="other@example.com",
            password="pass",
            dni="87654321X",
            phone_number="611111111",
            postal_code="28001"
        )
        data = self.get_base_data()
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_duplicate_email(self):
        AppUser.objects.create_user(
            username="anotheruser",
            email="patient@example.com",
            password="pass",
            dni="87654321Y",
            phone_number="611111112",
            postal_code="28001"
        )
        data = self.get_base_data()
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_duplicate_dni(self):
        AppUser.objects.create_user(
            username="user3",
            email="diff@example.com",
            password="pass",
            dni="12345678Z",
            phone_number="611111113",
            postal_code="28001"
        )
        data = self.get_base_data()
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("dni", serializer.errors)
    
    # --------------- GENDER --------------
    
    def test_invalid_gender_value(self):
        data = self.get_base_data()
        data["gender"] = "X"  # Valor no válido
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)

    def test_gender_required(self):
        data = self.get_base_data()
        data["gender"] = ""  # Campo vacío
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)
    
    # --------------- POSTAL CODE -----------
    
    def test_postal_code_too_long(self):
        data = self.get_base_data()
        data["postal_code"] = "280011"
        serializer = PatientRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("postal_code", serializer.errors)
    
    # ------------- APP USER RELATION -------

    def test_cannot_create_two_patients_for_same_user(self):
        user = AppUser.objects.create_user(
            username="onlyonepatient",
            email="onlyone@example.com",
            password="Test1234",
            dni="12345678Z",
            phone_number="600000001",
            postal_code="28001"
        )

        Patient.objects.create(
            user=user,
            gender="F",
            birth_date="1990-01-01"
        )

        # Intentar crear otro paciente con el mismo usuario
        with self.assertRaises(Exception) as context:
            Patient.objects.create(
                user=user,
                gender="F",
                birth_date="1995-01-01"
            )

        self.assertIn("duplicate key value violates unique constraint", str(context.exception))


class PatientSerializerTests(APITestCase):

    def setUp(self):
        self.user = AppUser.objects.create_user(
            username="patient1",
            email="patient1@example.com",
            password="testpass",
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001",
            first_name="John",
            last_name="Doe"
        )

        self.patient = Patient.objects.create(
            user=self.user,
            gender="M",
            birth_date="1995-01-01"
        )

        # Setup del request simulado para los serializers
        self.factory = APIRequestFactory()
        self.request = self.factory.put('/fake-url/')
        self.request.user = self.user

    def get_valid_data(self):
        return {
            "user": {
                "username": "patient1",
                "email": "patient1@example.com",
                "phone_number": "600000000",
                "dni": "12345678Z",
                "password": "62e47ee81923638dcb2e16b4986b860b8755a2b5dbe3f900f08187fd553710eb!",
                "first_name": "John",
                "last_name": "Doe",
                "postal_code": "28001",
                "account_status": "ACTIVE"
            },
            "gender": "M",
            "birth_date": "1995-01-01"
        }

    def test_missing_user_fields(self):
        required_user_fields = [
            "username", "email", "password", "first_name", "last_name",
            "dni", "phone_number", "postal_code", "gender", "birth_date"
        ]
        for field in required_user_fields:
            data = self.get_valid_data()
            data["user"].pop(field)
            serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
            print(field,serializer.is_valid())
            self.assertFalse(serializer.is_valid())
            self.assertIn(field, serializer.errors.get("user", serializer.errors))

    def test_gender_empty(self):
        data = self.get_valid_data()
        data["gender"] = ""
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)

    def test_birth_date_in_future(self):
        data = self.get_valid_data()
        data["birth_date"] = (date.today() + timedelta(days=1)).isoformat()
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("birth_date", serializer.errors)

    def test_birth_date_too_old(self):
        data = self.get_valid_data()
        data["birth_date"] = "1800-01-01"
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("birth_date", serializer.errors)

    def test_dni_not_updated(self):
        data = self.get_valid_data()
        data["user"]["dni"] = "87654321A"  # Intentar cambiar el DNI
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()
        self.assertEqual(updated.user.dni, "12345678Z")  # El DNI debe seguir siendo el original

    def test_birth_date_not_updated(self):
        data = self.get_valid_data()
        data["birth_date"] = "1999-12-31"
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()
        self.assertEqual(updated.birth_date, self.patient.birth_date)  # No debe cambiar
        self.assertNotEqual(updated.birth_date, data["birth_date"])

    def test_invalid_gender_value(self):
        data = self.get_valid_data()
        data["gender"] = "X"  # Valor inválido (solo se permite 'M', 'F', 'O')
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)

    def test_postal_code_too_long(self):
        data = self.get_valid_data()
        data["user"]["postal_code"] = "280011"  # Demasiado largo
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("postal_code", serializer.errors["user"])

    def test_user_must_be_18_or_older(self):
        underage_date = date.today().replace(year=date.today().year - 17)  # 17 años
        data = self.get_valid_data()
        data["birth_date"] = underage_date.isoformat()
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("birth_date", serializer.errors)

    def test_gender_required(self):
        data = self.get_valid_data()
        data["gender"] = None
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)

    def test_duplicate_patient_user_relation(self):
        # Ya hay un Patient creado en setUp para este user
        data = self.get_valid_data()
        serializer = PatientSerializer(instance=self.patient, data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        with self.assertRaises(Exception) as context:
            # Simular que alguien fuerza la creación de otro paciente con el mismo user
            Patient.objects.create(user=self.user, gender="M", birth_date="1995-01-01")

        self.assertIn("unique constraint", str(context.exception).lower())


class PhysioRegisterSerializerTests(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.request = self.factory.post('/fake-url/')
        self.request.user = AppUser(id=999)

        self.plan, _ = Pricing.objects.get_or_create(
            name='blue',
            defaults={'price': 10, 'video_limit': 5}
        )

    def get_valid_data(self):
        return {
            "username": "physiotest",
            "email": "physio@example.com",
            "password": "StrongPassword123!",
            "first_name": "Ana",
            "last_name": "García",
            "dni": "12345678Z",
            "gender": "F",
            "birth_date": "1990-01-01",
            "collegiate_number": "12345",
            "autonomic_community": "MADRID",
            "phone_number": "600000000",
            "postal_code": "28001",
            "plan": self.plan.name,
            "specializations": ["Deportiva", "Neurológica"],
            "services": {"masaje": True},
            "schedule": {"lunes": ["10:00", "12:00"]}
        }

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_valid_physio_registration(self, mock_validar):
        data = self.get_valid_data()
        serializer = PhysioRegisterSerializer(data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        physio = serializer.save()
        self.assertIsInstance(physio, Physiotherapist)
        self.assertEqual(physio.user.email, data["email"])
        self.assertEqual(physio.plan.name, "blue")
        self.assertEqual(physio.specializations.count(), 2)
        self.assertTrue(physio.services["masaje"])
        self.assertIn("lunes", physio.schedule)

    @patch("users.serializers.validar_colegiacion", return_value=False)
    def test_invalid_collegiate_validation(self, mock_validar):
        data = self.get_valid_data()
        serializer = PhysioRegisterSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("collegiate_number", serializer.errors)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_physio_must_be_18_or_older(self, mock_validar):
        data = self.get_valid_data()
        underage = date.today().replace(year=date.today().year - 17)
        data["birth_date"] = underage.isoformat()
        serializer = PhysioRegisterSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("birth_date", serializer.errors)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_gender(self, mock_validar):
        data = self.get_valid_data()
        data["gender"] = "X"
        serializer = PhysioRegisterSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_postal_code_length(self, mock_validar):
        data = self.get_valid_data()
        data["postal_code"] = "1234"
        serializer = PhysioRegisterSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("postal_code", serializer.errors)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_phone_number_length(self, mock_validar):
        data = self.get_valid_data()
        data["phone_number"] = "12345"
        serializer = PhysioRegisterSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("phone_number", serializer.errors)

class PhysioUpdateSerializerTests(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.request = self.factory.put('/fake-url/')

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="old@example.com",
            password="testpass",
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001",
            first_name="Ana",
            last_name="Pérez"
        )

        self.plan, _ = Pricing.objects.get_or_create(
            name='blue',
            defaults={'price': 10, 'video_limit': 5}
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Antigua bio",
            plan=self.plan
        )

        self.request.user = self.user

    def test_update_email_and_bio(self):
        data = {
            "email": "new@example.com",
            "bio": "Bio actualizada"
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()
        self.assertEqual(updated.user.email, data["email"])
        self.assertEqual(updated.bio, data["bio"])

    def test_invalid_postal_code(self):
        data = {
            "postal_code": "123"
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("postal_code", serializer.errors)

    def test_invalid_phone_number(self):
        data = {
            "phone_number": "12345"
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("phone_number", serializer.errors)

    def test_invalid_dni_format(self):
        data = {
            "dni": "1234"
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("dni", serializer.errors)

    def test_invalid_services_format(self):
        data = {
            "services": "no es un dict"
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("services", serializer.errors)

    def test_invalid_service_nested_structure(self):
        data = {
            "services": {
                "masaje": "sí"  # Debe ser un dict, no string
            }
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("services", serializer.errors)

    def test_update_specializations(self):
        #Specialization.objects.create(name="Traumatología")
        data = {
            "specializations": ["Deportiva", "Traumatología"]
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        physio = serializer.save()
        spec_names = list(physio.specializations.values_list("name", flat=True))
        self.assertCountEqual(spec_names, ["Deportiva", "Traumatología"])

    def test_update_services_and_schedule(self):
        data = {
            "services": {"rehabilitacion": {"precio": 30}},
            "schedule": {"lunes": ["10:00", "12:00"]}
        }
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        physio = serializer.save()
        self.assertIn("rehabilitacion", physio.services)
        self.assertIn("lunes", physio.schedule)

    def test_update_photo(self):
        # Generar imagen de prueba
        image = Image.new("RGB", (100, 100), color="blue")
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        buffer.seek(0)

        uploaded_image = SimpleUploadedFile("profile.jpg", buffer.read(), content_type="image/jpeg")
        data = {"photo": uploaded_image}
        serializer = PhysioUpdateSerializer(instance=self.physio, data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        physio = serializer.save()
        self.assertTrue(physio.user.photo.name.endswith("profile.jpg"))
"""
"""
class PatientProfileViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = AppUser.objects.create_user(
            username="patientuser",
            email="patient@example.com",
            password="testpass123",
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001",
            first_name="Laura",
            last_name="Pérez"
        )
        self.patient = Patient.objects.create(
            user=self.user,
            gender="F",
            birth_date="1995-01-01"
        )
        self.url = reverse("profile")
        self.client.force_authenticate(user=self.user)

    def test_get_patient_profile_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"]["username"], self.user.username)
        self.assertEqual(response.data["gender"], "F")

    def test_patch_patient_profile_success(self):
        data = {
            "user": {
                "email": "nuevo@example.com",
                "phone_number": "699999999"
            },
            "gender": "O"
        }
        response = self.client.patch(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"]["email"], "nuevo@example.com")
        self.assertEqual(response.data["gender"], "O")

    def test_patch_invalid_birth_date(self):
        data = {
            "birth_date": "1800-01-01"
        }
        response = self.client.patch(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("birth_date", response.data)
"""
"""
class CustomLoginViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("login")
        self.password = "testpass123"
        self.user = AppUser.objects.create_user(
            username="testuser",
            email="test@example.com",
            password=self.password,
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001"
        )

    def test_login_successful(self):
        data = {"username": "testuser", "password": self.password}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)

    def test_login_wrong_password(self):
        data = {"username": "testuser", "password": "wrongpass"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 401)
        self.assertIn("detail", response.data)

    def test_login_nonexistent_user(self):
        data = {"username": "nouser", "password": "whatever"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 401)
        self.assertIn("detail", response.data)

    def test_login_missing_fields(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("username", response.data)
        self.assertIn("password", response.data)

class LogoutViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("logout")
        self.user = AppUser.objects.create_user(
            username="user",
            email="user@example.com",
            password="test1234",
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001"
        )

    def test_logout_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Logout exitoso.")

    def test_logout_authenticated_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Logout exitoso.")

    def test_logout_wrong_method(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)


class CheckRoleViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("check_role")

    def test_check_role_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user_role"], "unknown")

    def test_check_role_patient(self):
        user = AppUser.objects.create_user(
            username="patientuser",
            email="patient@example.com",
            password="testpass",
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001"
        )
        Patient.objects.create(user=user, gender="F", birth_date="1990-01-01")
        self.client.force_authenticate(user=user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user_role"], "patient")

    def test_check_role_physio(self):
        user = AppUser.objects.create_user(
            username="physiouser",
            email="physio@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="611111111",
            postal_code="28002"
        )
        Physiotherapist.objects.create(
            user=user,
            gender="M",
            birth_date="1980-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid"
        )
        self.client.force_authenticate(user=user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user_role"], "physiotherapist")

    def test_check_role_unknown_user(self):
        user = AppUser.objects.create_user(
            username="norole",
            email="norole@example.com",
            password="testpass",
            dni="11112222X",
            phone_number="622222222",
            postal_code="28003"
        )
        self.client.force_authenticate(user=user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user_role"], "unknown")


class ReturnUserViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("current_user")

    def test_return_user_patient(self):
        user = AppUser.objects.create_user(
            username="patuser",
            email="pat@example.com",
            password="testpass",
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001"
        )
        Patient.objects.create(user=user, gender="F", birth_date="1995-01-01")

        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("patient", response.data)
        self.assertIn("user_data", response.data["patient"])
        self.assertEqual(response.data["patient"]["user_data"]["username"], "patuser")

    def test_return_user_physio(self):
        user = AppUser.objects.create_user(
            username="physiouser",
            email="physio@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="611111111",
            postal_code="28002"
        )
        Physiotherapist.objects.create(
            user=user,
            gender="M",
            birth_date="1985-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid"
        )

        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("physio", response.data)
        self.assertIn("user_data", response.data["physio"])
        self.assertEqual(response.data["physio"]["user_data"]["username"], "physiouser")

    def test_return_user_without_role(self):
        user = AppUser.objects.create_user(
            username="norole",
            email="norole@example.com",
            password="testpass",
            dni="99999999Z",
            phone_number="600123456",
            postal_code="28003"
        )
        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "User role not found")

    def test_return_user_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

class ValidatePhysioRegistrationTests(APITestCase):

    def setUp(self):
        self.url = reverse("validate_physio_registration")
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue',
            defaults={'price': 10, 'video_limit': 5}
        )

    def get_valid_data(self):
        return {
            "username": "fisiotest",
            "email": "fisiotest@example.com",
            "password": "StrongPass123",
            "first_name": "Ana",
            "last_name": "Gómez",
            "dni": "12345678Z",
            "gender": "F",
            "birth_date": "1990-01-01",
            "collegiate_number": "12345",
            "autonomic_community": "MADRID",
            "phone_number": "600000000",
            "postal_code": "28001",
            "plan": self.plan.name
        }

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_valid_registration(self, mock_validar):
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["valid"], True)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_duplicate_email_fails(self, mock_validar):
        AppUser.objects.create_user(
            username="someone",
            email="fisiotest@example.com",
            password="pass",
            dni="87654321X",
            phone_number="600111111",
            postal_code="28002"
        )
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_dni_letter(self, mock_validar):
        data = self.get_valid_data()
        data["dni"] = "12345678A"  # letra incorrecta
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("dni", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_phone_length(self, mock_validar):
        data = self.get_valid_data()
        data["phone_number"] = "12345"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("phone_number", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=False)
    def test_invalid_collegiate_number(self, mock_validar):
        data = self.get_valid_data()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("collegiate_number", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_underage_physio(self, mock_validar):
        data = self.get_valid_data()
        underage = date.today().replace(year=date.today().year - 17)
        data["birth_date"] = underage.isoformat()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("birth_date", response.data)

class PhysioRegisterViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("physio_register") 
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue',
            defaults={'price': 10, 'video_limit': 5}
        )

    def get_valid_data(self):
        return {
            "username": "fisiotest",
            "email": "fisiotest@example.com",
            "password": "StrongPass123",
            "first_name": "Ana",
            "last_name": "Gómez",
            "dni": "12345678Z",
            "gender": "F",
            "birth_date": "1990-01-01",
            "collegiate_number": "12345",
            "autonomic_community": "MADRID",
            "phone_number": "600000000",
            "postal_code": "28001",
            "plan": self.plan.name
        }

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_register_physio_success(self, mock_validar):
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["message"], "Fisioteraputa registrado correctamente")
        self.assertTrue(AppUser.objects.filter(username="fisiotest").exists())
        self.assertTrue(Physiotherapist.objects.filter(user__username="fisiotest").exists())

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_duplicate_email_fails(self, mock_validar):
        AppUser.objects.create_user(
            username="other",
            email="fisiotest@example.com",
            password="pass",
            dni="99999999A",
            phone_number="600999999",
            postal_code="28002"
        )
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_dni_letter(self, mock_validar):
        data = self.get_valid_data()
        data["dni"] = "12345678A"  # Letra incorrecta
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("dni", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=False)
    def test_invalid_collegiation_fails(self, mock_validar):
        data = self.get_valid_data()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("collegiate_number", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_underage_physio(self, mock_validar):
        data = self.get_valid_data()
        underage = date.today().replace(year=date.today().year - 17)
        data["birth_date"] = underage.isoformat()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("birth_date", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_phone_number(self, mock_validar):
        data = self.get_valid_data()
        data["phone_number"] = "12345"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("phone_number", response.data)

    @patch("users.serializers.validar_colegiacion", return_value=True)
    def test_invalid_postal_code(self, mock_validar):
        data = self.get_valid_data()
        data["postal_code"] = "123"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("postal_code", response.data)

from unittest.mock import patch, Mock
import stripe

class ProcessPaymentViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("process_payment")

    @patch("stripe.PaymentIntent.create")
    def test_successful_payment(self, mock_create):
        mock_intent = Mock(status="succeeded")
        mock_create.return_value = mock_intent

        data = {
            "payment_method_id": "pm_test",
            "amount": 1799
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])

    @patch("stripe.PaymentIntent.create")
    def test_requires_action_payment(self, mock_create):
        mock_intent = Mock(status="requires_action", client_secret="secret_123")
        mock_create.return_value = mock_intent

        data = {
            "payment_method_id": "pm_test",
            "amount": 1799
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["requires_action"])
        self.assertEqual(response.data["payment_intent_client_secret"], "secret_123")

    def test_missing_parameters(self):
        response = self.client.post(self.url, {"payment_method_id": "pm_test"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_invalid_amount_format(self):
        data = {
            "payment_method_id": "pm_test",
            "amount": "not_a_number"
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("stripe.PaymentIntent.create", side_effect=stripe.error.CardError("Card declined", param=None, code=None))
    def test_card_error(self, mock_create):
        data = {
            "payment_method_id": "pm_test",
            "amount": 1799
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("stripe.PaymentIntent.create", side_effect=Exception("Unexpected error"))
    def test_generic_error(self, mock_create):
        data = {
            "payment_method_id": "pm_test",
            "amount": 1799
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
"""
"""
import json

class PhysioUpdateViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("physio_update")
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue',
            defaults={'price': 10, 'video_limit': 5}
        )

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio1@example.com",
            password="testpass",
            dni="12345678Z",
            phone_number="600000000",
            postal_code="28001"
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="COL123",
            autonomic_community="MADRID",
            plan=self.plan
        )

        self.client.force_authenticate(user=self.user)

    def test_physio_update_success(self):
        data = {
            "user.email": "updated@example.com",
            "bio": "Actualización desde test",
            "services": '{"Servicio 1": {"id": 1, "title": "Primera consulta", "price": 30, "description": "Evaluaremos tu estado f\\u00edsico, hablaremos sobre tus molestias y realizaremos pruebas para dise\\u00f1ar un plan de tratamiento personalizado que se adapte a tus necesidades y estilo de vida.", "duration": 45, "custom_questionnaire": {"UI Schema": {"type": "Group", "label": "Cuestionario Personalizado", "elements": [{"type": "Control", "label": "\\u00bfQu\\u00e9 te duele?", "scope": "#/properties/q1"}, {"type": "Control", "label": "\\u00bfC\\u00f3mo describir\\u00edas el dolor?", "scope": "#/properties/q2"}]}}}}',
            "schedule": '{"lunes": ["10:00", "12:00"]}',
            "specializations": '["Traumatología", "Deportiva"]'
        }

        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Fisioterapeuta actualizado correctamente")

        self.physio.refresh_from_db()
        self.assertEqual(self.physio.user.email, "updated@example.com")
        self.assertEqual(self.physio.bio, "Actualización desde test")
        self.assertIn("Servicio 1", self.physio.services)
        self.assertEqual(self.physio.specializations.count(), 2)

    def test_invalid_services_format(self):
        data = {
            "services": "esto no es json"
        }
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_specializations_as_csv(self):
        data = {
            "specializations": "Neurológica, Deportiva"
        }
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.physio.refresh_from_db()
        names = list(self.physio.specializations.values_list("name", flat=True))
        self.assertCountEqual(names, ["Neurológica", "Deportiva"])

    def test_specializations_as_single_string(self):
        data = {
            "specializations": "Pediátrica"
        }
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.physio.refresh_from_db()
        names = list(self.physio.specializations.values_list("name", flat=True))
        self.assertEqual(names, ["Pediátrica"])

    def test_unauthenticated_user(self):
        self.client.force_authenticate(user=None)
        response = self.client.put(self.url, {}, format="json")
        self.assertIn(response.status_code, [401, 403])  # depende del auth backend

    def test_invalid_services_not_dict(self):
        data = {
            "services": json.dumps({
                "Servicio 1": "esto debería ser un objeto, no un string"
            })
        }
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_invalid_services_missing_required_fields(self):
        base_service = {
            "id": 1,
            "title": "Primera consulta",
            "price": 30,
            "description": "Descripción",
            "duration": 45,
            "custom_questionnaire": {
                "UI Schema": {
                    "type": "Group",
                    "label": "Cuestionario",
                    "elements": []
                }
            }
        }

        required_fields = ["id", "title", "price", "description", "duration"]

        for field in required_fields:
            service_copy = base_service.copy()
            service_copy.pop(field)

            data = {
                "services": json.dumps({
                    "Servicio 1": service_copy
                })
            }

            response = self.client.put(self.url, data, format="json")
            self.assertEqual(
                response.status_code, 400,
            )
            self.assertIn("error", response.data)
    def test_services_as_json_string(self):
        data = {
            "services": json.dumps({
                "Servicio 1": {
                    "id": 1,
                    "title": "Primera consulta",
                    "price": 30,
                    "description": "Evaluación inicial",
                    "duration": 45,
                    "custom_questionnaire": {
                        "UI Schema": {
                            "type": "Group",
                            "label": "Cuestionario",
                            "elements": []
                        }
                    }
                }
            })
        }
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.physio.refresh_from_db()
        self.assertIn("Servicio 1", self.physio.services)

    def test_services_as_dict_direct(self):
        data = {
            "services": {
                "Servicio 1": {
                    "id": 2,
                    "title": "Seguimiento",
                    "price": 25,
                    "description": "Consulta de seguimiento",
                    "duration": 30,
                    "custom_questionnaire": {
                        "UI Schema": {
                            "type": "Group",
                            "label": "Seguimiento",
                            "elements": []
                        }
                    }
                }
            }
        }
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.physio.refresh_from_db()
        self.assertIn("Servicio 1", self.physio.services)

    def test_services_invalid_type(self):
        data = {
            "services": 12345  # ❌ ni str ni dict
        }
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("services", response.data)
"""
"""
class PhysioCreateServiceViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("physio_create_service")
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue',
            defaults={'price': 10, 'video_limit': 5}
        )

        self.user = AppUser.objects.create_user(
            username="physio2",
            email="physio2@example.com",
            password="testpass",
            dni="12345678Y",
            phone_number="600111111",
            postal_code="28001"
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            gender="M",
            birth_date="1990-05-05",
            collegiate_number="C12345",
            autonomic_community="MADRID",
            plan=self.plan,
            services={}  # empieza vacío
        )

        self.client.force_authenticate(user=self.user)

        self.valid_service = {
            "id": 1,
            "title": "Consulta inicial",
            "price": 30,
            "description": "Descripción del servicio",
            "duration": 45,
            "custom_questionnaire": {
                "UI Schema": {
                    "type": "Group",
                    "label": "Formulario",
                    "elements": []
                }
            }
        }

    def test_create_new_service(self):
        response = self.client.post(self.url, self.valid_service, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("services", response.data)
        self.assertEqual(len(response.data["services"]), 1)

    def test_service_as_string(self):
        response = self.client.post(self.url, json.dumps(self.valid_service), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("services", response.data)

    def test_invalid_format_list(self):
        response = self.client.post(self.url, [self.valid_service], format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_missing_required_field(self):
        invalid_service = self.valid_service.copy()
        invalid_service.pop("price")
        response = self.client.post(self.url, invalid_service, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_price_not_int(self):
        invalid_service = self.valid_service.copy()
        invalid_service["price"] = "treinta"
        response = self.client.post(self.url, invalid_service, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_duration_not_int(self):
        invalid_service = self.valid_service.copy()
        invalid_service["duration"] = "cuarenta"
        response = self.client.post(self.url, invalid_service, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
"""

"""
class PatientRegisterViewTests(APITestCase):

    def setUp(self):
        self.url = reverse("patient_register")

    def get_valid_data(self):
        return {
            "username": "newpatient",
            "email": "new@example.com",
            "password": "StrongPassword123!",
            "first_name": "Laura",
            "last_name": "Gómez",
            "dni": "12345678Z",
            "phone_number": "600000000",
            "postal_code": "28001",
            "gender": "F",
            "birth_date": "1990-01-01"
        }

    def test_register_patient_success(self):
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["message"], "Paciente registrado correctamente")
        self.assertTrue(AppUser.objects.filter(username="newpatient").exists())
        self.assertTrue(Patient.objects.filter(user__username="newpatient").exists())

    def test_duplicate_email_fails(self):
        AppUser.objects.create_user(
            username="existinguser",
            email="new@example.com",
            password="pass",
            dni="87654321A",
            phone_number="611111111",
            postal_code="28001"
        )
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)

    def test_invalid_dni_format(self):
        data = self.get_valid_data()
        data["dni"] = "1234A"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("dni", response.data)

    def test_underage_birth_date_fails(self):
        data = self.get_valid_data()
        underage = date.today().replace(year=date.today().year - 17)
        data["birth_date"] = underage.isoformat()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("birth_date", response.data)

    def test_invalid_phone_number_length(self):
        data = self.get_valid_data()
        data["phone_number"] = "123"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("phone_number", response.data)

    def test_invalid_postal_code_length(self):
        data = self.get_valid_data()
        data["postal_code"] = "123"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("postal_code", response.data)

    def test_birth_date_too_old(self):
        data = self.get_valid_data()
        data["birth_date"] = "1800-01-01"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("birth_date", response.data)

    def test_birth_date_in_future(self):
        future_date = (date.today() + timedelta(days=1)).isoformat()
        data = self.get_valid_data()
        data["birth_date"] = future_date
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("birth_date", response.data)

    def test_duplicate_dni_fails(self):
        AppUser.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="pass",
            dni="12345678Z",  # mismo DNI
            phone_number="699999999",
            postal_code="28001"
        )
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("dni", response.data)

    def test_duplicate_username_fails(self):
        AppUser.objects.create_user(
            username="newpatient",  # mismo username
            email="otheruser@example.com",
            password="pass",
            dni="87654321X",
            phone_number="611111111",
            postal_code="28001"
        )
        response = self.client.post(self.url, self.get_valid_data(), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("username", response.data)

    def test_invalid_dni_letter(self):
        data = self.get_valid_data()
        data["dni"] = "12345678A"  # Letra incorrecta para ese número
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("dni", response.data)
"""
"""
class ValidatorTests(APITestCase):
    # TESTS ANDALUCIA
    def test_ANDALUCIA_valid_1(self):
        comunidad_autonoma = "ANDALUCIA"
        nombre_completo = "NATALIA GABRIELA SUBAT"
        num_colegiado = "13092"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ANDALUCIA_valid_2(self):
        comunidad_autonoma = "ANDALUCIA"
        nombre_completo = "VIVI LANZKY"
        num_colegiado = "19"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ANDALUCIA_valid_3(self):
        comunidad_autonoma = "ANDALUCIA"
        nombre_completo = "Mª DEL MAR GÁLVEZ CLEMENTE"
        num_colegiado = "20"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))
        
    def test_ANDALUCIA_valid_4(self):
        comunidad_autonoma = "ANDALUCIA"
        nombre_completo = "ESTEFANÍA RAMA MORENO"
        num_colegiado = "12529"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ANDALUCIA_INvalid_1(self):
        comunidad_autonoma = "ANDALUCIA"
        nombre_completo = "ALFONSO REINA MARTÍNEZ"
        num_colegiado = "13092"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))
        
    def test_ANDALUCIA_INvalid_2(self):
        comunidad_autonoma = "ANDALUCIA"
        nombre_completo = "PABLO CARTAS MARTÍNEZ"
        num_colegiado = "12529"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ANDALUCIA_INvalid_3(self):
        comunidad_autonoma = "ANDALUCIA"
        nombre_completo = "JOSÉ MANUEL BRANDI DE LA TORRE "
        num_colegiado = "6"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS ARAGON
    def test_ARAGON_valid_1(self):
        comunidad_autonoma = "ARAGON"
        nombre_completo = "ALBA ROMAN CUARTERO"
        num_colegiado = "1212"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ARAGON_valid_2(self):
        comunidad_autonoma = "ARAGON"
        nombre_completo = "BEGOÑA MATUREN ESTEBAN"
        num_colegiado = "56"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ARAGON_valid_3(self):
        comunidad_autonoma = "ARAGON"
        nombre_completo = "Eva Maria Rodriguez Martinez"
        num_colegiado = "30"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ARAGON_INvalid_1(self):
        comunidad_autonoma = "ARAGON"
        nombre_completo = "ESTHER CASAS ALIAGA"
        num_colegiado = "1213"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ARAGON_INvalid_2(self):
        comunidad_autonoma = "ARAGON"
        nombre_completo = "ANTONIO JOSE GARCIA ROMERO"
        num_colegiado = "203"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS ASTURIAS
    def test_ASTURIAS_valid_1(self):
        comunidad_autonoma = "ASTURIAS"
        nombre_completo = "MIGUEL ANTONIO MARTÍNEZ GONZÁLEZ"
        num_colegiado = "13"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ASTURIAS_valid_3(self):
        comunidad_autonoma = "ASTURIAS"
        nombre_completo = "JUANA Mª HERNÁNDEZ VERDEJO"
        num_colegiado = "25"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ASTURIAS_INvalid_1(self):
        comunidad_autonoma = "ASTURIAS"
        nombre_completo = "PEDRO ANTONIO BLANCO BLANCO"
        num_colegiado = "1213"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_ASTURIAS_INvalid_2(self):
        comunidad_autonoma = "ASTURIAS"
        nombre_completo = "Mª VICTORIA ÁLVAREZ BARRIL"
        num_colegiado = "113"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))


    # TESTS BALEARES
    def test_BALEARES_valid_1(self):
        comunidad_autonoma = "BALEARES"
        nombre_completo = "Alba Alfonso Marcos"
        num_colegiado = "2268"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_BALEARES_valid_2(self):
        comunidad_autonoma = "BALEARES"
        nombre_completo = "Maria José González Rodríguez"
        num_colegiado = "30"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_BALEARES_valid_3(self):
        comunidad_autonoma = "BALEARES"
        nombre_completo = "Barbara Sampol Sastre"
        num_colegiado = "1000"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_BALEARES_INvalid_1(self):
        comunidad_autonoma = "BALEARES"
        nombre_completo = "Paco Paco Pedro"
        num_colegiado = "2268"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_BALEARES_INvalid_2(self):
        comunidad_autonoma = "BALEARES"
        nombre_completo = "Carlotta Elisabeth Gelabert Doran"
        num_colegiado = "1233"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))
        
    # TESTS CANARIAS
    def test_CANARIAS_valid_1(self):
        comunidad_autonoma = "CANARIAS"
        nombre_completo = "ANTONIO JESUS FERNANDEZ VILAR"
        num_colegiado = "7"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))
        
    def test_CANARIAS_valid_2(self):
        comunidad_autonoma = "CANARIAS"
        nombre_completo = "UTE ROSS"
        num_colegiado = "433"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_CANARIAS_valid_3(self):
        comunidad_autonoma = "CANARIAS"
        nombre_completo = "ALBERTO J. HERNÁNDEZ GARCÍA"
        num_colegiado = "707"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_CANARIAS_INvalid_1(self):
        comunidad_autonoma = "CANARIAS"
        nombre_completo = "ANTONIA JESUS FERNANDEZ GARCA"
        num_colegiado = "7"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_CANARIAS_INvalid_2(self):
        comunidad_autonoma = "CANARIAS"
        nombre_completo = "MAXIMO CESAR BATISTA HERNANDEZ"
        num_colegiado = "398"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS CANTABRIA
    def test_CANTABRIA_valid_1(self):
        comunidad_autonoma = "CANTABRIA"
        nombre_completo = "ALBERTO PANDO ANGLADA"
        num_colegiado = "39/003"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_CANTABRIA_INvalid_1(self):
        comunidad_autonoma = "CANTABRIA"
        nombre_completo = "SIMON PEDRO FPANDO ANGLADA"
        num_colegiado = "39/003"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS CASTILLA-LA MANCHA
    def test_CASTILLA_LA_MANCHA_valid_1(self):
        comunidad_autonoma = "CASTILLA-LA MANCHA"
        nombre_completo = "Jesús Reyes Cano"
        num_colegiado = "4"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_CASTILLA_LA_MANCHA_INvalid_1(self):
        comunidad_autonoma = "CASTILLA-LA MANCHA"
        nombre_completo = "Jesús Reyes Cano"
        num_colegiado = "2"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS CASTILLA Y LEON
    def test_CASTILLA_Y_LEON_valid_1(self):
        comunidad_autonoma = "CASTILLA Y LEON"
        nombre_completo = "ELENA MARTÍN PRIETO"
        num_colegiado = "4"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_CASTILLA_Y_LEON_INvalid_1(self):
        comunidad_autonoma = "CASTILLA Y LEON"
        nombre_completo = "Gemma Flotats i Farre"
        num_colegiado = "00034"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))


    # TESTS CATALUÑA
    def test_CATALUÑA_valid_1(self):
        comunidad_autonoma = "CATALUÑA"
        nombre_completo = "ELENA MARTÍN PRIETO"
        num_colegiado = "4"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_CATALUÑA_INvalid_1(self):
        comunidad_autonoma = "CATALUÑA"
        nombre_completo = "Gemma Flotats i Farre"
        num_colegiado = "00034"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS EXTREMADURA
    def test_EXTREMADURA_valid_1(self):
        comunidad_autonoma = "EXTREMADURA"
        nombre_completo = "AGUSTIN LUCEÑO MARDONES"
        num_colegiado = "10"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_EXTREMADURA_INvalid_1(self):
        comunidad_autonoma = "EXTREMADURA"
        nombre_completo = "AGUSTIN LUCEÑO MARDONES"
        num_colegiado = "11"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS GALICIA
    def test_GALICIA_valid_1(self):
        comunidad_autonoma = "GALICIA"
        nombre_completo = "Andrea Abeledo Bastón"
        num_colegiado = "2772"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_GALICIA_INvalid_1(self):
        comunidad_autonoma = "GALICIA"
        nombre_completo = "Andrea Abeledo Bastón"
        num_colegiado = "982"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS LA RIOJA
    def test_LA_RIOJA_valid_1(self):
        comunidad_autonoma = "LA RIOJA"
        nombre_completo = "Jorge Alcalde Royo"
        num_colegiado = "LR-26/0005"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_LA_RIOJA_INvalid_1(self):
        comunidad_autonoma = "LA RIOJA"
        nombre_completo = "Jorge Alcalde Royo"
        num_colegiado = "LR-26/0015"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS MADRID
    def test_MADRID_valid_1(self):
        comunidad_autonoma = "MADRID"
        nombre_completo = "Cecilia Conde Ederra"
        num_colegiado = "1"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_MADRID_INvalid_1(self):
        comunidad_autonoma = "MADRID"
        nombre_completo = "Cecilia Conde Ederra"
        num_colegiado = "2"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS MURCIA
    def test_MURCIA_valid_1(self):
        comunidad_autonoma = "MURCIA"
        nombre_completo = "JUAN MANUEL ACOSTA RODRÍGUEZ"
        num_colegiado = "276"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_MURCIA_INvalid_1(self):
        comunidad_autonoma = "MURCIA"
        nombre_completo = "JUAN MANUEL ACOSTA RODRÍGUEZ"
        num_colegiado = "277"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))
        
    # TESTS NAVARRA
    def test_NAVARRA_valid_1(self):
        comunidad_autonoma = "NAVARRA"
        nombre_completo = "EDUARDO GIL GÓMEZ"
        num_colegiado = "7"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_NAVARRA_INvalid_1(self):
        comunidad_autonoma = "NAVARRA"
        nombre_completo = "EDUARDO GIL GÓMEZ"
        num_colegiado = "8"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS PAIS VASCO
    def test_PAIS_VASCO_valid_1(self):
        comunidad_autonoma = "PAIS VASCO"
        nombre_completo = "Manuel Acevedo Casco"
        num_colegiado = "1364"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_PAIS_VASCO_INvalid_1(self):
        comunidad_autonoma = "PAIS VASCO"
        nombre_completo = "Manuel Acevedo Casco"
        num_colegiado = "1364"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    # TESTS COMUNIDAD VALENCIANA
    def test_COMUNIDAD_VALENCIANA_valid_1(self):
        comunidad_autonoma = "COMUNIDAD VALENCIANA"
        nombre_completo = "VICENTA FORTUNY ALMUDÉVER"
        num_colegiado = "3"
        self.assertTrue(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))

    def test_COMUNIDAD_VALENCIANA_INvalid_1(self):
        comunidad_autonoma = "COMUNIDAD VALENCIANA"
        nombre_completo = "VICENTA FORTUNY ALMUDÉVER"
        num_colegiado = "4"
        self.assertFalse(validar_colegiacion(nombre_completo,num_colegiado, comunidad_autonoma))
"""