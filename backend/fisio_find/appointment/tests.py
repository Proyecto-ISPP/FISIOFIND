from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from django.shortcuts import render
from appointment.models import Appointment
from appointment.serializers import AppointmentSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from users.models import AppUser, Patient, Physiotherapist, Specialization, PhysiotherapistSpecialization
from users.serializers import PhysioSerializer, PatientSerializer, AppUserSerializer

class CreateAppointmentTests(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.physio_user = AppUser.objects.create_user(
            username = "jorgito",
            email = "jorgito@sample.com",
            password = "pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw=",
            dni = "77860168Q",
            phone_number = "666666666",
            postal_code = "41960",
            account_status = "ACTIVE",
            first_name = "Jorge",
            last_name = "García Chaparro"
        )
        self.physio_user_serializer = AppUserSerializer(data=self.physio_user)
        if self.physio_user_serializer.is_valid():
            self.physio_user_serializer.save()
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
                            "end": "14:00",
                            "start": "10:00"
                        }
                    ],
                    "saturday": [],
                    "sunday": [],
                    "thursday": [],
                    "tuesday": [
                        {
                            "end": "15:00",
                            "start": "10:00"
                        }
                    ],
                    "wednesday": []
                }
            },
            birth_date = "1980-01-01",
            collegiate_number = "COL1",
            services = {
                "Servicio 1": {
                    "id": 1,
                    "title": "Primera consulta",
                    "price": 30,
                    "description": "Evaluaremos tu estado físico, hablaremos sobre tus molestias y realizaremos pruebas para diseñar un plan de tratamiento personalizado que se adapte a tus necesidades y estilo de vida.",
                    "duration": 45,
                    "custom_questionnaire": {
                        "UI Schema": {
                            "type": "Group",
                            "label": "Cuestionario Personalizado",
                            "elements": [
                                {
                                    "type": "Control",
                                    "label": "¿Qué te duele?",
                                    "scope": "#/properties/q1"
                                },
                                {
                                    "type": "Control",
                                    "label": "¿Cómo describirías el dolor?",
                                    "scope": "#/properties/q2"
                                }
                            ]
                        }
                    }
                }
            },
            gender = "M"
        )
        self.physio_serializer = PhysioSerializer(data=self.physio)
        if self.physio_serializer.is_valid():
            self.physio_serializer.save()
        self.patient_user = AppUser.objects.create_user(
            username = "patient1",
            email = "patient1@sample.com",
            password = "pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw=",
            dni = "76543211B",
            phone_number = "666666666",
            postal_code = "41960",
            account_status = "ACTIVE",
            first_name = "Juan",
            last_name = "Rodríguez García"
        )
        self.patient_user_serializer = AppUserSerializer(data=self.patient_user)
        if self.patient_user_serializer.is_valid():
            self.patient_user_serializer.save()
        self.patient = Patient.objects.create(
            user = self.patient_user,
            gender = "F",
            birth_date = "1990-01-01"
        )
        self.patient_serializer = PatientSerializer(data=self.patient)
        if self.patient_serializer.is_valid():
            self.patient_serializer.save()
        self.appointment = Appointment.objects.create(
            start_time='2026-02-02T10:00:00Z',
            end_time='2026-02-02T11:00:00Z',
            is_online=True,
            service='{"service = "service"}',
            patient_id=self.patient.id,
            physiotherapist_id=self.physio.id,
            status='booked',
            alternatives='',
        )
        self.appointment_serializer = AppointmentSerializer(data=self.appointment)
        if self.appointment_serializer.is_valid():
            self.appointment_serializer.save()
            
    def test_create_appointment_as_patient(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        print(response.data)
        physiotherapist = Physiotherapist.objects.get(id=response.data['physiotherapist'])
        physio_scheule_appointments = physiotherapist.schedule['appointments'] 
        appointment_added = False
        for appointment in physio_scheule_appointments:
            appointment['start_time'] = appointment['start_time']
            appointment['end_time'] = appointment['end_time']
            if appointment['start_time'] == '2026-02-03T10:00:00' and appointment['end_time'] == '2026-02-03T11:00:00':
                appointment_added = True
                break
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Appointment.objects.count(), 2)
        self.assertEqual(Appointment.objects.get(id=2).start_time.isoformat().replace('+00:00', 'Z'), '2026-02-03T10:00:00Z')
        self.assertEqual(Appointment.objects.get(id=2).end_time.isoformat().replace('+00:00', 'Z'), '2026-02-03T11:00:00Z')
        self.assertEqual(Appointment.objects.get(id=2).patient.id, self.patient.id)
        self.assertEqual(Appointment.objects.get(id=2).physiotherapist.id, self.physio.id)
        self.assertEqual(Appointment.objects.get(id=2).status, 'booked')
        self.assertEqual(Appointment.objects.get(id=2).alternatives, "")
        self.assertEqual(appointment_added, True)

    def test_create_appointment_without_authentication(self):
        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T09:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-04T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-04T10:00:00Z',
            'end_time': '2026-02-04T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
            'patient': self.patient.id,
            'physiotherapist': self.physio.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'El fisioterapeuta no trabaja los miércoles')
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_as_patient_invalid_schedule_time(self):
        login_response = self.client.post('/api/app_user/login/', {
            'username': 'patient1',
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-03T16:00:00Z',
            'end_time': '2026-02-03T17:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-02T10:00:00Z',
            'end_time': '2026-02-02T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-09T10:00:00Z',
            'end_time': '2026-02-09T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2024-02-05T10:00:00Z',
            'end_time': '2024-02-05T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/patient/'
        data = {
            'start_time': '2024-02-05T10:00:00Z',
            'end_time': '2024-02-05T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            if appointment['start_time'] == '2026-02-03T10:00:00' and appointment['end_time'] == '2026-02-03T11:00:00':
                appointment_added = True
                break
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Appointment.objects.count(), 2)
        self.assertEqual(Appointment.objects.get(id=2).start_time.isoformat().replace('+00:00', 'Z'), '2026-02-03T10:00:00Z')
        self.assertEqual(Appointment.objects.get(id=2).end_time.isoformat().replace('+00:00', 'Z'), '2026-02-03T11:00:00Z')
        self.assertEqual(Appointment.objects.get(id=2).patient.id, self.patient.id)
        self.assertEqual(Appointment.objects.get(id=2).physiotherapist.id, self.physio.id)
        self.assertEqual(Appointment.objects.get(id=2).status, 'booked')
        self.assertEqual(Appointment.objects.get(id=2).alternatives, "")
        self.assertEqual(appointment_added, True)

    def test_create_appointment_as_physio_without_authentication(self):
        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-03T11:00:00Z',
            'end_time': '2026-02-03T10:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-04T10:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            password = "pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw=",
            dni = "76543212B",
            phone_number = "666666666",
            postal_code = "41960",
            account_status = "ACTIVE",
            first_name = "Abel",
            last_name = "Mejias Gil"
        )
        other_physio_user_serializer = AppUserSerializer(data=other_physio_user)
        if other_physio_user_serializer.is_valid():
            other_physio_user_serializer.save()
        other_physio = Physiotherapist.objects.create(
            user = other_physio_user,
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
                            "end": "14:00",
                            "start": "10:00"
                        }
                    ],
                    "saturday": [],
                    "sunday": [],
                    "thursday": [],
                    "tuesday": [
                        {
                            "end": "15:00",
                            "start": "10:00"
                        }
                    ],
                    "wednesday": []
                }
            },
            birth_date = "1980-01-01",
            collegiate_number = "COL2",
            services = {
                "Servicio 1": {
                    "id": 1,
                    "title": "Primera consulta",
                    "price": 30,
                    "description": "Evaluaremos tu estado físico, hablaremos sobre tus molestias y realizaremos pruebas para diseñar un plan de tratamiento personalizado que se adapte a tus necesidades y estilo de vida.",
                    "duration": 45,
                    "custom_questionnaire": {
                        "UI Schema": {
                            "type": "Group",
                            "label": "Cuestionario Personalizado",
                            "elements": [
                                {
                                    "type": "Control",
                                    "label": "¿Qué te duele?",
                                    "scope": "#/properties/q1"
                                },
                                {
                                    "type": "Control",
                                    "label": "¿Cómo describirías el dolor?",
                                    "scope": "#/properties/q2"
                                }
                            ]
                        }
                    }
                }
            },
            gender = "M"
        )
        other_physio_serializer = PhysioSerializer(data=other_physio)
        if other_physio_serializer.is_valid():
            other_physio_serializer.save()
        # Primero creamos otra cita para el paciente en el mismo horario
        other_appointment = Appointment.objects.create(
            start_time='2026-02-03T10:00:00Z',
            end_time='2026-02-03T11:00:00Z',
            is_online=True,
            service='{"service = "service"}',
            patient_id=self.patient.id,
            physiotherapist_id=other_physio.id,
            status='booked',
            alternatives='',
        )

        login_response = self.client.post('/api/app_user/login/', {
            'username': 'jorgito',
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-03T10:00:00Z',
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            # Falta start_time
            'end_time': '2026-02-03T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
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
            'password': 'pbkdf2_sha256$870000$3QqCfXSf9kmYHVoGHNxxiP$nQrFTWfdh8L2ap9wOVTulFJoqDrw2UD7wheiXkgJMXw='
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = '/api/appointment/physio/'
        data = {
            'start_time': '2026-02-02T10:00:00Z',  # Coincide con la cita existente
            'end_time': '2026-02-02T11:00:00Z',
            'is_online': True,
            'service': '{"service = "service"}',
            'patient': self.patient.id,
            'status': 'booked',
            'alternatives': ""
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'El fisioterapeuta ya tiene una cita en ese horario.')
        self.assertEqual(Appointment.objects.count(), 1)