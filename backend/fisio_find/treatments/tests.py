from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta, date
from .models import (
    Treatment, Session, SessionTest, SessionTestResponse, 
    Exercise, ExerciseSession, Series, ExerciseLog)
from users.models import AppUser, Physiotherapist, Patient, Pricing
from rest_framework import serializers
from .serializers import (TreatmentSerializer, TreatmentDetailSerializer, ExerciseSerializer, 
                         ExerciseSessionSerializer, SeriesSerializer, SessionSerializer, 
                         ExerciseLogSerializer, SessionTestSerializer, SessionTestResponseSerializer)
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from appointment.models import Appointment, StatusChoices


class TreatmentModelTest(TestCase):
    def setUp(self):
        self.user1 = AppUser.objects.create(username='physio1', dni='12345678A')
        self.user2 = AppUser.objects.create(username='patient1', dni='87654321B')
        self.physio = Physiotherapist.objects.create(
            user=self.user1, 
            birth_date=date(1980, 1, 1) 
        )
        self.patient = Patient.objects.create(
            user=self.user2, 
            birth_date=date(1990, 1, 1) 
        )
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1),
            homework="Estiramientos diarios",
            is_active=True
        )

    def test_treatment_creation(self):
        self.assertEqual(self.treatment.physiotherapist, self.physio)
        self.assertEqual(self.treatment.patient, self.patient)
        self.assertTrue(self.treatment.is_active)
        self.assertIsNotNone(self.treatment.created_at)
        self.assertIsNotNone(self.treatment.updated_at)

    def test_treatment_str(self):
        expected_str = f"Tratamiento para {self.patient.user.username} por {self.physio.user.username}"
        self.assertEqual(str(self.treatment), expected_str)

    def test_clean_end_time_before_start_time(self):
        self.treatment.end_time = self.treatment.start_time - timedelta(hours=1)
        with self.assertRaises(ValidationError):
            self.treatment.clean()

    def test_clean_valid_times(self):
        self.treatment.clean()  # Debería pasar sin errores

class SessionModelTest(TestCase):
    def setUp(self):
        self.user1 = AppUser.objects.create(username='physio2', dni='12345678C')
        self.user2 = AppUser.objects.create(username='patient2', dni='87654321D')
        self.physio = Physiotherapist.objects.create(
            user=self.user1, 
            birth_date=date(1980, 1, 1)
        )
        self.patient = Patient.objects.create(
            user=self.user2, 
            birth_date=date(1990, 1, 1)
        )
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1)
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            name="Sesión de fuerza",
            day_of_week=["Monday", "Wednesday"]
        )

    def test_session_creation(self):
        self.assertEqual(self.session.treatment, self.treatment)
        self.assertEqual(self.session.name, "Sesión de fuerza")
        self.assertEqual(self.session.day_of_week, ["Monday", "Wednesday"])

    def test_session_str(self):
        expected_str = f"Sesión para {self.treatment.patient.user.username} los días Lunes, Miércoles"
        self.assertEqual(str(self.session), expected_str)

class SessionTestModelTest(TestCase):
    def setUp(self):
        self.user1 = AppUser.objects.create(username='physio3', dni='12345678E')
        self.user2 = AppUser.objects.create(username='patient3', dni='87654321F')
        self.physio = Physiotherapist.objects.create(
            user=self.user1, 
            birth_date=date(1980, 1, 1)
        )
        self.patient = Patient.objects.create(
            user=self.user2, 
            birth_date=date(1990, 1, 1)
        )
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1)
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            day_of_week=["Tuesday"]
        )
        self.session_test = SessionTest.objects.create(
            session=self.session,
            question="¿Cómo te sientes hoy?",
            test_type=SessionTest.TEXT,
            scale_labels=None
        )

    def test_session_test_creation(self):
        self.assertEqual(self.session_test.session, self.session)
        self.assertEqual(self.session_test.question, "¿Cómo te sientes hoy?")
        self.assertEqual(self.session_test.test_type, SessionTest.TEXT)

    def test_session_test_str(self):
        expected_str = f"Test de {self.session.treatment.patient.user.username} en sesión {self.session.id}: ¿Cómo te sientes hoy?"
        self.assertEqual(str(self.session_test), expected_str)

