from django.db import models
from django.conf import settings
import boto3
from treatments.models import Treatment
from django.core.exceptions import ValidationError

def get_file_limit(user):
    plan = str(user.plan).strip().lower()
    if plan == 'blue':
        return 15
    elif plan == 'gold':
        return 30
    else:
        return 0

def check_user_file_limit(user):
    limit = get_file_limit(user)
    patient_files_count = PatientFile.objects.filter(treatment__physiotherapist=user).count()
    video_files_count = Video.objects.filter(treatment__physiotherapist=user).count()
    total_uploaded = patient_files_count + video_files_count

    if total_uploaded >= limit:
        raise ValidationError(f"Límite de archivos alcanzado para el plan '{user.plan}' ({limit}).")

class PatientFile(models.Model):
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, related_name='treatment_files')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True, max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_key = models.CharField(max_length=500, unique=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        if not self.pk and user and hasattr(user, 'physio'):
            fisioterapeuta = self.treatment.physiotherapist
            if user.physio == fisioterapeuta:
                check_user_file_limit(fisioterapeuta)
        super().save(*args, **kwargs)


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

    def save(self, *args, **kwargs):
        if not self.pk:  # Solo validar al crear
            fisioterapeuta = self.treatment.physiotherapist
            check_user_file_limit(fisioterapeuta)
        super().save(*args, **kwargs)

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
