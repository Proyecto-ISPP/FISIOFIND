from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils.timezone import now
from datetime import timedelta
from appointment.models import Appointment
from appointment_rating.models import AppointmentRating
from videocall.models import Room
from users.models import AppUser
from users.models import Patient
from users.models import Physiotherapist
from django.core.exceptions import ObjectDoesNotExist
from unittest.mock import patch

class AppointmentRatingIntegrationTests(APITestCase):

    def setUp(self):
        # Crear usuario paciente
        self.patient_user = AppUser.objects.create_user(
            username="paciente",
            email="paciente@example.com",
            password="testpass",
            dni="80736062J"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            birth_date="1995-01-01",
            gender="F"
        )
        
        # Crear usuario fisioterapeuta
        self.physio_user = AppUser.objects.create_user(
            username="fisio",
            email="fisio@example.com",
            password="testpass",
            dni="21419210T"
        )
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            gender="M",
            birth_date="1990-01-01",
            collegiate_number="C123",
            autonomic_community="MADRID"
        )

        # Autenticar el cliente con el usuario paciente
        self.client.force_authenticate(user=self.patient_user)

        # Crear una cita terminada (status="finished") que finalizó hace 1 hora y en el mismo día
        self.appointment = Appointment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=now() - timedelta(hours=2),
            end_time=now() - timedelta(hours=1),
            status="finished",
            is_online=True,
            service={"type": "Consulta", "duration": 60},
            alternatives=None
        )

        # Datos válidos para crear una valoración
        self.valid_rating_data = {
            "score": 4.5,
            "comment": "Buena sesión"
        }
        
        self.create_or_update_rating_url = reverse("create_or_update_rating", kwargs={"appointment_id": self.appointment.id})
        self.get_appointment_rating_url = reverse("get_appointment_rating", kwargs={"appointment_id": self.appointment.id})
        self.list_ratings_url = reverse("ratings-list", kwargs={"physio_id": self.physio.id})
        self.get_my_rating_url = reverse("ratings-average")
        
        # Para endpoints basados en Room
        # Creamos una Room asociada a la cita:
        self.room = Room.objects.create(
            code="TEST123",
            appointment=self.appointment,
            patient=self.patient,
            physiotherapist=self.physio,
            is_test_room=False
        )
        self.create_rating_by_room_url = reverse("ratings-create", kwargs={"room_code": "TEST123"})
        self.check_rating_by_room_url = reverse("check_rating_by_room_code", kwargs={"room_code": "TEST123"})
        
        self.report_rating_url_template = lambda rating_id: reverse("report_rating", kwargs={"rating_id": rating_id})

    @patch("appointment_rating.views.send_rating_email")
    def test_successful_rating_creation(self, mock_send_email):
        """Test exitoso de creación de rating para una cita finalizada (método POST)"""
        response = self.client.post(self.create_or_update_rating_url, self.valid_rating_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data["score"]), 4.5)
        self.assertEqual(response.data["comment"], "Buena sesión")
        self.assertEqual(response.data["appointment"], self.appointment.id)
        mock_send_email.assert_called()

    @patch("appointment_rating.views.send_rating_email")
    def test_duplicate_rating_creation_fails(self, mock_send_email):
        """No se puede crear más de un rating para la misma cita (POST)"""
        self.client.post(self.create_or_update_rating_url, self.valid_rating_data, format="json")
        mock_send_email.assert_called()
        response = self.client.post(self.create_or_update_rating_url, self.valid_rating_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("appointment_rating.views.send_rating_email")
    def test_successful_rating_update(self, mock_send_email):
        """Test para actualizar un rating existente (método PUT)"""
        # Crear rating inicialmente
        create_response = self.client.post(self.create_or_update_rating_url, self.valid_rating_data, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        # Actualización: cambiamos score y comment
        updated_data = {"score": 5.0, "comment": "Actualizado"}
        put_response = self.client.put(self.create_or_update_rating_url, updated_data, format="json")
        self.assertEqual(put_response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(put_response.data["score"]), 5.0)
        self.assertEqual(put_response.data["comment"], "Actualizado")
        mock_send_email.assert_called()

    @patch("appointment_rating.views.send_rating_email")
    def test_get_appointment_rating_success(self, mock_send_email):
        """Obtener el rating de una cita cuando existe (GET)"""
        # Primero, crear el rating
        self.client.post(self.create_or_update_rating_url, self.valid_rating_data, format="json")
        response = self.client.get(self.get_appointment_rating_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data["score"]), 4.5)
        self.assertEqual(response.data["comment"], "Buena sesión")
        mock_send_email.assert_called()

    def test_get_appointment_rating_not_found(self):
        """Obtener el rating de una cita sin rating debe devolver error 404"""
        response = self.client.get(self.get_appointment_rating_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_list_ratings(self):
        """Listar los ratings para un fisioterapeuta (GET)"""
        # Crear dos ratings (para distintas citas)
        AppointmentRating.objects.create(
            patient=self.patient, physiotherapist=self.physio,
            appointment=self.appointment, score=4.5, comment="Test 1"
        )
        # Crear otra cita y rating adicional
        appointment2 = Appointment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=now() - timedelta(hours=3),
            end_time=now() - timedelta(hours=2),
            status="finished",
            is_online=True,
            service={"type": "Consulta", "duration": 60},
            alternatives=None
        )

        AppointmentRating.objects.create(
            patient=self.patient, physiotherapist=self.physio,
            appointment=appointment2, score=5.0, comment="Test 2"
        )
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.get(self.list_ratings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_my_rating(self):
        """Obtener la media y cantidad de ratings para un fisioterapeuta (GET)"""
        # Crear dos ratings para el mismo fisioterapeuta
        AppointmentRating.objects.create(
            patient=self.patient, physiotherapist=self.physio,
            appointment=self.appointment, score=4.0, comment="Test 1"
        )
        appointment2 = Appointment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=now() - timedelta(hours=3),
            end_time=now() - timedelta(hours=2),
            status="finished",
            is_online=True,
            service={"type": "Consulta", "duration": 60},
            alternatives=None
        )
        AppointmentRating.objects.create(
            patient=self.patient, physiotherapist=self.physio,
            appointment=appointment2, score=5.0, comment="Test 2"
        )
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.get(self.get_my_rating_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("rating", response.data)
        self.assertIn("ratings_count", response.data)

    @patch("appointment_rating.views.send_rating_email")  
    def test_report_rating_as_physio(self, mock_send_email):
        """Test para reportar un rating, donde el reporte lo realiza el fisioterapeuta"""
        # Crear rating como paciente
        self.client.force_authenticate(user=self.patient_user)
        create_response = self.client.post(self.create_or_update_rating_url, self.valid_rating_data, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        rating_id = create_response.data["id"]

        # Cambiar autenticación a fisioterapeuta para reportar
        self.client.force_authenticate(user=self.physio_user)
        report_url = reverse("report_rating", kwargs={"rating_id": rating_id})
        report_response = self.client.post(report_url, format="json")
        self.assertEqual(report_response.status_code, status.HTTP_200_OK)
        self.assertIn("message", report_response.data)
        mock_send_email.assert_called()

    @patch("appointment_rating.views.send_rating_email")
    def test_create_rating_by_room_code(self, mock_send_email):
        """Crear un rating usando el endpoint basado en room_code (POST)"""
        url = self.create_rating_by_room_url
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.post(url, self.valid_rating_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data["score"]), 4.5)
        self.assertEqual(response.data["appointment"], self.appointment.id)
        mock_send_email.assert_called()

    def test_check_rating_by_room_code_exists(self):
        """Verificar que se detecta un rating existente por room_code (GET)"""
        AppointmentRating.objects.create(
            patient=self.patient, physiotherapist=self.physio,
            appointment=self.appointment, score=4.5, comment="Test rating"
        )
        url = self.check_rating_by_room_url
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("score", response.data)

    def test_check_rating_by_room_code_not_exists(self):
        """Verificar que para un room sin rating se indica que no existe rating (GET)"""
        url = self.check_rating_by_room_url
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data.get("rating_exists", False))
        
    def test_create_or_update_rating_invalid_patient(self):
        """Intenta crear rating con una cita que no pertenece al paciente autenticado."""
        # Creamos otra cita pero sin asignar al paciente
        other_patient_user = AppUser.objects.create_user(
            username="otro_paciente",
            email="otro_paciente@example.com",
            password="testpass",
            dni="12345678A"
        )
        other_patient = Patient.objects.create(
            user=other_patient_user,
            birth_date="1998-01-01",
            gender="M"
        )
        appointment2 = Appointment.objects.create(
            physiotherapist=self.physio,
            patient=other_patient,
            start_time=now() - timedelta(hours=2),
            end_time=now() - timedelta(hours=1),
            status="finished",
            is_online=True,
            service={"type": "Consulta", "duration": 60},
            alternatives=None
        )
        url = reverse("create_or_update_rating", kwargs={"appointment_id": appointment2.id})
        response = self.client.post(url, {"score": 4.0, "comment": "Error de paciente"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_create_or_update_rating_unfinished(self):
        """Intenta crear rating para una cita que no está terminada."""
        self.appointment.status = "pending"
        self.appointment.save()
        response = self.client.post(self.create_or_update_rating_url, {"score": 4.0, "comment": "No terminada"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_create_or_update_rating_too_old(self):
        """Intenta crear rating para una cita que terminó hace más de 7 días."""
        self.appointment.end_time = now() - timedelta(days=8)
        self.appointment.save()
        response = self.client.post(self.create_or_update_rating_url, {"score": 4.0, "comment": "Demasiado vieja"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_create_or_update_rating_put_no_existing_rating(self):
        """Intenta actualizar un rating con PUT cuando no existe rating previo."""
        # No se crea rating de antemano
        response = self.client.put(self.create_or_update_rating_url, {"score": 4.0, "comment": "Intento actualización"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_get_appointment_rating_invalid_appointment(self):
        """Intenta obtener el rating para una cita que no pertenece al paciente autenticado."""
        invalid_url = reverse("get_appointment_rating", kwargs={"appointment_id": 9999})
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Aceptamos que la respuesta tenga "error" o "detail"
        self.assertTrue("error" in response.data or "detail" in response.data)

    def test_report_rating_as_physio_error(self):
        """Prueba que reportar un rating inexistente retorna error 404."""
        self.client.force_authenticate(user=self.physio_user)
        report_url = self.report_rating_url_template(9999)
        response = self.client.post(report_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_list_ratings_no_ratings(self):
        """Prueba listar ratings para un fisioterapeuta cuando no existen ratings."""
        self.client.force_authenticate(user=self.physio_user)
        # Asegurarse de que no existan ratings en la base de datos para este physiotherapist
        AppointmentRating.objects.all().delete()
        response = self.client.get(self.list_ratings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_my_rating_empty(self):
        """Prueba obtener la media y cantidad de ratings cuando no existen ratings."""
        self.client.force_authenticate(user=self.physio_user)
        # Asegurarse de que no existan ratings para el fisioterapeuta
        AppointmentRating.objects.filter(physiotherapist=self.physio).delete()
        response = self.client.get(self.get_my_rating_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # En este caso, se espera que rating sea None
        self.assertIsNone(response.data["rating"])
        self.assertEqual(response.data["ratings_count"], 0)

    def test_object_does_not_exist_is_handled(self):
        with self.assertRaises(ObjectDoesNotExist):
            AppointmentRating.objects.get(id=99999)

    def test_reverse_url_for_invalid_name_raises_error(self):
        from django.urls.exceptions import NoReverseMatch
        with self.assertRaises(NoReverseMatch):
            reverse("non_existent_url_name")

    def test_model_string_representation(self):
        user = AppUser.objects.create_user(username="testuser", email="test@example.com", password="pass", dni="12345678Z")
        patient = Patient.objects.create(user=user, birth_date="2000-01-01", gender="F")
        physio = Physiotherapist.objects.create(user=user, birth_date="1990-01-01", gender="M", collegiate_number="C0001", autonomic_community="VALENCIA")
        appointment = Appointment.objects.create(
            physiotherapist=physio,
            patient=patient,
            start_time=now() - timedelta(hours=2),
            end_time=now() - timedelta(hours=1),
            status="finished",
            is_online=True,
            service={"type": "Revisión", "duration": 60},
            alternatives=None
        )
        rating = AppointmentRating.objects.create(
            patient=patient, physiotherapist=physio, appointment=appointment, score=5.0, comment="Genial"
        )
        self.assertIn("5.0", str(rating))
        self.assertIn("test@example.com", str(rating))