class SessionTestResponseModelTest(TestCase):
    def setUp(self):
        self.user1 = AppUser.objects.create(username='physio4', dni='12345678G')
        self.user2 = AppUser.objects.create(username='patient4', dni='87654321H')
        self.physio = Physiotherapist.objects.create(
            user=self.user1, 
            birth_date=date(1980, 1, 1)
        )
        self.patient = Patient.objects.create(
            user=self.user2, 
            birth_date=date(1990, 1, 1)
        )
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1)
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            day_of_week=["Friday"]
        )
        self.session_test = SessionTest.objects.create(
            session=self.session,
            question="¿Dolor en escala 1-10?",
            test_type=SessionTest.SCALE,
            scale_labels={"1": "Nada", "10": "Mucho"}
        )
        self.response = SessionTestResponse.objects.create(
            test=self.session_test,
            patient=self.patient,
            response_scale=5
        )

    def test_response_creation(self):
        self.assertEqual(self.response.test, self.session_test)
        self.assertEqual(self.response.patient, self.patient)
        self.assertEqual(self.response.response_scale, 5)
        self.assertIsNotNone(self.response.submitted_at)

    def test_response_str(self):
        expected_str = f"Respuesta de {self.patient.user.username} al test ¿Dolor en escala 1-10? en sesión {self.session.id}"
        self.assertEqual(str(self.response), expected_str)

class ExerciseModelTest(TestCase):
    def setUp(self):
        self.user = AppUser.objects.create(username='physio5', dni='12345678I')
        self.physio = Physiotherapist.objects.create(
            user=self.user, 
            birth_date=date(1980, 1, 1)
        )
        self.exercise = Exercise.objects.create(
            title="Sentadilla",
            description="Ejercicio para piernas",
            area="LOWER_BODY",
            physiotherapist=self.physio
        )

    def test_exercise_creation(self):
        self.assertEqual(self.exercise.title, "Sentadilla")
        self.assertEqual(self.exercise.area, "LOWER_BODY")
        self.assertEqual(self.exercise.physiotherapist, self.physio)

    def test_exercise_str(self):
        self.assertEqual(str(self.exercise), "Sentadilla")

class ExerciseSessionModelTest(TestCase):
    def setUp(self):
        self.user1 = AppUser.objects.create(username='physio6', dni='12345678J')
        self.user2 = AppUser.objects.create(username='patient6', dni='87654321K')
        self.physio = Physiotherapist.objects.create(
            user=self.user1, 
            birth_date=date(1980, 1, 1)
        )
        self.patient = Patient.objects.create(
            user=self.user2, 
            birth_date=date(1990, 1, 1)
        )
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1)
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            day_of_week=["Monday"]
        )
        self.exercise = Exercise.objects.create(
            title="Press de banca",
            area="CHEST",
            physiotherapist=self.physio
        )
        self.exercise_session = ExerciseSession.objects.create(
            exercise=self.exercise,
            session=self.session
        )

    def test_exercise_session_creation(self):
        self.assertEqual(self.exercise_session.exercise, self.exercise)
        self.assertEqual(self.exercise_session.session, self.session)

    def test_exercise_session_str(self):
        expected_str = f"{self.exercise.title} en sesión {self.session.id}"
        self.assertEqual(str(self.exercise_session), expected_str)

class SeriesModelTest(TestCase):
    def setUp(self):
        self.user1 = AppUser.objects.create(username='physio7', dni='12345678L')
        self.user2 = AppUser.objects.create(username='patient7', dni='87654321M')
        self.physio = Physiotherapist.objects.create(
            user=self.user1, 
            birth_date=date(1980, 1, 1)
        )
        self.patient = Patient.objects.create(
            user=self.user2, 
            birth_date=date(1990, 1, 1)
        )
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1)
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            day_of_week=["Monday"]
        )
        self.exercise = Exercise.objects.create(
            title="Curl de bíceps",
            area="ARM",
            physiotherapist=self.physio
        )
        self.exercise_session = ExerciseSession.objects.create(
            exercise=self.exercise,
            session=self.session
        )
        self.series = Series.objects.create(
            exercise_session=self.exercise_session,
            series_number=1,
            repetitions=10,
            weight=15.0
        )

    def test_series_creation(self):
        self.assertEqual(self.series.exercise_session, self.exercise_session)
        self.assertEqual(self.series.series_number, 1)
        self.assertEqual(self.series.repetitions, 10)
        self.assertEqual(self.series.weight, 15.0)

    def test_series_str(self):
        expected_str = f"Serie 1 de {self.exercise_session.exercise.title} (10 reps, 15.0 kg)"
        self.assertEqual(str(self.series), expected_str)

    def test_series_negative_repetitions(self):
        self.series.repetitions = -1
        with self.assertRaises(ValidationError):
            self.series.clean()

    def test_series_no_metrics(self):
        self.series.weight = None
        self.series.time = None
        self.series.distance = None
        with self.assertRaises(ValidationError):
            self.series.clean()

