import base64
from decimal import Decimal
import json
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import Physiotherapist
from users.models import Specialization 
from rest_framework.decorators import api_view, permission_classes
import random


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
        filters &= Q(gender__iexact=gender[0])  # 'M' o 'F'

    if postal_code:
        filters &= Q(user__postal_code__icontains=postal_code)

    if name:
        filters &= Q(user__first_name__icontains=name) | Q(user__last_name__icontains=name)

    # Obtener los fisioterapeutas con los filtros básicos
    physiotherapists = Physiotherapist.objects.filter(filters).distinct()

    # Filtro por precio máximo
    if max_price:
        try:
            max_price_value = float(max_price)
            physiotherapists = [
                physio for physio in physiotherapists
                if any(
                    float(service.get('price', float('inf'))) <= max_price_value
                    for service in physio.services.values()
                )
            ]
        except (ValueError, TypeError):
            pass  # Ignora si max_price no es válido

    # Filtro por schedule (mañana, tarde, noche)
    if schedule:
        time_ranges = {
            'mañana': (time_to_minutes('06:00'), time_to_minutes('14:00')),
            'tarde': (time_to_minutes('14:00'), time_to_minutes('20:00')),
            'noche': (time_to_minutes('20:00'), time_to_minutes('23:59'))
        }
        
        if schedule in time_ranges:
            req_start_min, req_end_min = time_ranges[schedule]
            physiotherapists = [
                physio for physio in physiotherapists
                if has_availability_any_day(
                    get_weekly_schedule(physio.schedule),
                    req_start_min,
                    req_end_min
                )
            ]

    exact_matches = weighted_shuffle(physiotherapists)[:12]

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
                    if any(
                        float(service.get('price', float('inf'))) <= max_price_value
                        for service in physio.services.values()
                    )
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

    def serialize(physios):
        results = []
        for physio in physios:
            specializations = physio.specializations.all()
            specialization_names = [s.name for s in specializations]
            
            # Manejar el campo image
            image_data = None
            if physio.user.photo:
                if isinstance(physio.user.photo, str):
                    image_data = physio.user.photo  # Asumir que es una URL
                elif hasattr(physio.user.photo, 'read'):  # Es un archivo
                    image_data = base64.b64encode(physio.user.photo.read()).decode('utf-8')
                else:  # Datos binarios crudos
                    image_data = base64.b64encode(physio.user.photo).decode('utf-8')

            results.append({
                'id': physio.id,
                'name': f'{physio.user.first_name} {physio.user.last_name}',
                'specializations': ', '.join(specialization_names),
                'gender': physio.gender,
                'postalCode': physio.user.postal_code,
                'rating': physio.rating_avg,
                'image': image_data,
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
            if isinstance(slot, list) and slot:  # Verifica que slot sea una lista no vacía
                slot = slot[0]  # Toma el primer elemento de la lista
                start_str = slot.get('start', '00:00')
                end_str = slot.get('end', '00:00')
                
                # Si start y end están vacíos, asumir todo el día (00:00 - 23:59)
                if not start_str and not end_str:
                    slot_start_min = time_to_minutes('00:00')  # 0 minutos
                    slot_end_min = time_to_minutes('23:59')    # 1439 minutos
                else:
                    slot_start_min = time_to_minutes(start_str)
                    slot_end_min = time_to_minutes(end_str)
                
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