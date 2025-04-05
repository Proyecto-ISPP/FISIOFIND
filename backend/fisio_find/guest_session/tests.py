from django.test import TestCase

from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import AppUser
from users.models import Physiotherapist, Specialization
from users.models import Pricing
from django.utils import timezone

class PhysioSearchTests(APITestCase):
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

        cls.spec1 = Specialization.objects.create(name='Rehabilitación')
        cls.spec2 = Specialization.objects.create(name='Deportiva')
        cls.physio.specializations.set([cls.spec1, cls.spec2])

        # Fisio Gold 1
        cls.gold_user_1 = AppUser.objects.create_user(username="gold1", email='gold1@example.com', password='pass', dni='11111111B', first_name='Carlos', last_name='Pérez', postal_code='28001')
        cls.gold_physio_1 = Physiotherapist.objects.create(
            user=cls.gold_user_1,
            plan=cls.plan_gold,
            schedule=cls.physio.schedule,
            services={"1": {"price": 30}},
            gender='M',
            birth_date='1980-01-01',
            autonomic_community='MADRID'
        )
        cls.gold_physio_1.specializations.set([cls.spec1])

        # Fisio Gold 2
        cls.gold_user_2 = AppUser.objects.create_user(username="gold2", email='gold2@example.com', password='pass', dni='22222222C', first_name='Laura', last_name='Ruiz', postal_code='28001')
        cls.gold_physio_2 = Physiotherapist.objects.create(
            user=cls.gold_user_2,
            plan=cls.plan_gold,
            schedule=cls.physio.schedule,
            services={"1": {"price": 30}},
            gender='F',
            birth_date='1980-01-01',
            autonomic_community='MADRID'
        )
        cls.gold_physio_2.specializations.set([cls.spec1])


    def test_search_by_name(self):
        url = reverse('search-physios')
        response = self.client.get(url, {'q': 'Ana'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_search_missing_query(self):
        url = reverse('search-physios')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

    def test_list_specializations(self):
        url = reverse('specializations')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Rehabilitación', response.data)

    def test_physios_with_valid_specialization(self):
        url = reverse('physios-with-specializations')
        response = self.client.get(url, {'specialization': 'Rehabilitación'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_physios_with_invalid_specialization(self):
        url = reverse('physios-with-specializations')
        response = self.client.get(url, {'specialization': 'NoExiste'})
        self.assertEqual(response.status_code, 404)

    def test_physios_with_missing_specialization_param(self):
        url = reverse('physios-with-specializations')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
    
    def test_advanced_search_exact_match(self):
        url = reverse('advanced-search')
        response = self.client.post(url, {
            'specialization': 'Rehabilitación',
            'gender': 'Female',
            'postalCode': '28001',
            'maxPrice': 40,
            'schedule': 'mañana',
            'name': 'Ana'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['exactMatches']), 1)
    
    def test_advanced_search_suggested_match(self):
        url = reverse('advanced-search')
        response = self.client.post(url, {
            'specialization': 'NoExiste',
            'gender': 'female',
            'postalCode': '28001',
            'maxPrice': 50,
            'schedule': 'mañana',
            'name': 'Ana'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['exactMatches']), 0)
        self.assertIn('suggestedMatches', response.data)

    def test_weighted_shuffle_distribution_20_physios(self):
        # Crea 20 fisios, llama a la funcion de busqueda avanzada un
        # numero de repeticiones y comprueba que aparezcan
        # mas fisio gold que blue
        from collections import Counter

        gold_plan = Pricing.objects.get_or_create(name='Gold', defaults={'price': 99})[0]
        blue_plan = Pricing.objects.get_or_create(name='blue', defaults={'price': 10})[0]

        spec = Specialization.objects.get_or_create(name='TestSpec')[0]
        schedule = {
            "weekly_schedule": {
                "monday": [[{"start": "06:00", "end": "14:00"}]]
            },
            "appointments": [],
            "exceptions": {}
        }

        # Crear 10 Gold y 10 Blue
        for i in range(10):
            create_physio(user_id=100 + i, plan=gold_plan, spec=spec, schedule=schedule)
            create_physio(user_id=200 + i, plan=blue_plan, spec=spec, schedule=schedule)

        url = reverse('advanced-search')
        reps = 100
        gold_total = 0
        blue_total = 0

        for _ in range(reps):
            response = self.client.post(url, {
                'postalCode': '99999',
            }, format='json')
            self.assertEqual(response.status_code, 200)
            suggested = response.data.get('exactMatches', [])
            self.assertLessEqual(len(suggested), 12)

            for physio in suggested:
                pid = physio['id']
                if Physiotherapist.objects.get(id=pid).plan.name == 'Gold':
                    gold_total += 1
                else:
                    blue_total += 1

        avg_gold = gold_total / reps
        avg_blue = blue_total / reps

        # Confirmamos que Gold aparece un poco mas que Blue
        # (como es random tampoco se quiere hacer un test muy estricto)
        self.assertGreater(avg_gold, 1.25 * avg_blue)


def create_physio(user_id, plan, spec, schedule, postal_code='99999'):
    user = AppUser.objects.create_user(
        username=f"user{user_id}",
        email=f"user{user_id}@example.com",
        dni=f"{user_id:08d}A",
        password='pass',
        first_name=f"Nombre{user_id}",
        last_name="Apellido",
        postal_code=postal_code
    )
    physio = Physiotherapist.objects.create(
        user=user,
        plan=plan,
        rating_avg=4.0,
        birth_date='1980-01-01',
        schedule=schedule,
        services={"1": {"price": 30}},
        gender='F',
        autonomic_community='MADRID'
    )
    physio.specializations.set([spec])
    return physio