class ExerciseLogModelTest(TestCase):
    def setUp(self):
        self.user1 = AppUser.objects.create(username='physio8', dni='12345678N')
        self.user2 = AppUser.objects.create(username='patient8', dni='87654321O')
        self.physio = Physiotherapist.objects.create(
            user=self.user1, 
            birth_date=date(1980, 1, 1)
        )
        self.patient = Patient.objects.create(
            user=self.user2, 
            birth_date=date(1990, 1, 1)
        )
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physio,
            patient=self.patient,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=1)
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            day_of_week=["Monday"]
        )
        self.exercise = Exercise.objects.create(
            title="Sentadilla",
            area="LOWER_BODY",
            physiotherapist=self.physio
        )
        self.exercise_session = ExerciseSession.objects.create(
            exercise=self.exercise,
            session=self.session
        )
        self.series = Series.objects.create(
            exercise_session=self.exercise_session,
            series_number=1,
            repetitions=12,
            weight=20.0
        )
        self.exercise_log = ExerciseLog.objects.create(
            series=self.series,
            patient=self.patient,
            repetitions_done=10,
            weight_done=18.0,
            notes="Buen esfuerzo"
        )

    def test_exercise_log_creation(self):
        self.assertEqual(self.exercise_log.series, self.series)
        self.assertEqual(self.exercise_log.patient, self.patient)
        self.assertEqual(self.exercise_log.repetitions_done, 10)
        self.assertEqual(self.exercise_log.weight_done, 18.0)
        self.assertEqual(self.exercise_log.notes, "Buen esfuerzo")
        self.assertIsNotNone(self.exercise_log.date)

    def test_exercise_log_str(self):
        expected_str = f"Log de {self.patient.user.username} en serie {self.series.series_number}"
        self.assertEqual(str(self.exercise_log), expected_str)


class TreatmentSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10),
            homework="Test homework",
            is_active=True
        )

    def test_treatment_serializer_valid_data(self):
        serializer = TreatmentSerializer(instance=self.treatment)
        data = serializer.data
        self.assertEqual(data['id'], self.treatment.id)
        self.assertEqual(data['physiotherapist'], self.treatment.physiotherapist.id)
        self.assertEqual(data['patient'], self.treatment.patient.id)
        self.assertEqual(data['homework'], "Test homework")
        self.assertTrue(data['is_active'])

    def test_treatment_serializer_validation_start_time_past(self):
        data = {
            'physiotherapist': self.physiotherapist.id,
            'patient': self.patient.id,
            'start_time': timezone.now() - timedelta(days=1),
            'end_time': timezone.now() + timedelta(days=5),
            'homework': 'Test'
        }
        serializer = TreatmentSerializer(data=data)
        with self.assertRaisesMessage(serializers.ValidationError, 
            "La fecha de inicio no puede ser anterior a la fecha actual"):
            serializer.is_valid(raise_exception=True)

    def test_treatment_serializer_validation_end_before_start(self):
        data = {
            'physiotherapist': self.physiotherapist.id,
            'patient': self.patient.id,
            'start_time': timezone.now() + timedelta(days=5),
            'end_time': timezone.now() + timedelta(days=2),
            'homework': 'Test'
        }
        serializer = TreatmentSerializer(data=data)
        with self.assertRaisesMessage(serializers.ValidationError, 
            "La fecha de finalización debe ser posterior a la fecha de inicio"):
            serializer.is_valid(raise_exception=True)

    def test_treatment_serializer_partial_update_end_time(self):
        data = {'end_time': timezone.now() + timedelta(days=15)}
        serializer = TreatmentSerializer(instance=self.treatment, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        self.assertGreater(serializer.validated_data['end_time'], self.treatment.start_time)

class TreatmentDetailSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10),
            homework="Test homework",
            is_active=True
        )

    def test_treatment_detail_serializer(self):
        serializer = TreatmentDetailSerializer(instance=self.treatment)
        data = serializer.data
        self.assertIn('physiotherapist', data)
        self.assertEqual(data['physiotherapist']['user']['first_name'], "Ana")
        self.assertIn('patient', data)
        self.assertEqual(data['patient']['user']['first_name'], "Juan")
        self.assertEqual(data['id'], self.treatment.id)
    
    def test_treatment_detail_serializer_create(self):
        session = Session.objects.create(
            name="Test Session",
            treatment=self.treatment,  # Existing treatment for setup
            day_of_week=["Monday"]
        )
        data = {
            'physiotherapist_id': self.physiotherapist.id,
            'patient_id': self.patient.id,
            'start_time': timezone.now() + timedelta(days=1),
            'end_time': timezone.now() + timedelta(days=5),
            'homework': 'Test',
            'sessions': [session.id]  # Required related field
        }
        serializer = TreatmentDetailSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        treatment = serializer.save()
        self.assertEqual(treatment.physiotherapist, self.physiotherapist)
        self.assertEqual(treatment.patient, self.patient)

