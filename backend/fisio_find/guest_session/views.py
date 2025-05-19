import base64
import json
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import Physiotherapist
from users.models import Specialization
from appointment_rating.models import AppointmentRating
from django.db.models import Avg, Count
from rest_framework.decorators import api_view, permission_classes
import random
from django.conf import settings
import os


class SearchPhysiotherapistView(APIView):
    """
    Vista para buscar fisioterapeutas por nombre o apellido, incluyendo su especialidad.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Indica un nombre."}, status=status.HTTP_400_BAD_REQUEST)

        # Filtramos fisioterapeutas por nombre o apellido
        physiotherapists = Physiotherapist.objects.filter(
            Q(user__first_name__icontains=query) | Q(user__last_name__icontains=query)
        )

        # Preparamos los datos que queremos devolver, incluyendo la especialidad
        results = []
        for physio in physiotherapists:
            # Recuperar especialidades del fisioterapeuta
            specializations = physio.specializations.all()  # Supuesto campo ManyToManyField
            specialization_names = [specialization.name for specialization in specializations]

            # Preparar un diccionario con la información que se va a devolver
            physio_data = {
                'first_name': physio.user.first_name,
                'last_name': physio.user.last_name,
                'specializations': specialization_names
            }
            results.append(physio_data)

        return Response(results, status=status.HTTP_200_OK)


class ListSpecializationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        specializations = Specialization.objects.all()
        data = [specialization.name for specialization in specializations]
        return Response(data, status=status.HTTP_200_OK)


class PhysiotherapistsWithSpecializationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        specialization_name = request.query_params.get('specialization', None)
        if not specialization_name:
            return Response({"error": "Se necesita una especialización"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            specialization = Specialization.objects.get(name__iexact=specialization_name)
            physiotherapists = Physiotherapist.objects.filter(specializations=specialization)

            # Preparamos los datos con las especialidades
            results = []
            for physio in physiotherapists:
                specializations = physio.specializations.all()
                specialization_names = [specialization.name for specialization in specializations]

                # Creamos el diccionario con los datos
                physio_data = {
                    'id': physio.id,
                    'first_name': physio.user.first_name,
                    'last_name': physio.user.last_name,
                    'specializations': specialization_names
                }
                results.append(physio_data)

            return Response(results, status=status.HTTP_200_OK)
        except Specialization.DoesNotExist:
            return Response({"error": "Especialidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def advanced_search(request):
    data = request.data
    specialization = data.get('specialization', '')
    gender = data.get('gender', '')
    postal_code = data.get('postalCode', '')
    max_price = data.get('maxPrice', '')
    schedule = data.get('schedule', '')  # 'mañana', 'tarde', 'noche' o ''
    name = data.get('name', '')

    filters = Q()

    if specialization:
        filters &= Q(specializations__name__iexact=specialization)

    if gender and gender != 'indifferent':
        gender_map = {'male': 'M', 'female': 'F'}
        gender_code = gender_map.get(gender, '')
        if gender_code:
            filters &= Q(gender__iexact=gender_code)  # 'M' o 'F'

    if postal_code:
        filters &= Q(user__postal_code__icontains=postal_code)

    if name:
        filters &= Q(user__first_name__icontains=name) | Q(user__last_name__icontains=name)

    # Obtener los fisioterapeutas con los filtros básicos
    physiotherapists = Physiotherapist.objects.filter(filters).distinct()

    # Filtrar solo los que realmente tienen al menos un servicio válido (no solo string no vacío, sino que el JSON tenga al menos un servicio)
    def has_at_least_one_service(services):
        if not services:
            return False
        if isinstance(services, str):
            try:
                services = json.loads(services)
            except Exception:
                return False
        return bool(services) and len(services) > 0

    physiotherapists = [p for p in physiotherapists if has_at_least_one_service(p.services)]

    # Función auxiliar para calcular el precio medio (solo para serialización)
    def get_average_price(services):
        if not services:
            return None
        if isinstance(services, str):
            try:
                services = json.loads(services)
            except json.JSONDecodeError:
                return None

        prices = []
        for service_key, service_data in services.items():
            if isinstance(service_data, dict) and 'price' in service_data:
                try:
                    price = float(service_data['price'])
                    prices.append(price)
                except (ValueError, TypeError):
                    continue
        return sum(prices) / len(prices) if prices else None

    # Función auxiliar para verificar si hay algún servicio menor o igual a max_price
    def has_service_below_price(services, max_price_value):
        if not services:
            return False
        if isinstance(services, str):
            try:
                services = json.loads(services)
            except json.JSONDecodeError:
                return False

        for service_key, service_data in services.items():
            if isinstance(service_data, dict) and 'price' in service_data:
                try:
                    price = float(service_data['price'])
                    if price <= max_price_value:
                        return True
                except (ValueError, TypeError):
                    continue
        return False

    # Filtro por precio máximo (al menos un servicio menor o igual a max_price)
    if max_price:
        try:
            max_price_value = float(max_price)
            filtered_physios = [
                physio for physio in physiotherapists
                if has_service_below_price(physio.services, max_price_value)
            ]
            physiotherapists = filtered_physios
        except (ValueError, TypeError):
            pass  # Ignora si max_price no es válido

    # Filtro por schedule (mañana, tarde, noche)
    time_ranges = {
        'mañana': (time_to_minutes('06:00'), time_to_minutes('14:00')),
        'tarde': (time_to_minutes('14:00'), time_to_minutes('20:00')),
        'noche': (time_to_minutes('20:00'), time_to_minutes('23:00'))
    }

    if schedule and schedule in time_ranges:
        req_start_min, req_end_min = time_ranges[schedule]
        filtered_physios = []
        for physio in physiotherapists:
            try:
                weekly_schedule = get_weekly_schedule(physio.schedule)
                if has_availability_any_day(weekly_schedule, req_start_min, req_end_min):
                    filtered_physios.append(physio)
            except Exception:
                continue
        physiotherapists = filtered_physios

    exact_matches = weighted_shuffle(physiotherapists)[:12]

    # Lógica para sugerencias
    suggested_matches = []
    if not exact_matches and specialization:
        similar = Physiotherapist.objects.filter(
            Q(specializations__name__icontains=specialization) |
            Q(user__postal_code__icontains=postal_code)
        ).distinct()
        if max_price:
            try:
                max_price_value = float(max_price)
                similar = [
                    physio for physio in similar
                    if has_service_below_price(physio.services, max_price_value)
                ]
            except (ValueError, TypeError):
                pass
        if schedule in time_ranges:
            req_start_min, req_end_min = time_ranges[schedule]
            similar = [
                physio for physio in similar
                if has_availability_any_day(
                    get_weekly_schedule(physio.schedule),
                    req_start_min,
                    req_end_min
                )
            ]
        suggested_matches = weighted_shuffle(similar)[:12]

    # Serialización con precio medio
    def serialize(physios):
        results = []
        # Base URL del servidor (ajústala según tu configuración)
        base_url = request.build_absolute_uri('/')[:-1]  # e.g., http://localhost:8000
        
        for physio in physios:
            specializations = physio.specializations.all()
            specialization_names = [s.name for s in specializations]

            # Calcular precio medio
            avg_price = get_average_price(physio.services)

            # Manejar el campo image como URL completa
            image_url = None
            if physio.user.photo:
                if isinstance(physio.user.photo, str):
                    # Si es una ruta relativa, construir la URL completa
                    image_url = f"{base_url}{settings.MEDIA_URL}{physio.user.photo}"
                elif hasattr(physio.user.photo, 'url'):
                    # Si es un campo FileField, usar su URL
                    image_url = f"{base_url}{physio.user.photo.url}"
                elif hasattr(physio.user.photo, 'read'):
                    # Si es un archivo, opcionalmente podrías seguir usando base64
                    # Pero para consistencia, asumimos que está guardado en media/
                    image_url = None  # O manejar esto de otra forma si es necesario
                else:
                    # Datos binarios crudos (menos común)
                    image_url = None
                
            rating = physio.rating_avg
            try:
                aggregate_data = AppointmentRating.objects.filter(
                    physiotherapist=physio
                ).aggregate(average=Avg("score"), count=Count("id"))
                avg_score = aggregate_data["average"]
                ratings_count = aggregate_data["count"]

                # Si existen valoraciones, redondeamos el promedio a dos decimales.
                if ratings_count > 0 and avg_score is not None:
                    rating = round(avg_score, 2)

            except Exception as e:
                rating = physio.rating_avg

            results.append({
                'id': physio.id,
                'name': f'{physio.user.first_name} {physio.user.last_name}',
                'specializations': ', '.join(specialization_names),
                'gender': physio.gender,
                'postalCode': physio.user.postal_code,
                'rating': rating,
                'price': avg_price,
                'image': image_url,  # Ahora siempre es una URL completa o None
            })
        return results

    return Response({
        'exactMatches': serialize(exact_matches),
        'suggestedMatches': serialize(suggested_matches)
    }, status=status.HTTP_200_OK)

def weighted_shuffle(physios):
    golds = [p for p in physios if is_gold_physio(p)]
    regulars = [p for p in physios if not is_gold_physio(p)]
    weighted_pool = golds * 3 + regulars
    seen_ids = set()
    shuffled = []
    for physio in random.sample(weighted_pool, k=min(len(weighted_pool), 20)):
        if physio.id not in seen_ids:
            seen_ids.add(physio.id)
            shuffled.append(physio)
    return shuffled


def is_gold_physio(physio):
    return physio.plan and physio.plan.name == 'Gold'


def time_to_minutes(time_str):
    """Convierte un string de tiempo HH:MM a minutos desde medianoche."""
    if not time_str:  # Si está vacío, devolver 0 (o ajustar según necesidad)
        return 0
    try:
        hours, minutes = map(int, time_str.split(':'))
        return hours * 60 + minutes
    except (ValueError, TypeError):
        return 0  # Valor por defecto si la conversión falla


def has_availability_any_day(weekly_schedule, req_start_min, req_end_min):
    """Verifica si hay disponibilidad en cualquier día que se solape con el rango solicitado."""
    for day_schedule in weekly_schedule.values():
        for slot in day_schedule:
            if isinstance(slot, dict):
                start_str = slot.get('start', '00:00')
                end_str = slot.get('end', '00:00')

                if not start_str and not end_str:
                    slot_start_min = time_to_minutes('00:00')
                    slot_end_min = time_to_minutes('23:59')
                else:
                    slot_start_min = time_to_minutes(start_str)
                    slot_end_min = time_to_minutes(end_str)

                # Comprobamos si hay intersección con la franja solicitada
                if slot_start_min <= req_end_min and slot_end_min >= req_start_min:
                    return True
    return False


def get_weekly_schedule(schedule):
    """Obtiene el weekly_schedule manejando tanto cadenas como diccionarios."""
    if isinstance(schedule, str):
        try:
            return json.loads(schedule).get('weekly_schedule', {})
        except (json.JSONDecodeError, AttributeError):
            return {}
    elif isinstance(schedule, dict):
        return schedule.get('weekly_schedule', {})
    return {}
