from treatments.models import Treatment
from django.conf import settings
import boto3
import uuid
from rest_framework import serializers
from .models import PatientFile, Video
import logging
from mimetypes import guess_type
from django.core.exceptions import ValidationError


class PatientFileSerializer(serializers.ModelSerializer):
    files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True
    )
    file_urls = serializers.SerializerMethodField()
    file_types = serializers.SerializerMethodField()

    class Meta:
        model = PatientFile
        fields = ["id", "title", "description", "uploaded_at", "file_key", "file_urls", "files", "file_types"]
        extra_kwargs = {
            "file_key": {"read_only": True},  # La clave del archivo es solo de lectura
        }

    def validate_title(self, value):
        """Valida que el título no esté vacío y tenga un tamaño máximo."""
        if len(value) > 100:
            raise serializers.ValidationError("El título no puede exceder los 100 caracteres.")
        return value

    def validate_description(self, value):
        """Valida que la descripción no exceda el tamaño máximo."""
        if len(value) > 255:
            raise serializers.ValidationError("La descripción no puede exceder los 255 caracteres.")
        return value

    def get_file_types(self, obj):
        """Devuelve los tipos MIME de cada archivo basado en la extensión."""
        if not obj.file_key:
            return []

        file_keys = obj.file_key.split(",")
        mime_types = []

        for key in file_keys:
            url = key.split("/")[-1]
            mime_type, _ = guess_type(url)
            mime_types.append(mime_type or "application/octet-stream")  # default

        return mime_types

    def validate_files(self, files):
        """Valida que todos los archivos tengan una extensión permitida."""
        allowed_extensions = (".pdf", ".jpg", ".jpeg", ".png", ".dicom")
        for file in files:
            if not file.name.lower().endswith(allowed_extensions):
                raise serializers.ValidationError(f"Solo se permiten archivos con extensiones {', '.join(allowed_extensions)}.")
        return files
    
    def validate_upload_limit(self, treatment):
        physio = treatment.physiotherapist
        plan = physio.plan
        limit = plan.video_limit
        uploaded_videos = Video.objects.filter(treatment__physiotherapist=physio).count()
        uploaded_files = PatientFile.objects.filter(treatment__physiotherapist=physio).count()
        total_uploaded = uploaded_videos + uploaded_files
        if total_uploaded >= limit:
            raise ValidationError(f"Límite de archivos alcanzado para el plan '{plan.name}' ({limit}).")

    def create(self, validated_data):
        request = self.context["request"]

        # Obtener campos del formulario
        treatment = request.data.get('treatment')
        title = request.data.get('title')
        description = request.data.get('description')

        if not treatment:
            raise serializers.ValidationError("El tratamiento es obligatorio.")

        files = request.FILES.getlist("files")
        if not files:
            raise serializers.ValidationError("No se han enviado archivos.")

        # Crear cliente S3
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
            endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL
        )

        try:
            treatment_instance = Treatment.objects.get(id=treatment)
            treatment_patient = treatment_instance.patient.user.username
        except Treatment.DoesNotExist:
            raise serializers.ValidationError("El tratamiento especificado no existe.")

        # Verificar si ya existe un archivo con ese título y tratamiento
        existing_file = PatientFile.objects.filter(treatment_id=treatment, title=title).first()

        if existing_file:
            treatment_file = existing_file
            file_keys = treatment_file.file_key.split(",") if treatment_file.file_key else []
        else:
            file_keys = []
            treatment_file = PatientFile(
                treatment_id=treatment,
                title=title,
                description=description,
            )

        # Subir archivos a S3
        for file in files:
            file_extension = file.name.split(".")[-1]
            file_key = f"patient_files/{treatment_patient}/{uuid.uuid4()}.{file_extension}"

            try:
                s3_client.upload_fileobj(
                    file,
                    settings.DIGITALOCEAN_SPACE_NAME,
                    file_key,
                    ExtraArgs={"ACL": "private"},
                )
                file_keys.append(file_key)

                mime_type = file.content_type or guess_type(file.name)[0]
                treatment_file.file_type = mime_type or "application/octet-stream"

            except Exception as e:
                logger = logging.getLogger(__name__)
                logger.error(f"Error al subir archivo: {str(e)}")
                raise serializers.ValidationError("Error al subir archivo. Por favor, inténtelo de nuevo más tarde.")

        # Guardar el archivo actualizado
        treatment_file.file_key = ",".join(file_keys)
        treatment_file.save(user=request.user)

        return treatment_file

    def update(self, instance, validated_data):
        """Actualiza un archivo en DigitalOcean Spaces y la BD."""

        # Actualizar otros campos si están en los datos
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)

        instance.save()
        return instance

    def get_file_urls(self, obj):
        """Devuelve la URL completa del archivo."""
        return f"{settings.DIGITALOCEAN_ENDPOINT_URL}/{obj.file_key}"

class VideoSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)  # Para recibir el archivo en el request

    class Meta:
        model = Video
        fields = ["id", "treatment", "title", "description", "file", "file_key", "file_url", "uploaded_at"]
        extra_kwargs = {
            "file_key": {"read_only": True},  # El usuario no debe enviar esto
        }

    def validate_title(self, value):
        """Valida que el título no esté vacío y tenga un tamaño máximo."""
        if len(value) > 100:
            raise serializers.ValidationError("El título no puede exceder los 100 caracteres.")
        return value

    def validate_description(self, value):
        """Valida que la descripción no exceda el tamaño máximo."""
        if len(value) > 255:
            raise serializers.ValidationError("La descripción no puede exceder los 255 caracteres.")
        return value

    def validate_file(self, file):
        """Valida que el archivo sea un video permitido."""
        allowed_extensions = (".mp4", ".avi", ".mov", ".mkv", ".webm")
        if not file.name.lower().endswith(allowed_extensions):
            raise serializers.ValidationError(f"Solo se permiten archivos con extensiones {', '.join(allowed_extensions)}.")
        return file
    
    def validate_upload_limit(self, treatment):
        physio = treatment.physiotherapist
        plan = physio.plan
        limit = plan.video_limit
        uploaded_videos = Video.objects.filter(treatment__physiotherapist=physio).count()
        uploaded_files = PatientFile.objects.filter(treatment__physiotherapist=physio).count()
        total_uploaded = uploaded_videos + uploaded_files
        if total_uploaded >= limit:
            raise ValidationError(f"Límite de archivos alcanzado para el plan '{plan.name}' ({limit}).")
 
    def create(self, validated_data):
        """Sube el archivo a DigitalOcean Spaces y guarda el Video en la BD."""
        request = self.context["request"]
        file = validated_data.pop("file")  
        treatment = request.data.get('treatment')

        try:
            treatment_instance = Treatment.objects.get(id=treatment)
            treatment_physio = treatment_instance.physiotherapist.user.username
        except Treatment.DoesNotExist:
            raise serializers.ValidationError("El tratamiento especificado no existe.")

        self.validate_upload_limit(treatment_instance)
        # Generar un nombre único para evitar sobrescribir archivos
        file_extension = file.name.split(".")[-1]
        file_key = f"videos/{treatment_physio}/{uuid.uuid4()}.{file_extension}"

        # Conectar a DigitalOcean Spaces
        s3_client = boto3.client(
            "s3",
            region_name=settings.DIGITALOCEAN_REGION,
            endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL,
            aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
        )

        # Intentar subir el archivo
        try:
            s3_client.upload_fileobj(
                file,
                settings.DIGITALOCEAN_SPACE_NAME,
                file_key,
                ExtraArgs={"ACL": "public-read"},  # Permitir acceso público
            )
        except Exception as e:
            logging.error(f"Error al subir archivo: {str(e)}")
            raise serializers.ValidationError("Error al subir archivo. Por favor, inténtelo de nuevo más tarde.")

        # Guardar en la BD
        video_file, created = Video.objects.get_or_create(
            file_key=file_key,
            treatment_id=treatment,
            **validated_data
        )
        return video_file

    def update(self, instance, validated_data):
        """Actualiza un video en DigitalOcean Spaces y la BD."""

        # Actualizar título y descripción si están en los datos
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)

        instance.save()
        return instance

    def get_file_url(self, obj):
        """Devuelve la URL completa del archivo."""
        return f"{settings.DIGITALOCEAN_ENDPOINT_URL}/{obj.file_key}"