class ExerciseSerializerTests(TestCase):
    def setUp(self):
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

    def test_exercise_serializer_valid_data(self):
        exercise = Exercise.objects.create(
            title="Test Exercise",
            description="Test Description",
            area="Legs",
            physiotherapist=self.physiotherapist
        )
        serializer = ExerciseSerializer(instance=exercise)
        data = serializer.data
        self.assertEqual(data['title'], "Test Exercise")
        self.assertEqual(data['description'], "Test Description")
        self.assertEqual(data['area'], "Legs")
        self.assertEqual(data['physiotherapist'], self.physiotherapist.id)

    def test_exercise_serializer_create(self):
        data = {
            'title': 'New Exercise',
            'description': 'New Description',
            'area': 'ARM',
            'physiotherapist': self.physiotherapist.id
        }
        serializer = ExerciseSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.errors)  # Imprimir errores para depuración
        self.assertTrue(serializer.is_valid(), f"Errores de validación: {serializer.errors}")
        exercise = serializer.save()
        self.assertEqual(exercise.title, "New Exercise")

class ExerciseSessionSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10)
        )
        self.exercise = Exercise.objects.create(title="Test", physiotherapist=self.physiotherapist)
        self.session = Session.objects.create(name="Test Session", treatment=self.treatment, day_of_week=["MON"])

    def test_exercise_session_serializer(self):
        exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        serializer = ExerciseSessionSerializer(instance=exercise_session)
        data = serializer.data
        self.assertEqual(data['exercise'], self.exercise.id)
        self.assertEqual(data['session'], self.session.id)

class SeriesSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10)
        )
        self.exercise = Exercise.objects.create(title="Test", physiotherapist=self.physiotherapist)
        self.session = Session.objects.create(name="Test Session", treatment=self.treatment, day_of_week=["MON"])
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)

    def test_series_serializer_valid_data(self):
        series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)
        serializer = SeriesSerializer(instance=series)
        data = serializer.data
        self.assertEqual(data['repetitions'], 10)
        self.assertEqual(data['weight'], 5.0)

    def test_series_serializer_validation_no_metrics(self):
        data = {'exercise_session': self.exercise_session.id, 'series_number': 1, 'repetitions': 10}
        serializer = SeriesSerializer(data=data)
        with self.assertRaisesMessage(serializers.ValidationError, "Debe haber al menos una métrica"):
            serializer.is_valid(raise_exception=True)

def test_series_serializer_validation_negative_repetitions(self):
    data = {'exercise_session': self.exercise_session.id, 'series_number': 1, 'repetitions': -1, 'weight': 5.0}
    serializer = SeriesSerializer(data=data)
    with self.assertRaisesMessage(serializers.ValidationError, 
        "Asegúrese de que este valor es mayor o igual a 0."):
        serializer.is_valid(raise_exception=True)

class SessionSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10)
        )
        self.session = Session.objects.create(name="Test Session", treatment=self.treatment, day_of_week=["MON"])

    def test_session_serializer_valid_data(self):
        serializer = SessionSerializer(instance=self.session)
        data = serializer.data
        self.assertEqual(data['name'], "Test Session")
        self.assertEqual(data['day_of_week'], ["MON"])

class ExerciseLogSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10)
        )
        self.exercise = Exercise.objects.create(title="Test", physiotherapist=self.physiotherapist)
        self.session = Session.objects.create(name="Test Session", treatment=self.treatment, day_of_week=["MON"])
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)

    def test_exercise_log_serializer(self):
        log = ExerciseLog.objects.create(series=self.series, patient=self.patient, repetitions_done=8)
        serializer = ExerciseLogSerializer(instance=log)
        data = serializer.data
        self.assertEqual(data['series'], self.series.id)
        self.assertEqual(data['repetitions_done'], 8)

class SessionTestSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10)
        )
        self.session = Session.objects.create(name="Test Session", treatment=self.treatment, day_of_week=["MON"])

    def test_session_test_serializer(self):
        test = SessionTest.objects.create(session=self.session, question="Test question", test_type=SessionTest.TEXT)
        serializer = SessionTestSerializer(instance=test)
        data = serializer.data
        self.assertEqual(data['question'], "Test question")
        self.assertEqual(data['test_type'], SessionTest.TEXT)

