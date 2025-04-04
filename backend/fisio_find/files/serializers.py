from treatments.models import Treatment
from django.conf import settings
import boto3
import uuid
from rest_framework import serializers
from .models import PatientFile, Video


class PatientFileSerializer(serializers.ModelSerializer):
    files = serializers.ListField(
        child=serializers.FileField(),  # Para manejar múltiples archivos
        write_only=True
    )
    file_urls = serializers.SerializerMethodField()

    class Meta:
        model = PatientFile
        fields = ["id", "title", "description", "uploaded_at", "file_key", "file_urls", "files"]
        extra_kwargs = {
            "file_key": {"read_only": True},  # La clave del archivo es solo de lectura
        }

    def validate_files(self, files):
        """Valida que todos los archivos tengan una extensión permitida."""
        allowed_extensions = (".pdf", ".jpg", ".jpeg", ".png", ".dicom")
        for file in files:
            if not file.name.lower().endswith(allowed_extensions):
                raise serializers.ValidationError(f"Solo se permiten archivos con extensiones {', '.join(allowed_extensions)}.")
        return files

    def create(self, validated_data):
        # Obtener la solicitud para acceder a request.data y request.FILES
        request = self.context["request"]
        
        # Obtener los campos del formulario directamente desde request.data
        treatment = request.data.get('treatment')  # Recibimos treatment desde request.data
        title = request.data.get('title')
        description = request.data.get('description')

        if not treatment:
            raise serializers.ValidationError("El tratamiento es obligatorio.")
        
        # Obtener los archivos
        files = request.FILES.getlist("files")

        # Usar get_or_create para asegurar que el archivo esté asociado con el tratamiento
        treatment_file, created = PatientFile.objects.get_or_create(
            treatment_id=treatment,  # Usamos el ID directamente
            title=title,
            defaults={"description": description, "file_key": ""}
        )

        # Obtener las claves de archivo existentes
        file_keys = treatment_file.file_key.split(",") if treatment_file.file_key else []

        # Crear el cliente de S3
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
        
        # Subir cada archivo a DigitalOcean
        for file in files:
            file_extension = file.name.split(".")[-1]
            file_key = f"patient_files/{treatment_patient}/{uuid.uuid4()}.{file_extension}"

            try:
                # Subir archivo a S3
                s3_client.upload_fileobj(
                    file,
                    settings.DIGITALOCEAN_SPACE_NAME,
                    file_key,
                    ExtraArgs={"ACL": "private"},
                )
                file_keys.append(file_key)  # Agregar el archivo a la lista de claves
            except Exception as e:
                raise serializers.ValidationError(f"Error al subir archivo: {str(e)}")

        # Guardar las claves de los archivos en el tratamiento
        treatment_file.file_key = ",".join(file_keys)
        treatment_file.save()

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

    def validate_file(self, file):
        """Valida que el archivo sea un video permitido."""
        allowed_extensions = (".mp4", ".avi", ".mov", ".mkv", ".webm")
        if not file.name.lower().endswith(allowed_extensions):
            raise serializers.ValidationError(f"Solo se permiten archivos con extensiones {', '.join(allowed_extensions)}.")
        return file

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
            raise serializers.ValidationError(f"Error al subir archivo: {str(e)}")

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

