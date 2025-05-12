from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from rest_framework import status
from django.urls import reverse
from users.models import AppUser, Physiotherapist, Pricing, Patient
from questionnaire.models import Questionnaire, QuestionnaireResponses
from appointment.models import Appointment
from videocall.models import Room
from datetime import datetime, timedelta
import pytz

"""
Se prueban: 
    - Titulos o labels muy largos
    - Acceder sin usuario
    - Acceder siendo paciente
    - Acciones validas
    - jsons con mal formato
"""

class QuestionnaireViewTests(APITestCase):
    def setUp(self):
        self.plan_blue, _ = Pricing.objects.get_or_create(name='blue', defaults={'price': 10, 'video_limit': 5})
        self.plan_gold, _ = Pricing.objects.get_or_create(name='Gold', defaults={'price': 99, 'video_limit': 20})

        self.user = AppUser.objects.create_user(
            username="example", dni='12345678A',
            email='ana@example.com', password='pass',
            first_name='Ana', last_name='López', postal_code='28001', photo=''
        )
        
        self.user_no_physio = AppUser.objects.create_user(
            username="example2", dni='44825747N',
            email='ana2@example.com', password='pass2',
            first_name='Ana2', last_name='López2', postal_code='28002', photo=''
        )
        
        self.patient_user = AppUser.objects.create_user(
            username="example3", dni='87393815W',
            email='ana3@example.com', password='pass3',
            first_name='Ana3', last_name='López3', postal_code='28003', photo=''
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender='F',
            birth_date='1980-01-01',
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            plan=self.plan_blue,
            birth_date='1980-01-01',
            rating_avg=4.5,
            schedule={
                "exceptions": {}, 
                "appointments": [
                    {"status": "booked", "end_time": "2025-05-08T08:00:00+0200", "start_time": "2025-05-08T07:00:00+0200"}], 
                "weekly_schedule": {
                    "friday": [[{"id": "ws-1743588431925-196", "end": "11:30", "start": "06:00"}]], 
                    "monday": [[{"id": "ws-1743588426078-297", "end": "11:30", "start": "06:00"}]], 
                    "sunday": [[{"id": "ws-1743588437221-514", "end": "11:30", "start": "06:00"}]], 
                    "tuesday": [[{"id": "ws-1743588427821-114", "end": "11:30", "start": "06:00"}]], 
                    "saturday": [[{"id": "ws-1743588435485-212", "end": "11:30", "start": "06:00"}]], 
                    "thursday": [[{"id": "ws-1743588430590-854", "end": "11:30", "start": "06:00"}]], 
                    "wednesday": [[{"id": "ws-1743588429230-980", "end": "11:30", "start": "06:00"}]]}},  # puedes dejar el tuyo completo aquí
            services={"1": {"price": 30, "title": "Primera consulta", "duration": 60}},
            gender='F',
            autonomic_community='MADRID'
        )
        self.client.force_authenticate(user=self.user)
        self.questionnaire = Questionnaire.objects.create(
            physiotherapist=self.physio,
            title="Test Q",
            json_schema={
                "type": "object",
                "properties": {
                    "q1": {"type": "string"},
                    "q2": {"type": "number"},
                    "q3": {"enum": ["opcion1", "opcion2", "opcion3"], "type": "string"}
                }
            },
            ui_schema={
                "type": "Group",
                "label": "Titulo 1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "elements": [
                    {"type": "Control", "label": "¿Arriba o abajo?", "scope": "#/properties/q1"},
                    {"type": "Control", "label": "pregunta con numero", "scope": "#/properties/q2"},
                    {"type": "Control", "label": "pregunta con seleccion", "scope": "#/properties/q3"}
                ]
            },
            questions=[
                {"type": "string", "label": "¿Arriba o abajo?", "options": []},
                {"type": "number", "label": "pregunta con numero", "options": []},
                {"type": "select", "label": "pregunta con seleccion", "options": ["opcion1", "opcion2", "opcion3"]}
            ]
        )

    def test_list_questionnaires(self):
        url = reverse('questionnaire_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_full_questionnaire(self):
        url = reverse('create_questionnaire')
        data = {
            "title": "Cuestionario de prueba",
            "json_schema": {
                "type": "object",
                "properties": {
                    "q1": {"type": "string"},
                    "q2": {"type": "number"},
                    "q3": {"enum": ["opcion1", "opcion2", "opcion3"], "type": "string"}
                }
            },
            "ui_schema": {
                "type": "Group",
                "label": "Titulo 1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "elements": [
                    {"type": "Control", "label": "¿Arriba o abajo?", "scope": "#/properties/q1"},
                    {"type": "Control", "label": "pregunta con numero", "scope": "#/properties/q2"},
                    {"type": "Control", "label": "pregunta con seleccion", "scope": "#/properties/q3"}
                ]
            },
            "questions": [
                {"type": "string", "label": "¿Arriba o abajo?", "options": []},
                {"type": "number", "label": "pregunta con numero", "options": []},
                {"type": "select", "label": "pregunta con seleccion", "options": ["opcion1", "opcion2", "opcion3"]}
            ]
        }
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Questionnaire.objects.count(), 2)
        self.assertEqual(response.data['title'], data['title'])

    def test_detail_questionnaire(self):
        url = reverse('questionnaire_detail', args=[self.questionnaire.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.questionnaire.title)

    def test_update_questionnaire(self):
        url = reverse('questionnaire_detail', args=[self.questionnaire.id])
        data = {'title': 'Actualizado'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.questionnaire.refresh_from_db()
        self.assertEqual(self.questionnaire.title, 'Actualizado')

    def test_update_questionnaire_invalid_question(self):
        url = reverse('questionnaire_detail', args=[self.questionnaire.id])
        long_label = '¿' + 'a' * 76 + '?'
        data = {
            'questions': [{"type": "string", "label": long_label, "options": []}]
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_questionnaire(self):
        url = reverse('questionnaire_detail', args=[self.questionnaire.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Questionnaire.objects.filter(id=self.questionnaire.id).exists())

    def test_create_question(self):
        url = reverse('create_question', args=[self.questionnaire.id])
        question_data = {
            "type": "select",
            "label": "¿Tienes fiebre?",
            "options": ["Sí", "No"]
        }
        response = self.client.post(url, data=question_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.questionnaire.refresh_from_db()
        self.assertIn(question_data, self.questionnaire.questions)

    def test_unauthorized_access(self):
        self.client.force_authenticate(user=None)
        url = reverse('questionnaire_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_list_questionnaires(self):
        self.client.force_authenticate(user=None)
        url = reverse('questionnaire_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_create_questionnaire(self):
        self.client.force_authenticate(user=None)
        url = reverse('create_questionnaire')
        response = self.client.post(url, data={}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_detail_questionnaire(self):
        self.client.force_authenticate(user=None)
        url = reverse('questionnaire_detail', args=[self.questionnaire.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_create_question(self):
        self.client.force_authenticate(user=None)
        url = reverse('create_question', args=[self.questionnaire.id])
        response = self.client.post(url, data={}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_non_physio_list_questionnaires(self):
        self.client.force_authenticate(user=self.user_no_physio)
        url = reverse('questionnaire_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_physio_create_questionnaire(self):
        self.client.force_authenticate(user=self.user_no_physio)
        url = reverse('create_questionnaire')
        response = self.client.post(url, data={}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_physio_detail_questionnaire(self):
        self.client.force_authenticate(user=self.user_no_physio)
        url = reverse('questionnaire_detail', args=[self.questionnaire.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_physio_create_question(self):
        self.client.force_authenticate(user=self.user_no_physio)
        url = reverse('create_question', args=[self.questionnaire.id])
        response = self.client.post(url, data={}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_detail_nonexistent_questionnaire(self):
        url = reverse('questionnaire_detail', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_nonexistent_questionnaire(self):
        url = reverse('questionnaire_detail', args=[9999])
        data = {"title": "Nuevo título"}
        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nonexistent_questionnaire(self):
        url = reverse('questionnaire_detail', args=[9999])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patient_access_list_forbidden(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('questionnaire_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patient_create_forbidden(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('create_questionnaire')
        response = self.client.post(url, data={}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_questionnaire_title_too_long(self):
        url = reverse('create_questionnaire')
        long_title = 'T' * 76
        data = {
            "title": long_title,
            "json_schema": {"type": "object", "properties": {}},
            "ui_schema": {"type": "Group", "label": "Test", "elements": []},
            "questions": []
        }
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_create_questionnaire_invalid_json_schema(self):
        url = reverse('create_questionnaire')
        data = {
            "title": "Cuestionario inválido",
            "json_schema": "esto no es json",  # string inválido
            "ui_schema": {"type": "Group", "label": "Test", "elements": []},
            "questions": []
        }
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_create_questionnaire_invalid_ui_schema(self):
        url = reverse('create_questionnaire')
        data = {
            "title": "Cuestionario inválido",
            "json_schema": {"type": "object", "properties": {}},
            "ui_schema": "esto tampoco es json",
            "questions": []
        }
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

class CreateQuestionnaireResponseTests(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now_spain = datetime.now(self.spain_tz)
        self.future_date = now_spain + timedelta(weeks=1)
        self.future_date = self.future_date.astimezone(self.spain_tz)
        future_date_str = self.future_date.strftime("%Y-%m-%d")

        self.start_time = f"{future_date_str}T10:00:00{self.future_date.strftime('%z')}"
        self.end_time = f"{future_date_str}T11:00:00{self.future_date.strftime('%z')}"

        # Usuario y fisioterapeuta
        self.physio_user = AppUser.objects.create_user(
            username="fisio_test",
            email="fisio@test.com",
            password="Usuar1o_1",
            dni="11111111A",
            phone_number="600000000",
            postal_code="41000",
            account_status="ACTIVE",
            first_name="Fisio",
            last_name="Test"
        )
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            birth_date="1985-01-01",
            collegiate_number="FISIO123",
            autonomic_community="ANDALUCIA",
            gender="M",
            schedule={},
            services={
                "1": {
                    "id": 1,
                    "title": "Sesión estándar",
                    "tipo": "SESION",
                    "price": 40,
                    "description": "Sesión de fisioterapia de 1 hora",
                    "duration": 60,
                    "custom_questionnaire": None
                }
            }
        )

        # Cuestionario realista para pruebas
        self.questionnaire1 = Questionnaire.objects.create(
            title="Cuestionario básico",
            physiotherapist=self.physio,
            json_schema={
                "type": "object",
                "properties": {
                    "q1": {"type": "string"},
                    "q2": {"type": "string"},
                    "q3": {"type": "number"}
                }
            },
            ui_schema={
                "type": "Group",
                "label": "Cuestionario básico",
                "elements": [
                    {"type": "Control", "label": "¿Dónde sientes molestias?", "scope": "#/properties/q1"},
                    {"type": "Control", "label": "¿Desde cuándo?", "scope": "#/properties/q2"},
                    {"type": "Control", "label": "Nivel de dolor (1-10)", "scope": "#/properties/q3"}
                ]
            },
            questions=[
                {"type": "string", "label": "¿Dónde sientes molestias?", "options": []},
                {"type": "string", "label": "¿Desde cuándo?", "options": []},
                {"type": "number", "label": "Nivel de dolor (1-10)", "options": []}
            ]
        )

        # Cuestionario realista para pruebas
        self.questionnaire2 = Questionnaire.objects.create(
            title="Cuestionario básico",
            physiotherapist=self.physio,
            json_schema={
                "type": "object",
                "properties": {
                    "q1": {"type": "string"},
                    "q2": {"type": "string"},
                    "q3": {"type": "number"}
                }
            },
            ui_schema={
                "type": "Group",
                "label": "Cuestionario básico",
                "elements": [
                    {"type": "Control", "label": "¿Dónde sientes molestias?", "scope": "#/properties/q1"},
                    {"type": "Control", "label": "¿Desde cuándo?", "scope": "#/properties/q2"},
                    {"type": "Control", "label": "Nivel de dolor (1-10)", "scope": "#/properties/q3"}
                ]
            },
            questions=[
                {"type": "string", "label": "¿Dónde sientes molestias?", "options": []},
                {"type": "string", "label": "¿Desde cuándo?", "options": []},
                {"type": "number", "label": "Nivel de dolor (1-10)", "options": []}
            ]
        )

        # Usuario y paciente
        self.patient_user = AppUser.objects.create_user(
            username="paciente_test",
            email="paciente@test.com",
            password="Usuar1o_1",
            dni="22222222B",
            phone_number="600000001",
            postal_code="41001",
            account_status="ACTIVE",
            first_name="Paciente",
            last_name="Test"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender="F",
            birth_date="1990-01-01"
        )

        # Cita
        self.appointment = Appointment.objects.create(
            start_time=self.start_time,
            end_time=self.end_time,
            is_online=False,
            service=self.physio.services["1"],
            patient=self.patient,
            physiotherapist=self.physio,
            status='confirmed',
            alternatives='',
        )

        self.room = Room.objects.create(
            appointment=self.appointment,
            code="ROOM123",
            physiotherapist = self.physio,
            patient = self.patient,
            is_test_room=False,
            created_at=datetime.now(pytz.utc),
        )

        # Respuestas al cuestionario
        self.questionnaire_response = QuestionnaireResponses.objects.create(
            responses={
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Espalda baja"},
                "q2": {"question": "¿Desde cuándo?", "response": "Hace 2 semanas"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 6}
            },
            notes="Paciente refiere dolor agudo",
            appointment=self.appointment,
            questionnaire=self.questionnaire1
        )

    def test_create_questionnaire_response_success(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Cuello"},
                "q2": {"question": "¿Desde cuándo?", "response": "3 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 7}
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["responses"]["q1"]["response"], "Cuello")

    def test_create_questionnaire_response_missing_fields(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Hombro"}
                # Falta q2 y q3
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Falta la respuesta a la pregunta 'q2'.")

    def test_create_questionnaire_response_invalid_room_code(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "BADROOMCODE",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Brazo"},
                "q2": {"question": "¿Desde cuándo?", "response": "1 semana"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 4}
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Código de sala no válido.")

    def test_create_questionnaire_response_unrelated_questionnaire(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Crear un cuestionario de otro fisio
        another_physio_user = AppUser.objects.create_user(
            username="otro_fisio", email="otro@test.com", password="Password123"
        )
        another_physio = Physiotherapist.objects.create(
            user=another_physio_user,
            birth_date="1985-01-01",
            collegiate_number="FISIO123",
            autonomic_community="ANDALUCIA",
            gender="M",
            schedule={},
            services={
                "1": {
                    "id": 1,
                    "title": "Sesión estándar",
                    "tipo": "SESION",
                    "price": 40,
                    "description": "Sesión de fisioterapia de 1 hora",
                    "duration": 60,
                    "custom_questionnaire": None
                }
            }
        )
        unrelated_questionnaire = Questionnaire.objects.create(
            title="Otro cuestionario",
            physiotherapist=another_physio,
            json_schema=self.questionnaire1.json_schema,
            ui_schema=self.questionnaire1.ui_schema,
            questions=self.questionnaire1.questions
        )

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Tobillo"},
                "q2": {"question": "¿Desde cuándo?", "response": "4 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 5}
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{unrelated_questionnaire.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Este cuestionario no está asignado al fisioterapeuta de la cita.")

    def test_create_questionnaire_response_already_exists(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Espalda"},
                "q2": {"question": "¿Desde cuándo?", "response": "1 mes"},
                "q3": {"question": "Nivel de dolor (1-10)", "response":7}
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{self.questionnaire1.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_extra_response(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Cuello"},
                "q2": {"question": "¿Desde cuándo?", "response": "3 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 7},
                "q4": {"question": "Pregunta extra", "response": "Respuesta extra"}  # Respuesta inesperada
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Respuestas inesperadas", response.data["error"])

    def test_wrong_type_string(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": 678},  # Debe ser cadena de texto
                "q2": {"question": "¿Desde cuándo?", "response": "3 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 7},
            },
            "notes": ""
        }
        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "La respuesta a 'q1' debe ser una cadena de texto.")

    def test_wrong_type_number(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Espalda"},  # Debe ser cadena de texto
                "q2": {"question": "¿Desde cuándo?", "response": "3 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": "NaN"},
            },
            "notes": ""
        }
        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "La respuesta a 'q3' debe ser un número.")

    def test_unauthenticated_user(self):
        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Espalda"},  # Debe ser cadena de texto
                "q2": {"question": "¿Desde cuándo?", "response": "3 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 6},
            },
            "notes": ""
        }
        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_questionnaire_response_invalid_patient(self):
        another_patient_user = AppUser.objects.create_user(
            username="otro_paciente",
            email="paciente@test.com",
            password="Usuar1o_1",
            dni="22222222B",
            phone_number="600000001",
            postal_code="41001",
            account_status="ACTIVE",
            first_name="Paciente",
            last_name="Test"
        )
        another_patient = Patient.objects.create(
            user=another_patient_user,
            gender="F",
            birth_date="1990-01-01"
        )

        login_response = self.client.post('/api/app_user/login/', {
            'username': 'otro_paciente',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "room_code": "ROOM123",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Tobillo"},
                "q2": {"question": "¿Desde cuándo?", "response": "4 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 5}
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Este cuestionario no está asignado al paciente de la cita.")

    def test_create_questionnaire_response_invalid_appointment_status(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        another_appointment = Appointment.objects.create(
            start_time=self.start_time,
            end_time=self.end_time,
            is_online=False,
            service=self.physio.services["1"],
            patient=self.patient,
            physiotherapist=self.physio,
            status='canceled',
            alternatives='',
        )

        another_room = Room.objects.create(
            appointment=another_appointment,
            code="ROOM321",
            physiotherapist = self.physio,
            patient = self.patient,
            is_test_room=False,
            created_at=datetime.now(pytz.utc),
        )

        data = {
            "room_code": "ROOM321",
            "responses": {
                "q1": {"question": "¿Dónde sientes molestias?", "response": "Tobillo"},
                "q2": {"question": "¿Desde cuándo?", "response": "4 días"},
                "q3": {"question": "Nivel de dolor (1-10)", "response": 5}
            },
            "notes": ""
        }

        response = self.client.post(f"/api/questionnaires/{self.questionnaire2.id}/responses/create/", data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "No se puede responder un cuestionario para una cita no activa.")

class AddNotes2QuestionnaireResponseTest(APITestCase):
    def setUp(self):
        self.tz = pytz.timezone("Europe/Madrid")
        now = datetime.now(self.tz)
        self.future_date = now + timedelta(days=7)
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now_spain = datetime.now(self.spain_tz)
        self.future_date = now_spain + timedelta(weeks=1)
        self.future_date = self.future_date.astimezone(self.spain_tz)
        future_date_str = self.future_date.strftime("%Y-%m-%d")

        self.start_time = f"{future_date_str}T10:00:00{self.future_date.strftime('%z')}"
        self.end_time = f"{future_date_str}T11:00:00{self.future_date.strftime('%z')}"

        # Usuario y fisioterapeuta
        self.physio_user = AppUser.objects.create_user(
            username="fisio_test",
            email="fisio@test.com",
            password="Usuar1o_1",
            dni="11111111A",
            phone_number="600000000",
            postal_code="41000",
            account_status="ACTIVE",
            first_name="Fisio",
            last_name="Test"
        )
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            birth_date="1985-01-01",
            collegiate_number="FISIO123",
            autonomic_community="ANDALUCIA",
            gender="M",
            schedule={},
            services={
                "1": {
                    "id": 1,
                    "title": "Sesión estándar",
                    "tipo": "SESION",
                    "price": 40,
                    "description": "Sesión de fisioterapia de 1 hora",
                    "duration": 60,
                    "custom_questionnaire": None
                }
            }
        )

        # Usuario y paciente
        self.patient_user = AppUser.objects.create_user(
            username="paciente_test",
            email="paciente@test.com",
            password="Usuar1o_1",
            dni="22222222B",
            phone_number="600000001",
            postal_code="41001",
            account_status="ACTIVE",
            first_name="Paciente",
            last_name="Test"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender="F",
            birth_date="1990-01-01"
        )

        # Cita
        self.appointment = Appointment.objects.create(
            start_time=self.start_time,
            end_time=self.end_time,
            is_online=False,
            service=self.physio.services["1"],
            patient=self.patient,
            physiotherapist=self.physio,
            status='confirmed',
            alternatives='',
        )

        self.room = Room.objects.create(
            appointment=self.appointment,
            code="ROOM123",
            physiotherapist = self.physio,
            patient = self.patient,
            is_test_room=False,
            created_at=datetime.now(pytz.utc),
        )

        self.questionnaire = Questionnaire.objects.create(
            title="Cuestionario test",
            physiotherapist=self.physio,
            json_schema={"type": "object", "properties": {"q1": {"type": "string"}}},
            ui_schema={"type": "Control", "label": "¿Cómo estás?", "scope": "#/properties/q1"},
            questions=[{"type": "string", "label": "¿Cómo estás?", "options": []}]
        )

        self.response = QuestionnaireResponses.objects.create(
            questionnaire=self.questionnaire,
            appointment=self.appointment,
            responses={"q1": {"question": "¿Cómo estás?", "response": "Bien"}},
            notes=""
        )

        self.url = f"/api/questionnaires/{self.questionnaire.id}/responses/add-notes/"
        self.valid_payload = {
            "room_code": self.room.code,
            "notes": "Paciente con buena actitud"
        }

    def test_physio_can_add_notes_successfully(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'fisio_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.put(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['notes'], self.valid_payload['notes'])

    def test_cannot_add_notes_if_not_authenticated(self):
        response = self.client.put(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_other_physio_cannot_add_notes(self):
        # Usuario y fisioterapeuta
        other_physio_user = AppUser.objects.create_user(
            username="other_fisio_test",
            email="fisio@test.com",
            password="Usuar1o_1",
            dni="11111111A",
            phone_number="600000000",
            postal_code="41000",
            account_status="ACTIVE",
            first_name="Fisio",
            last_name="Test"
        )
        other_physio = Physiotherapist.objects.create(
            user=other_physio_user,
            birth_date="1985-01-01",
            collegiate_number="FISIO123",
            autonomic_community="ANDALUCIA",
            gender="M",
            schedule={},
            services={
                "1": {
                    "id": 1,
                    "title": "Sesión estándar",
                    "tipo": "SESION",
                    "price": 40,
                    "description": "Sesión de fisioterapia de 1 hora",
                    "duration": 60,
                    "custom_questionnaire": None
                }
            }
        )
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'other_fisio_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.put(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_note_too_long_returns_400(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'fisio_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        long_note = "a" * 256
        response = self.client.put(self.url, {**self.valid_payload, "notes": long_note}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Las notas no pueden exceder los 255 caracteres")

    def test_questionnaire_response_not_found(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'fisio_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Cita
        self.appointment = Appointment.objects.create(
            start_time=self.start_time,
            end_time=self.end_time,
            is_online=False,
            service=self.physio.services["1"],
            patient=self.patient,
            physiotherapist=self.physio,
            status='confirmed',
            alternatives='',
        )

        self.room = Room.objects.create(
            appointment=self.appointment,
            code="ROOM321",
            physiotherapist = self.physio,
            patient = self.patient,
            is_test_room=False,
            created_at=datetime.now(pytz.utc),
        )

        response = self.client.put(
            self.url,
            {
                "room_code": "ROOM321",
                "notes": "Notas de prueba"
            },
            format='json'
        )
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "No se ha encontrado la respuesta al cuestionario.")

    def test_add_notes_as_patient(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente_test',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.put(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)