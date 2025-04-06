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


@api_view(['POST'])
@permission_classes([IsPatient])
def create_file(request):
    treatment_id = request.data.get('treatment')

    if not treatment_id:
        return Response(
            {"message": "El ID del tratamiento es requerido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Aquí asumo que Treatment es el nombre del modelo y tiene una relación con el paciente
    try:
        treatment = Treatment.objects.get(id=treatment_id)
    except Treatment.DoesNotExist:
        return Response(
            {"message": "Tratamiento no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Verificar si el paciente asociado al tratamiento es el mismo que el que hace la solicitud
    if treatment.patient != request.user.patient:
        return Response(
            {"message": "No tienes permiso para crear archivos para este tratamiento"},
            status=status.HTTP_403_FORBIDDEN
        )
    mutable_data = request.data.copy()
    serializer = PatientFileSerializer(data=mutable_data, context={'request': request})

    if serializer.is_valid():
        file = serializer.save()
        return Response(
            {
                "mesaage": "Archivo creado correctamente",
                "file": PatientFileSerializer(file).data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsPatient])
def delete_patient_file(request, file_id):
    user = request.user

    try:
        file = PatientFile.objects.get(id=file_id)

        if not hasattr(user, 'patient') or file.treatment.patient.id != user.patient.id:
            return Response({"error": "No tienes permiso para eliminar este archivo"}, status=status.HTTP_403_FORBIDDEN)

        file.delete_from_storage()
        file.delete()

        return Response({"message": "Archivo eliminado correctamente"}, status=status.HTTP_200_OK)

    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsPatient])
def update_patient_file(request, file_id):
    try:
        file_instance = PatientFile.objects.get(id=file_id)
    except PatientFile.DoesNotExist:
        return Response({"error": "Archivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Verificar que el usuario autenticado es el dueño del archivo
    if file_instance.treatment.patient.id != request.user.patient.id:
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
def get_patient_files(request):
    user = request.user
    patient_files = []

    # Filtrar los archivos que el usuario puede acceder
    if hasattr(user, 'patient'):
        files = PatientFile.objects.filter(treatment__patient=user.patient)
    elif hasattr(user, 'physio'):
        files = PatientFile.objects.filter(treatment__physiotherapist=user.physio)
    else:
        files = []

    for file in files:
        serializer = PatientFileSerializer(file)
        patient_files.append(serializer.data)

    if not patient_files:
        return Response({"error": "No se han encontrado archivos a los que puedas acceder"},
                        status=status.HTTP_404_NOT_FOUND)

    return Response(patient_files, status=status.HTTP_200_OK)


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
        return Response({"error": f"Error al obtener el archivo: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def create_video(request):
    treatment_id = request.data.get('treatment')

    if not treatment_id:
        return Response(
            {"message": "El ID del tratamiento es requerido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Aquí asumo que Treatment es el nombre del modelo y tiene una relación con el paciente
    try:
        treatment = Treatment.objects.get(id=treatment_id)
    except Treatment.DoesNotExist:
        return Response(
            {"message": "Tratamiento no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Verificar si el fisioterapeuta asociado al tratamiento es el mismo que el que hace la solicitud
    if treatment.physiotherapist != request.user.physio:
        return Response(
            {"message": "No tienes permiso para crear archivos para este tratamiento"},
            status=status.HTTP_403_FORBIDDEN
        )

    mutable_data = request.data.copy()
    serializer = VideoSerializer(data=mutable_data, context={"request": request})

    if serializer.is_valid():
        video = serializer.save()
        return Response(
            {
                "message": "Archivo creado correctamente",
                "video": VideoSerializer(video).data
            },
            status=status.HTTP_201_CREATED
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
def list_my_videos(request):
    user = request.user
    videos_owner = []

    if hasattr(user, 'patient'):
        videos = Video.objects.filter(treatment__patient=user.patient)
    elif hasattr(user, 'physio'):
        videos = Video.objects.filter(treatment__physiotherapist=user.physio)
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
@permission_classes([IsPatient])
def stream_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        if not hasattr(request.user, "patient") or video.treatment.patient != request.user.patient:
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

        # Manejar streaming por fragmentos (range requests)
        range_header = request.headers.get("Range", None)
        if range_header:
            range_value = range_header.replace("bytes=", "").split("-")
            start = int(range_value[0]) if range_value[0] else 0
            end = int(range_value[1]) if len(range_value) > 1 and range_value[1] else video_size - 1
            chunk_size = end - start + 1

            # Leer solo el fragmento necesario
            video_body.seek(start)
            video_chunk = video_body.read(chunk_size)

            # Responder con `206 Partial Content`
            response = HttpResponse(video_chunk, content_type="video/mp4")
            response["Content-Range"] = f"bytes {start}-{end}/{video_size}"
            response["Accept-Ranges"] = "bytes"
            response["Content-Length"] = str(chunk_size)
            response["Cache-Control"] = "no-cache"
            response["Connection"] = "keep-alive"
            response.status_code = 206
        else:
            # Streaming completo en fragmentos
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