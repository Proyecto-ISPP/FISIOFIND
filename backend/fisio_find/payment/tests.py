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
from payment.views import *

'''
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

        response = self.client.post(self.url, {"appointment_id": self.appointment.id, "amount": 10.10})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_payment_appointment_not_found(self):
        response = self.client.post(self.url, {"appointment_id": 9999, "amount": 100.10})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_payment_unauthenticated(self):
        self.client.logout()
        response = self.client.post(self.url, {"appointment_id": self.appointment.id})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("payment.views.stripe.PaymentIntent.create")
    def test_create_payment_stripe_error(self, mock_create_intent):
        mock_create_intent.side_effect = Exception("Stripe error")
        response = self.client.post(self.url, {"appointment_id": self.appointment.id, "amount":100.10})
        if response.status_code == 500:
            self.fail("ERROR 500: excepción no manejada correctamente")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Error procesando el pago", response.data["error"])
'''

class ConfirmPaymentTestCase(APITestCase):
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
        self.client.force_authenticate(user=self.patient_user)

        self.payment = Payment.objects.create(
            appointment=self.appointment,
            status='Pending',
            amount=1000,
            stripe_payment_intent_id='pi_test_123'
        )
        self.url = reverse('confirm_payment', args=[self.payment.id])

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_successful(self, mock_retrieve_intent):
        mock_retrieve_intent.return_value = {'status': 'succeeded'}

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Payment confirmed')
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, 'Paid')
        self.assertEqual(self.payment.appointment.status, 'Paid')

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_already_paid(self, mock_retrieve_intent):
        self.payment.status = 'Paid'
        self.payment.save()

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already confirmed', response.data['error'])

    def test_confirm_payment_not_owner(self):
        other_user = AppUser.objects.create_user(username='otheruser', password='Usuar1o_1')
        Patient.objects.create(user=other_user, birth_date="1985-05-05")
        self.client.force_authenticate(user=other_user)

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_requires_payment_method(self, mock_retrieve_intent):
        mock_retrieve_intent.return_value = {'status': 'requires_payment_method'}

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Payment method is required', response.data['error'])

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_canceled_on_stripe(self, mock_retrieve_intent):
        mock_retrieve_intent.return_value = {'status': 'canceled'}

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Payment was canceled', response.data['error'])

    def test_confirm_payment_not_found(self):
        url = reverse('confirm_payment', args=[9999])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_deadline_expired(self, mock_retrieve_intent):
        from payment.views import _check_deadline

        # Forzamos a que la función de deadline devuelva True
        with patch('payment.views._check_deadline', return_value=True):
            response = self.client.post(self.url)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('deadline has expired', response.data['error'])

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_unhandled_exception(self, mock_retrieve_intent):
        mock_retrieve_intent.side_effect = Exception("Some internal error")

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error confirming payment', response.data['error'])

    def test_confirm_payment_unauthenticated(self):
        self.client.logout()
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_integration_flow_success(self, mock_retrieve_intent):
        """
        Flujo completo: paciente autenticado -> cita pendiente -> estado Stripe exitoso -> actualización local.
        """
        mock_retrieve_intent.return_value = {'status': 'succeeded'}

        # Verificamos estados iniciales
        self.assertEqual(self.payment.status, 'Pending')
        self.assertEqual(self.appointment.status, 'booked')

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.payment.refresh_from_db()
        self.appointment.refresh_from_db()

        self.assertEqual(self.payment.status, 'Paid')
        self.assertEqual(self.appointment.status, 'Paid')
        self.assertIn('message', response.data)
        self.assertIn('payment', response.data)

    @patch('payment.views.stripe.PaymentIntent.retrieve')
    def test_confirm_payment_integration_flow_requires_method_then_error(self, mock_retrieve_intent):
        """
        Flujo fallido: Stripe responde que falta método de pago.
        """
        mock_retrieve_intent.return_value = {'status': 'requires_payment_method'}

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Payment method is required')

