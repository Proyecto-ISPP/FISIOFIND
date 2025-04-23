'''
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from unittest.mock import patch
from datetime import datetime, timedelta
import pytz
from users.models import AppUser, Patient, Physiotherapist, Pricing
from appointment.models import Appointment
from treatments.models import Treatment
from payment.models import Payment

class CreatePaymentTestCase(APITestCase):
    def setUp(self):
        self.factory = APIClient()
        self.client = APIClient()
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now_spain = datetime.now(self.spain_tz)
        self.future_date = now_spain + timedelta(weeks=1)
        self.exception_date = self.future_date + timedelta(days=1)
        self.future_date = self.future_date.astimezone(self.spain_tz)
        self.exception_date = self.exception_date.astimezone(self.spain_tz)

        future_date_str = self.future_date.strftime("%Y-%m-%d")
        exception_date_str = self.exception_date.strftime("%Y-%m-%d")
        weekday_key = self.future_date.strftime("%A").lower()
        exception_weekday = self.exception_date.strftime("%A").lower()

        self.start_time = f"{future_date_str}T10:00:00{self.future_date.strftime('%z')}"
        self.end_time = f"{future_date_str}T11:00:00{self.future_date.strftime('%z')}"

        self.physio_user = AppUser.objects.create_user(
            username="jorgito",
            email="jorgito@sample.com",
            password="Usuar1o_1",
            dni="77860168Q",
            phone_number="666666666",
            postal_code="41960",
            account_status="ACTIVE",
            first_name="Jorge",
            last_name="García Chaparro"
        )
        self.plan = Pricing.objects.create(name="blue", price=10, video_limit=5)
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            bio="Bio example",
            autonomic_community="EXTREMADURA",
            rating_avg=4.5,
            schedule={
                "exceptions": {exception_date_str: [{"end": "12:00", "start": "10:00"}]},
                "appointments": [{"status": "booked", "start_time": self.start_time, "end_time": self.end_time}],
                "weekly_schedule": {
                    weekday_key: [{"id": "slot1", "start": "16:00", "end": "18:00"}],
                    exception_weekday: [{"id": "slot2", "start": "10:00", "end": "14:00"}]
                }
            },
            birth_date="1980-01-01",
            collegiate_number="COL1",
            services={
                "1": {
                    "id": 1,
                    "title": "Primera consulta",
                    "tipo": "PRIMERA_CONSULTA",
                    "price": 50,
                    "description": "Descripción",
                    "duration": 60,
                    "custom_questionnaire": {
                        "UI Schema": {
                            "type": "Group",
                            "label": "Cuestionario",
                            "elements": [
                                {"type": "Number", "label": "Edad", "scope": "#/properties/edad"},
                                {"type": "Control", "label": "Motivo de la consulta", "scope": "#/properties/motivo_consulta"}
                            ]
                        }
                    }
                }
            },
            gender="M",
            plan=self.plan
        )
        self.valid_service = {
            "id": 1,
            "title": "Primera consulta",
            "tipo": "PRIMERA_CONSULTA",
            "price": 50,
            "description": "Descripción",
            "duration": 60,
            "questionaryResponses": {
                "edad": "30",
                "motivo_consulta": "Dolor en la espalda"
            }
        }
        self.patient_user = AppUser.objects.create_user(
            username="patient1",
            email="patient1@sample.com",
            password="Usuar1o_1",
            dni="76543211B",
            phone_number="666666666",
            postal_code="41960",
            account_status="ACTIVE",
            first_name="Juan",
            last_name="Rodríguez García"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender="F",
            birth_date="1990-01-01",
            stripe_customer_id="cus_test_123"
        )
        self.appointment = Appointment.objects.create(
            start_time=self.start_time,
            end_time=self.end_time,
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives='',
        )
        self.url = reverse("create_payment")
        self.client.force_authenticate(user=self.patient_user)
    """
    @patch("payment.views.stripe.PaymentIntent.create")
    def test_create_payment_success(self, mock_create_intent):
        mock_create_intent.return_value = {
            "id": "pi_test_123",
            "client_secret": "secret_123"
        }

        response = self.client.post(self.url, {
            "appointment_id": self.appointment.id,
            "amount": 1000
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("payment", response.data)
        self.assertIn("client_secret", response.data)
        self.assertEqual(Payment.objects.count(), 1)
    """
    def test_create_payment_deadline_expired_and_cancels_appointment(self):
        # Acorta artificialmente el start_time para simular deadline vencido
        self.appointment.start_time = timezone.now() + timedelta(hours=47)
        self.appointment.save()

        response = self.client.post(self.url, {"appointment_id": self.appointment.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("deadline has expired", response.data["error"])

        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, "Canceled")
"""
    def test_create_payment_invalid_amount(self):
        response = self.client.post(self.url, {
            "appointment_id": self.appointment.id,
            "amount": ""
        })
        self.assertIn(response.status_code, [400, 500])

    def test_create_payment_not_owner(self):
        intruso_user = AppUser.objects.create_user(username="hacker", password="Usuar1o_1")
        intruso_patient = Patient.objects.create(user=intruso_user, birth_date="1990-01-01")
        self.client.force_authenticate(user=intruso_user)

        response = self.client.post(self.url, {"appointment_id": self.appointment.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_payment_appointment_not_found(self):
        response = self.client.post(self.url, {"appointment_id": 9999})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_payment_unauthenticated(self):
        self.client.logout()
        response = self.client.post(self.url, {"appointment_id": self.appointment.id})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("payment.views.stripe.PaymentIntent.create")
    def test_create_payment_stripe_error(self, mock_create_intent):
        mock_create_intent.side_effect = Exception("Stripe error")
        response = self.client.post(self.url, {"appointment_id": self.appointment.id})
        if response.status_code == 500:
            self.fail("ERROR 500: excepción no manejada correctamente")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Error processing payment", response.data["error"])
"""
'''