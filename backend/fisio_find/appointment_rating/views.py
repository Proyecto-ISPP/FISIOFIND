from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from appointment.models import Appointment
from .models import AppointmentRating
from .serializers import AppointmentRatingSerializer
from users.permissions import IsPatient, IsPhysioOrPatient

@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def list_ratings(request, physio_id):
    """ Obtiene todas las valoraciones de un fisioterapeuta específico """
    ratings = AppointmentRating.objects.filter(physiotherapist_id=physio_id)
    serializer = AppointmentRatingSerializer(ratings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsPatient])
def get_appointment_rating(request, appointment_id):
    # Comprueba que la cita existe y pertenece al usuario autenticado
    appointment = get_object_or_404(Appointment, id=appointment_id, patient=request.user.patient)
    
    # Busca la valoración asociada a la cita
    rating = AppointmentRating.objects.filter(appointment=appointment).first()
    if not rating:
        return Response(
            {"error": "No se encontró valoración para esta cita."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = AppointmentRatingSerializer(rating)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsPatient])
def create_rating(request):
    
    """ Permite a un paciente valorar a un fisioterapeuta solo si la cita está finalizada """
    appointment_id = request.data.get('appointment')

    # Verificar si la cita existe y pertenece al usuario autenticado
    appointment = Appointment.objects.get(id=appointment_id)

    # Solo se puede valorar si la cita está terminada
    if appointment.status != "finished":
        return Response({"error": "Solo puedes valorar citas finalizadas."}, status=status.HTTP_400_BAD_REQUEST)

    # Verifica que la cita se completó hace menos de 7 días.
    if timezone.now() - appointment.end_time > timedelta(days=7):
        return Response(
            {"error": "La valoración ya no se puede crear, han pasado más de 7 días desde el fin de la cita."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar que no haya una valoración previa para esta cita
    if AppointmentRating.objects.filter(appointment=appointment).exists():
        return Response({"error": "Ya has valorado esta cita."}, status=status.HTTP_400_BAD_REQUEST)

    # Serializar y guardar la valoración
    serializer = AppointmentRatingSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(patient=request.user.patient, physiotherapist=appointment.physiotherapist, appointment=appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'PUT'])
@permission_classes([IsPatient])
def create_or_update_rating(request, appointment_id):
    """ Permite a un paciente valorar o editar una valoración de un fisioterapeuta solo si la cita está finalizada """
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "La cita no existe."}, status=status.HTTP_400_BAD_REQUEST)

    if appointment.patient != request.user.patient:
        return Response({"error": "No puedes valorar esta cita porque no eres el paciente de la misma."}, status=status.HTTP_400_BAD_REQUEST)

    # Solo se puede valorar si la cita está terminada
    if appointment.status != "finished":
        return Response({"error": "Solo puedes valorar citas finalizadas."}, status=status.HTTP_400_BAD_REQUEST)

    # Verifica que la cita se completó hace menos de 7 días.
    if timezone.now() - appointment.end_time > timedelta(days=7):
        return Response(
            {"error": "La valoración ya no se puede crear, han pasado más de 7 días desde el fin de la cita."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar si ya existe una valoración para esta cita
    existing_rating = AppointmentRating.objects.filter(appointment=appointment, patient=request.user.patient).first()

    request.data['appointment'] = appointment.id  

    # Si no existe una valoración, se crea una nueva
    if not existing_rating:
        # Crear nueva valoración
        serializer = AppointmentRatingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=request.user.patient, physiotherapist=appointment.physiotherapist, appointment=appointment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Creación exitosa
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Si ya existe, se actualiza
    else:
        # Editar valoración existente
        serializer = AppointmentRatingSerializer(existing_rating, data=request.data, partial=True)  # partial=True para solo actualizar los campos enviados
        if serializer.is_valid():
            serializer.save()  # Solo actualizamos los campos enviados
            return Response(serializer.data, status=status.HTTP_200_OK)  # Edición exitosa
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
