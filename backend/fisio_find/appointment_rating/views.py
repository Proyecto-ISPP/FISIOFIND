from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from appointment.models import Appointment
from videocall.models import Room
from .emailUtils import send_rating_email
from .models import AppointmentRating
from .serializers import AppointmentRatingSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsPatient, IsPhysioOrPatient, IsPhysiotherapist


@api_view(["GET"])
@permission_classes([IsPhysioOrPatient])
def list_ratings(request, physio_id):
    """Obtiene todas las valoraciones de un fisioterapeuta específico"""
    ratings = AppointmentRating.objects.filter(physiotherapist_id=physio_id)
    serializer = AppointmentRatingSerializer(ratings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def get_my_rating(request):
    """
    Calcula la valoración media y la cantidad de valoraciones del fisioterapeuta autenticado.
    """
    try:
        aggregate_data = AppointmentRating.objects.filter(
            physiotherapist=request.user.physio
        ).aggregate(average=Avg("score"), count=Count("id"))
        avg_score = aggregate_data["average"]
        ratings_count = aggregate_data["count"]

        # Si existen valoraciones, redondeamos el promedio a dos decimales.
        if ratings_count > 0 and avg_score is not None:
            avg_score = round(avg_score, 2)
        else:
            avg_score = None

        data = {"rating": avg_score, "ratings_count": ratings_count}
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "Solicitud incorrecta"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsPatient])
def get_appointment_rating(request, appointment_id):
    # Comprueba que la cita existe y pertenece al usuario autenticado
    appointment = get_object_or_404(
        Appointment, id=appointment_id, patient=request.user.patient
    )

    # Busca la valoración asociada a la cita
    rating = AppointmentRating.objects.filter(appointment=appointment).first()
    if not rating:
        return Response(
            {"error": "No se encontró valoración para esta cita."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = AppointmentRatingSerializer(rating)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPatient])
def check_rating_by_room_code(request, room_code):
    """
    Verifica si la cita asociada a la sala con room_code ya tiene una valoración.
    """
    room = get_object_or_404(Room, code=room_code, patient=request.user.patient)
    appointment = room.appointment
    rating = AppointmentRating.objects.filter(appointment=appointment).first()
    if rating:
        serializer = AppointmentRatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"rating_exists": False}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsPatient])
def create_rating_by_room_code(request, room_code):
    """Permite a un paciente valorar a un fisioterapeuta solo si la cita está finalizada"""
   
    # Verificar si la room existe y pertenece al usuario autenticado
    room = get_object_or_404(
        Room, code=room_code, patient=request.user.patient
    )
    
    appointment_id = room.appointment.id

    # Verificar si la cita existe y pertenece al usuario autenticado
    appointment = get_object_or_404(
        Appointment, id=appointment_id, patient=request.user.patient
    )

    # Verifica que la cita se completó hace menos de 7 días.
    if timezone.now() - appointment.end_time > timedelta(days=7):
        return Response(
            {
                "error": "La valoración ya no se puede crear, han pasado más de 7 días desde el fin de la cita."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Verificar que no haya una valoración previa para esta cita
    if AppointmentRating.objects.filter(appointment=appointment).exists():
        return Response(
            {"error": "Ya has valorado esta cita."}, status=status.HTTP_400_BAD_REQUEST
        )
        
    request.data["appointment"] = appointment_id

    # Serializar y guardar la valoración
    serializer = AppointmentRatingSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(
            patient=request.user.patient,
            physiotherapist=appointment.physiotherapist,
            appointment=appointment,
        )
        send_rating_email(serializer.instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST", "PUT"])
@permission_classes([IsPatient])
def create_or_update_rating(request, appointment_id):
    """Permite a un paciente valorar o editar una valoración de un fisioterapeuta solo si la cita está finalizada"""
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "La cita no existe."}, status=status.HTTP_400_BAD_REQUEST)

    if appointment.patient != request.user.patient:
        return Response({"error": "No puedes valorar esta cita porque no eres el paciente de la misma."}, 
                        status=status.HTTP_400_BAD_REQUEST)

    if appointment.status != "finished":
        return Response({"error": "Solo puedes valorar citas finalizadas."}, 
                        status=status.HTTP_400_BAD_REQUEST)

    if timezone.now() - appointment.end_time > timedelta(days=7):
        return Response({"error": "La valoración ya no se puede crear, han pasado más de 7 días desde el fin de la cita."},
                        status=status.HTTP_400_BAD_REQUEST)

    existing_rating = AppointmentRating.objects.filter(appointment=appointment, patient=request.user.patient).first()

    request.data["appointment"] = appointment.id

    if request.method == "POST":
        # Si ya existe, se rechaza la creación duplicada
        if existing_rating:
            return Response({"error": "Ya has valorado esta cita."}, status=status.HTTP_400_BAD_REQUEST)
        # Crear nueva valoración
        serializer = AppointmentRatingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                patient=request.user.patient,
                physiotherapist=appointment.physiotherapist,
                appointment=appointment,
            )
            send_rating_email(serializer.instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        # Para PUT, se espera que ya exista una valoración
        if not existing_rating:
            return Response({"error": "No existe valoración previa para actualizar."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = AppointmentRatingSerializer(existing_rating, data=request.data, partial=True)
        if serializer.is_valid():
            rating = serializer.save()
            rating.updated_at = timezone.now()
            rating.save()
            return Response(AppointmentRatingSerializer(rating).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsPhysiotherapist])
def report_rating(request, rating_id):
    """
    Permite a un fisioterapeuta reportar una valoración de un paciente.
    """
    try:
        rating = AppointmentRating.objects.get(id=rating_id)
    except AppointmentRating.DoesNotExist:
        return Response(
            {"error": "La valoración no existe."}, status=status.HTTP_404_NOT_FOUND
        )

    # Aquí puedes implementar la lógica para reportar la valoración

    rating.is_reported = True
    rating.save()

    return Response(
        {"message": "Valoración reportada con éxito."}, status=status.HTTP_200_OK
    )
