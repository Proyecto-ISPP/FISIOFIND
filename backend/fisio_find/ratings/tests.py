from django.test import TestCase

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from ratings.models import Rating
from users.models import AppUser, Physiotherapist, Pricing
from ratings.models import Rating

class RatingListViewTests(APITestCase):

    def setUp(self):
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        self.user = AppUser.objects.create_user(
            username="fisiotest", dni="12345678A",
            email="fisiotest@example.com", password="securepass",
            first_name="Fisio", last_name="Test",
            postal_code="28000", photo=""
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            plan=self.plan,
            birth_date='1985-01-01',
            rating_avg=0,
            schedule={
                "exceptions": {},
                "appointments": [],
                "weekly_schedule": {}
            },
            services={},
            gender='F',
            autonomic_community='MADRID'
        )

        Rating.objects.create(punctuation=5, opinion="Excelente", physiotherapist=self.physio)
        Rating.objects.create(punctuation=3, opinion="Normal", physiotherapist=self.physio)
        Rating.objects.create(punctuation=1, opinion="Malo", physiotherapist=self.physio)

        self.url = reverse("ratings_list")

    def test_list_ratings_returns_200(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_ratings_returns_all_items(self):
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), 3)

    def test_list_ratings_is_ordered_by_punctuation_desc(self):
        response = self.client.get(self.url)
        puntuaciones = [rating["punctuation"] for rating in response.data]
        self.assertEqual(puntuaciones, sorted(puntuaciones, reverse=True))

    def test_list_ratings_empty(self):
        Rating.objects.all().delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
        
