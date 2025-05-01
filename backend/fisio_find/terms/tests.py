from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from terms.models import Terms
from terms.serializers import TermsSerializer
from users.models import Admin, AppUser
from django.urls import reverse

class TermsListTests(APITestCase):

    def setUp(self):
        self.url = reverse('terms_list')
        self.admin = Admin.objects.create(user=AppUser.objects.create_user("admin", password="pass"))
        Terms.objects.create(content="Términos 1", version="1.0", tag="terms", modifier=self.admin)
        Terms.objects.create(content="Términos 2", version="1.1", tag="privacy", modifier=self.admin)

    def test_list_all_terms(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_filter_terms_by_tag(self):
        response = self.client.get(self.url, {'tag': 'privacy'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tag'], 'privacy')
    
class TermsDetailTests(APITestCase):

    def setUp(self):
        self.admin = Admin.objects.create(user=AppUser.objects.create_user("admin2", password="pass"))
        self.term = Terms.objects.create(content="Detalle", version="1.2", tag="cookies", modifier=self.admin)
        self.url = reverse('terms_detail', args=[self.term.id])

    def test_get_term_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.term.id)
        self.assertEqual(response.data['tag_display'], "Cookie Policy")

    def test_term_not_found(self):
        response = self.client.get(reverse('terms_detail', args=[999]))
        self.assertEqual(response.status_code, 404)

class TermsCreateTests(APITestCase):

    def setUp(self):
        self.url = reverse('terms_create')
        self.admin_user = AppUser.objects.create_user(username="admin", password="adminpass")
        self.admin = Admin.objects.create(user=self.admin_user)
        self.client.force_authenticate(user=self.admin_user)

    def test_create_term_success(self):
        data = {
            "content": "Términos nuevos",
            "version": "2.0",
            "tag": "terms"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["version"], "2.0")
        self.assertEqual(response.data["tag_display"], "Terms of Use")

    def test_create_term_missing_fields(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
        self.assertIn("content", response.data)

    def test_create_term_invalid_tag(self):
        data = {
            "content": "Contenido inválido",
            "version": "3.0",
            "tag": "invalido"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
        self.assertIn("invalido", response.data["error"])

    def test_create_term_requires_admin(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url, {})
        self.assertIn(response.status_code, [403, 401])

class TermsUpdateTests(APITestCase):

    def setUp(self):
        self.admin_user = AppUser.objects.create_user(username="admin", password="adminpass")
        self.admin = Admin.objects.create(user=self.admin_user)
        self.term = Terms.objects.create(
            content="Original", version="1.0", tag="terms", modifier=self.admin
        )
        self.url = reverse('terms_update', args=[self.term.id])
        self.client.force_authenticate(user=self.admin_user)

    def test_update_term_success(self):
        data = {"content": "Contenido actualizado"}
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["content"], "Contenido actualizado")

    def test_update_invalid_id(self):
        url = reverse('terms_update', args=[999])
        response = self.client.put(url, {"content": "Texto"})
        self.assertIn(response.status_code, [404,400])

    def test_update_requires_admin(self):
        self.client.force_authenticate(user=None)
        response = self.client.put(self.url, {"content": "Cambio"})
        self.assertIn(response.status_code, [403, 401])

class TermsDeleteTests(APITestCase):

    def setUp(self):
        self.admin_user = AppUser.objects.create_user(username="admin", password="adminpass")
        self.admin = Admin.objects.create(user=self.admin_user)
        self.term = Terms.objects.create(content="Eliminar", version="1.0", tag="privacy", modifier=self.admin)
        self.url = reverse('terms_delete', args=[self.term.id])
        self.client.force_authenticate(user=self.admin_user)

    def test_delete_term_success(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Terms.objects.filter(id=self.term.id).exists())

    def test_delete_term_not_found(self):
        url = reverse('terms_delete', args=[999])
        response = self.client.delete(url)
        self.assertIn(response.status_code, [404,400])

    def test_delete_requires_admin(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.url)
        self.assertIn(response.status_code, [403, 401])

class TermsSerializerTests(APITestCase):
    def test_serializer_outputs_tag_display(self):
        admin_user = AppUser.objects.create_user(username="admin_tag", password="pass")
        admin = Admin.objects.create(user=admin_user)
        term = Terms.objects.create(
            content="Contenido ejemplo",
            version="1.0",
            tag="license",
            modifier=admin
        )
        serializer = TermsSerializer(term)
        self.assertEqual(serializer.data["tag_display"], "License")