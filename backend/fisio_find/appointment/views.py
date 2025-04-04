from collections import defaultdict
from datetime import datetime, timedelta
from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from appointment.models import Appointment, Physiotherapist, Patient
from appointment.serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from payment.views import cancel_payment_patient, cancel_payment_pyshio, create_payment_setup
from users.permissions import IsPhysiotherapist, IsPatient, IsPhysioOrPatient
from users.permissions import IsAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from django.utils.timezone import make_aware, is_aware
from django.utils.dateparse import parse_datetime
from datetime import datetime, timezone, timedelta
from appointment.emailUtils import send_appointment_email
from django.core import signing
from django.core.signing import BadSignature, SignatureExpired
from rest_framework.permissions import AllowAny
from urllib.parse import unquote
import datetime as dt
from users.util import validate_service_with_questionary
from videocall.models import Room
import pytz


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

def update_schedule(data):
    if isinstance(data, Appointment):
        physio_id = data.physiotherapist.id
    else:
        physio_id = data.get('physiotherapist')
    if not physio_id:
        return Response({"error": "Debes proporcionar un ID de fisioterapeuta"}, status=status.HTTP_400_BAD_REQUEST)
    
    physiotherapist = Physiotherapist.objects.get(id=physio_id)
    if not physiotherapist:
        return Response({"error": "Fisioterapeuta no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    current_schedule = physiotherapist.schedule
    if not current_schedule:
        return Response({"error": "No se ha definido un horario para este fisioterapeuta"}, status=status.HTTP_404_NOT_FOUND)

    # Obtener las citas actualizadas
    spain_tz = pytz.timezone('Europe/Madrid')
    appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
    current_schedule['appointments'] = [
        {
            "start_time": appointment.start_time.astimezone(spain_tz).strftime('%Y-%m-%dT%H:%M:%S%z'),
            "end_time": appointment.end_time.astimezone(spain_tz).strftime('%Y-%m-%dT%H:%M:%S%z'),
            "status": appointment.status
        }
        for appointment in appointments
    ]

    # Guardar el schedule actualizado
    physiotherapist.schedule = current_schedule
    physiotherapist.save()


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])
def create_appointment_patient(request):
    patient = request.user.patient
    
    weekly_days = {
        "monday": "lunes",
        "tuesday": "martes",
        "wednesday": "miércoles",
        "thursday": "jueves",
        "friday": "viernes",
        "saturday": "sábado",
        "sunday": "domingo"
    }

    data = request.data.copy()
    data['patient'] = patient.id
    data['status'] = "booked"

    try:
        physiotherapist = Physiotherapist.objects.get(id=data['physiotherapist'])
    except Physiotherapist.DoesNotExist:
        return Response({"error": "Fisioterapeuta no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    schedule = physiotherapist.schedule
    weekly_schedule = schedule.get('weekly_schedule', {})
    exceptions = schedule.get('exceptions', {})
    
    selected_service = data.get('service',{})
    if selected_service == None or selected_service == {}:
        return Response({"error": "Debes de seleccionar un servicio"}, status=status.HTTP_400_BAD_REQUEST)
    
    physio_services = physiotherapist.services
    try:
        selected_service = validate_service_with_questionary(selected_service, physio_services)
    except Exception:
        return Response({"error": "Debes de enviar un cuestionario válido"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Parsear fechas de la solicitud
    start_time = parse_datetime(data['start_time'])
    if not is_aware(start_time):
        start_time = make_aware(start_time)
    end_time = parse_datetime(data['end_time'])
    if not is_aware(end_time):
        end_time = make_aware(end_time)
    appointment_day = start_time.strftime('%A').lower()  # "monday", "tuesday", etc.

    # Verificar que la fecha no sea pasada
    if start_time.date() < datetime.now().date():
        return Response({"error": "No puedes crear una cita en el pasado"}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Verificar si el fisioterapeuta trabaja ese día
    if appointment_day not in weekly_schedule or not weekly_schedule[appointment_day]:
        return Response({"error": f"El fisioterapeuta no trabaja los {weekly_days[appointment_day]}"}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Verificar si la cita está dentro del horario del fisioterapeuta
    valid_time_slot = False
    for slot in weekly_schedule[appointment_day]:
        slot_start = datetime.strptime(slot['start'], "%H:%M").time()
        slot_end = datetime.strptime(slot['end'], "%H:%M").time()
        if slot_start <= start_time.time() and end_time.time() <= slot_end:
            valid_time_slot = True
            break

    if not valid_time_slot:
        return Response({"error": "El horario solicitado no está dentro del horario del fisioterapeuta"}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Verificar si la fecha está en excepciones
    exception_slots = exceptions.get(start_time.strftime('%Y-%m-%d'), [])
    for ex in exception_slots:
        ex_start = datetime.strptime(ex['start'], "%H:%M").time()
        ex_end = datetime.strptime(ex['end'], "%H:%M").time()
        if ex_start <= start_time.time() < ex_end or ex_start < end_time.time() <= ex_end:
            return Response({"error": "El fisioterapeuta no está disponible en ese horario debido a una excepción"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        appointment = serializer.save()
        payment_data = create_payment_setup(serializer.data['id'], serializer.data['service']['price'] * 100, request.user)
        update_schedule(data)
        if isinstance(payment_data, Response):
            return payment_data
        # send_appointment_email(appointment.id, 'booked')

        # Crear videollamada
        Room.objects.create(
            physiotherapist=appointment.physiotherapist,
            patient=appointment.patient,
            appointment=appointment
        )
        

        return Response({'appointment_data': serializer.data, 'payment_data': payment_data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def create_appointment_physio(request):
    physiotherapist = request.user.physio
    if hasattr(request.user, 'patient'):
        return Response({"error": "Los pacientes no pueden crear citas como fisioterapeutas"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    data['physiotherapist'] = physiotherapist.id

    try:
        patient = Patient.objects.get(id=data['patient'])
    except Patient.DoesNotExist:
        return Response({"error": "Paciente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        appointment = serializer.save()
        update_schedule(data)

        # Crear videollamada
        Room.objects.create(
            physiotherapist=appointment.physiotherapist,
            patient=appointment.patient,
            appointment=appointment
        )
       
        return Response(AppointmentSerializer(appointment).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Buscar una forma de filtrar mas sencilla *funciona pero muchas lineas*


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def list_appointments_physio(request):
    physiotherapist = request.user.physio
    appointments = Appointment.objects.filter(physiotherapist=physiotherapist)

    appointment_status = request.query_params.get('status', None)
    if appointment_status:
        appointments = appointments.filter(status=appointment_status)

    is_online = request.query_params.get('is_online', None)
    if is_online is not None:
        appointments = appointments.filter(
            is_online=is_online.lower() == 'true')

    patient = request.query_params.get('patient', None)
    if patient:
        try:
            patient = Patient.objects.get(id=patient)
        except Patient.DoesNotExist:
            return Response({"error": "Paciente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        appointments = appointments.filter(patient=patient)
        if appointments.count() == 0:
            return Response({"error": "No hay citas para este paciente"}, status=status.HTTP_404_NOT_FOUND)

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
@permission_classes([AllowAny])
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
        data = request.data['schedule']

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


        # Validar la estructura de exceptions
        if not isinstance(data, dict) or 'exceptions' not in data:
            raise ValidationError(
                "Debe enviar un objeto JSON con el campo 'exceptions'.")

        exceptions = data['exceptions']
        if not isinstance(exceptions, dict):
            raise ValidationError("exceptions debe ser un diccionario.")

        weekday_map = {
            0: "monday",
            1: "tuesday",
            2: "wednesday",
            3: "thursday",
            4: "friday",
            5: "saturday",
            6: "sunday"
        }

        for date_str, blocks in exceptions.items():
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                raise ValidationError(f"La fecha {date_str} no tiene el formato válido YYYY-MM-DD.")
            
            if not isinstance(blocks, list):
                raise ValidationError(f"Los bloques para la fecha {date_str} deben ser una lista.")

            weekday_name = weekday_map[date_obj.weekday()]
            weekday_blocks = weekly_schedule.get(weekday_name, [])

            for block in blocks:
                if not isinstance(block, dict) or 'start' not in block or 'end' not in block:
                    raise ValidationError(
                        f"El bloque {block} en la fecha {date_str} no es válido. Debe ser un objeto con 'start' y 'end'.")

                start, end = block['start'], block['end']
                if not _is_valid_time(start) or not _is_valid_time(end):
                    raise ValidationError(
                        f"Los horarios {start} o {end} en la fecha {date_str} no son válidos. Usa formato 'HH:MM'.")

                if not _is_valid_time_range(start, end):
                    raise ValidationError(
                        f"El rango {start}-{end} en la fecha {date_str} no es válido. La hora de inicio debe ser anterior a la de fin.")

                # Obtener la fecha actual sin hora
                today = dt.date.today()

                # Filtrar excepciones pasadas
                exceptions = {
                    date_str: blocks
                    for date_str, blocks in exceptions.items()
                    if datetime.strptime(date_str, "%Y-%m-%d").date() >= today and len(blocks) > 0
                }

                # Validar que hay un bloque del weekly_schedule ese día que cubre ese rango
                exception_start = datetime.strptime(start, "%H:%M").time()
                exception_end = datetime.strptime(end, "%H:%M").time()

                matches_schedule = any(
                    datetime.strptime(wb['start'], "%H:%M").time() <= exception_start and
                    datetime.strptime(wb['end'], "%H:%M").time() >= exception_end
                    for wb in weekday_blocks
                )

                if not matches_schedule:
                    raise ValidationError(
                        f"La excepción del {date_str} ({start}-{end}) no coincide con ningún horario habitual del día {weekday_name}."
                    )

        # Actualizar solo las exceptions en el schedule existente
        current_schedule['exceptions'] = exceptions


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
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def update_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    data = request.data.copy()

    spain_tz = pytz.timezone("Europe/Madrid")
    now = datetime.now(spain_tz)
    start_time = appointment.start_time.astimezone(spain_tz)

    # Restricción de 48 horas
    if start_time - now < timedelta(hours=48):
        return Response(
            {"error": "Solo puedes modificar citas con al menos 48 horas de antelación"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Si el usuario es fisioterapeuta
    # if appointment.status != "booked":
    #     return Response({"error": "Solo puedes modificar citas con estado 'booked'"}, status=status.HTTP_403_FORBIDDEN)

    # Verificar que la cita tenga al menos 48 horas de margen
    if appointment.start_time - now < timedelta(hours=48):
        return Response({"error": "Solo puedes modificar citas con al menos 48 horas de antelación"}, status=status.HTTP_403_FORBIDDEN)

    alternatives = data.get("alternatives", {})
    if not isinstance(alternatives, dict):
        return Response({"error": "Alternatives debe ser un diccionario"}, status=status.HTTP_400_BAD_REQUEST)

    # Validar que las fechas y horas sean únicas y que no incluyan la fecha actual de la cita
    appointment_start_time = appointment.start_time.astimezone(spain_tz).strftime("%H:%M")  # Convertir a string
    validated_alternatives = defaultdict(set)
    physio_appointments = Physiotherapist.objects.get(id=appointment.physiotherapist.id).schedule["appointments"]

    for date, slots in alternatives.items():
        for slot in slots:
            slot_start = slot["start"]
            slot_end = slot["end"]
            if slot_start == appointment_start_time and date == appointment.start_time.strftime("%Y-%m-%d"):
                return Response({"error": f"No puedes agregar la fecha actual de la cita ({appointment_start_time}) en 'alternatives'"}, status=status.HTTP_400_BAD_REQUEST)
            
            if slot_start >= slot_end:
                return Response({"error": f"En {date}, la hora de inicio debe ser menor que la de fin"}, status=status.HTTP_400_BAD_REQUEST)
            
            for physio_appointment in physio_appointments:
                if date == physio_appointment["start_time"].split("T")[0]:
                    if physio_appointment["end_time"].split("T")[1][:5] > slot_start >= physio_appointment["start_time"].split("T")[1][:5] or physio_appointment["start_time"].split("T")[1][:5] < slot_end <= physio_appointment["end_time"].split("T")[1][:5]:
                        return Response({"error": f"En {date}, la hora de inicio y fin no se pueden solapar con otra cita del fisioterapeuta"}, status=status.HTTP_400_BAD_REQUEST)

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
        data["start_time"] = appointment.start_time
        data["end_time"] = appointment.end_time

    serializer = AppointmentSerializer(appointment, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        # if serializer.data['alternatives']:
            # send_appointment_email(appointment.id, 'modified')
        # elif serializer.data['status'] == "confirmed":
            # send_appointment_email(appointment.id, 'modified-accepted')
        update_schedule(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPatient])
def accept_alternative(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    data = request.data.copy()
    alternatives = appointment.alternatives
    if alternatives == "":
        return Response({"error": "No puedes aceptar una alternativa si la cita no tiene alternativas"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar que el usuario autenticado sea el paciente correspondiente
    if user.patient != appointment.patient:
        return Response({"error": "No autorizado para aceptar una alternativa de esta cita"}, status=status.HTTP_403_FORBIDDEN)
    selected_start_date = data.get("start_time")
    selected_end_date = data.get("end_time")

    if not selected_start_date or not selected_end_date:
        return Response({"error": "Debes proporcionar un 'start_time' y un 'end_time' válidos"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Extraer la fecha y la hora de las fechas
    selected_date = selected_start_date.split('T')[0]  # Ejemplo: "2025-04-07"
    selected_start_time = selected_start_date.split('T')[1][:5]  # Ejemplo: "10:00"
    selected_end_time = selected_end_date.split('T')[1][:5]      # Ejemplo: "10:45"

    # Validar que la selección coincida con una alternativa exacta
    valid_selection = False
    if selected_date in alternatives:
        for slot in alternatives[selected_date]:
            if slot["start"] == selected_start_time and slot["end"] == selected_end_time:
                valid_selection = True
                break

    if not valid_selection:
        return Response({"error": "El rango horario seleccionado no coincide con las alternativas disponibles"}, status=status.HTTP_400_BAD_REQUEST)

    # Actualizar la cita con la nueva fecha y hora seleccionada
    data["alternatives"] = ""  # Eliminar todas las alternativas
    data["status"] = "confirmed"

    data["start_time"] = data["start_time"].replace("Z", "")
    data["end_time"] = data["end_time"].replace("Z", "")

    serializer = AppointmentSerializer(appointment, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        update_schedule(appointment)
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
    # send_appointment_email(appointment.id, 'confirmed')
    
    # Serializar la cita actualizada
    serializer = AppointmentSerializer(appointment)

    # Devolver el mensaje de confirmación y los detalles de la cita
    return Response({
        "message": "La cita fue aceptada correctamente",  # Mensaje de confirmación
        "appointment": serializer.data  # Datos de la cita actualizada
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def confirm_alternative_appointment(request, token):
    try:
        # Extrae y valida el token
        data = signing.loads(token, max_age=48*3600)
        appointment_id = data.get('appointment_id')
        patient_user_id = data.get('patient_user_id')
    except SignatureExpired:
        return Response({"error": "El token ha expirado"}, status=status.HTTP_400_BAD_REQUEST)
    except BadSignature:
        return Response({"error": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST)

    # Busca la cita a partir del ID extraído del token
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_400_BAD_REQUEST)

    # Verifica que el paciente autenticado sea el paciente correspondiente
    if request.user.id != patient_user_id:
        return Response({"error": "No autorizado para confirmar esta cita"}, status=status.HTTP_403_FORBIDDEN)

    # Extrae los parámetros start_time y end_time de la query string
    start_time_str = request.query_params.get('start_time')
    end_time_str = request.query_params.get('end_time')

    if not start_time_str or not end_time_str:
        return Response({"error": "Faltan los parámetros start_time o end_time"}, status=status.HTTP_400_BAD_REQUEST)

    # Decodificar los valores de fecha y hora
    start_time_decoded = unquote(start_time_str)
    end_time_decoded = unquote(end_time_str)

    # Convertir las cadenas de fecha y hora en objetos datetime
    try:
        start_time = datetime.strptime(start_time_decoded, '%Y-%m-%d %H:%M')
        end_time = datetime.strptime(end_time_decoded, '%Y-%m-%d %H:%M')
    except ValueError:
        return Response({"error": "El formato de la fecha y hora es incorrecto. Debe ser 'YYYY-MM-DD HH:MM'"}, status=status.HTTP_400_BAD_REQUEST)

    # Verifica que la franja seleccionada sea válida
    valid_selection = False
    for date, slots in appointment.alternatives.items():
        for slot in slots:
            slot_start_time = datetime.strptime(f"{date} {slot['start']}", '%Y-%m-%d %H:%M')
            slot_end_time = datetime.strptime(f"{date} {slot['end']}", '%Y-%m-%d %H:%M')

            if slot_start_time == start_time and slot_end_time == end_time:
                valid_selection = True
                break
        if valid_selection:
            break

    if not valid_selection:
        return Response({"error": "El rango horario seleccionado no coincide con las alternativas disponibles"}, status=status.HTTP_400_BAD_REQUEST)

    # Actualiza la cita con la nueva fecha y hora seleccionada
    appointment.start_time = start_time
    appointment.end_time = end_time
    appointment.status = "confirmed"
    appointment.save()

    # Enviar un correo de confirmación al paciente
    send_appointment_email(appointment.id, 'modified-accepted')
    return Response({"message": "¡Cita aceptada con éxito!"}, status=status.HTTP_200_OK)


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
    if hasattr(user, 'patient') and appointment.start_time - now < timedelta(hours=48):
        return Response({"error": "No puedes borrar una cita con menos de 48 horas de antelación"}, status=status.HTTP_403_FORBIDDEN)

    try:
        if hasattr(user, 'patient'):
            cancel_payment_patient(appointment.id)
        elif hasattr(user, 'physio'):
            cancel_payment_pyshio(appointment.id)

    except Exception as e:
        print(e)
        return Response({'error': 'An internal error has occurred. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Enviar el correo con el rol del usuario
    send_appointment_email(appointment.id, 'canceled', role)

    # Eliminar la sala asociada, si existe
    Room.objects.filter(appointment=appointment).delete()

    # Eliminar la cita
    appointment.delete()
    update_schedule(appointment)
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
@permission_classes([IsAuthenticated])
def confirm_appointment_using_token(request, token):
    try:
        # Extrae y valida el token; max_age define la expiración en segundos (48 horas)
        data = signing.loads(token, max_age=48*3600)
        appointment_id = data.get('appointment_id')
        token_physio_user_id = data.get('physio_user_id')
    except SignatureExpired:
        return Response({"error": "El token ha expirado"}, status=status.HTTP_400_BAD_REQUEST)
    except BadSignature:
        return Response({"error": "Token de aceptación de cita inválido"}, status=status.HTTP_400_BAD_REQUEST)

    # Busca la cita a partir del ID extraído del token
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    # Verifica que el usuario autenticado sea el fisioterapeuta correspondiente
    if request.user.id != token_physio_user_id:
        return Response({"error": "No autorizado para confirmar esta cita"}, status=status.HTTP_403_FORBIDDEN)

    # Marca la cita como aceptada y guarda
    appointment.status = "confirmed"
    appointment.save()
    send_appointment_email(appointment.id, 'confirmed')


    return Response({"message": "¡Cita aceptada con éxito!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def list_finished_appointments_physio(request):
    """
    Lista las citas finalizadas de un fisioterapeuta.
    """
    physiotherapist = request.user.physio
    if physiotherapist is None:
        return Response(
            {'detail': 'Debe ser fisioterapeuta para ver las citas'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Filtrar por estado finalizado
    status_filter = request.query_params.get('status', 'finished')
    
    appointments = Appointment.objects.filter(
        physiotherapist=physiotherapist,
        status=status_filter
    ).order_by('-end_time')
    
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)
