from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from django.shortcuts import render
from appointment.models import Appointment, StatusChoices
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from users.models import AppUser, Patient, Physiotherapist, Specialization, PhysiotherapistSpecialization
from videocall.models import Room
from django.utils import timezone
from datetime import timedelta
import json


from rest_framework.test import APITestCase
from django.urls import reverse
from django.utils.timezone import now, timedelta
from datetime import datetime, timedelta
import pytz


from django.test import TestCase
from users.util import validate_service_with_questionary


class ValidateServiceWithQuestionaryTests(TestCase):

    def setUp(self):
        self.service_template = {
            "id": 1,
            "title": "Primera consulta",
            "tipo": "PRIMERA_CONSULTA",
            "price": 50,
            "description": "Evaluación inicial",
            "duration": 60,
            "custom_questionnaire": {
                "UI Schema": {
                    "type": "Group",
                    "label": "Cuestionario",
                    "elements": [
                        {"type": "Number", "label": "Edad", "scope": "#/properties/edad"},
                        {"type": "Control", "label": "Motivo", "scope": "#/properties/motivo"}
                    ]
                }
            }
        }

        self.valid_service_input = {
            "id": 1,
            "title": "Primera consulta",
            "tipo": "PRIMERA_CONSULTA",
            "price": 50,
            "description": "Evaluación inicial",
            "duration": 60,
            "questionaryResponses": {
                "edad": "30",
                "motivo": "Dolor de espalda"
            }
        }

        self.physio_services = {
            "1": self.service_template
        }

    def test_valid_service_passes(self):
        result = validate_service_with_questionary(self.valid_service_input.copy(), self.physio_services)
        self.assertEqual(result["id"], 1)

    def test_service_with_questionnaire_none_allows_empty_responses(self):
        physio_service = self.service_template.copy()
        physio_service["custom_questionnaire"] = None
        self.physio_services["1"] = physio_service

        modified_service = self.valid_service_input.copy()
        modified_service["custom_questionnaire"] = None
        modified_service["questionaryResponses"] = {}

        result = validate_service_with_questionary(modified_service, self.physio_services)
        self.assertEqual(result["questionaryResponses"], {})

    def test_service_with_questionnaire_none_ignores_extra_responses(self):
        physio_service = self.service_template.copy()
        physio_service["custom_questionnaire"] = None
        self.physio_services["1"] = physio_service

        modified_service = self.valid_service_input.copy()
        modified_service["custom_questionnaire"] = None
        modified_service["questionaryResponses"] = {"cualquiera": "valor"}

        result = validate_service_with_questionary(modified_service, self.physio_services)
        self.assertEqual(result["questionaryResponses"], {})

    def test_service_id_not_found(self):
        with self.assertRaises(ValueError):
            validate_service_with_questionary(self.valid_service_input, {})  # no servicios

    def test_service_field_mismatch(self):
        modified = self.valid_service_input.copy()
        modified["price"] = 999
        with self.assertRaises(ValueError):
            validate_service_with_questionary(modified, self.physio_services)

    def test_missing_response_key(self):
        modified = self.valid_service_input.copy()
        del modified["questionaryResponses"]["motivo"]
        with self.assertRaises(ValueError) as cm:
            validate_service_with_questionary(modified, self.physio_services)
        self.assertIn("Falta la respuesta", str(cm.exception))

    def test_empty_string_response(self):
        modified = self.valid_service_input.copy()
        modified["questionaryResponses"]["motivo"] = ""
        with self.assertRaises(ValueError):
            validate_service_with_questionary(modified, self.physio_services)

    def test_response_wrong_type_control(self):
        modified = self.valid_service_input.copy()
        modified["questionaryResponses"]["motivo"] = 123  # debe ser str
        with self.assertRaises(ValueError):
            validate_service_with_questionary(modified, self.physio_services)

    def test_response_too_long_string(self):
        modified = self.valid_service_input.copy()
        modified["questionaryResponses"]["motivo"] = "x" * 151
        with self.assertRaises(ValueError):
            validate_service_with_questionary(modified, self.physio_services)

    def test_response_not_integer_number(self):
        modified = self.valid_service_input.copy()
        modified["questionaryResponses"]["edad"] = "treinta"
        with self.assertRaises(ValueError):
            validate_service_with_questionary(modified, self.physio_services)

    def test_response_contains_extra_keys(self):
        modified = self.valid_service_input.copy()
        modified["questionaryResponses"]["extra"] = "valor"
        with self.assertRaises(ValueError):
            validate_service_with_questionary(modified, self.physio_services)

    def test_scope_without_prefix(self):
        physio_services = {
            "1": {
                **self.service_template,
                "custom_questionnaire": {
                    "UI Schema": {
                        "type": "Group",
                        "label": "Form",
                        "elements": [
                            {"type": "Control", "label": "Test", "scope": "edad"}  # inválido
                        ]
                    }
                }
            }
        }
        with self.assertRaises(ValueError):
            validate_service_with_questionary(self.valid_service_input, physio_services)


