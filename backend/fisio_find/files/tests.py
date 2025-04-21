from unittest.mock import patch, MagicMock
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import StreamingHttpResponse, HttpResponse

from users.models import (
    AppUser, Patient, Physiotherapist, Pricing,
)

from treatments.models import Treatment
from files.models import PatientFile, Video
from django.core.files.uploadedfile import SimpleUploadedFile

class CreateFileUploadMockTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.client.force_authenticate(user=self.patient_user)
        self.url = reverse('create_file')

    @patch("files.serializers.boto3.client") 
    def test_create_file_with_upload_mocked(self, mock_boto_client):
        mock_s3 = MagicMock()
        mock_boto_client.return_value = mock_s3

        # Simular que `upload_fileobj` funciona sin lanzar error
        mock_s3.upload_fileobj.return_value = None

        test_file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")

        data = {
            "treatment": self.treatment.id,
            "title": "Archivo subido",
            "description": "Subida simulada",
            "files": [test_file]
        }

        response = self.client.post(self.url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PatientFile.objects.count(), 1)
        self.assertTrue(mock_s3.upload_fileobj.called) 

    def test_create_file_unauthenticated(self):
        self.client.logout()

        data = {
            "treatment": self.treatment.id,
            "title": "Sin token",
            "description": "No autenticado"
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_create_file_wrong_role(self):
        # Un usuario que no es paciente
        physio_user = AppUser.objects.create_user(
            username="not_patient",
            email="nurse@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="NoPaciente",
            last_name="Infiltrado"
        )
        Physiotherapist.objects.create(
            user=physio_user,
            gender="M",
            birth_date="1980-01-01",
            collegiate_number="XYZ999",
            autonomic_community="Madrid",
            bio="Bio falsa",
            plan=self.plan
        )
        self.client.force_authenticate(user=physio_user)

        data = {
            "treatment": self.treatment.id,
            "title": "Intento inválido",
            "description": "No soy paciente"
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("detail", response.data)
        self.assertEqual(str(response.data["detail"]), "Usted no tiene permiso para realizar esta acción.")

    def test_create_file_title_too_long(self):
        test_file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")
        data = {
            "treatment": self.treatment.id,
            "title": "T" * 101,  # supera los 100 caracteres
            "description": "Título demasiado largo",
            "files": [test_file]
        }

        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("Asegúrese de que este campo no tenga más de 100 caracteres.", response.data["title"][0])

    @patch("files.serializers.boto3.client")
    def test_create_file_upload_error(self, mock_boto_client):
        mock_s3 = MagicMock()
        mock_boto_client.return_value = mock_s3

        # Simular excepción al subir el archivo
        mock_s3.upload_fileobj.side_effect = Exception("Simulated S3 failure")

        test_file = SimpleUploadedFile("fail.pdf", b"fail_content", content_type="application/pdf")

        data = {
            "treatment": self.treatment.id,
            "title": "Falla de subida",
            "description": "El archivo no se sube",
            "files": [test_file]
        }

        response = self.client.post(self.url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Error al subir archivo. Por favor, inténtelo de nuevo más tarde.", response.data)
        

class DeletePatientFileTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.client.force_authenticate(user=self.patient_user)

    @patch("files.models.PatientFile.delete_from_storage")
    def test_delete_file_success(self, mock_delete_from_storage):
        patient_file = PatientFile.objects.create(
            treatment=self.treatment,
            title="Archivo para borrar",
            description="Prueba",
            file_key="patient_files/test/delete.pdf"
        )

        url = reverse("delete_patient_file", args=[patient_file.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Archivo eliminado correctamente")
        self.assertFalse(PatientFile.objects.filter(id=patient_file.id).exists())
        mock_delete_from_storage.assert_called_once()

    def test_delete_file_unauthenticated(self):
        self.client.logout()

        patient_file = PatientFile.objects.create(
            treatment=self.treatment,
            title="Archivo no autenticado",
            file_key="key.pdf"
        )

        url = reverse("delete_patient_file", args=[patient_file.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_delete_file_not_owner(self):
        intruder_user = AppUser.objects.create_user(
            username="otro",
            email="otro@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Intruso",
            last_name="NoDueño"
        )
        other_patient = Patient.objects.create(user=intruder_user, birth_date="1985-01-01")
        other_treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=other_patient,
            homework='Otro',
            is_active=True,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(days=1)
        )

        patient_file = PatientFile.objects.create(
            treatment=other_treatment,
            title="No soy tuyo",
            file_key="otro.pdf"
        )

        url = reverse("delete_patient_file", args=[patient_file.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("No tienes permiso", response.data["error"])

    def test_delete_file_not_found(self):
        url = reverse("delete_patient_file", args=[99999])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Archivo no encontrado", response.data["error"])

    @patch("files.models.PatientFile.delete_from_storage")
    def test_delete_file_storage_error(self, mock_delete_from_storage):
        """
        Este test FALLA a propósito si delete_from_storage lanza una excepción no manejada.
        Sirve como recordatorio de que la vista no captura este error. No modificar hasta que se maneje correctamente.
        """
        patient_file = PatientFile.objects.create(
            treatment=self.treatment,
            title="Fallo en storage",
            file_key="fallo.pdf"
        )

        mock_delete_from_storage.side_effect = Exception("Simulated storage error")

        url = reverse("delete_patient_file", args=[patient_file.id])

        try:
            response = self.client.delete(url)
            # Si no lanza excepción pero da error 500, también fallamos
            if response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR:
                self.fail("ERROR 500: delete_from_storage no está manejado por la vista. Notificar para mejora.")
        except Exception as e:
            self.fail(f"Excepción no capturada en la vista: {str(e)}. Notificar para manejo correcto.")

class UpdatePatientFileTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.file = PatientFile.objects.create(
            treatment=self.treatment,
            title="Informe original",
            description="Desc original",
            file_key="patient_files/test/original.pdf"
        )

        self.client.force_authenticate(user=self.patient_user)

    def test_update_file_success(self):
        data = {
            "title": "Nuevo título",
            "description": "Descripción actualizada"
        }

        url = reverse("update_patient_file", args=[self.file.id])
        response = self.client.put(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Archivo actualizado correctamente")
        self.file.refresh_from_db()
        self.assertEqual(self.file.title, "Nuevo título")

    def test_update_file_not_found(self):
        url = reverse("update_patient_file", args=[9999])
        data = {"title": "Cambio"}

        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Archivo no encontrado", response.data["error"])

    def test_update_file_not_owner(self):
        intruder_user = AppUser.objects.create_user(
            username="intruso",
            email="intruso@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Otro",
            last_name="Usuario"
        )
        other_patient = Patient.objects.create(user=intruder_user, birth_date="1985-01-01")
        self.client.force_authenticate(user=intruder_user)

        url = reverse("update_patient_file", args=[self.file.id])
        response = self.client.put(url, {"title": "Intento de acceso ajeno"})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("No tienes permiso", response.data["error"])

    def test_update_file_unauthenticated(self):
        self.client.logout()
        url = reverse("update_patient_file", args=[self.file.id])
        response = self.client.put(url, {"title": "No autenticado"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])



class GetPatientFileByIdTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.file = PatientFile.objects.create(
            treatment=self.treatment,
            title="Archivo prueba",
            description="Prueba",
            file_key="patient_files/test/sample.pdf"
        )

    def test_patient_can_access_own_file(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse("get_patient_file_by_id", args=[self.file.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.file.title)

    def test_physio_can_access_patient_file(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("get_patient_file_by_id", args=[self.file.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.file.title)

    def test_unauthenticated_cannot_access_file(self):
        self.client.logout()
        url = reverse("get_patient_file_by_id", args=[self.file.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_other_user_cannot_access_file(self):
        intruder_user = AppUser.objects.create_user(
            username="intruso",
            email="intruso@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Otro",
            last_name="Usuario"
        )
        self.client.force_authenticate(user=intruder_user)

        url = reverse("get_patient_file_by_id", args=[self.file.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("Usted no tiene permiso para realizar esta acción.", str(response.data["detail"]))

    def test_file_not_found(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse("get_patient_file_by_id", args=[9999])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Archivo no encontrado", response.data["error"])

class GetPatientFilesTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        # Creamos dos archivos asociados a este tratamiento
        self.file1 = PatientFile.objects.create(
            treatment=self.treatment,
            title="Archivo 1",
            description="Primero",
            file_key="patient_files/test/file1.pdf"
        )

        self.file2 = PatientFile.objects.create(
            treatment=self.treatment,
            title="Archivo 2",
            description="Segundo",
            file_key="patient_files/test/file2.pdf"
        )

        self.url = reverse("get_patient_files")

    def test_patient_gets_own_files(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        titles = [file["title"] for file in response.data]
        self.assertIn("Archivo 1", titles)
        self.assertIn("Archivo 2", titles)

    def test_physio_gets_files_from_treatments(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_no_accessible_files_returns_404(self):
        # Usuario sin archivos relacionados
        user = AppUser.objects.create_user(
            username="intruso",
            email="intruso@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Otro",
            last_name="Usuario"
        )
        Patient.objects.create(user=user, birth_date="1990-01-01")

        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("No se han encontrado archivos", response.data["error"])

    def test_unauthenticated_user_cannot_access(self):
        self.client.logout()
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_user_with_no_role_gets_403(self):
        user = AppUser.objects.create_user(
            username="sinrol",
            email="sinrol@example.com",
            password="testpass",
            dni="11111111Z",
            phone_number="600000003",
            postal_code="28004",
            first_name="Sin",
            last_name="Rol"
        )
        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class CreateVideoTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.client.force_authenticate(user=self.user)
        self.url = reverse("create_video")

    @patch("files.serializers.boto3.client")
    def test_create_video_success(self, mock_boto_client):
        mock_s3 = MagicMock()
        mock_boto_client.return_value = mock_s3
        mock_s3.upload_fileobj.return_value = None  # No lanza error

        test_video = SimpleUploadedFile("video.mp4", b"contenido", content_type="video/mp4")
        data = {
            "treatment": self.treatment.id,
            "title": "Video de prueba",
            "description": "Ejercicio guiado",
            "file": test_video
        }

        response = self.client.post(self.url, data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Archivo creado correctamente")
        self.assertEqual(Video.objects.count(), 1)

    def test_create_video_unauthenticated(self):
        self.client.logout()
        data = {
            "treatment": self.treatment.id,
            "title": "Ejercicio",
            "file_key": "videos/fisio1/ejercicio.mp4"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_create_video_missing_treatment(self):
        data = {
            "title": "Sin tratamiento",
            "file_key": "videos/fisio1/sintratamiento.mp4"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("El ID del tratamiento es requerido", response.data["message"])

    def test_create_video_treatment_not_found(self):
        data = {
            "treatment": 9999,
            "title": "Tratamiento inexistente",
            "file_key": "videos/fisio1/invalido.mp4"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Tratamiento no encontrado", response.data["message"])

    def test_create_video_not_owned_by_physio(self):
        other_user = AppUser.objects.create_user(
            username="otrofisio",
            email="otro@example.com",
            password="testpass",
            dni="00000000X",
            phone_number="600000002",
            postal_code="28003",
            first_name="Fisio",
            last_name="Ajeno"
        )
        other_physio = Physiotherapist.objects.create(
            user=other_user,
            gender="M",
            birth_date="1980-01-01",
            collegiate_number="XYZ999",
            autonomic_community="Madrid",
            bio="Otro bio",
            plan=self.plan
        )

        self.client.force_authenticate(user=other_user)

        data = {
            "treatment": self.treatment.id,
            "title": "No autorizado",
            "file_key": "videos/fake/intrusion.mp4"
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("No tienes permiso", response.data["message"])

    def test_create_video_invalid_data(self):
        data = {
            "treatment": self.treatment.id,
            "title": "",  # Campo obligatorio vacío
            # Falta "file"
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("file", response.data) 

    @patch("files.serializers.boto3.client")
    def test_create_video_upload_fails(self, mock_boto_client):
        mock_s3 = MagicMock()
        mock_boto_client.return_value = mock_s3
        mock_s3.upload_fileobj.side_effect = Exception("Simulated upload error")

        test_video = SimpleUploadedFile("fallo.mp4", b"contenido", content_type="video/mp4")
        data = {
            "treatment": self.treatment.id,
            "title": "Falla controlada",
            "file": test_video
        }

        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(any("Error al subir archivo" in str(err) for err in response.data))

class DeleteVideoTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.video = Video.objects.create(
            treatment=self.treatment,
            title="Video prueba",
            description="Descripción",
            file_key="videos/fisio1/video.mp4"
        )

        self.url = reverse("delete_video", args=[self.video.id])
        self.client.force_authenticate(user=self.user)

    @patch("files.models.Video.delete_from_storage")
    def test_delete_video_success(self, mock_delete_from_storage):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Video eliminado correctamente")
        self.assertFalse(Video.objects.filter(id=self.video.id).exists())
        mock_delete_from_storage.assert_called_once()

    def test_delete_video_unauthenticated(self):
        self.client.logout()
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_delete_video_not_owner(self):
        other_user = AppUser.objects.create_user(
            username="intruso",
            email="otro@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Otro",
            last_name="Usuario"
        )
        other_physio = Physiotherapist.objects.create(
            user=other_user,
            gender="M",
            birth_date="1980-01-01",
            collegiate_number="XYZ999",
            autonomic_community="Madrid",
            bio="Otro",
            plan=self.plan
        )

        self.client.force_authenticate(user=other_user)
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("No tienes permiso", response.data["error"])

    def test_delete_video_not_found(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("delete_video", args=[99999])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Video no encontrado", response.data["error"])

    @patch("files.models.Video.delete_from_storage")
    def test_delete_video_storage_error(self, mock_delete_from_storage):
        """
        Este test FALLA a propósito si delete_from_storage sigue provocando error 500.
        Sirve como recordatorio para capturar esa excepción en el futuro.
        """
        mock_delete_from_storage.side_effect = Exception("Simulated deletion error")

        try:
            response = self.client.delete(self.url)

            if response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR:
                self.fail("ERROR 500: delete_from_storage lanza excepción no manejada. Notificar para mejora.")
        except Exception as e:
            self.fail(f"Excepción no capturada en la vista: {str(e)}. Notificar para manejo adecuado.")

class ListVideoByIdTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.video = Video.objects.create(
            treatment=self.treatment,
            title="Video prueba",
            description="Instrucción visual",
            file_key="videos/fisio1/prueba.mp4"
        )

        self.url = reverse("list_video_by_id", args=[self.video.id])

    def test_patient_can_view_video(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.video.title)

    def test_physio_can_view_video(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.video.title)

    def test_unauthenticated_user_cannot_view_video(self):
        self.client.logout()
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_user_without_access_cannot_view_video(self):
        intruder_user = AppUser.objects.create_user(
            username="intruso",
            email="intruso@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Otro",
            last_name="Usuario"
        )
        self.client.force_authenticate(user=intruder_user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(str(response.data["detail"]), "Usted no tiene permiso para realizar esta acción.")

    def test_video_not_found(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse("list_video_by_id", args=[9999])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Video no encontrado", response.data["error"])

class ListMyVideosTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.video1 = Video.objects.create(
            treatment=self.treatment,
            title="Video 1",
            description="Descripción 1",
            file_key="videos/fisio1/video1.mp4"
        )

        self.video2 = Video.objects.create(
            treatment=self.treatment,
            title="Video 2",
            description="Descripción 2",
            file_key="videos/fisio1/video2.mp4"
        )

        self.url = reverse("list_my_videos")

    def test_patient_can_list_their_videos(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        titles = [video["title"] for video in response.data]
        self.assertIn("Video 1", titles)
        self.assertIn("Video 2", titles)

    def test_physio_can_list_their_videos(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_user_with_no_accessible_videos(self):
        new_user = AppUser.objects.create_user(
            username="newuser",
            email="nuevo@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000010",
            postal_code="28004",
            first_name="Sin",
            last_name="Videos"
        )
        Patient.objects.create(user=new_user, birth_date="1990-01-01")
        self.client.force_authenticate(user=new_user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("No se han encontrado videos", response.data["error"])

    def test_unauthenticated_user_cannot_access(self):
        self.client.logout()
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_user_with_no_role_gets_403(self):
        user = AppUser.objects.create_user(
            username="norol",
            email="norol@example.com",
            password="testpass",
            dni="22222222T",
            phone_number="600000099",
            postal_code="28005",
            first_name="Sin",
            last_name="Rol"
        )
        self.client.force_authenticate(user=user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class UpdateVideoTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.video = Video.objects.create(
            treatment=self.treatment,
            title="Video inicial",
            description="Descripción inicial",
            file_key="videos/fisio1/video.mp4"
        )

        self.url = reverse("update_video", args=[self.video.id])
        self.client.force_authenticate(user=self.user)

    def test_update_video_success(self):
        data = {
            "title": "Nuevo título",
            "description": "Nueva descripción"
        }
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Video actualizado correctamente")
        self.video.refresh_from_db()
        self.assertEqual(self.video.title, "Nuevo título")

    def test_update_video_not_found(self):
        url = reverse("update_video", args=[99999])
        response = self.client.put(url, {"title": "Cambio"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("El video no existe", response.data["error"])

    def test_update_video_not_owner(self):
        other_user = AppUser.objects.create_user(
            username="otro_fisio",
            email="otro@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Otro",
            last_name="Fisio"
        )
        other_physio = Physiotherapist.objects.create(
            user=other_user,
            gender="M",
            birth_date="1980-01-01",
            collegiate_number="XYZ999",
            autonomic_community="Madrid",
            bio="Otro bio",
            plan=self.plan
        )
        self.client.force_authenticate(user=other_user)
        response = self.client.put(self.url, {"title": "Intento ajeno"})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("No tienes permiso", response.data["error"])

    def test_update_video_unauthenticated(self):
        self.client.logout()
        response = self.client.put(self.url, {"title": "Sin token"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_update_video_invalid_data(self):
        response = self.client.put(self.url, {"title": ""})  # Vacío
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

class StreamVideoTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = AppUser.objects.create_user(
            username="physio1",
            email="physio@example.com",
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

        self.physiotherapist = Physiotherapist.objects.create(
            user=self.user,
            gender="F",
            birth_date="1990-01-01",
            collegiate_number="ABC123",
            autonomic_community="Madrid",
            bio="Test bio",
            plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient@example.com",
            password="testpass",
            dni="87654321X",
            phone_number="600000001",
            postal_code="28002",
            first_name="Juan",
            last_name="Gómez"
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01"
        )

        now = timezone.now()
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 1',
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )

        self.video = Video.objects.create(
            treatment=self.treatment,
            title="Video prueba",
            description="Ejercicio",
            file_key="videos/fisio1/video.mp4"
        )

        self.url = reverse("stream_video", args=[self.video.id])
        self.client.force_authenticate(user=self.patient_user)

    @patch("files.views.boto3.client")
    def test_stream_full_video_success(self, mock_boto_client):
        mock_body = MagicMock()
        mock_body.iter_chunks.return_value = [b"chunk1", b"chunk2"]
        mock_boto_client.return_value.get_object.return_value = {
            "ContentLength": 12,
            "Body": mock_body
        }

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response, StreamingHttpResponse)
        self.assertEqual(response["Content-Type"], "video/mp4")

    @patch("files.views.boto3.client")
    def test_stream_video_with_range_success(self, mock_boto_client):
        mock_body = BytesIO(b"0123456789")
        mock_boto_client.return_value.get_object.return_value = {
            "ContentLength": 10,
            "Body": mock_body
        }

        response = self.client.get(self.url, HTTP_RANGE="bytes=0-4")

        self.assertEqual(response.status_code, 206)
        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response["Content-Range"], "bytes 0-4/10")
        self.assertEqual(response["Content-Length"], "5")
        self.assertEqual(response.content, b"01234")

    def test_stream_video_not_found(self):
        url = reverse("stream_video", args=[9999])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 404)
        self.assertIn("El video no existe", response.data["error"])

    def test_stream_video_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
        self.assertIn("Las credenciales de autenticación no se proveyeron.", response.data["detail"])

    def test_stream_video_not_owner(self):
        other_user = AppUser.objects.create_user(
            username="otro_paciente",
            email="otro@example.com",
            password="testpass",
            dni="00000000T",
            phone_number="600000002",
            postal_code="28003",
            first_name="Otro",
            last_name="Paciente"
        )
        other_patient = Patient.objects.create(user=other_user, birth_date="1990-01-01")
        self.client.force_authenticate(user=other_user)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 403)
        self.assertIn("No tienes permisos", response.data["error"])

    @patch("files.views.boto3.client")
    def test_stream_video_storage_error(self, mock_boto_client):
        mock_boto_client.return_value.get_object.side_effect = Exception("DigitalOcean error")

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 500)
        self.assertIn("DigitalOcean error", response.data["error"])