class SessionTestResponseSerializerTests(TestCase):
    def setUp(self):
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
        self.treatment = Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=10)
        )
        self.session = Session.objects.create(name="Test Session", treatment=self.treatment, day_of_week=["MON"])

    def test_session_test_response_serializer_text_valid(self):
        test = SessionTest.objects.create(session=self.session, question="How do you feel?", test_type=SessionTest.TEXT)
        data = {'test': test.id, 'response_text': 'Good'}
        serializer = SessionTestResponseSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_session_test_response_serializer_text_with_scale(self):
        test = SessionTest.objects.create(session=self.session, question="How do you feel?", test_type=SessionTest.TEXT)
        data = {'test': test.id, 'response_text': 'Good', 'response_scale': 5}
        serializer = SessionTestResponseSerializer(data=data)
        with self.assertRaisesMessage(serializers.ValidationError, "No debe incluir respuesta numérica en un test de texto"):
            serializer.is_valid(raise_exception=True)

    def test_session_test_response_serializer_scale_valid(self):
        test = SessionTest.objects.create(
            session=self.session,
            question="Rate your pain",
            test_type=SessionTest.SCALE,
            scale_labels={'1': 'Low', '5': 'High'} 
        )
        data = {
            'test': test.id,
            'patient': self.patient.id,  
            'response_scale': 3,         
            'response_text': None        
        }
        serializer = SessionTestResponseSerializer(data=data)
        # Imprimir errores Ascensor para depuración
        if not serializer.is_valid():
            print(serializer.errors)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_session_test_response_serializer_scale_invalid_range(self):
        test = SessionTest.objects.create(
            session=self.session,
            question="Rate your pain",
            test_type=SessionTest.SCALE,
            scale_labels={'1': 'Low', '5': 'High'}
        )
        data = {'test': test.id, 'response_scale': 6}
        serializer = SessionTestResponseSerializer(data=data)
        with self.assertRaisesMessage(serializers.ValidationError, "El valor debe estar entre 1 y 5"):
            serializer.is_valid(raise_exception=True)

    def test_session_test_response_serializer_scale_with_text(self):
        test = SessionTest.objects.create(
            session=self.session,
            question="Rate your pain",
            test_type=SessionTest.SCALE,
            scale_labels={'1': 'Low', '5': 'High'}
        )
        data = {'test': test.id, 'response_scale': 3, 'response_text': 'Test'}
        serializer = SessionTestResponseSerializer(data=data)
        with self.assertRaisesMessage(serializers.ValidationError, "No debe incluir texto en un test de escala"):
            serializer.is_valid(raise_exception=True)


