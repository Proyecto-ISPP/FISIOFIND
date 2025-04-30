from treatments.models import Treatment
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import PatientFileSerializer, VideoSerializer
from django.http import StreamingHttpResponse, HttpResponse
from django.conf import settings
import boto3
from rest_framework import status
from users.permissions import IsPatient, IsPhysioOrPatient, IsPhysiotherapist
from .models import PatientFile, Video
from mimetypes import guess_type
from django.core.exceptions import ValidationError

@api_view(['POST'])
@permission_classes([IsPhysioOrPatient])
def create_file(request):
    treatment_id = request.data.get('treatment')

    if not treatment_id:
        return Response(
            {"message": "El ID del tratamiento es requerido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        treatment = Treatment.objects.get(id=treatment_id)
    except Treatment.DoesNotExist:
        return Response(
            {"message": "Tratamiento no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    if hasattr(request.user, 'patient') and treatment.patient != request.user.patient:
        return Response(
            {"message": "No tienes permiso para crear archivos para este tratamiento"},
            status=status.HTTP_403_FORBIDDEN
        )
    elif hasattr(request.user, 'physio') and treatment.physiotherapist != request.user.physio:
        return Response(
            {"message": "No tienes permiso para crear archivos para este tratamiento"},
            status=status.HTTP_403_FORBIDDEN
        )

    mutable_data = request.data.copy()
    uploaded_file = request.FILES.get('file')

    if uploaded_file:
        mime_type = uploaded_file.content_type or guess_type(uploaded_file.name)[0]
        mutable_data['file_type'] = mime_type or "application/octet-stream"

    serializer = PatientFileSerializer(data=mutable_data, context={'request': request})

    if serializer.is_valid():
        try:
            file = serializer.save(user=request.user)
            return Response(
                {
                    "message": "Archivo creado correctamente",
                    "file": PatientFileSerializer(file).data
                },
                status=status.HTTP_201_CREATED
            )
        except ValidationError as ve:
            return Response(
                {"detail": str(ve.message)},
                status=status.HTTP_400_BAD_REQUEST
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsPhysioOrPatient])
def delete_patient_file(request, file_id):
    user = request.user

    try:
        file = PatientFile.objects.get(id=file_id)

        if hasattr(user, 'patient') and file.treatment.patient.id != user.patient.id:
            return Response({"error": "No tienes permiso para eliminar este archivo"}, status=status.HTTP_403_FORBIDDEN)
        elif hasattr(user, 'physio') and file.treatment.physiotherapist.id != user.physio.id:
            return Response({"error": "No tienes permiso para eliminar este archivo"}, status=status.HTTP_403_FORBIDDEN)

        file.delete_from_storage()
        file.delete()

        return Response({"message": "Archivo eliminado correctamente"}, status=status.HTTP_200_OK)

    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsPhysioOrPatient])
def update_patient_file(request, file_id):
    try:
        file_instance = PatientFile.objects.get(id=file_id)
    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Verificar que el usuario autenticado es el dueño del archivo o el fisioterapeuta asociado
    if hasattr(request.user, 'patient') and file_instance.treatment.patient.id != request.user.patient.id:
        return Response({"error": "No tienes permiso para actualizar este archivo"}, status=status.HTTP_403_FORBIDDEN)
    elif hasattr(request.user, 'physio') and file_instance.treatment.physiotherapist.id != request.user.physio.id:
        return Response({"error": "No tienes permiso para actualizar este archivo"}, status=status.HTTP_403_FORBIDDEN)

    mutable_data = request.data.copy()

    # Si el archivo es nuevo, lo agregamos al diccionario mutable
    new_file = request.FILES.get("files")
    if new_file:
        mutable_data["files"] = new_file

    serializer = PatientFileSerializer(file_instance, data=mutable_data, partial=True, context={"request": request})

    if serializer.is_valid():
        serializer.save()

        return Response({
            "message": "Archivo actualizado correctamente",
            "file": serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def get_patient_file_by_id(request, file_id):
    user = request.user
    try:
        file = PatientFile.objects.get(id=file_id)
        serializer = PatientFileSerializer(file)

        if hasattr(user, 'patient') and file.treatment.patient.id == user.patient.id:
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif hasattr(user, 'physio') and file.treatment.physiotherapist.id == user.physio.id:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No tienes permiso para ver este archivo"}, status=status.HTTP_403_FORBIDDEN)
    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def get_patient_files(request, id_treatment):
    user = request.user
    patient_files = []

    # Filtrar los archivos que el usuario puede acceder
    if hasattr(user, 'patient'):
        files = PatientFile.objects.filter(treatment__patient=user.patient, treatment__id=id_treatment)
    elif hasattr(user, 'physio'):
        files = PatientFile.objects.filter(treatment__physiotherapist=user.physio, treatment__id=id_treatment)
    else:
        files = []

    for file in files:
        serializer = PatientFileSerializer(file)
        patient_files.append(serializer.data)

    if not patient_files:
        return Response({"error": "No se han encontrado archivos a los que puedas acceder"},
                        status=status.HTTP_404_NOT_FOUND)

    return Response(patient_files, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def view_or_download_patient_file(request, file_id):
    user = request.user
    try:
        file = PatientFile.objects.get(id=file_id)

        # Verificación de permisos
        if hasattr(user, 'patient') and file.treatment.patient != user.patient:
            return Response({"error": "No tienes permiso para ver este archivo"}, status=status.HTTP_403_FORBIDDEN)
        elif hasattr(user, 'physio') and file.treatment.physiotherapist != user.physio:
            return Response({"error": "No tienes permiso para ver este archivo"}, status=status.HTTP_403_FORBIDDEN)

        # Cliente S3 para DigitalOcean
        s3_client = boto3.client(
            "s3",
            region_name=settings.DIGITALOCEAN_REGION,
            endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL,
            aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
        )

        s3_object = s3_client.get_object(
            Bucket=settings.DIGITALOCEAN_SPACE_NAME,
            Key=file.file_key
        )

        file_size = s3_object["ContentLength"]
        file_body = s3_object["Body"]
        file_type = file.file_type or "application/octet-stream"
        file_name = file.title or "archivo"

        def stream_file():
            for chunk in file_body.iter_chunks():
                yield chunk

        response = StreamingHttpResponse(stream_file(), content_type=file_type)
        response["Content-Length"] = str(file_size)
        response["Content-Disposition"] = f'inline; filename="{file_name}"'  # cambiar a 'attachment' si quieres forzar descarga
        response["Cache-Control"] = "no-cache"
        response["Accept-Ranges"] = "bytes"
        response["Connection"] = "keep-alive"

        return response

    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Error al obtener el archivo"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def create_video(request):
    treatment_id = request.data.get('treatment')

    if not treatment_id:
        return Response(
            {"message": "El ID del tratamiento es requerido."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        treatment = Treatment.objects.get(id=treatment_id)
    except Treatment.DoesNotExist:
        return Response(
            {"message": "Tratamiento no encontrado."},
            status=status.HTTP_404_NOT_FOUND
        )

    if treatment.physiotherapist != request.user.physio:
        return Response(
            {"message": "No tienes permiso para crear videos para este tratamiento."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Validate required fields
    if not request.data.get('title'):
        return Response(
            {"message": "El título es obligatorio."},
            status=status.HTTP_400_BAD_REQUEST
        )
    if not request.data.get('description'):
        return Response(
            {"message": "La descripción es obligatoria."},
            status=status.HTTP_400_BAD_REQUEST
        )
    if 'file' not in request.FILES:
        return Response(
            {"message": "El archivo de video es obligatorio."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate file type
    uploaded_file = request.FILES['file']
    if not uploaded_file.content_type.startswith('video/'):
        return Response(
            {"message": "El archivo debe ser un video válido."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = VideoSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        try:
            video = serializer.save()
            return Response(
                {
                    "message": "Video creado correctamente.",
                    "video": VideoSerializer(video).data
                },
                status=status.HTTP_201_CREATED
            )
        except ValidationError as ve:
                return Response(
                    {"detail": str(ve.message)},
                    status=status.HTTP_400_BAD_REQUEST
                )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsPhysiotherapist])
def delete_video(request, video_id):
    user = request.user
    try:
        video = Video.objects.get(id=video_id)

        if not hasattr(user, 'physio') or video.treatment.physiotherapist != user.physio:
            return Response({"error": "No tienes permiso para eliminar este video"}, status=status.HTTP_403_FORBIDDEN)

        video.delete_from_storage()
        video.delete()

        return Response({"message": "Video eliminado correctamente"}, status=status.HTTP_200_OK)

    except Video.DoesNotExist:
        return Response({"error": "Video no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def list_video_by_id(request, video_id):
    user = request.user
    try:
        video = Video.objects.get(id=video_id)
        serializer = VideoSerializer(video)

        if hasattr(user, 'patient') and video.treatment.patient == user.patient:
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif hasattr(user, 'physio') and video.treatment.physiotherapist == user.physio:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No tienes permiso para ver este video"}, status=status.HTTP_403_FORBIDDEN)
    except Video.DoesNotExist:
        return Response({"error": "Video no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def list_my_videos(request, id_treatment):
    user = request.user
    videos_owner = []

    if hasattr(user, 'patient'):
        videos = Video.objects.filter(treatment__patient=user.patient, treatment__id=id_treatment)
    elif hasattr(user, 'physio'):
        videos = Video.objects.filter(treatment__physiotherapist=user.physio, treatment__id=id_treatment)
    else:
        videos = []

    for video in videos:
        serializer = VideoSerializer(video)
        videos_owner.append(serializer.data)

    if not videos_owner:
        return Response({"error": "No se han encontrado videos a los que puedas acceder"},
                        status=status.HTTP_404_NOT_FOUND)

    return Response(videos_owner, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def update_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)

        # Verificar que el usuario autenticado es el fisioterapeuta propietario del video
        if request.user.physio != video.treatment.physiotherapist:
            return Response({'error': 'No tienes permiso para actualizar este video'}, status=status.HTTP_403_FORBIDDEN)

    except Video.DoesNotExist:
        return Response({'error': 'El video no existe'}, status=status.HTTP_404_NOT_FOUND)

    # Convertir request.data en un diccionario mutable
    mutable_data = request.data.copy()

    # Serializar con los datos nuevos
    serializer = VideoSerializer(video, data=mutable_data, partial=True, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Video actualizado correctamente", "video": serializer.data},
                        status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def stream_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        # Check permissions for both patients and physiotherapists
        if hasattr(request.user, "patient") and video.treatment.patient != request.user.patient:
            return Response({'error': 'No tienes permisos para reproducir este vídeo'}, status=403)
        elif hasattr(request.user, "physio") and video.treatment.physiotherapist != request.user.physio:
            return Response({'error': 'No tienes permisos para reproducir este vídeo'}, status=403)

        s3_client = boto3.client(
            "s3",
            region_name=settings.DIGITALOCEAN_REGION,
            endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL,
            aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
        )

        video_object = s3_client.get_object(
            Bucket=settings.DIGITALOCEAN_SPACE_NAME,
            Key=video.file_key
        )

        video_size = video_object["ContentLength"]
        video_body = video_object["Body"]

        # Handle range requests for streaming
        range_header = request.headers.get("Range", None)
        if range_header:
            range_value = range_header.replace("bytes=", "").split("-")
            start = int(range_value[0]) if range_value[0] else 0
            end = int(range_value[1]) if len(range_value) > 1 and range_value[1] else video_size - 1
            chunk_size = end - start + 1

            # Read only the required chunk
            video_body.seek(start)
            video_chunk = video_body.read(chunk_size)

            # Respond with `206 Partial Content`
            response = HttpResponse(video_chunk, content_type="video/mp4")
            response["Content-Range"] = f"bytes {start}-{end}/{video_size}"
            response["Accept-Ranges"] = "bytes"
            response["Content-Length"] = str(chunk_size)
            response["Cache-Control"] = "no-cache"
            response["Connection"] = "keep-alive"
            response.status_code = 206
        else:
            # Full streaming in chunks
            def stream_file():
                for chunk in video_body.iter_chunks():
                    yield chunk

            response = StreamingHttpResponse(stream_file(), content_type="video/mp4")
            response["Content-Length"] = str(video_size)
            response["Accept-Ranges"] = "bytes"
            response["Cache-Control"] = "no-cache"
            response["Connection"] = "keep-alive"

        return response

    except Video.DoesNotExist:
        return Response({"error": "El video no existe"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)