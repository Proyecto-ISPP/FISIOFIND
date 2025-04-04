from django.contrib import admin
from django import forms
from .models import PatientFile, Video
import boto3, uuid
from django.conf import settings
from django.utils.html import format_html


class PatientFileAdminForm(forms.ModelForm):
    file_upload = forms.FileField(required=False, label="Subir archivo")  # 👈 Agregamos el campo de subida

    class Meta:
        model = PatientFile
        fields = '__all__'

    def save(self, commit=True):
        instance = super().save(commit=False)
        uploaded_file = self.cleaned_data.get('file_upload')

        treatment = self.cleaned_data.get('treatment')
        treatment_patient = treatment.patient.user.username

        if uploaded_file:
            # Configurar conexión con DigitalOcean Spaces
            s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
                aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
                endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL
            )

            # Nombre del archivo en Spaces
            file_extension = uploaded_file.name.split(".")[-1]
            file_key = f"patient_files/{treatment_patient}/{uuid.uuid4()}.{file_extension}"

            # Subir archivo a DigitalOcean
            s3_client.upload_fileobj(
                uploaded_file,
                settings.DIGITALOCEAN_SPACE_NAME,
                file_key,
                ExtraArgs={'ACL': 'public-read'}
            )

            # Guardar la referencia al archivo
            instance.file_key = file_key

        if commit:
            instance.save()
        return instance


@admin.register(PatientFile)
class PatientFileAdmin(admin.ModelAdmin):
    form = PatientFileAdminForm  # 👈 Usamos el nuevo formulario
    list_display = ('id', 'title', 'uploaded_at', 'file_link')

    def file_link(self, obj):
        """Muestra un link al archivo en DigitalOcean"""
        if obj.file_key:
            url = f"{settings.DIGITALOCEAN_ENDPOINT_URL}/{settings.DIGITALOCEAN_SPACE_NAME}/{obj.file_key}"
            return format_html(f'<a href="{url}" target="_blank">Ver archivo</a>')
        return "No hay archivo"

    file_link.allow_tags = True
    file_link.short_description = "Archivo"

    def delete_model(self, request, obj):
        obj.delete_from_storage()  # 👈 Llama a tu método personalizado
        super().delete_model(request, obj)


class VideoAdminForm(forms.ModelForm):
    video_upload = forms.FileField(required=False, label="Subir video")  # Campo para subir el archivo de video

    class Meta:
        model = Video
        fields = '__all__'

    def save(self, commit=True):
        instance = super().save(commit=False)
        uploaded_video = self.cleaned_data.get('video_upload')

        treatment = self.cleaned_data.get('treatment')
        treatment_patient = treatment.patient.user.username  # Suponiendo que puedes acceder al paciente desde el tratamiento

        if uploaded_video:
            # Configurar conexión con DigitalOcean Spaces
            s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
                aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
                endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL
            )

            # Nombre del archivo en Spaces
            file_extension = uploaded_video.name.split(".")[-1]
            file_key = f"videos/{treatment_patient}/{uuid.uuid4()}.{file_extension}"

            # Subir archivo a DigitalOcean
            s3_client.upload_fileobj(
                uploaded_video,
                settings.DIGITALOCEAN_SPACE_NAME,
                file_key,
                ExtraArgs={'ACL': 'public-read'}
            )

            # Guardar la referencia al archivo
            instance.file_key = file_key

        if commit:
            instance.save()
        return instance


class VideoAdmin(admin.ModelAdmin):
    form = VideoAdminForm
    list_display = ('title', 'description', 'uploaded_at', 'file_url')
    search_fields = ('title', 'description')

    def delete_model(self, request, obj):
        obj.delete_from_storage()  # 👈 Llama a tu método personalizado
        super().delete_model(request, obj)

admin.site.register(Video, VideoAdmin)