class TreatmentCreateViewTests(APITestCase):
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
        # Use timezone-aware datetimes
        now = timezone.now()
        self.appointment = Appointment.objects.create(
            patient=self.patient,
            physiotherapist=self.physiotherapist,
            start_time=now - timedelta(hours=2),  # Past start time for a finished appointment
            end_time=now - timedelta(hours=1),    # Past end time
            is_online=False,
            service={"type": "Consulta inicial", "duration": 60},
            status=StatusChoices.FINISHED,  # Matches 'finished' in view
            alternatives=None
        )
        self.url = '/api/treatments/create/'

    def test_create_treatment_success(self):
        self.client.force_authenticate(user=self.user)
        now = timezone.now()
        data = {
            'appointment_id': self.appointment.id,
            'homework': 'Tratamiento de rodilla',  # Changed from 'name' to 'homework'
            'is_active': True,
            'start_time': now + timedelta(days=1),  # Future start time
            'end_time': now + timedelta(days=2),    # Future end time
        }
        response = self.client.post(self.url, data, format='json')
        print("Response data:", response.data)  # Keep for debugging
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Treatment.objects.count(), 1)
        treatment = Treatment.objects.first()
        self.assertEqual(treatment.physiotherapist, self.physiotherapist)
        self.assertEqual(treatment.patient, self.patient)

    def test_create_treatment_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        now = timezone.now()
        data = {
            'appointment_id': self.appointment.id,
            'homework': 'Tratamiento de rodilla',
            'is_active': True,
            'start_time': now + timedelta(days=1),
            'end_time': now + timedelta(days=2),
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_treatment_missing_appointment(self):
        self.client.force_authenticate(user=self.user)
        now = timezone.now()
        data = {
            'homework': 'Tratamiento de rodilla',
            'is_active': True,
            'start_time': now + timedelta(days=1),
            'end_time': now + timedelta(days=2),
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_treatment_not_finished(self):
        # Create a non-finished appointment
        now = timezone.now()
        not_finished_appointment = Appointment.objects.create(
            patient=self.patient,
            physiotherapist=self.physiotherapist,
            start_time=now + timedelta(hours=1),  # Future start time
            end_time=now + timedelta(hours=2),    # Future end time
            is_online=True,
            service={"type": "Seguimiento", "duration": 30},
            status=StatusChoices.BOOKED  
        )
        self.client.force_authenticate(user=self.user)
        data = {
            'appointment_id': not_finished_appointment.id,
            'homework': 'Tratamiento de rodilla',
            'is_active': True,
            'start_time': now + timedelta(days=1),
            'end_time': now + timedelta(days=2),
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class PhysiotherapistTreatmentListViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.url = '/api/treatments/physio/'  # Updated URL with /api/ prefix

    def test_list_treatments_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['homework'], 'Tratamiento 1')  # Changed 'name' to 'homework'

    def test_list_treatments_filter_active(self):
        self.client.force_authenticate(user=self.user)
        now = timezone.now()
        Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 2',  # Changed from 'name' to 'homework'
            is_active=False,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        response = self.client.get(self.url + '?is_active=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['is_active'], True)

    def test_list_treatments_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class PatientTreatmentListViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.url = '/api/treatments/patient/'  # Updated URL with /api/ prefix

    def test_list_treatments_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['homework'], 'Tratamiento 1')  # Changed 'name' to 'homework'

    def test_list_treatments_filter_active(self):
        self.client.force_authenticate(user=self.patient_user)
        now = timezone.now()
        Treatment.objects.create(
            physiotherapist=self.physiotherapist,
            patient=self.patient,
            homework='Tratamiento 2',  # Changed from 'name' to 'homework'
            is_active=False,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        response = self.client.get(self.url + '?is_active=false')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['is_active'], False)

    def test_list_treatments_no_permission(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TreatmentDetailViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.url = f'/api/treatments/{self.treatment.id}/'  # Updated URL with /api/ prefix

    def test_get_treatment_success_physio(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['homework'], 'Tratamiento 1')  # Changed 'name' to 'homework'

    def test_get_treatment_success_patient(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['homework'], 'Tratamiento 1')  # Changed 'name' to 'homework'

    def test_update_treatment_success(self):
        self.client.force_authenticate(user=self.user)
        now = timezone.now()
        data = {
            'homework': 'Tratamiento Actualizado',  # Changed 'name' to 'homework'
            'is_active': False,
            'start_time': now + timedelta(days=1),
            'end_time': now + timedelta(days=2),
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.treatment.refresh_from_db()
        self.assertEqual(self.treatment.homework, 'Tratamiento Actualizado')  # Changed 'name' to 'homework'
        self.assertFalse(self.treatment.is_active)

    def test_update_treatment_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        now = timezone.now()
        data = {
            'homework': 'Tratamiento Actualizado',  # Changed 'name' to 'homework'
            'start_time': now + timedelta(days=1),
            'end_time': now + timedelta(days=2),
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_treatment_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Treatment.objects.count(), 0)

class SessionTestResponseViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            name='Sesión 1',
            day_of_week=['Monday']
        )
        self.test = SessionTest.objects.create(
            session=self.session,
            question='Rate your pain',
            test_type=SessionTest.SCALE,
            scale_labels={'1': 'Low', '5': 'High'}
        )
        self.url = f'/api/treatments/sessions/{self.session.id}/test/respond/'  # Updated URL with /api/ prefix

    def test_respond_test_success(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {
            'response_scale': 3,
            'response_text': None
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SessionTestResponse.objects.count(), 1)
        response_obj = SessionTestResponse.objects.first()
        self.assertEqual(response_obj.response_scale, 3)
        self.assertEqual(response_obj.patient, self.patient)
        self.assertEqual(response_obj.test, self.test)

    def test_respond_test_no_permission(self):
        self.client.force_authenticate(user=self.user)
        data = {'response_scale': 3}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_respond_test_invalid_scale(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'response_scale': 6}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('response_scale', response.data)

class SessionCreateViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(
            treatment=self.treatment,
            name='Sesión 1',
            day_of_week=['Monday']
        )
        self.test = SessionTest.objects.create(
            session=self.session,
            question='Rate your pain',
            test_type=SessionTest.SCALE,
            scale_labels={'1': 'Low', '5': 'High'}
        )
        self.url = f'/api/treatments/{self.treatment.id}/sessions/create/'

    def test_create_session_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'name': 'Session 1', 'day_of_week': ['Monday']}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Session.objects.count(), 2)
        self.assertEqual(Session.objects.first().name, 'Sesión 1')

    def test_create_session_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'name': 'Session 1', 'day_of_week': ['Monday']}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_session_inactive_treatment(self):
        self.treatment.is_active = False
        self.treatment.save()
        self.client.force_authenticate(user=self.user)
        data = {'name': 'Session 1', 'day_of_week': ['Monday']}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_session_invalid_data(self):
        self.client.force_authenticate(user=self.user)
        data = {'name': ''}  # Missing day_of_week
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class SessionListViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.url = f'/api/treatments/{self.treatment.id}/sessions/'

    def test_list_sessions_physio_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Session 1')

    def test_list_sessions_patient_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Session 1')

    def test_list_sessions_no_permission(self):
        other_user = AppUser.objects.create_user(username="other", email="other@example.com", password="testpass")
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SessionDetailViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.url = f'/api/treatments/sessions/{self.session.id}/'

    def test_get_session_physio_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Session 1')

    def test_get_session_patient_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Session 1')

    def test_update_session_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'name': 'Updated Session', 'day_of_week': ['Tuesday']}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.session.refresh_from_db()
        self.assertEqual(self.session.name, 'Updated Session')

    def test_update_session_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'name': 'Updated Session'}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_session_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Session.objects.count(), 0)

class SessionTestCreateOrUpdateViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.url = f'/api/treatments/sessions/{self.session.id}/test/'

    def test_create_test_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'question': 'Rate your pain', 'test_type': 'SCALE', 'scale_labels': {'1': 'Low', '5': 'High'}}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SessionTest.objects.count(), 1)

    def test_update_test_success(self):
        SessionTest.objects.create(session=self.session, question="Initial", test_type="TEXT")
        self.client.force_authenticate(user=self.user)
        data = {'question': 'Updated question', 'test_type': 'SCALE', 'scale_labels': {'1': 'Low', '5': 'High'}}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.session.test.refresh_from_db()
        self.assertEqual(self.session.test.question, 'Updated question')

    def test_create_test_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'question': 'Rate your pain', 'test_type': 'SCALE'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SessionTestRetrieveViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.test = SessionTest.objects.create(session=self.session, question="Rate your pain", test_type="SCALE", scale_labels={'1': 'Low', '5': 'High'})
        self.url = f'/api/treatments/sessions/{self.session.id}/test/view/'

    def test_retrieve_test_physio_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['question'], 'Rate your pain')

    def test_retrieve_test_patient_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['question'], 'Rate your pain')

    def test_retrieve_test_no_permission(self):
        other_user = AppUser.objects.create_user(username="other", email="other@example.com", password="testpass")
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SessionTestDeleteViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.test = SessionTest.objects.create(session=self.session, question="Rate your pain", test_type="SCALE", scale_labels={'1': 'Low', '5': 'High'})
        self.url = f'/api/treatments/sessions/{self.session.id}/test/delete/'

    def test_delete_test_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(SessionTest.objects.count(), 0)

    def test_delete_test_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SessionTestResponseViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.test = SessionTest.objects.create(session=self.session, question="Rate your pain", test_type="SCALE", scale_labels={'1': 'Low', '5': 'High'})
        self.url = f'/api/treatments/sessions/{self.session.id}/test/respond/'

    def test_respond_test_success(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'response_scale': 3, 'response_text': None}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SessionTestResponse.objects.count(), 1)
        response_obj = SessionTestResponse.objects.first()
        self.assertEqual(response_obj.response_scale, 3)

    def test_respond_test_no_permission(self):
        self.client.force_authenticate(user=self.user)
        data = {'response_scale': 3}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_respond_test_invalid_scale(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'response_scale': 6}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class SessionTestResponseListViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.test = SessionTest.objects.create(session=self.session, question="Rate your pain", test_type="SCALE", scale_labels={'1': 'Low', '5': 'High'})
        SessionTestResponse.objects.create(test=self.test, patient=self.patient, response_scale=3)
        self.url = f'/api/treatments/sessions/{self.session.id}/test/responses/'

    def test_list_responses_physio_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['response_scale'], 3)

    def test_list_responses_patient_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_responses_no_permission(self):
        other_user = AppUser.objects.create_user(username="other", email="other@example.com", password="testpass")
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ExerciseCreateViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.url = '/api/treatments/exercises/create/'

    def test_create_exercise_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'title': 'Exercise 1', 'description': 'Test exercise', 'area': 'Legs'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Exercise.objects.count(), 1)
        self.assertEqual(Exercise.objects.first().title, 'Exercise 1')

    def test_create_exercise_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'title': 'Exercise 1', 'description': 'Test exercise', 'area': 'Legs'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ExerciseListViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.url = '/api/treatments/exercises/'

    def test_list_exercises_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Exercise 1')

    def test_list_exercises_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ExerciseDetailViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.url = f'/api/treatments/exercises/{self.exercise.id}/'

    def test_get_exercise_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Exercise 1')

    def test_update_exercise_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'title': 'Updated Exercise', 'description': 'Updated'}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.exercise.refresh_from_db()
        self.assertEqual(self.exercise.title, 'Updated Exercise')

    def test_delete_exercise_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Exercise.objects.count(), 0)

    def test_exercise_no_permission(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ExerciseSearchViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        Exercise.objects.create(physiotherapist=self.physiotherapist, title="Leg Stretch", description="Test", area="Legs")
        self.url = '/api/treatments/exercises/search/'

    def test_search_exercise_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url + '?query=Leg')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Leg Stretch')

    def test_search_exercise_no_query(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class ExerciseByAreaViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        Exercise.objects.create(physiotherapist=self.physiotherapist, title="Leg Stretch", description="Test", area="Legs")
        self.url = '/api/treatments/exercises/by-area/'

    def test_exercise_by_area_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['area'], 'Legs')
        self.assertEqual(response.data[0]['exercises'][0]['title'], 'Leg Stretch')

    def test_exercise_by_area_no_permission(self):
        self.client.force_authenticate(user=AppUser.objects.create_user(username="other", email="other@example.com", password="testpass"))
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class AssignExerciseToSessionViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.url = f'/api/treatments/sessions/{self.session.id}/assign-exercise/'

    def test_assign_exercise_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'exercise': self.exercise.id}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ExerciseSession.objects.count(), 1)

    def test_assign_exercise_no_permission(self):
        self.client.force_authenticate(user=self.patient.user)
        data = {'exercise': self.exercise.id}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class UnassignExerciseFromSessionViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.url = f'/api/treatments/exercise-sessions/{self.exercise_session.id}/unassign-exercise/'

    def test_unassign_exercise_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ExerciseSession.objects.count(), 0)

    def test_unassign_exercise_no_permission(self):
        self.client.force_authenticate(user=self.patient.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SeriesCreateViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.url = f'/api/treatments/exercise-sessions/{self.exercise_session.id}/series/create/'

    def test_create_series_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'series_number': 1, 'repetitions': 10, 'weight': 5.0}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Series.objects.count(), 1)

    def test_create_series_no_permission(self):
        self.client.force_authenticate(user=self.patient.user)
        data = {'series_number': 1, 'repetitions': 10, 'weight': 5.0}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_series_max_limit(self):
        self.client.force_authenticate(user=self.user)
        for i in range(10):
            Series.objects.create(exercise_session=self.exercise_session, series_number=i+1, repetitions=10, weight=5.0)
        data = {'series_number': 11, 'repetitions': 10, 'weight': 5.0}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class SeriesDetailViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)
        self.url = f'/api/treatments/series/{self.series.id}/'

    def test_get_series_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['repetitions'], 10)

    def test_update_series_success(self):
        self.client.force_authenticate(user=self.user)
        data = {'repetitions': 15}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.series.refresh_from_db()
        self.assertEqual(self.series.repetitions, 15)

    def test_delete_series_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Series.objects.count(), 0)

    def test_series_no_permission(self):
        self.client.force_authenticate(user=self.patient.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SeriesDeleteViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)
        self.url = f'/api/treatments/series/{self.series.id}/delete/'

    def test_delete_series_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Series.objects.count(), 0)

    def test_delete_series_no_permission(self):
        self.client.force_authenticate(user=self.patient.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SeriesListByExerciseSessionViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)
        self.url = f'/api/treatments/exercise-sessions/{self.exercise_session.id}/series/'

    def test_list_series_physio_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['repetitions'], 10)

    def test_list_series_patient_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class ExerciseListBySessionViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.url = f'/api/treatments/sessions/{self.session.id}/exercises/'

    def test_list_exercises_physio_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['exercise'], self.exercise.id)

    def test_list_exercises_patient_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_exercises_no_permission(self):
        other_user = AppUser.objects.create_user(username="other", email="other@example.com", password="testpass")
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ExerciseLogCreateViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)
        self.url = '/api/treatments/exercise-logs/create/'

    def test_create_exercise_log_success(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'series': self.series.id, 'repetitions_done': 8, 'weight_done': 4.5}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ExerciseLog.objects.count(), 1)

    def test_create_exercise_log_no_permission(self):
        self.client.force_authenticate(user=self.user)
        data = {'series': self.series.id, 'repetitions_done': 8}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ExerciseLogListViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)
        self.log = ExerciseLog.objects.create(series=self.series, patient=self.patient, repetitions_done=8, weight_done=4.5)
        self.url = f'/api/treatments/exercise-sessions/{self.exercise_session.id}/logs/'

    def test_list_exercise_logs_physio_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['repetitions_done'], 8)

    def test_list_exercise_logs_patient_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_exercise_logs_no_permission(self):
        other_user = AppUser.objects.create_user(username="other", email="other@example.com", password="testpass")
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ExerciseLogDetailViewTests(APITestCase):
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
            homework='Tratamiento 1',  # Changed from 'name' to 'homework'
            is_active=True,
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=2),
        )
        self.session = Session.objects.create(treatment=self.treatment, name="Session 1", day_of_week=['Monday'])
        self.exercise = Exercise.objects.create(physiotherapist=self.physiotherapist, title="Exercise 1", description="Test", area="Legs")
        self.exercise_session = ExerciseSession.objects.create(exercise=self.exercise, session=self.session)
        self.series = Series.objects.create(exercise_session=self.exercise_session, series_number=1, repetitions=10, weight=5.0)
        self.log = ExerciseLog.objects.create(series=self.series, patient=self.patient, repetitions_done=8, weight_done=4.5)
        self.url = f'/api/treatments/exercise-logs/{self.log.id}/'

    def test_get_exercise_log_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['repetitions_done'], 8)

    def test_update_exercise_log_success(self):
        self.client.force_authenticate(user=self.patient_user)
        data = {'repetitions_done': 9}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.log.refresh_from_db()
        self.assertEqual(self.log.repetitions_done, 9)

    def test_delete_exercise_log_success(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ExerciseLog.objects.count(), 0)

    def test_exercise_log_no_permission(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)