class CreateAppointmentIntegrationTests(APITestCase):

    def setUp(self):
        self.user = AppUser.objects.create_user(
            username="paciente",
            email="paciente@example.com",
            password="testpass",
            dni="80736062J"
        )
        self.patient = Patient.objects.create(
            user=self.user,
            birth_date="1995-01-01",   # Añadido
            gender="F"                 # Añadido (ajusta según tu modelo)
        )
        self.client.force_authenticate(user=self.user)

        self.physio_user = AppUser.objects.create_user(
            username="fisio",
            email="fisio@example.com",
            password="testpass",
            dni="21419210T"
        )
        working_day = (now() + timedelta(days=1)).strftime('%A').lower()

        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            gender="M",
            birth_date="1990-01-01",
            collegiate_number="C123",
            autonomic_community="MADRID",
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
            schedule={
                "weekly_schedule": {
                    working_day: [{"start": "09:00", "end": "17:00"}]
                },
                "exceptions": {}
            }
        )

        self.url = reverse("create_appointment_patient")

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


    def base_data(self, service_override=None):
        start = now() + timedelta(days=1, hours=2)
        end = start + timedelta(minutes=60)
        return {
            "physiotherapist": self.physio.id,
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "service": service_override or self.valid_service,
            "is_online": True,
            "alternatives": {}
        }
    def test_successful_appointment_creation(self):
        response = self.client.post(self.url, self.base_data(), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Appointment.objects.count(), 1)

    def test_missing_service_field(self):
        data = self.base_data()
        data.pop("service")
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_empty_service_dict(self):
        data = self.base_data()
        data["service"] = {}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_invalid_service_id_not_in_physio_services(self):
        invalid_service = self.valid_service.copy()
        invalid_service["id"] = 99  # no existe
        data = self.base_data(service_override=invalid_service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_service_fields_do_not_match_physio_service(self):
        invalid_service = self.valid_service.copy()
        invalid_service["price"] = 999  # no coincide
        data = self.base_data(service_override=invalid_service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_questionary_missing_required_response(self):
        invalid_service = self.valid_service.copy()
        invalid_service["questionaryResponses"].pop("edad")
        data = self.base_data(service_override=invalid_service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_questionary_response_wrong_type(self):
        invalid_service = self.valid_service.copy()
        invalid_service["questionaryResponses"]["edad"] = "treinta y dos"  # no se puede convertir a int
        data = self.base_data(service_override=invalid_service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_questionary_response_control_too_long(self):
        invalid_service = self.valid_service.copy()
        invalid_service["questionaryResponses"]["motivo_consulta"] = "x" * 151
        data = self.base_data(service_override=invalid_service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_questionary_response_extra_keys(self):
        invalid_service = self.valid_service.copy()
        invalid_service["questionaryResponses"]["extra"] = "no debería estar"
        data = self.base_data(service_override=invalid_service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_custom_questionnaire_is_null_should_ignore_responses(self):
        physio_services = self.physio.services
        physio_services["1"]["custom_questionnaire"] = None
        self.physio.services = physio_services
        self.physio.save()

        service = self.valid_service.copy()
        service["custom_questionnaire"] = None
        service["questionaryResponses"] = {"respuesta_aleatoria": "cualquiera"}  # será ignorado

        data = self.base_data(service_override=service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_custom_questionnaire_is_null_and_no_responses(self):
        physio_services = self.physio.services
        physio_services["1"]["custom_questionnaire"] = None
        self.physio.services = physio_services
        self.physio.save()

        service = self.valid_service.copy()
        service["custom_questionnaire"] = None
        service["questionaryResponses"] = {}

        data = self.base_data(service_override=service)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)


class CreateAppointmentTests(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        # Obtener la fecha una semana después de la actual en horario de España
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now_spain = datetime.now(self.spain_tz)
        self.future_date = now_spain + timedelta(weeks=1)
        self.exception_date = self.future_date + timedelta(days=1)

        # Asegurar que las fechas están con zona horaria
        self.future_date = self.future_date.astimezone(self.spain_tz)
        self.exception_date = self.exception_date.astimezone(self.spain_tz)
        
        # Formateo de fechas
        future_date_str = self.future_date.strftime("%Y-%m-%d")
        exception_date_str = self.exception_date.strftime("%Y-%m-%d")
        weekday_key = self.future_date.strftime("%A").lower()
        exception_weekday = self.exception_date.strftime("%A").lower()

        # Definir horas fijas
        self.start_time = f"{future_date_str}T10:00:00{self.future_date.strftime('%z')}"
        self.end_time = f"{future_date_str}T11:00:00{self.future_date.strftime('%z')}"
        self.new_appointment_end_time = f"{future_date_str}T12:00:00{self.future_date.strftime('%z')}"
        self.end_weekly_schedule_time = f"{future_date_str}T13:00:00{self.future_date.strftime('%z')}"

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
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            bio="Bio example",
            autonomic_community="EXTREMADURA",
            rating_avg=4.5,
            schedule={
                "exceptions": {
                    exception_date_str: [
                        {
                            "end": "12:00",
                            "start": "10:00"
                        }
                    ]
                },
                "appointments": [
                    {
                        "status": "booked",
                        "start_time": self.start_time,
                        "end_time": self.end_time
                    },
                ],
                "weekly_schedule": {
                    weekday_key: [
                        {
                            "id": f"ws-{int(self.future_date.timestamp())}-001",
                            "start": "16:00",
                            "end": "18:00"
                        },
                        {
                            "id": f"ws-{int(self.future_date.timestamp())}-002",
                            "start": self.start_time.split("T")[1].split(":")[0]+":00",
                            "end": self.new_appointment_end_time.split("T")[1].split(":")[0]+":59"
                        }
                    ],
                    exception_weekday: [
                        {
                            "id": f"ws-{int(self.exception_date.timestamp())}-003",
                            "start": "10:00",
                            "end": "14:00"
                        }
                    ]
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
            gender="M"
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
            birth_date="1990-01-01"
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
    
    def test_create_appointment_as_patient(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        physiotherapist = Physiotherapist.objects.get(id=response.data['appointment_data']['physiotherapist'])
        physio_schedule_appointments = physiotherapist.schedule['appointments'] 
        appointment_added = False
        for appointment in physio_schedule_appointments:
            appointment['start_time'] = appointment['start_time']
            appointment['end_time'] = appointment['end_time']
            if appointment['start_time'] == self.end_time and appointment['end_time'] == self.new_appointment_end_time:
                appointment_added = True
                break
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Appointment.objects.count(), 2)
        self.assertEqual(Room.objects.count(), 1)
        self.assertEqual(Appointment.objects.get(id=2).start_time.astimezone(self.spain_tz).strftime("%Y-%m-%dT%H:%M:%S%z"), self.end_time)
        self.assertEqual(Appointment.objects.get(id=2).end_time.astimezone(self.spain_tz).strftime("%Y-%m-%dT%H:%M:%S%z"), self.new_appointment_end_time)
        self.assertEqual(Appointment.objects.get(id=2).patient.id, self.patient.id)
        self.assertEqual(Appointment.objects.get(id=2).physiotherapist.id, self.physio.id)
        self.assertEqual(Appointment.objects.get(id=2).status, 'booked')
        self.assertEqual(Appointment.objects.get(id=2).alternatives, "")
        self.assertEqual(appointment_added, True)
        self.assertIsInstance(response.data['payment_data']['payment'], dict)
        self.assertEqual(response.data['payment_data']['payment']['amount'], '50.00')
        self.assertEqual(response.data['payment_data']['payment']['appointment'], 2)
        self.assertIsInstance(response.data['payment_data']['client_secret'], str)

    def test_create_appointment_without_authentication(self):
        url = '/api/appointment/patient/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(Appointment.objects.count(), 1)
    
    def test_create_appointment_as_patient_invalid_start_end_time(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': self.new_appointment_end_time,
            'end_time': self.end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'La fecha de inicio debe ser anterior a la fecha de fin.')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_invalid_start_end_date(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': self.end_time,
            'end_time': self.exception_date.strftime("%Y-%m-%d")+"T11:00:00"+self.exception_date.strftime("%z"),
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'La cita debe comenzar y terminar el mismo día.')
        self.assertEqual(Appointment.objects.count(), 1)
    
    def test_create_appointment_as_patient_invalid_schedule_day(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': (self.future_date + timedelta(days=-1)).strftime("%Y-%m-%dT%H:%M:%S%z"),
            'end_time': (self.future_date + timedelta(days=-1, hours=1)).strftime("%Y-%m-%dT%H:%M:%S%z"),
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('El fisioterapeuta no trabaja los', response.data['error'])
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_invalid_schedule_time(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': (self.future_date + timedelta(hours=4)).strftime("%Y-%m-%dT%H:%M:%S%z"),
            'end_time': (self.future_date + timedelta(hours=5)).strftime("%Y-%m-%dT%H:%M:%S%z"),
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'El horario solicitado no está dentro del horario del fisioterapeuta')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_already_appointment_exists(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': self.start_time,
            'end_time': self.end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'El fisioterapeuta ya tiene una cita en ese horario.')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_in_exception_date(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': self.exception_date.strftime("%Y-%m-%d")+"T10:00:00"+self.exception_date.strftime("%z"),
            'end_time': self.exception_date.strftime("%Y-%m-%d")+"T11:00:00"+self.exception_date.strftime("%z"),
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'El fisioterapeuta no está disponible en ese horario debido a una excepción')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_in_past_date(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': (self.future_date + timedelta(weeks=-2)).strftime("%Y-%m-%dT%H:%M:%S%z"),
            'end_time': (self.future_date + timedelta(weeks=-2, hours=1)).strftime("%Y-%m-%dT%H:%M:%S%z"),
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'No puedes crear una cita en el pasado')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_with_physio_credentials(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_invalid_physio(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'physiotherapist': 8,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Fisioterapeuta no encontrado')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_physio(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        physiotherapist = Physiotherapist.objects.get(id=response.data['physiotherapist'])
        physio_schedule_appointments = physiotherapist.schedule['appointments'] 
        appointment_added = False
        for appointment in physio_schedule_appointments:
            appointment['start_time'] = appointment['start_time']
            appointment['end_time'] = appointment['end_time']
            if appointment['start_time'] == self.end_time and appointment['end_time'] == self.new_appointment_end_time:
                appointment_added = True
                break
        appointment_id = response.data["id"]
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Appointment.objects.count(), 2)
        self.assertEqual(Room.objects.count(), 1)
        self.assertEqual(Appointment.objects.get(id=appointment_id).start_time.astimezone(self.spain_tz).strftime("%Y-%m-%dT%H:%M:%S%z"), self.end_time)
        self.assertEqual(Appointment.objects.get(id=appointment_id).end_time.astimezone(self.spain_tz).strftime("%Y-%m-%dT%H:%M:%S%z"), self.new_appointment_end_time)
        self.assertEqual(Appointment.objects.get(id=appointment_id).patient.id, self.patient.id)
        self.assertEqual(Appointment.objects.get(id=appointment_id).physiotherapist.id, self.physio.id)
        self.assertEqual(Appointment.objects.get(id=appointment_id).status, 'booked')
        self.assertEqual(Appointment.objects.get(id=appointment_id).alternatives, "")
        self.assertEqual(appointment_added, True)

    def test_create_appointment_as_physio_without_authentication(self):
        url = '/api/appointment/physio/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_physio_with_patient_credentials(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_physio_invalid_start_end_time(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': self.new_appointment_end_time,
            'end_time': self.end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'La fecha de inicio debe ser anterior a la fecha de fin.')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_physio_invalid_start_end_date(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': self.end_time,
            'end_time': self.exception_date.strftime("%Y-%m-%d")+"T11:00:00"+self.exception_date.strftime("%z"),
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'La cita debe comenzar y terminar el mismo día.')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_physio_patient_already_has_appointment(self):
        # Primero creamos otro fisioterapeuta para el paciente
        other_physio_user = AppUser.objects.create_user(
            username = "other_fisio",
            email = "other_fisio@sample.com",
            password = "Usuar1o_1",
            dni = "76543212B",
            phone_number = "666666666",
            postal_code = "41960",
            account_status = "ACTIVE",
            first_name = "Abel",
            last_name = "Mejias Gil"
        )
        other_physio = Physiotherapist.objects.create(
            user = other_physio_user,
            bio = "Bio example",
            autonomic_community = "EXTREMADURA",
            rating_avg = 4.5,
            schedule = {},
            birth_date = "1980-01-01",
            collegiate_number = "COL2",
            services = {},
            gender = "M"
        )
        # Primero creamos otra cita para el paciente en el mismo horario
        other_appointment = Appointment.objects.create(
            start_time=self.end_time,
            end_time=self.new_appointment_end_time,
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=other_physio.id,
            status='booked',
            alternatives='',
        )

        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'El paciente ya tiene una cita en ese horario.')
        self.assertEqual(Appointment.objects.count(), 2)  # Sigue habiendo dos citas (la original y la que creamos en este test)

    def test_create_appointment_as_physio_invalid_patient(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': self.end_time,
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': 999,  # ID inválido
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 404)
        # Asumiendo que el serializer validará que el paciente exista
        self.assertEqual(response.data['error'], 'Paciente no encontrado')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_physio_missing_required_fields(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            # Falta start_time
            'end_time': self.new_appointment_end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('start_time' in response.data)
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_physio_same_time_conflict(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': self.start_time,  # Coincide con la cita existente
            'end_time': self.end_time,
            'is_online': True,
            'service': self.valid_service,
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'El fisioterapeuta ya tiene una cita en ese horario.')
        self.assertEqual(Appointment.objects.count(), 1)

class ListAppointmentTests(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        # Create physiotherapist user
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
        
        # Create physiotherapist profile
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            bio="Bio example",
            autonomic_community="EXTREMADURA",
            rating_avg=4.5,
            schedule={
                "exceptions": {},
                "appointments": [],
                "weekly_schedule": {
                    "monday": [{"start": "10:00", "end": "14:00"}],
                    "tuesday": [{"start": "10:00", "end": "15:00"}],
                    "wednesday": [],
                    "thursday": [],
                    "friday": [],
                    "saturday": [],
                    "sunday": []
                }
            },
            birth_date="1980-01-01",
            collegiate_number="COL1",
            services={
                "Servicio 1": {
                    "id": 1,
                    "title": "Primera consulta",
                    "price": 30,
                    "description": "Evaluación física personalizada",
                    "duration": 45
                }
            },
            gender="M"
        )
        # Create a second physiotherapist for testing
        self.physio_user2 = AppUser.objects.create_user(
            username="physio2",
            email="physio2@sample.com",
            password="Usuar1o_1",
            dni="77860169Q",
            phone_number="666666667",
            postal_code="41961",
            account_status="ACTIVE",
            first_name="Ana",
            last_name="Martínez López"
        )
        self.physio2 = Physiotherapist.objects.create(
            user=self.physio_user2,
            bio="Another physio",
            autonomic_community="ANDALUCIA",
            rating_avg=4.2,
            schedule={
                "exceptions": {},
                "appointments": [],
                "weekly_schedule": {
                    "monday": [{"start": "09:00", "end": "13:00"}],
                    "tuesday": [],
                    "wednesday": [{"start": "10:00", "end": "15:00"}],
                    "thursday": [],
                    "friday": [{"start": "09:00", "end": "14:00"}],
                    "saturday": [],
                    "sunday": []
                }
            },
            birth_date="1985-02-15",
            collegiate_number="COL2",
            services={
                "Servicio 1": {
                    "id": 1,
                    "title": "Consulta",
                    "price": 35,
                    "description": "Consulta general",
                    "duration": 40
                }
            },
            gender="F"
        )
        # Create patient user
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
        # Create patient profile
        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender="M",
            birth_date="1990-01-01"
        )
        # Create a second patient for testing
        self.patient_user2 = AppUser.objects.create_user(
            username="patient2",
            email="patient2@sample.com",
            password="Usuar1o_1",
            dni="76543212B",
            phone_number="666666668",
            postal_code="41962",
            account_status="ACTIVE",
            first_name="María",
            last_name="Sánchez Pérez"
        )
        self.patient2 = Patient.objects.create(
            user=self.patient_user2,
            gender="F",
            birth_date="1992-05-15"
        )
        # Create future date for appointments
        future_date = timezone.now() + timedelta(days=365)
        base_date = future_date.replace(hour=10, minute=0, second=0, microsecond=0)
        # Create appointments with different statuses for testing
        # Appointments for physio1 with patient1
        self.appointment1 = Appointment.objects.create(
            start_time=base_date,
            end_time=base_date + timedelta(hours=1),
            is_online=True,
            service='{"service": "Servicio 1"}',
            patient=self.patient,
            physiotherapist=self.physio,
            status=StatusChoices.BOOKED,
            alternatives=""
        )
        self.appointment2 = Appointment.objects.create(
            start_time=base_date + timedelta(days=1),
            end_time=base_date + timedelta(days=1, hours=1),
            is_online=False,
            service='{"service": "Servicio 1"}',
            patient=self.patient,
            physiotherapist=self.physio,
            status=StatusChoices.CONFIRMED,
            alternatives=""
        )
        self.appointment3 = Appointment.objects.create(
            start_time=base_date + timedelta(days=2),
            end_time=base_date + timedelta(days=2, hours=1),
            is_online=True,
            service='{"service": "Servicio 1"}',
            patient=self.patient,
            physiotherapist=self.physio,
            status=StatusChoices.CANCELED,
            alternatives=""
        )
        # Appointments for physio1 with patient2
        self.appointment4 = Appointment.objects.create(
            start_time=base_date + timedelta(days=3),
            end_time=base_date + timedelta(days=3, hours=1),
            is_online=True,
            service='{"service": "Servicio 1"}',
            patient=self.patient2,
            physiotherapist=self.physio,
            status=StatusChoices.FINISHED,
            alternatives=""
        )
        self.appointment5 = Appointment.objects.create(
            start_time=base_date + timedelta(days=4),
            end_time=base_date + timedelta(days=4, hours=1),
            is_online=False,
            service='{"service": "Servicio 1"}',
            patient=self.patient2,
            physiotherapist=self.physio,
            status=StatusChoices.PENDING,
            alternatives=""
        )
        # Appointments for physio2 with patient1
        self.appointment6 = Appointment.objects.create(
            start_time=base_date + timedelta(days=5),
            end_time=base_date + timedelta(days=5, hours=1),
            is_online=True,
            service='{"service": "Servicio 1"}',
            patient=self.patient,
            physiotherapist=self.physio2,
            status=StatusChoices.BOOKED,
            alternatives=""
        )
        # Appointments for physio2 with patient2
        self.appointment7 = Appointment.objects.create(
            start_time=base_date + timedelta(days=6),
            end_time=base_date + timedelta(days=6, hours=1),
            is_online=False,
            service='{"service": "Servicio 1"}',
            patient=self.patient2,
            physiotherapist=self.physio2,
            status=StatusChoices.CONFIRMED,
            alternatives=""
        )
    
    def test_list_appointments_physio_without_authentication(self):
        url = '/api/appointment/physio/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
    
    def test_list_appointments_physio_with_patient_credentials(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = '/api/appointment/physio/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
    
    def test_list_appointments_physio_all(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = '/api/appointment/physio/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        
        # Check that we get the correct number of appointments for this physiotherapist
        self.assertEqual(response.data['count'], 5)
        
        # Verify all appointments belong to the authenticated physiotherapist
        for appointment in response.data['results']:
            self.assertEqual(appointment['physiotherapist'], self.physio.id)
    
    def test_list_appointments_physio_filter_by_status(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test filter by status="booked"
        url = '/api/appointment/physio/list/?status=booked'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.appointment1.id)
        
        # Test filter by status="confirmed"
        url = '/api/appointment/physio/list/?status=confirmed'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.appointment2.id)
        
        # Test filter by status="canceled"
        url = '/api/appointment/physio/list/?status=canceled'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.appointment3.id)
        
        # Test filter by status="finished"
        url = '/api/appointment/physio/list/?status=finished'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.appointment4.id)
        
        # Test filter by status="pending"
        url = '/api/appointment/physio/list/?status=pending'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.appointment5.id)
        
        # Test filter by non-existent status
        url = '/api/appointment/physio/list/?status=nonexistent'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)
    
    def test_list_appointments_physio_filter_by_is_online(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test filter by is_online=true
        url = '/api/appointment/physio/list/?is_online=true'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 3)  # Appointments 1, 3, 4 are online
        
        # Test filter by is_online=false
        url = '/api/appointment/physio/list/?is_online=false'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)  # Appointments 2, 5 are not online
    
    def test_list_appointments_physio_filter_by_patient(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test filter by patient=patient1
        url = f'/api/appointment/physio/list/?patient={self.patient.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 3)  # Appointments 1, 2, 3 are for patient1
        
        # Test filter by patient=patient2
        url = f'/api/appointment/physio/list/?patient={self.patient2.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)  # Appointments 4, 5 are for patient2
        
        # Test with non-existent patient ID
        url = '/api/appointment/physio/list/?patient=999'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Paciente no encontrado')
    
    # def test_list_appointments_physio_search(self):
    #     login_response = self.client.post('/api/app_user/login/', {
    #         'username': 'jorgito',
    #         'password': 'Usuar1o_1'
    #     })
    #     token = login_response.data['access']
    #     self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
    #     # Test search functionality
    #     url = '/api/appointment/physio/list/?search=book'
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(response.data['count'], 1)  # Should find the "booked" appointment
        
    #     url = '/api/appointment/physio/list/?search=conf'
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(response.data['count'], 1)  # Should find the "confirmed" appointment
    
    def test_list_appointments_physio_ordering(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test ordering ascending by start_time
        url = '/api/appointment/physio/list/?ordering=start_time'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        # Check that dates are in ascending order
        start_times = [appointment['start_time'] for appointment in response.data['results']]
        self.assertEqual(start_times, sorted(start_times))
        
        # Test ordering descending by start_time
        url = '/api/appointment/physio/list/?ordering=-start_time'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        # Check that dates are in descending order
        start_times = [appointment['start_time'] for appointment in response.data['results']]
        self.assertEqual(start_times, sorted(start_times, reverse=True))
        
        # Test ordering by end_time
        url = '/api/appointment/physio/list/?ordering=end_time'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        # Check that dates are in ascending order
        end_times = [appointment['end_time'] for appointment in response.data['results']]
        self.assertEqual(end_times, sorted(end_times))
    
    def test_list_appointments_physio_multiple_filters(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test filter by online=true and status=booked
        url = '/api/appointment/physio/list/?is_online=true&status=booked'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)  # Only appointment1 is both online and booked
        
        # Test filter by patient=patient1 and is_online=false
        url = f'/api/appointment/physio/list/?patient={self.patient.id}&is_online=false'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)  # Only appointment2 is for patient1 and not online
        
        # Test filter by patient=patient2 and status=pending
        url = f'/api/appointment/physio/list/?patient={self.patient2.id}&status=pending'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)  # Only appointment5 is for patient2 and pending
    
    def test_list_appointments_physio_pagination(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test default pagination (should return all 5 appointments in one page with default settings)
        url = '/api/appointment/physio/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        
        # Test with page size parameter (assuming StandardResultsSetPagination allows page_size as query parameter)
        url = '/api/appointment/physio/list/?page_size=2'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)  # Total count should still be 5
        self.assertEqual(len(response.data['results']), 2)  # But only 2 results per page
        
        # Check the second page
        url = '/api/appointment/physio/list/?page=2&page_size=2'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        self.assertEqual(len(response.data['results']), 2)
        
        # Check the third page (should have only one result)
        url = '/api/appointment/physio/list/?page=3&page_size=2'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_list_appointments_patient_without_authentication(self):
        url = '/api/appointment/patient/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
    
    def test_list_appointments_patient_with_physio_credentials(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = '/api/appointment/patient/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
    
    def test_list_appointments_patient_all(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = '/api/appointment/patient/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        
        # Should return all 4 appointments for patient1 (3 with physio1 and 1 with physio2)
        self.assertEqual(len(response.data), 4)
        
        # Verify all appointments belong to the authenticated patient
        patient_ids = [appointment['patient'] for appointment in response.data]
        self.assertTrue(all(pid == self.patient.id for pid in patient_ids))
    
    def test_list_appointments_patient2_all(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient2',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = '/api/appointment/patient/list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        
        # Should return all 3 appointments for patient2 (2 with physio1 and 1 with physio2)
        self.assertEqual(len(response.data), 3)
        
        # Verify all appointments belong to the authenticated patient
        patient_ids = [appointment['patient'] for appointment in response.data]
        self.assertTrue(all(pid == self.patient2.id for pid in patient_ids))

    def test_get_appointment_by_id_as_patient(self):
        # Autenticar como el paciente
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Obtener la cita
        url = f'/api/appointment/{self.appointment1.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.appointment1.id)
        self.assertEqual(response.data['patient'], self.patient.id)
        self.assertEqual(response.data['physiotherapist'], self.physio.id)

    def test_get_appointment_by_id_as_physio(self):
        # Autenticar como el fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Obtener la cita
        url = f'/api/appointment/{self.appointment1.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.appointment1.id)
        self.assertEqual(response.data['patient'], self.patient.id)
        self.assertEqual(response.data['physiotherapist'], self.physio.id)

    def test_get_appointment_by_id_without_permission(self):
        # Crear un usuario sin relación con la cita
        other_user = AppUser.objects.create_user(
            username="other_user",
            email="other_user@sample.com",
            password="Usuar1o_1"
        )
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'other_user',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Intentar obtener la cita
        url = f'/api/appointment/{self.appointment1.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], "No tienes permisos para ver esta cita")

    def test_get_appointment_by_id_not_found(self):
        # Autenticar como el paciente
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Intentar obtener una cita inexistente
        url = '/api/appointment/999/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], "Cita no encontrada")

    def test_get_appointment_by_id_without_authentication(self):
        # Intentar obtener la cita sin autenticación
        url = f'/api/appointment/{self.appointment1.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)


class UpdateAppointmentTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.spain_tz = pytz.timezone("Europe/Madrid")
        now_spain = datetime.now(self.spain_tz)
        
        # Fechas automáticas
        self.future_date = (now_spain + timedelta(days=5)).astimezone(self.spain_tz)
        self.close_date = (now_spain + timedelta(hours=24)).astimezone(self.spain_tz)

        self.future_date_str_date = self.future_date.strftime("%Y-%m-%d")
        self.close_date_str_date = self.close_date.strftime("%Y-%m-%d")
        self_future_date_weekday = self.future_date.strftime("%A").lower()
        self.close_date_weekday = self.close_date.strftime("%A").lower()
        
        self.future_date_start_time = f"{self.future_date_str_date}T10:00:00{self.future_date.strftime('%z')}"
        self.future_date_end_time = f"{self.future_date_str_date}T11:00:00{self.future_date.strftime('%z')}"
        self.close_date_start_time = f"{self.close_date_str_date}T10:00:00{self.close_date.strftime('%z')}"
        self.close_date_end_time = f"{self.close_date_str_date}T11:00:00{self.close_date.strftime('%z')}"
        
        # Crear usuario fisioterapeuta
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
        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            bio="Bio example",
            autonomic_community="EXTREMADURA",
            rating_avg=4.5,
            schedule={
                "exceptions": {},
                "appointments": [
                    {
                        "status": "booked",
                        "start_time": self.future_date_start_time,
                        "end_time": self.future_date_end_time
                    },
                    {
                        "status": "booked",
                        "start_time": self.close_date_start_time,
                        "end_time": self.close_date_end_time
                    }
                ],
                "weekly_schedule": {
                    "monday": [{"start": "10:00", "end": "14:00"}],
                    "tuesday": [{"start": "10:00", "end": "15:00"}],
                    "wednesday": [],
                    "thursday": [],
                    "friday": [],
                    "saturday": [],
                    "sunday": []
                }
            },
            birth_date="1980-01-01",
            collegiate_number="COL1",
            services={"Servicio 1": {"id": 1, "title": "Consulta", "price": 30, "duration": 45}},
            gender="M"
        )
        # Crear usuario paciente
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
            gender="M",
            birth_date="1990-01-01"
        )
        # Crear cita futura (más de 48 horas desde ahora)
        self.appointment = Appointment.objects.create(
            start_time=self.future_date_start_time,
            end_time=self.future_date_end_time,
            is_online=True,
            service='{"service": "Servicio 1"}',
            patient=self.patient,
            physiotherapist=self.physio,
            status=StatusChoices.BOOKED,
            alternatives=""
        )
        # Crear cita cercana (menos de 48 horas)
        self.close_appointment = Appointment.objects.create(
            start_time=self.close_date_start_time,
            end_time=self.close_date_end_time,
            is_online=True,
            service='{"service": "Servicio 1"}',
            patient=self.patient,
            physiotherapist=self.physio,
            status=StatusChoices.BOOKED,
            alternatives=""
        )


    def test_update_appointment_success(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": {
                self.future_date_str_date: [{"start": "11:00", "end": "12:00"}],
                (self.future_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "12:00", "end": "13:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'pending')
        self.assertEqual(response.data['alternatives'], data['alternatives'])

    def test_update_appointment_without_authentication(self):
        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": {
                self.future_date_str_date: [{"start": "11:00", "end": "12:00"}],
                (self.future_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "12:00", "end": "13:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 401)

    def test_update_appointment_as_patient(self):
        # Login como paciente
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": {
                self.future_date_str_date: [{"start": "11:00", "end": "12:00"}],
                (self.future_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "12:00", "end": "13:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['detail'], "Usted no tiene permiso para realizar esta acción.")

    def test_update_appointment_less_than_48_hours(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.close_appointment.id}/'
        data = {
            "alternatives": {
                self.close_date_str_date: [{"start": "11:00", "end": "12:00"}],
                (self.close_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "12:00", "end": "13:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], "Solo puedes modificar citas con al menos 48 horas de antelación")

    def test_update_appointment_invalid_time_order(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": {
                self.future_date_str_date: [{"start": "11:00", "end": "10:00"}],
                (self.future_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "11:00", "end": "12:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("la hora de inicio debe ser menor que la de fin", response.data['error'])

    def test_update_appointment_with_current_time(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": {
                self.future_date_str_date: [{"start": "10:00", "end": "11:00"}],
                (self.future_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "11:00", "end": "12:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("No puedes agregar la fecha actual de la cita", response.data['error'])

    def test_update_appointment_duplicate_slots(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": {
                self.future_date_str_date: [
                    {"start": "11:00", "end": "12:00"},
                    {"start": "11:00", "end": "12:00"}
                ]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("ya existe en 'alternatives'", response.data['error'])

    def test_update_appointment_not_found(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/update/999/'
        data = {
            "alternatives": {
                self.future_date_str_date: [{"start": "11:00", "end": "12:00"}],
                (self.future_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "12:00", "end": "13:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], "Cita no encontrada")

    def test_update_appointment_invalid_data(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": "invalid_data"  # Formato incorrecto
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], "Alternatives debe ser un diccionario")

    def test_update_appointment_alternative_overlap_with_other_existing_appointment(self):
        # Login como fisioterapeuta
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/'
        data = {
            "alternatives": {
                self.close_date_str_date: [{"start": "10:00", "end": "11:00"}],
                (self.future_date + timedelta(days=1)).strftime("%Y-%m-%d"): [{"start": "12:00", "end": "13:00"}]
            }
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("la hora de inicio y fin no se pueden solapar con otra cita del fisioterapeuta", response.data['error'])

class PatchDeleteAppointmentTests(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.physio_user = AppUser.objects.create_user(
            username = "jorgito",
            email = "jorgito@sample.com",
            password = "Usuar1o_1",
            dni = "77860168Q",
            phone_number = "666666666",
            postal_code = "41960",
            account_status = "ACTIVE",
            first_name = "Jorge",
            last_name = "García Chaparro"
        )
        self.physio = Physiotherapist.objects.create(
            user = self.physio_user,
            bio = "Bio example",
            autonomic_community = "EXTREMADURA",
            rating_avg = 4.5,
            schedule = {
                "exceptions": {
                    "2026-02-09": [
                        {
                            "end": "12:00",
                            "start": "10:00"
                        }
                    ]
                },
                "appointments": [
                    {
                        "status": "booked",
                        "end_time": "2026-02-02T10:00:00Z",
                        "start_time": "2026-02-02T11:00:00Z"
                    },
                ],
                "weekly_schedule": {
                    "friday": [],
                    "monday": [
                        {
                            "id": "ws-1743669362707-139",
                            "end": "14:00",
                            "start": "10:00"
                        }
                    ],
                    "sunday": [],
                    "tuesday": [
                        {
                            "id": "ws-1743669365620-823",
                            "end": "15:00",
                            "start": "10:00"
                        }
                    ],
                    "saturday": [],
                    "thursday": [],
                    "wednesday": []
                }
            },
            birth_date = "1980-01-01",
            collegiate_number = "COL1",
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
            gender = "M"
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
            username = "patient1",
            email = "patient1@sample.com",
            password = "Usuar1o_1",
            dni = "76543211B",
            phone_number = "666666666",
            postal_code = "41960",
            account_status = "ACTIVE",
            first_name = "Juan",
            last_name = "Rodríguez García"
        )
        self.patient = Patient.objects.create(
            user = self.patient_user,
            gender = "F",
            birth_date = "1990-01-01"
        )
        self.appointment = Appointment.objects.create(
            start_time='2026-02-02T10:00:00+01:00',
            end_time='2026-02-02T11:00:00+01:00',
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives={
                "2026-02-03": [{"start": "10:00", "end": "11:00"}]
            },
        )

    def test_accept_alternative_success(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = f'/api/appointment/update/{self.appointment.id}/accept-alternative/'
        data = {
            "start_time": "2026-02-03T10:00:00Z",
            "end_time": "2026-02-03T11:00:00Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "confirmed")
        self.assertEqual(response.data["start_time"].replace("+01:00", "Z"), "2026-02-03T10:00:00Z")
        self.assertEqual(response.data["end_time"].replace("+01:00", "Z"), "2026-02-03T11:00:00Z")
        self.assertEqual(response.data["alternatives"], "")
    
    def test_accept_alternative_invalid_appointment(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.put('/api/appointment/update/999/accept-alternative/', format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Cita no encontrada')

    def test_accept_alternative_no_alternatives(self):
        aux_appointment = Appointment.objects.create(
            start_time='2026-02-03T10:00:00Z',
            end_time='2026-02-03T11:00:00Z',
            is_online=True,
            service=self.valid_service,
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives=""
        )
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        data = {
            "start_time": "2026-02-03T10:00:00Z",
            "end_time": "2026-02-03T11:00:00Z"
        }
        
        response = self.client.put(f'/api/appointment/update/{aux_appointment.id}/accept-alternative/', data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'No puedes aceptar una alternativa si la cita no tiene alternativas')

    def test_accept_alternative_invalid_alternative_date(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = f'/api/appointment/update/{self.appointment.id}/accept-alternative/'
        data = {
            "start_time": "2026-02-04T10:00:00Z",
            "end_time": "2026-02-04T11:00:00Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'El rango horario seleccionado no coincide con las alternativas disponibles')

    def test_accept_alternative_invalid_alternative_time(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = f'/api/appointment/update/{self.appointment.id}/accept-alternative/'
        data = {
            "start_time": "2026-02-03T11:00:00Z",
            "end_time": "2026-02-03T12:00:00Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'El rango horario seleccionado no coincide con las alternativas disponibles')

    def test_accept_alternative_other_patient(self):
        patient_user = AppUser.objects.create_user(
            username = "patient2",
            email = "patient2@sample.com",
            password = "Usuar1o_1",
            dni = "12345675A",
            phone_number = "666666666",
            postal_code = "41960",
            account_status = "ACTIVE",
            first_name = "Juan",
            last_name = "Rodríguez García"
        )
        patient = Patient.objects.create(
            user = patient_user,
            gender = "F",
            birth_date = "1990-01-01"
        )        
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient2',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = f'/api/appointment/update/{self.appointment.id}/accept-alternative/'
        data = {
            "start_time": "2026-02-03T10:00:00Z",
            "end_time": "2026-02-03T11:00:00Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'No autorizado para aceptar una alternativa de esta cita')

    def test_accept_alternative_no_dates(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = f'/api/appointment/update/{self.appointment.id}/accept-alternative/'
        data = {}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], "Debes proporcionar un 'start_time' y un 'end_time' válidos")

    def test_confirm_appointment_success(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'Usuar1o_1'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = f'/api/appointment/update/{self.appointment.id}/confirm/'
        response = self.client.put(url)
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "La cita fue aceptada correctamente")
        self.assertEqual(response.data["appointment"]["status"], "confirmed")
        self.assertEqual(response.data["appointment"]["start_time"], self.appointment.start_time)
        self.assertEqual(response.data["appointment"]["end_time"], self.appointment.end_time)
 
    def test_confirm_appointment_invalid_appointment(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'fisio',
            'password': 'password123'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.put('/api/appointment/confirm/999/', format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Cita no encontrada')
    
    def test_confirm_appointment_not_physio(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            physiotherapist=self.physio,
            status='booked'
        )
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'paciente',
            'password': 'password123'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.put(f'/api/appointment/confirm/{appointment.id}/', format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'No tienes permisos para confirmar esta cita')
    
    def test_delete_appointment_invalid_appointment(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'fisio',
            'password': 'password123'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.delete('/api/appointment/delete/999/', format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Cita no encontrada')
    
    def test_delete_appointment_no_permission(self):
        appointment = Appointment.objects.create(
            patient=self.patient,
            physiotherapist=self.physio,
            status='booked'
        )
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'otro_usuario',
            'password': 'password123'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.delete(f'/api/appointment/delete/{appointment.id}/', format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'No tienes permisos para borrar esta cita')
