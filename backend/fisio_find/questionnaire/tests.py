from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import AppUser, Physiotherapist, Pricing, Patient
from questionnaire.models import Questionnaire

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
        long_label = '¿' + 'a' * 256 + '?'
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
        long_title = 'T' * 256
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
