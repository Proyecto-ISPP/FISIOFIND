from collections import defaultdict
from datetime import datetime, timedelta
from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from gestion_citas.models import Appointment, Physiotherapist
from gestion_citas.serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsPhysiotherapist, IsPatient, IsPhysioOrPatient
from users.permissions import IsAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from django.utils.timezone import make_aware, is_aware
from datetime import datetime, timezone, timedelta
from gestion_citas.emailUtils import send_appointment_email
from django.core import signing
from django.core.signing import BadSignature, SignatureExpired
from rest_framework.permissions import AllowAny

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])
def create_appointment_patient(request):
    patient = request.user.patient
    if hasattr(request.user, 'physio'):
        return Response({"error": "Los fisioterapeutas no pueden crear citas como pacientes"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    data['patient'] = patient.id

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        send_appointment_email(serializer.data['id'], 'booked')
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def create_appointment_physio(request):
    physiotherapist = request.user.physio
    if hasattr(request.user, 'patient'):
        return Response({"error": "Los pacientes no pueden crear citas como fisioterapeutas"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    data['physiotherapist'] = physiotherapist.id

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Buscar una forma de filtrar mas sencilla *funciona pero muchas lineas*


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def list_appointments_physio(request):
    physiotherapist = request.user.physio
    appointments = Appointment.objects.filter(physiotherapist=physiotherapist)

    status = request.query_params.get('status', None)
    if status:
        appointments = appointments.filter(status=status)

    is_online = request.query_params.get('is_online', None)
    if is_online is not None:
        appointments = appointments.filter(
            is_online=is_online.lower() == 'true')

    patient = request.query_params.get('patient', None)
    if patient:
        appointments = appointments.filter(patient=patient)

    search_filter = SearchFilter()
    search_fields = ['status']
    appointments = search_filter.filter_queryset(
        request, appointments, view=None)

    ordering_filter = OrderingFilter()
    ordering_filter.ordering_fields = ['start_time', 'end_time']
    appointments = ordering_filter.filter_queryset(
        request, appointments, view=None)

    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(appointments, request)
    serializer = AppointmentSerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPatient])
def list_appointments_patient(request):
    patient = request.user.patient
    appointments = Appointment.objects.filter(patient=patient)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_physio_schedule_by_id(request, pk):
    try:
        physiotherapist = Physiotherapist.objects.get(id=pk)

        schedule = physiotherapist.schedule
        if schedule is None:
            return Response({"message": "No se ha definido un horario para este fisioterapeuta"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"schedule": schedule}, status=status.HTTP_200_OK)
    except Physiotherapist.DoesNotExist:
        return Response({"error": "Fisioterapeuta no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def edit_weekly_schedule(request):
    try:
        # Obtener el Physiotherapist asociado al usuario autenticado
        physiotherapist = request.user.physio

        # Obtener el schedule existente
        current_schedule = physiotherapist.schedule or {
            "weekly_schedule": {"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []},
            "exceptions": {},
            "appointments": []
        }

        # Obtener los datos del cuerpo de la solicitud
        data = request.data

        # Validar la estructura del weekly_schedule
        if not isinstance(data, dict) or 'weekly_schedule' not in data:
            raise ValidationError(
                "Debe enviar un objeto JSON con el campo 'weekly_schedule'.")

        weekly_schedule = data['weekly_schedule']
        if not isinstance(weekly_schedule, dict):
            raise ValidationError("weekly_schedule debe ser un diccionario.")
        valid_days = ['monday', 'tuesday', 'wednesday',
                      'thursday', 'friday', 'saturday', 'sunday']
        for day, schedules in weekly_schedule.items():
            if day.lower() not in valid_days:
                raise ValidationError(
                    f"{day} no es un día válido. Usa: {', '.join(valid_days)}.")
            if not isinstance(schedules, list):
                raise ValidationError(
                    f"Los horarios para {day} deben ser una lista.")
            for schedule in schedules:
                if not isinstance(schedule, dict) or 'start' not in schedule or 'end' not in schedule:
                    raise ValidationError(
                        f"El horario {schedule} no es válido. Debe ser un objeto con 'start' y 'end'.")
                start, end = schedule['start'], schedule['end']
                if not _is_valid_time(start) or not _is_valid_time(end):
                    raise ValidationError(
                        f"Los horarios {start} o {end} no son válidos. Usa formato 'HH:MM'.")
                if not _is_valid_time_range(start, end):
                    raise ValidationError(
                        f"El rango {start}-{end} no es válido. La hora de inicio debe ser anterior a la de fin.")

        # Actualizar solo el weekly_schedule en el schedule existente
        current_schedule['weekly_schedule'] = weekly_schedule

        # Obtener las citas actualizadas
        appointments = Appointment.objects.filter(
            physiotherapist=physiotherapist)
        current_schedule['appointments'] = [
            {
                "start_time": appointment.start_time.strftime('%Y-%m-%dT%H:%M:%S'),
                "end_time": appointment.end_time.strftime('%Y-%m-%dT%H:%M:%S'),
                "status": appointment.status
            }
            for appointment in appointments
        ]

        # Guardar el schedule actualizado
        physiotherapist.schedule = current_schedule
        physiotherapist.save()

        return Response({"message": "Horario semanal actualizado con éxito", "schedule": physiotherapist.schedule}, status=status.HTTP_200_OK)
    except ValidationError as ve:
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def add_unavailable_day(request):
    try:
        # Obtener el Physiotherapist asociado al usuario autenticado
        physiotherapist = request.user.physio
        print(
            f"Physiotherapist autenticado: {physiotherapist.id} para usuario {request.user.id}")

        # Obtener el schedule existente
        current_schedule = physiotherapist.schedule or {
            "weekly_schedule": {"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []},
            "exceptions": {},
            "appointments": []
        }

        # Obtener los datos del cuerpo de la solicitud
        data = request.data

        # Validar la estructura
        if not isinstance(data, dict) or 'date' not in data or 'time_ranges' not in data:
            raise ValidationError(
                "Debe enviar un objeto JSON con los campos 'date' y 'time_ranges'.")
        date_str = data['date']
        time_ranges = data['time_ranges']

        # Validar la fecha
        try:
            datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            raise ValidationError(
                f"{date_str} no es una fecha válida. Usa formato YYYY-MM-DD.")

        # Validar los rangos de tiempo
        if not isinstance(time_ranges, list):
            raise ValidationError("time_ranges debe ser una lista.")
        for time_range in time_ranges:
            if not isinstance(time_range, dict) or 'start' not in time_range or 'end' not in time_range:
                raise ValidationError(
                    f"El rango {time_range} no es válido. Debe ser un objeto con 'start' y 'end'.")
            start, end = time_range['start'], time_range['end']
            if not _is_valid_time(start) or not _is_valid_time(end):
                raise ValidationError(
                    f"Los horarios {start} o {end} no son válidos. Usa formato 'HH:MM'.")
            if not _is_valid_time_range(start, end):
                raise ValidationError(
                    f"El rango {start}-{end} no es válido. La hora de inicio debe ser anterior a la de fin.")

        # Añadir o actualizar la fecha en exceptions con deduplicación
        if date_str not in current_schedule['exceptions']:
            current_schedule['exceptions'][date_str] = []

        existing_ranges = current_schedule['exceptions'][date_str]
        new_ranges = []
        for time_range in time_ranges:
            range_key = (time_range['start'], time_range['end'])
            if not any((existing['start'], existing['end']) == range_key for existing in existing_ranges):
                new_ranges.append(time_range)
        current_schedule['exceptions'][date_str].extend(new_ranges)

        # Obtener las citas actualizadas
        appointments = Appointment.objects.filter(
            physiotherapist=physiotherapist)
        current_schedule['appointments'] = [
            {
                "start_time": appointment.start_time.strftime('%Y-%m-%dT%H:%M:%S'),
                "end_time": appointment.end_time.strftime('%Y-%m-%dT%H:%M:%S'),
                "status": appointment.status
            }
            for appointment in appointments
        ]

        # Guardar el schedule actualizado
        physiotherapist.schedule = current_schedule
        physiotherapist.save()

        return Response({"message": f"Día no disponible {date_str} añadido con éxito", "schedule": physiotherapist.schedule}, status=status.HTTP_200_OK)
    except ValidationError as ve:
        return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

# funciones auxiliares para la validacion para schedule


def _is_valid_time(time_str):
    """Validar que un horario esté en formato 'HH:MM'."""
    try:
        datetime.strptime(time_str, '%H:%M')
        hour, minute = map(int, time_str.split(':'))
        return 0 <= hour <= 23 and 0 <= minute <= 59
    except ValueError:
        return False


def _is_valid_time_range(start, end):
    """Validar que el rango de tiempo sea lógico (inicio antes de fin)."""
    try:
        start_hour, start_min = map(int, start.split(':'))
        end_hour, end_min = map(int, end.split(':'))
        start_minutes = start_hour * 60 + start_min
        end_minutes = end_hour * 60 + end_min
        return start_minutes < end_minutes
    except ValueError:
        return False


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPhysioOrPatient])
def update_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    data = request.data.copy()

    now = datetime.now(timezone.utc)  # Aseguramos que 'now' es timezone-aware
    start_time = appointment.start_time

    # Convertimos start_time a timezone-aware si no lo es
    if not is_aware(start_time):
        start_time = make_aware(start_time, timezone.utc)

    # Restricción de 48 horas
    if start_time - now < timedelta(hours=48):
        return Response(
            {"error": "Solo puedes modificar citas con al menos 48 horas de antelación"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Si el usuario es fisioterapeuta
    if hasattr(user, 'physio'):
        # if appointment.status != "booked":
        #     return Response({"error": "Solo puedes modificar citas con estado 'booked'"}, status=status.HTTP_403_FORBIDDEN)

        # Verificar que la cita tenga al menos 48 horas de margen
        if appointment.start_time - now < timedelta(hours=48):
            return Response({"error": "Solo puedes modificar citas con al menos 48 horas de antelación"}, status=status.HTTP_403_FORBIDDEN)

        alternatives = data.get("alternatives", {})

        # Validar que haya al menos dos fechas diferentes
        # if not isinstance(alternatives, dict) or len(alternatives.keys()) < 2:
        #     return Response({"error": "Debes proporcionar al menos dos fechas diferentes en 'alternatives'"}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que las fechas y horas sean únicas y que no incluyan la fecha actual de la cita
        appointment_start_time = appointment.start_time.strftime(
            "%Y-%m-%dT%H:%M:%SZ")  # Convertir a string
        validated_alternatives = defaultdict(set)

        for date, slots in alternatives.items():
            for slot in slots:
                slot_start = slot["start"]
                slot_end = slot["end"]

                if slot_start == appointment_start_time:
                    return Response({"error": f"No puedes agregar la fecha actual de la cita ({appointment_start_time}) en 'alternatives'"}, status=status.HTTP_400_BAD_REQUEST)

                if slot_start >= slot_end:
                    return Response({"error": f"En {date}, la hora de inicio debe ser menor que la de fin"}, status=status.HTTP_400_BAD_REQUEST)

                # Garantizar que cada combinación start-end sea única
                if (slot_start, slot_end) in validated_alternatives[date]:
                    return Response({"error": f"La combinación {slot_start} - {slot_end} en {date} ya existe en 'alternatives'"}, status=status.HTTP_400_BAD_REQUEST)

                validated_alternatives[date].add((slot_start, slot_end))

        # Convertir los sets de vuelta a listas de diccionarios
        data["alternatives"] = {
            date: [{"start": start, "end": end} for start, end in slots]
            for date, slots in validated_alternatives.items()
        }

        data["status"] = "pending"

    # Si el usuario es paciente
    elif hasattr(user, 'patient'):
        # if appointment.status != "pending":
        #     return Response({"error": "Solo puedes modificar citas con estado 'pending'"}, status=status.HTTP_403_FORBIDDEN)

        selected_start_time = data.get("start_time")
        selected_end_time = data.get("end_time")

        if not selected_start_time or not selected_end_time:
            return Response({"error": "Debes proporcionar un 'start_time' y un 'end_time' válidos"}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que la selección coincida con una alternativa exacta
        valid_selection = False
        for slots in appointment.alternatives.values():
            for slot in slots:
                if slot["start"] == selected_start_time and slot["end"] == selected_end_time:
                    valid_selection = True
                    break
            if valid_selection:
                break

        # if not valid_selection:
        #     return Response({"error": "El rango horario seleccionado no coincide con las alternativas disponibles"}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar la cita con la nueva fecha y hora seleccionada
        data["alternatives"] = ""  # Eliminar todas las alternativas
        data["status"] = "confirmed"

    else:
        return Response({"error": "No tienes permisos para modificar esta cita"}, status=status.HTTP_403_FORBIDDEN)

    serializer = AppointmentSerializer(appointment, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        if serializer.data['alternatives']:
            send_appointment_email(appointment.id, 'modified')
        elif serializer.data['status'] == "confirmed":
            send_appointment_email(appointment.id, 'confirmed')
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def confirm_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    # Verificar que el usuario es un fisioterapeuta
    if not hasattr(user, 'physio'):
        return Response({"error": "No tienes permisos para confirmar esta cita"}, status=status.HTTP_403_FORBIDDEN)

    # Verificar que el fisioterapeuta que está intentando confirmar la cita es el responsable
    if appointment.physiotherapist != user.physio:
        return Response({"error": "No puedes confirmar citas de otros fisioterapeutas"}, status=status.HTTP_403_FORBIDDEN)

    # Verificar que la cita esté en estado "booked"
    if appointment.status != "booked":
        return Response({"error": "Solo puedes confirmar citas con estado 'booked'"}, status=status.HTTP_403_FORBIDDEN)

    # Cambiar el estado a "confirmed"
    appointment.status = "confirmed"
    appointment.save()
    send_appointment_email(appointment.id, 'confirmed')

    # Serializar la cita actualizada
    serializer = AppointmentSerializer(appointment)

    # Devolver el mensaje de confirmación y los detalles de la cita
    return Response({
        "message": "La cita fue aceptada correctamente",  # Mensaje de confirmación
        "appointment": serializer.data  # Datos de la cita actualizada
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsPhysioOrPatient])
def delete_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    now = datetime.now(timezone.utc)  # Fecha y hora actual en UTC

    # Verificar si el usuario es el fisioterapeuta o el paciente de la cita
    if not (hasattr(user, 'physio') or hasattr(user, 'patient')):
        return Response({"error": "No tienes permisos para borrar esta cita"}, status=status.HTTP_403_FORBIDDEN)

    # Verificar si el usuario tiene permisos para borrar la cita
    if hasattr(user, 'physio'):
        if appointment.physiotherapist != user.physio:
            return Response({"error": "No tienes permisos para borrar esta cita"}, status=status.HTTP_403_FORBIDDEN)
        role = 'physio'  # El usuario es fisioterapeuta
    elif hasattr(user, 'patient'):
        if appointment.patient != user.patient:
            return Response({"error": "No tienes permisos para borrar esta cita"}, status=status.HTTP_403_FORBIDDEN)
        role = 'patient'  # El usuario es paciente

    # Verificar si quedan menos de 48 horas para el inicio de la cita
    if appointment.start_time - now < timedelta(hours=48):
        return Response({"error": "No puedes borrar una cita con menos de 48 horas de antelación"}, status=status.HTTP_403_FORBIDDEN)

    # Enviar el correo con el rol del usuario
    send_appointment_email(appointment.id, 'canceled', role)

    # Eliminar la cita
    appointment.delete()

    return Response({"message": "Cita eliminada correctamente"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointment_by_id(request, appointmentId):
    try:
        # Obtener la cita según el ID proporcionado
        appointment = Appointment.objects.get(id=appointmentId)

        # Verificar si el usuario tiene permisos para acceder a esta cita
        user = request.user
        if appointment.patient.user != user and appointment.physiotherapist.user != user:
            return Response({"error": "No tienes permisos para ver esta cita"}, status=status.HTTP_403_FORBIDDEN)

        # Serializar los detalles de la cita
        serializer = AppointmentSerializer(appointment)

        # Devolver la respuesta con los detalles de la cita
        serializer_data = serializer.data
        serializer_data['patient_name'] = appointment.patient.user.first_name + \
            " " + appointment.patient.user.last_name
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def confirm_appointment_using_token(request, token):
    try:
        print("hola llego aqui")
        # Extrae y valida el token; max_age define la expiración en segundos (48 horas)
        data = signing.loads(token, max_age=48*3600)
        appointment_id = data.get('appointment_id')
    except SignatureExpired:
        return Response({"error": "El token ha expirado"}, status=status.HTTP_400_BAD_REQUEST)
    except BadSignature:
        return Response({"error": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST)

    # Busca la cita a partir del ID extraído del token
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_400_BAD_REQUEST)

    # Marca la cita como aceptada
    appointment.status = "confirmed"
    appointment.save()

    return Response({"message": "¡Cita aceptada con éxito!"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAdmin])
def create_appointment_admin(request):

    data = request.data.copy()

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminAppointmenList(generics.ListAPIView):
    '''
    API endpoint para listar los términos para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmennDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo término por su id para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmenUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para que admin actualice un término.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmenDelete(generics.DestroyAPIView):
    '''
    API endpoint para que admin elimine un término.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

"""
class AdminAppointmenCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


class AdminAppointmenList(generics.ListAPIView):
    '''
    API endpoint para listar los términos para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmennDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo término por su id para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmenUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para que admin actualice un término.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmenDelete(generics.DestroyAPIView):
    '''
    API endpoint para que admin elimine un término.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
"""