class CancelPaymentFunctionTestCase(APITestCase):
    def setUp(self):
        # Copia exacta de tu setup, con ajustes mínimos
        self.factory = APIClient()
        self.client = APIClient()
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now_spain = datetime.now(self.spain_tz)
        self.future_date = now_spain + timedelta(weeks=1)
        self.exception_date = self.future_date + timedelta(days=1)

        future_date_str = self.future_date.strftime("%Y-%m-%d")
        exception_date_str = self.exception_date.strftime("%Y-%m-%d")
        weekday_key = self.future_date.strftime("%A").lower()
        exception_weekday = self.exception_date.strftime("%A").lower()

        # ✅ Aquí los usas como string en el modelo, pero vamos a convertirlos a datetime luego
        self.start_time_str = f"{future_date_str}T10:00:00{self.future_date.strftime('%z')}"
        self.end_time_str = f"{future_date_str}T11:00:00{self.future_date.strftime('%z')}"
        self.start_time_dt = datetime.strptime(self.start_time_str, "%Y-%m-%dT%H:%M:%S%z")
        self.end_time_dt = datetime.strptime(self.end_time_str, "%Y-%m-%dT%H:%M:%S%z")

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
                "appointments": [{"status": "booked", "start_time": self.start_time_str, "end_time": self.end_time_str}],
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
            start_time=self.start_time_dt,  # 👈 Aquí como datetime
            end_time=self.end_time_dt,
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives=''
        )

        self.payment = Payment.objects.create(
            appointment=self.appointment,
            status='Not Paid',
            amount=1000,
            stripe_payment_intent_id='pi_test_123'
        )

    @patch("payment.views.stripe.PaymentIntent.cancel")
    def test_cancel_payment_before_deadline(self, mock_cancel):
        response = cancel_payment_patient(self.payment.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Appointment canceled without charge", response.data["message"])
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, 'Canceled')

    def test_cancel_payment_after_deadline(self):
        self.payment.status = 'Not Captured'
        self.payment.save()

        # Forzar fecha a menos de 48h
        self.appointment.start_time = timezone.now() + timedelta(hours=1)
        self.appointment.save()

        response = cancel_payment_patient(self.payment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cannot be refunded", response.data["error"])

    def test_cancel_payment_already_refunded(self):
        self.payment.status = 'Refunded'
        self.payment.save()
        response = cancel_payment_patient(self.payment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already been canceled", response.data["error"])

    def test_cancel_payment_not_found(self):
        response = cancel_payment_patient(9999)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Payment not found", response.data["error"])

    @patch("payment.views.stripe.PaymentIntent.cancel", side_effect=Exception("Stripe fail"))
    def test_cancel_payment_stripe_fails(self, mock_cancel):
        response = cancel_payment_patient(self.payment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("internal error", response.data["error"])

class CancelPaymentByPhysioTests(APITestCase):
    def setUp(self):
        # Tu setup exacto
        self.factory = APIClient()
        self.client = APIClient()
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now_spain = datetime.now(self.spain_tz)
        self.future_date = now_spain + timedelta(weeks=1)
        self.exception_date = self.future_date + timedelta(days=1)

        future_date_str = self.future_date.strftime("%Y-%m-%d")
        exception_date_str = self.exception_date.strftime("%Y-%m-%d")
        weekday_key = self.future_date.strftime("%A").lower()
        exception_weekday = self.exception_date.strftime("%A").lower()

        self.start_time_str = f"{future_date_str}T10:00:00{self.future_date.strftime('%z')}"
        self.end_time_str = f"{future_date_str}T11:00:00{self.future_date.strftime('%z')}"
        self.start_time_dt = datetime.strptime(self.start_time_str, "%Y-%m-%dT%H:%M:%S%z")
        self.end_time_dt = datetime.strptime(self.end_time_str, "%Y-%m-%dT%H:%M:%S%z")

        self.physio_user = AppUser.objects.create_user(username="jorgito", email="jorgito@sample.com", password="Usuar1o_1", dni="77860168Q", phone_number="666666666", postal_code="41960", account_status="ACTIVE", first_name="Jorge", last_name="García Chaparro")
        self.plan = Pricing.objects.create(name="blue", price=10, video_limit=5)
        self.physio = Physiotherapist.objects.create(user=self.physio_user, bio="Bio example", autonomic_community="EXTREMADURA", rating_avg=4.5, schedule={"exceptions": {exception_date_str: [{"end": "12:00", "start": "10:00"}]}, "appointments": [{"status": "booked", "start_time": self.start_time_str, "end_time": self.end_time_str}], "weekly_schedule": {weekday_key: [{"id": "slot1", "start": "16:00", "end": "18:00"}], exception_weekday: [{"id": "slot2", "start": "10:00", "end": "14:00"}]}}, birth_date="1980-01-01", collegiate_number="COL1", services={"1": {"id": 1, "title": "Primera consulta", "tipo": "PRIMERA_CONSULTA", "price": 50, "description": "Descripción", "duration": 60, "custom_questionnaire": {"UI Schema": {"type": "Group", "label": "Cuestionario", "elements": [{"type": "Number", "label": "Edad", "scope": "#/properties/edad"}, {"type": "Control", "label": "Motivo de la consulta", "scope": "#/properties/motivo_consulta"}]}}}}, gender="M", plan=self.plan)
        self.patient_user = AppUser.objects.create_user(username="patient1", email="patient1@sample.com", password="Usuar1o_1", dni="76543211B", phone_number="666666666", postal_code="41960", account_status="ACTIVE", first_name="Juan", last_name="Rodríguez García")
        self.patient = Patient.objects.create(user=self.patient_user, gender="F", birth_date="1990-01-01", stripe_customer_id="cus_test_123")

        self.appointment = Appointment.objects.create(
            start_time=self.start_time_dt,
            end_time=self.end_time_dt,
            is_online=True,
            service={"id": 1, "title": "Primera consulta"},
            patient=self.patient,
            physiotherapist=self.physio,
            status='booked',
            alternatives=''
        )

        self.payment = Payment.objects.create(
            appointment=self.appointment,
            status='Not Paid',
            amount=1000,
            stripe_payment_intent_id='pi_test_123'
        )

    @patch("payment.views.stripe.PaymentIntent.retrieve")
    @patch("payment.views.stripe.PaymentIntent.cancel")
    def test_cancel_not_paid_and_cancellable(self, mock_cancel, mock_retrieve):
        mock_retrieve.return_value = {'status': 'requires_payment_method'}
        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("canceled without charge", response.data["message"])

    @patch("payment.views.stripe.PaymentIntent.retrieve")
    def test_cancel_not_paid_and_not_cancellable(self, mock_retrieve):
        mock_retrieve.return_value = {'status': 'succeeded'}
        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cannot be canceled", response.data["error"])

    @patch("payment.views.stripe.PaymentIntent.retrieve")
    @patch("payment.views.stripe.Refund.create")
    def test_cancel_paid_and_refundable(self, mock_refund, mock_retrieve):
        self.payment.status = 'Paid'
        self.payment.save()
        mock_retrieve.return_value = {'status': 'succeeded'}
        mock_refund.return_value = {'status': 'succeeded'}

        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Payment refunded", response.data["message"])

    @patch("payment.views.stripe.PaymentIntent.retrieve")
    def test_cancel_paid_but_not_completed(self, mock_retrieve):
        self.payment.status = 'Paid'
        self.payment.save()
        mock_retrieve.return_value = {'status': 'requires_action'}

        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("was not completed", response.data["error"])
    
    @patch("payment.views.stripe.PaymentIntent.cancel")
    def test_cancel_not_captured(self, mock_cancel):
        self.payment.status = 'Not Captured'
        self.payment.save()
        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("canceled without charge", response.data["message"])

    def test_cancel_already_refunded(self):
        self.payment.status = 'Refunded'
        self.payment.save()
        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already been canceled", response.data["error"])

    def test_cancel_after_appointment_time(self):
        self.appointment.start_time = timezone.now() - timedelta(hours=1)
        self.appointment.save()

        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already passed", response.data["error"])

    def test_cancel_appointment_not_found(self):
        response = cancel_payment_pyshio(9999)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Payment not found", response.data["error"])

    @patch("payment.views.stripe.PaymentIntent.retrieve", side_effect=Exception("Stripe crash"))
    def test_cancel_stripe_error(self, mock_retrieve):
        response = cancel_payment_pyshio(self.appointment.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("An internal error has occurred. Please", response.data["error"])

class GetPaymentDetailsTests(APITestCase):
    def setUp(self):
        # Usamos exactamente tu setup original
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
        self.start_time_dt = datetime.strptime(self.start_time, "%Y-%m-%dT%H:%M:%S%z")
        self.end_time_dt = datetime.strptime(self.end_time, "%Y-%m-%dT%H:%M:%S%z")

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
            start_time=self.start_time_dt,
            end_time=self.end_time_dt,
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives='',
        )
        self.payment = Payment.objects.create(
            appointment=self.appointment,
            status='Paid',
            amount=1000,
            stripe_payment_intent_id='pi_test_123'
        )
        self.url = reverse('get_payment_details', args=[self.payment.id])
        self.client.force_authenticate(user=self.patient_user)

    def test_get_payment_details_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, PaymentSerializer(self.payment).data)

    def test_get_payment_details_wrong_user(self):
        intruso = AppUser.objects.create_user(username="hacker", password="Usuar1o_1")
        Patient.objects.create(user=intruso, birth_date="1995-05-05")
        self.client.force_authenticate(user=intruso)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("only view your own", response.data["error"])

    def test_get_payment_details_not_found(self):
        url = reverse('get_payment_details', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("not found", response.data["error"])

    def test_get_payment_details_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class GetRefundStatusTests(APITestCase):
    def setUp(self):
        # Tu setup exacto
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
        self.start_time_dt = datetime.strptime(self.start_time, "%Y-%m-%dT%H:%M:%S%z")
        self.end_time_dt = datetime.strptime(self.end_time, "%Y-%m-%dT%H:%M:%S%z")

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
            start_time=self.start_time_dt,
            end_time=self.end_time_dt,
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives='',
        )
        self.payment = Payment.objects.create(
            appointment=self.appointment,
            status='Refunded',
            amount=1000,
            stripe_payment_intent_id='pi_test_123'
        )
        self.url = reverse('get_refund_status', args=[self.payment.id])
        self.client.force_authenticate(user=self.patient_user)

    @patch("payment.views.stripe.PaymentIntent.retrieve")
    @patch("payment.views.stripe.Refund.list")
    def test_refund_status_success(self, mock_refund_list, mock_retrieve_intent):
        mock_retrieve_intent.return_value = {'id': 'pi_test_123'}
        mock_refund_list.return_value = stripe.util.convert_to_stripe_object({
            'data': [{
                'status': 'succeeded',
                'amount': 1000,
                'created': 1700000000
            }]
        })

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refund_status', response.data)
        self.assertEqual(response.data['refund_status'], 'succeeded')
        self.assertEqual(response.data['refund_amount'], 10.0)

    def test_refund_status_not_owner(self):
        other_user = AppUser.objects.create_user(username="otro", password="Usuar1o_1")
        Patient.objects.create(user=other_user,             gender="F",
            birth_date="1990-01-01")
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_refund_status_not_found(self):
        url = reverse('get_refund_status', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_refund_status_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("payment.views.stripe.PaymentIntent.retrieve", side_effect=stripe.error.StripeError("Stripe boom"))
    def test_refund_status_stripe_error(self, mock_stripe):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("processing your payment", response.data["error"])

    @patch("payment.views.stripe.PaymentIntent.retrieve")
    @patch("payment.views.stripe.Refund.list", return_value=stripe.util.convert_to_stripe_object({'data': []}))
    def test_refund_status_refunded_but_no_stripe_data(self, mock_list, mock_retrieve):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("not found in Stripe", response.data["error"])

    def test_refund_status_no_refund_yet(self):
        self.payment.status = 'Paid'
        self.payment.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'No refund has been issued for this payment')


from django.test import TestCase
from io import BytesIO
from payment.utils.pdf_generator import generate_invoice_pdf, PaymentPhysioInvoicePDF  # ajusta el import si es necesario
from PyPDF2 import PdfReader
from datetime import datetime, timedelta
from decimal import Decimal
import pytz

class PDFGenerationTests(TestCase):
    def setUp(self):
        # Setup básico manual sin usar la base real
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now = datetime.now(self.spain_tz)
        self.start_time = now + timedelta(days=7)

        self.physio_user = AppUser.objects.create_user(
            username="fisiotest", password="Usuar1o_1", dni="12345678Z", phone_number="600000000", first_name="Laura", last_name="García"
        )
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            bio="Fisio especializada",
            autonomic_community="ANDALUCIA",
            gender="F",
            birth_date="1980-01-01",
            plan=Pricing.objects.create(name="blue", price=10, video_limit=5)
        )

        self.patient_user = AppUser.objects.create_user(
            username="pacientetest", password="Usuar1o_1", dni="87654321B", phone_number="611111111", first_name="Carlos", last_name="Ruiz"
        )
        self.patient = Patient.objects.create(user=self.patient_user, birth_date="1990-01-01")

        self.appointment = Appointment.objects.create(
            start_time=self.start_time,
            end_time=self.start_time + timedelta(hours=1),
            patient=self.patient,
            physiotherapist=self.physio,
            is_online=True,
            status="booked",
            service={"id": 1, "title": "Sesión de prueba"},
            alternatives=""
        )

        self.payment = Payment.objects.create(
            appointment=self.appointment,
            amount=Decimal("100.00"),
            status="Paid",
            payment_date=now,
            stripe_payment_intent_id="pi_test_123"
        )

    def test_generate_invoice_pdf_valid(self):
        pdf_bytes = generate_invoice_pdf(self.payment)
        self.assertIsInstance(pdf_bytes, bytes)
        self.assertGreater(len(pdf_bytes), 500)  # algo razonable como mínimo

        # Validar que es PDF (comienza por %PDF-)
        self.assertTrue(pdf_bytes.startswith(b"%PDF"))

        # Validar lectura con PyPDF2
        reader = PdfReader(BytesIO(pdf_bytes))
        self.assertGreaterEqual(len(reader.pages), 1)

    def test_generate_physio_invoice_pdf(self):
        invoice = PaymentPhysioInvoicePDF(
            physiotherapist=f"{self.physio.user.first_name} {self.physio.user.last_name}",
            iban="ES7620770024003102575766",
            paid_payments=[self.payment],
            invoice_number="2025-0001"
        )
        buffer = invoice.generate_pdf()
        pdf_bytes = buffer.read()

        self.assertIsInstance(pdf_bytes, bytes)
        self.assertTrue(pdf_bytes.startswith(b"%PDF"))
        reader = PdfReader(BytesIO(pdf_bytes))
        self.assertGreaterEqual(len(reader.pages), 1)

class InvoicePDFViewTests(APITestCase):
    def setUp(self):
        # Setup similar al que usas, simplificado para test
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now = datetime.now(self.spain_tz)
        self.start_time = now + timedelta(days=7)

        self.physio_user = AppUser.objects.create_user(username="fisiotest", password="Usuar1o_1", dni="12345678Z", phone_number="600000000", first_name="Laura", last_name="García")
        self.physio = Physiotherapist.objects.create(user=self.physio_user, birth_date="1980-01-01", plan=Pricing.objects.create(name="blue", price=10, video_limit=5))

        self.patient_user = AppUser.objects.create_user(username="pacientetest", password="Usuar1o_1", dni="87654321B")
        self.patient = Patient.objects.create(user=self.patient_user, birth_date="1990-01-01")
        self.appointment = Appointment.objects.create(
            start_time=self.start_time,
            end_time=self.start_time + timedelta(hours=1),
            patient=self.patient,
            physiotherapist=self.physio,
            is_online=True,
            status="booked",
            service={"id": 1, "title": "Sesión de prueba"},
            alternatives=""
        )
        self.payment = Payment.objects.create(
            appointment=self.appointment,
            amount=Decimal("100.00"),
            status="Paid",
            payment_date=now,
            stripe_payment_intent_id="pi_test_123"
        )

        self.url = reverse('invoice_pdf')
        self.client.force_authenticate(user=self.patient_user)

    def test_invoice_pdf_by_payment_id(self):
        response = self.client.get(f"{self.url}?payment_id={self.payment.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn(f'invoice_{self.payment.id}.pdf', response['Content-Disposition'])

        # Validar contenido PDF
        reader = PdfReader(BytesIO(response.content))
        self.assertGreaterEqual(len(reader.pages), 1)

    def test_invoice_pdf_by_appointment_id(self):
        response = self.client.get(f"{self.url}?appointment_id={self.appointment.id}")
        self.assertEqual(response.status_code, 200)
        reader = PdfReader(BytesIO(response.content))
        self.assertGreaterEqual(len(reader.pages), 1)

    def test_invoice_pdf_no_params(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Se requiere el ID del pago", response.data['error'])

    def test_invoice_pdf_not_owner(self):
        intruder_user = AppUser.objects.create_user(username="otro", password="Usuar1o_1")
        Patient.objects.create(user=intruder_user, birth_date="1990-01-01")
        self.client.force_authenticate(user=intruder_user)
        response = self.client.get(f"{self.url}?payment_id={self.payment.id}")
        self.assertEqual(response.status_code, 403)
        self.assertIn("permiso", response.data['error'])

    def test_invoice_pdf_not_found(self):
        response = self.client.get(f"{self.url}?payment_id=9999")
        self.assertEqual(response.status_code, 404)
        self.assertIn("Pago no encontrado", response.data['error'])

    def test_invoice_pdf_unauthenticated(self):
        self.client.logout()
        response = self.client.get(f"{self.url}?payment_id={self.payment.id}")
        self.assertEqual(response.status_code, 401)

class GetPhysioInvoicesTests(APITestCase):
    def setUp(self):
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now = timezone.now()

        self.physio_user = AppUser.objects.create_user(
            username="physiotest", password="Usuar1o_1", dni="12345678X"
        )
        self.plan = Pricing.objects.create(name="blue", price=10, video_limit=5)
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user, birth_date="1980-01-01", plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(username="patient", password="Usuar1o_1", dni="98765432Y")
        self.patient = Patient.objects.create(user=self.patient_user, birth_date="1990-01-01")

        # Citas en diferentes estados
        self.appointment1 = Appointment.objects.create(
            start_time=now - timedelta(days=30),
            end_time=now - timedelta(days=30, hours=-1),
            patient=self.patient,
            physiotherapist=self.physio,
            is_online=True,
            service={"id": 1, "title": "Consulta"},
            status='booked'
        )

        self.appointment2 = Appointment.objects.create(
            start_time=now - timedelta(days=5),
            end_time=now - timedelta(days=5, hours=-1),
            patient=self.patient,
            physiotherapist=self.physio,
            is_online=True,
            service={"id": 1, "title": "Consulta"},
            status='booked'
        )

        self.appointment3 = Appointment.objects.create(
            start_time=now - timedelta(days=1),
            end_time=now - timedelta(days=1, hours=-1),
            patient=self.patient,
            physiotherapist=self.physio,
            is_online=True,
            service={"id": 1, "title": "Consulta"},
            status='booked'
        )

        Payment.objects.create(appointment=self.appointment1, amount=Decimal('50.00'), status='Not Paid')
        Payment.objects.create(appointment=self.appointment2, amount=Decimal('75.00'), status='Paid')
        Payment.objects.create(appointment=self.appointment3, amount=Decimal('100.00'), status='Redeemed', payment_date=now)

        self.url = reverse("get_physio_invoices")

    def test_get_physio_invoices_success(self):
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertIn("not_paid_payments", data)
        self.assertIn("paid_payments", data)
        self.assertIn("redeemed_payments", data)
        self.assertIn("monthly_stats", data)
        self.assertIn("overall_stats", data)

        # Verifica que se agrupan correctamente
        self.assertEqual(len(data["not_paid_payments"]), 1)
        self.assertEqual(len(data["paid_payments"]), 1)
        self.assertEqual(len(data["redeemed_payments"]), 1)

    def test_get_physio_invoices_not_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_get_physio_invoices_not_physio(self):
        non_physio_user = AppUser.objects.create_user(username="notaphysio", password="Usuar1o_1")
        self.client.force_authenticate(user=non_physio_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 403)
        self.assertIn("Usted no tiene permiso", response.data['detail'])

    def test_get_physio_invoices_monthly_stats_format(self):
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.get(self.url)
        months = [stat["month"] for stat in response.data["monthly_stats"]]
        self.assertEqual(len(months), 12)
        self.assertRegex(months[0], r"^\d{4}-\d{2}$")  # Formato 'YYYY-MM'

class CollectPaymentsTests(APITestCase):
    def setUp(self):
        self.spain_tz = pytz.timezone("Europe/Madrid")
        self.now = timezone.now()

        self.physio_user = AppUser.objects.create_user(username="fisiotest", password="Usuar1o_1", dni="12345678X")
        self.plan = Pricing.objects.create(name="blue", price=10, video_limit=5)
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user, birth_date="1980-01-01", plan=self.plan
        )

        self.patient_user = AppUser.objects.create_user(username="pacientetest", password="Usuar1o_1", dni="98765432Y")
        self.patient = Patient.objects.create(user=self.patient_user, birth_date="1990-01-01")

        self.appointment1 = Appointment.objects.create(
            start_time=self.now - timedelta(days=5),
            end_time=self.now - timedelta(days=5, hours=-1),
            patient=self.patient,
            physiotherapist=self.physio,
            is_online=True,
            status='booked',
            service={"id": 1, "title": "Consulta"},
            alternatives=""
        )

        self.payment = Payment.objects.create(
            appointment=self.appointment1,
            amount=Decimal('80.00'),
            status='Paid',
            payment_date=self.now
        )

        self.url = reverse("collect_payments")
        self.client.force_authenticate(user=self.physio_user)

    def test_collect_payments_success(self):
        response = self.client.post(self.url, {"iban": "ES7620770024003102575766"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("application/pdf", response['Content-Type'])
        self.assertTrue(response.get('X-Message').startswith("1 pagos reclamados"))
        
        # Validar que el contenido es un PDF
        pdf_bytes = b"".join(response.streaming_content)
        reader = PdfReader(BytesIO(pdf_bytes))
        self.assertGreaterEqual(len(reader.pages), 1)

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, 'Redeemed')

    def test_collect_payments_already_redeemed(self):
        self.payment.status = 'Redeemed'
        self.payment.save()
        response = self.client.post(self.url, {"iban": "ES7620770024003102575766"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("ya existen pagos redimidos", response.data["error"])

    def test_collect_payments_no_paid(self):
        self.payment.status = 'Not Paid'
        self.payment.save()
        response = self.client.post(self.url, {"iban": "ES7620770024003102575766"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("No hay pagos pendientes", response.data["message"])

    def test_collect_payments_missing_iban(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Se requiere un IBAN", response.data["error"])

    def test_collect_payments_not_physio(self):
        user = AppUser.objects.create_user(username="no_fisio", password="Usuar1o_1")
        self.client.force_authenticate(user=user)
        response = self.client.post(self.url, {"iban": "ES123"})
        self.assertEqual(response.status_code, 403)
        self.assertIn("permiso", response.data["detail"].lower())

    def test_collect_payments_unauthenticated(self):
        self.client.logout()
        response = self.client.post(self.url, {"iban": "ES123"})
        self.assertEqual(response.status_code, 401)

class CreatePaymentSetupFunctionTests(APITestCase):
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
            stripe_customer_id=None
        )
        self.appointment = Appointment.objects.create(
            start_time=datetime.strptime(self.start_time, "%Y-%m-%dT%H:%M:%S%z"),
            end_time=datetime.strptime(self.end_time, "%Y-%m-%dT%H:%M:%S%z"),
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives='',
        )

    def test_create_payment_setup_appointment_not_found(self):
        result = create_payment_setup(9999, 3000, self.patient_user)
        self.assertEqual(result.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Cita no encontrada", result.data["error"])

    @patch("payment.views.stripe.SetupIntent.create", side_effect=Exception("Simulated Stripe error"))
    def test_create_payment_setup_stripe_crash_and_delete_appointment(self, mock_setup):
        appointment_id = self.appointment.id
        result = create_payment_setup(appointment_id, 5000, self.patient_user)

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", result.data)
        self.assertFalse(Appointment.objects.filter(id=appointment_id).exists())