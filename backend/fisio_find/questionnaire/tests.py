from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import AppUser, Physiotherapist, Pricing
from questionnaire.models import Questionnaire

class QuestionnaireViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.plan_blue, _ = Pricing.objects.get_or_create(name='blue', defaults={'price': 10, 'video_limit': 5})
        cls.plan_gold, _ = Pricing.objects.get_or_create(name='Gold', defaults={'price': 99, 'video_limit': 20})

        cls.user = AppUser.objects.create_user(
            username="example", dni='12345678A',
            email='ana@example.com', password='pass',
            first_name='Ana', last_name='López', postal_code='28001', photo=''
        )
        cls.physio = Physiotherapist.objects.create(
            user=cls.user,
            plan=cls.plan_blue,
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
        cls.client.force_authenticate(user=cls.user)

        cls.questionnaire = Questionnaire.objects.create(
            physiotherapist=cls.physio,
            title="Test Q",
            json_schema={},
            ui_schema={},
            questions=["¿Cómo te sientes hoy?"]
        )

    def test_list_questionnaires(self):
        url = reverse('questionnaire_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_questionnaire(self):
        url = reverse('create_questionnaire')
        data = {
            'title': 'Nuevo Q',
            'json_schema': {},
            'ui_schema': {},
            'questions': ['¿Tienes dolor?']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Questionnaire.objects.count(), 2)

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
        data = {'questions': ['¿' + 'm' * 255 + '?']}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_questionnaire(self):
        url = reverse('questionnaire_detail', args=[self.questionnaire.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Questionnaire.objects.filter(id=self.questionnaire.id).exists())

    def test_create_question(self):
        url = reverse('create_question', args=[self.questionnaire.id])
        data = '¿Tienes fiebre?'
        response = self.client.post(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.questionnaire.refresh_from_db()
        self.assertIn('¿Tienes fiebre?', self.questionnaire.questions)

    def test_create_question_too_long(self):
        url = reverse('create_question', args=[self.questionnaire.id])
        long_question = '¿' + 'a' * 256 + '?'
        response = self.client.post(url, data=long_question, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_access(self):
        self.client.force_authenticate(user=None)
        url = reverse('questionnaire_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
