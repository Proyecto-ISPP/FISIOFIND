from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from users.models import AppUser,  Physiotherapist, Patient, Pricing
from videocall.models import Room
from videocall.models import Appointment
from videocall.serializers import RoomSerializer
from datetime import timedelta
from django.utils import timezone
from django.utils.timezone import now, timedelta

"""
Tests de:
    - Permisos
    - Restricciones
    - Casos validos
"""


class RoomCreateViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
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
            }},
            services={"1": {"price": 30, "title": "Primera consulta", "duration": 60}},
            gender='F',
            autonomic_community='MADRID'
        )
        self.client.force_authenticate(user=self.user)

        self.appointment = Appointment.objects.create(
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1),
            is_online=True,
            service={"name": "Sesión de prueba"},
            patient=self.patient,
            physiotherapist=self.physio,
            status="booked",
            alternatives=None
        )

        self.url = reverse('create_room')

    def test_create_room_successfully(self):
        data = {
            "physiotherapist_id": self.physio.id,
            "patient_id": self.patient.id
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('code', response.data)
        self.assertEqual(Room.objects.count(), 1)
        room = Room.objects.first()
        self.assertEqual(room.physiotherapist, self.physio)
        self.assertEqual(room.patient, self.patient)

    def test_create_room_missing_fields(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'physiotherapist_id y patient_id son necesarios')

    def test_create_room_invalid_ids(self):
        data = {
            "physiotherapist_id": 999,
            "patient_id": 888
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'ID de fisioterapeuta o paciente inválidos')

    def test_create_room_unauthenticated(self):
        self.client.force_authenticate(user=None)
        data = {
            "physiotherapist_id": self.physio.id,
            "patient_id": self.patient.id
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class RoomJoinViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.plan_blue, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )
        self.plan_gold, _ = Pricing.objects.get_or_create(
            name='Gold', defaults={'price': 99, 'video_limit': 20}
        )

        self.user = AppUser.objects.create_user(
            username="example", dni='12345678A',
            email='ana@example.com', password='pass',
            first_name='Ana', last_name='López',
            postal_code='28001', photo=''
        )

        self.user_no_physio = AppUser.objects.create_user(
            username="example2", dni='44825747N',
            email='ana2@example.com', password='pass2',
            first_name='Ana2', last_name='López2',
            postal_code='28002', photo=''
        )

        self.patient_user = AppUser.objects.create_user(
            username="example3", dni='87393815W',
            email='ana3@example.com', password='pass3',
            first_name='Ana3', last_name='López3',
            postal_code='28003', photo=''
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender='F',
            birth_date='1980-01-01'
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            plan=self.plan_blue,
            birth_date='1980-01-01',
            rating_avg=4.5,
            schedule={
                "exceptions": {},
                "appointments": [
                    {"status": "booked", "end_time": "2025-05-08T08:00:00+0200", "start_time": "2025-05-08T07:00:00+0200"}
                ],
                "weekly_schedule": {
                    "friday": [[{"id": "ws-1743588431925-196", "end": "11:30", "start": "06:00"}]]
                }
            },
            services={"1": {"price": 30, "title": "Primera consulta", "duration": 60}},
            gender='F',
            autonomic_community='MADRID'
        )

        # Cita dentro del rango de tiempo
        start = now() - timedelta(minutes=30)
        end = now() + timedelta(minutes=30)
        self.appointment = Appointment.objects.create(
            start_time=start,
            end_time=end,
            is_online=True,
            service={"name": "Primera consulta"},
            patient=self.patient,
            physiotherapist=self.physio,
            status="booked"
        )

        self.room = Room.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            appointment=self.appointment
        )

        self.url = reverse('join_room', args=[self.room.code])

    def test_physio_joins_own_room(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patient_joins_own_room_in_time_range(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_room_not_found(self):
        self.client.force_authenticate(user=self.user)
        invalid_url = reverse('join_room', args=["INVALIDCODE"])
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_physio_joins_other_physio_room(self):
        other_user = AppUser.objects.create_user(
            username="outsider", dni="11223344B",
            email="other@example.com", password="pass"
        )
        other_physio = Physiotherapist.objects.create(
            user=other_user,
            plan=self.plan_gold,
            birth_date='1985-05-05',
            rating_avg=4.0,
            schedule={}, services={}, gender='M',
            autonomic_community='MADRID'
        )

        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patient_joins_other_patient_room(self):
        other_patient_user = AppUser.objects.create_user(
            username="other_patient", dni="99887766X",
            email="op@example.com", password="pass"
        )
        other_patient = Patient.objects.create(
            user=other_patient_user,
            gender='M',
            birth_date='1990-01-01'
        )

        self.client.force_authenticate(user=other_patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patient_joins_test_room(self):
        self.room.is_test_room = True
        self.room.save()
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patient_joins_out_of_time_window(self):
        # Mover cita fuera del rango
        self.appointment.start_time = now() + timedelta(days=1)
        self.appointment.end_time = now() + timedelta(days=1, hours=1)
        self.appointment.save()

        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('solo está disponible', response.data['detail'])

    def test_unauthenticated_access(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_physio_joins_out_of_time_window(self):
        # Mover la cita fuera del rango permitido
        self.appointment.start_time = now() + timedelta(days=1)
        self.appointment.end_time = now() + timedelta(days=1, hours=1)
        self.appointment.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('solo está disponible', response.data['detail'])

class RoomDeleteViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.plan_blue, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        self.user = AppUser.objects.create_user(
            username="example", dni='12345678A',
            email='ana@example.com', password='pass',
            first_name='Ana', last_name='López',
            postal_code='28001', photo=''
        )

        self.patient_user = AppUser.objects.create_user(
            username="example3", dni='87393815W',
            email='ana3@example.com', password='pass3',
            first_name='Ana3', last_name='López3',
            postal_code='28003', photo=''
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender='F',
            birth_date='1980-01-01'
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            plan=self.plan_blue,
            birth_date='1980-01-01',
            rating_avg=4.5,
            schedule={},
            services={"1": {"price": 30, "title": "Primera consulta", "duration": 60}},
            gender='F',
            autonomic_community='MADRID'
        )

        self.appointment = Appointment.objects.create(
            start_time=now() + timedelta(minutes=10),
            end_time=now() + timedelta(hours=1),
            is_online=True,
            service={"name": "Primera consulta"},
            patient=self.patient,
            physiotherapist=self.physio,
            status="booked"
        )

        self.room = Room.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            appointment=self.appointment
        )

        self.url = reverse('delete_room', args=[self.room.code])

    def test_physio_deletes_room_successfully(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Room.objects.filter(code=self.room.code).exists())

    def test_delete_room_not_found(self):
        self.client.force_authenticate(user=self.user)
        invalid_url = reverse('delete_room', args=["INVALIDCODE"])
        response = self.client.delete(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'Sala no encontrada')

    def test_delete_room_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RoomListViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        self.physio_user = AppUser.objects.create_user(
            username="physio", dni='11111111A',
            email='physio@example.com', password='pass',
            first_name='Fisio', last_name='Test',
            postal_code='12345', photo=''
        )

        self.patient_user = AppUser.objects.create_user(
            username="patient", dni='22222222B',
            email='patient@example.com', password='pass',
            first_name='Paciente', last_name='Test',
            postal_code='12345', photo=''
        )

        self.other_user = AppUser.objects.create_user(
            username="no_profile", dni='33333333C',
            email='no_profile@example.com', password='pass',
            first_name='NoPerfil', last_name='Test',
            postal_code='12345', photo=''
        )

        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            plan=self.plan,
            birth_date='1980-01-01',
            rating_avg=4.5,
            schedule={}, services={}, gender='F',
            autonomic_community='MADRID'
        )

        self.patient = Patient.objects.create(
            user=self.patient_user,
            gender='F',
            birth_date='1985-01-01'
        )

        # Cita actual
        self.current_appointment = Appointment.objects.create(
            start_time=now() - timedelta(minutes=10),
            end_time=now() + timedelta(minutes=50),
            is_online=True,
            service={"name": "Sesión activa"},
            patient=self.patient,
            physiotherapist=self.physio,
            status="booked"
        )

        self.active_room = Room.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            appointment=self.current_appointment
        )

        # Cita antigua (más de 2 horas terminada)
        self.old_appointment = Appointment.objects.create(
            start_time=now() - timedelta(hours=3),
            end_time=now() - timedelta(hours=2, minutes=30),
            is_online=True,
            service={"name": "Sesión antigua"},
            patient=self.patient,
            physiotherapist=self.physio,
            status="finished"
        )

        self.old_room = Room.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            appointment=self.old_appointment
        )

        self.url = reverse('my-rooms')

    def test_physio_sees_only_their_rooms(self):
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Solo debe quedar la sala activa
        rooms = response.data
        self.assertEqual(len(rooms), 1)
        self.assertEqual(rooms[0]['code'], self.active_room.code)

    def test_patient_sees_only_their_rooms(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rooms = response.data
        self.assertEqual(len(rooms), 1)
        self.assertEqual(rooms[0]['code'], self.active_room.code)

    def test_old_rooms_are_deleted(self):
        # Confirmamos que antes de la llamada la sala vieja existe
        self.assertTrue(Room.objects.filter(id=self.old_room.id).exists())

        self.client.force_authenticate(user=self.physio_user)
        self.client.get(self.url)

        # Después de llamar a la vista, la sala vieja debería estar eliminada
        self.assertFalse(Room.objects.filter(id=self.old_room.id).exists())

    def test_user_without_profile_gets_400(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'No se encontraron salas para este usuario')

    def test_unauthenticated_user_gets_401(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TestRoomCreateViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        self.physio_user = AppUser.objects.create_user(
            username="fisio", dni='12345678A',
            email='fisio@example.com', password='pass',
            first_name='Fisio', last_name='Prueba',
            postal_code='28001', photo=''
        )

        self.non_physio_user = AppUser.objects.create_user(
            username="no_fisio", dni='87654321Z',
            email='nofisio@example.com', password='pass2',
            first_name='NoFisio', last_name='Prueba',
            postal_code='28002', photo=''
        )

        self.physio = Physiotherapist.objects.create(
            user=self.physio_user,
            plan=self.plan,
            birth_date='1980-01-01',
            rating_avg=5.0,
            schedule={},
            services={},
            gender='F',
            autonomic_community='MADRID'
        )

        self.url = reverse('create_test_room')

    def test_physio_creates_test_room_successfully(self):
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Room.objects.filter(physiotherapist=self.physio, is_test_room=True).exists())
        self.assertIn("code", response.data)

    def test_physio_with_existing_test_room_gets_existing_code(self):
        Room.objects.create(physiotherapist=self.physio, is_test_room=True)
        self.client.force_authenticate(user=self.physio_user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("code", response.data)
        self.assertEqual(response.data["detail"], "Ya tienes una sala de prueba activa.")

    def test_unauthenticated_user_cannot_create_test_room(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_physio_user_cannot_create_test_room(self):
        self.client.force_authenticate(user=self.non_physio_user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        