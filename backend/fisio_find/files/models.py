from django.db import models
from django.conf import settings
import boto3
from treatments.models import Treatment
from users.models import AppUser
from django.core.exceptions import ValidationError

class PatientFile(models.Model):
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, related_name='treatment_files')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True, max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_key = models.CharField(max_length=500, unique=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    uploaded_by = models.ForeignKey(AppUser, on_delete=models.CASCADE,  null=True, related_name='uploaded_patient_files')

    def __str__(self):
        return self.title

    def delete_from_storage(self):
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
            endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL
        )
        try:
            print(f"Eliminando archivo de DigitalOcean: {self.file_key}")
            s3_client.delete_object(Bucket=settings.DIGITALOCEAN_SPACE_NAME, Key=self.file_key)
            print(f"Archivo eliminado correctamente de DigitalOcean: {self.file_key}")
        except Exception as e:
            print(f"Error al eliminar el archivo de DigitalOcean: {e}")
            raise

    @property
    def file_url(self):
        return f"{settings.DIGITALOCEAN_ENDPOINT_URL}/{settings.DIGITALOCEAN_SPACE_NAME}/{self.file_key}"

class Video(models.Model):
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, related_name='treatment_videos')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_key = models.CharField(max_length=500, unique=True)

    def __str__(self):
        return self.title

    def delete_from_storage(self):
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
            endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL
        )
        try:
            s3_client.delete_object(Bucket=settings.DIGITALOCEAN_SPACE_NAME, Key=self.file_key)
        except Exception as e:
            print(f"Error al eliminar el archivo de Spaces: {e}")

    @property
    def file_url(self):
        return f"https://fisiofind-repo.fra1.digitaloceanspaces.com/{self.file_key}"