class RatingCreateViewTests(APITestCase):

    def setUp(self):
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        # Fisioterapeuta
        self.user_physio = AppUser.objects.create_user(
            username="physio", email="physio@example.com", password="pass",
            dni="12345678A", first_name="Fisio", last_name="User", postal_code="28000", photo=""
        )
        self.physio = Physiotherapist.objects.create(
            user=self.user_physio,
            plan=self.plan,
            birth_date='1985-01-01',
            rating_avg=0,
            schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        # Usuario sin perfil de physio
        self.user_normal = AppUser.objects.create_user(
            username="normal", email="normal@example.com", password="pass2",
            dni="11223344B", first_name="Normal", last_name="User", postal_code="28000", photo=""
        )

        # Ruta
        self.url = reverse('create_rating')

    def test_physio_can_create_rating(self):
        self.client.force_authenticate(user=self.user_physio)
        data = {
            "punctuation": 5,
            "opinion": "Muy buena experiencia"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rating.objects.count(), 1)
        self.assertEqual(Rating.objects.first().punctuation, 5)

    def test_non_physio_cannot_create_rating(self):
        self.client.force_authenticate(user=self.user_normal)
        data = {
            "punctuation": 4,
            "opinion": "Intento fallido"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Rating.objects.count(), 0)

    def test_rating_with_invalid_punctuation_fails(self):
        self.client.force_authenticate(user=self.user_physio)
        data = {
            "punctuation": 7,
            "opinion": "Puntuación inválida"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("punctuation", response.data)

    def test_cannot_create_duplicate_rating(self):
        self.client.force_authenticate(user=self.user_physio)
        Rating.objects.create(physiotherapist=self.physio, punctuation=4, opinion="Primera")
        data = {
            "punctuation": 3,
            "opinion": "Intento duplicado"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_opinion_exceeds_max_length(self):
        self.client.force_authenticate(user=self.user_physio)
        data = {
            "punctuation": 4,
            "opinion": "a" * 141
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("opinion", response.data)    

class RatingUpdateViewTests(APITestCase):

    def setUp(self):
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        # Fisio que crea la valoración
        self.user1 = AppUser.objects.create_user(
            username="physio1", email="physio1@example.com", password="pass",
            dni="12345678A", first_name="Fisio", last_name="Uno", postal_code="28000", photo=""
        )
        self.physio1 = Physiotherapist.objects.create(
            user=self.user1,
            plan=self.plan,
            birth_date='1980-01-01',
            rating_avg=0,
            schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        # Otro fisio
        self.user2 = AppUser.objects.create_user(
            username="physio2", email="physio2@example.com", password="pass",
            dni="87654321B", first_name="Fisio", last_name="Dos", postal_code="28001", photo=""
        )
        self.physio2 = Physiotherapist.objects.create(
            user=self.user2,
            plan=self.plan,
            birth_date='1982-01-01',
            rating_avg=0,
            schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        self.rating = Rating.objects.create(
            physiotherapist=self.physio1,
            punctuation=4,
            opinion="Original"
        )

        self.url = reverse('update_rating', args=[self.rating.id])

    def test_physio_can_update_own_rating(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(self.url, {"opinion": "Actualizado"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.rating.refresh_from_db()
        self.assertEqual(self.rating.opinion, "Actualizado")

    def test_other_physio_cannot_update_rating(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.patch(self.url, {"opinion": "Hackeo"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.rating.refresh_from_db()
        self.assertEqual(self.rating.opinion, "Original")

    def test_update_nonexistent_rating_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('update_rating', args=[9999])
        response = self.client.patch(url, {"opinion": "Nada"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_with_invalid_data_returns_400(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(self.url, {"punctuation": 7})  # fuera del rango permitido
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("punctuation", response.data)
        

class RatingDeleteViewTests(APITestCase):

    def setUp(self):
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        # Fisio propietario
        self.user1 = AppUser.objects.create_user(
            username="physio1", email="physio1@example.com", password="pass",
            dni="12345678A", first_name="Fisio", last_name="Uno", postal_code="28000", photo=""
        )
        self.physio1 = Physiotherapist.objects.create(
            user=self.user1, plan=self.plan, birth_date='1980-01-01',
            rating_avg=0, schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        # Otro fisio
        self.user2 = AppUser.objects.create_user(
            username="physio2", email="physio2@example.com", password="pass",
            dni="87654321B", first_name="Fisio", last_name="Dos", postal_code="28001", photo=""
        )
        self.physio2 = Physiotherapist.objects.create(
            user=self.user2, plan=self.plan, birth_date='1982-01-01',
            rating_avg=0, schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        # Valoración a borrar
        self.rating = Rating.objects.create(
            physiotherapist=self.physio1,
            punctuation=4,
            opinion="Valoración temporal"
        )

        self.url = reverse('delete_rating', args=[self.rating.id])

    def test_physio_can_delete_own_rating(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Rating.objects.filter(id=self.rating.id).exists())

    def test_other_physio_cannot_delete_rating(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Rating.objects.filter(id=self.rating.id).exists())

    def test_deleting_nonexistent_rating_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('delete_rating', args=[9999])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_user_cannot_delete_rating(self):
        # No autenticamos ningún usuario
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(Rating.objects.filter(id=self.rating.id).exists())


class RatingDetailViewTests(APITestCase):

    def setUp(self):
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        self.user = AppUser.objects.create_user(
            username="physio", email="physio@example.com", password="pass",
            dni="12345678A", first_name="Fisio", last_name="Uno", postal_code="28000", photo=""
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user,
            plan=self.plan,
            birth_date='1980-01-01',
            rating_avg=0,
            schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        self.rating = Rating.objects.create(
            physiotherapist=self.physio,
            punctuation=5,
            opinion="Excelente"
        )

        self.url = reverse('get_rating_details', args=[self.rating.id])

    def test_anyone_can_view_rating_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['punctuation'], 5)
        self.assertEqual(response.data['opinion'], "Excelente")

    def test_rating_detail_not_found(self):
        url = reverse('get_rating_details', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Valoración no encontrada')


class RatingCheckIfRatedTests(APITestCase):

    def setUp(self):
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        self.user_physio = AppUser.objects.create_user(
            username="physio", email="physio@example.com", password="pass",
            dni="12345678A", first_name="Fisio", last_name="Uno", postal_code="28000", photo=""
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user_physio,
            plan=self.plan,
            birth_date='1980-01-01',
            rating_avg=0,
            schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        self.user_non_physio = AppUser.objects.create_user(
            username="no_physio", email="no@example.com", password="pass",
            dni="87654321B", first_name="No", last_name="Fisio", postal_code="28001", photo=""
        )

        self.url = reverse('has_rated')

    def test_physio_with_rating_gets_true(self):
        Rating.objects.create(physiotherapist=self.physio, punctuation=5, opinion="Sí")
        self.client.force_authenticate(user=self.user_physio)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['has_rated'], True)

    def test_physio_without_rating_gets_false(self):
        self.client.force_authenticate(user=self.user_physio)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['has_rated'], False)

    def test_non_physio_user_gets_403(self):
        self.client.force_authenticate(user=self.user_non_physio)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_gets_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class GetMyRatingTests(APITestCase):

    def setUp(self):
        self.plan, _ = Pricing.objects.get_or_create(
            name='blue', defaults={'price': 10, 'video_limit': 5}
        )

        self.user_physio = AppUser.objects.create_user(
            username="physio", email="physio@example.com", password="pass",
            dni="12345678A", first_name="Fisio", last_name="Uno", postal_code="28000", photo=""
        )

        self.physio = Physiotherapist.objects.create(
            user=self.user_physio,
            plan=self.plan,
            birth_date='1980-01-01',
            rating_avg=0,
            schedule={"exceptions": {}, "appointments": [], "weekly_schedule": {}},
            services={}, gender='F', autonomic_community='MADRID'
        )

        self.user_normal = AppUser.objects.create_user(
            username="normal", email="normal@example.com", password="pass",
            dni="87654321B", first_name="Usuario", last_name="Normal", postal_code="28001", photo=""
        )

        self.url = reverse('my_rating')

    def test_physio_with_rating_gets_rating(self):
        Rating.objects.create(physiotherapist=self.physio, punctuation=5, opinion="Excelente")
        self.client.force_authenticate(user=self.user_physio)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["punctuation"], 5)
        self.assertEqual(response.data["opinion"], "Excelente")

    def test_physio_without_rating_gets_204(self):
        self.client.force_authenticate(user=self.user_physio)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data, None)

    def test_non_physio_user_gets_403(self):
        self.client.force_authenticate(user=self.user_normal)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_gets_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
