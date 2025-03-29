from rest_framework.test import APITestCase, APIRequestFactory
from django.test import TestCase
from rest_framework import status
from django.urls import reverse
from users.validacionFisios import validar_colegiacion
from users.models import AppUser
from users.serializers import AppUserSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

def get_fake_image(name="photo.jpg"):
    image = Image.new("RGB", (100, 100), color="red")
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    return SimpleUploadedFile(name=name, content=buffer.read(), content_type="image/jpeg")

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

"""
class PatientRegisterTests(APITestCase):

    def test_register_patient_successfully(self):
        url = reverse('patient_register')  # o directamente: '/api/patients/register/'
        data = {
            "email": "test@example.com",
            "password": "StrongPassword123",
            "first_name": "John",
            "last_name": "Doe"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Paciente registrado correctamente")

    def test_register_patient_with_invalid_data(self):
        url = reverse('patient_register')
        data = {
            "email": "",  # Email vacío
            "password": "123",  # Demasiado corta
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

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