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

    # Verificar que no haya una valoración previa para esta cita
    if AppointmentRating.objects.filter(appointment=appointment).exists():
        return Response({"error": "Ya has valorado esta cita."}, status=status.HTTP_400_BAD_REQUEST)

    # Serializar y guardar la valoración
    serializer = AppointmentRatingSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(patient=request.user.patient, physiotherapist=appointment.physiotherapist, appointment=appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
