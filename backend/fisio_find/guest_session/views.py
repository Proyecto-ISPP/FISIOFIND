from decimal import Decimal
import random
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import Physiotherapist
from users.models import Specialization


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
        
class AdvancedSearchView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        specialization = data.get('specialization', '')
        gender = data.get('gender', '')
        postal_code = data.get('postalCode', '')
        max_price = data.get('maxPrice', '')
        schedule = data.get('schedule', '')
        name = data.get('name', '')

        filters = Q()

        if specialization:
            filters &= Q(specializations__name__iexact=specialization)

        if gender and gender != 'indifferent':
            filters &= Q(gender__iexact=gender[0])  # 'M' o 'F'

        if postal_code:
            filters &= Q(user__postal_code__icontains=postal_code)

        if max_price:
            filters &= Q(user__price__lte=max_price)

        if name:
            filters &= Q(user__first_name__icontains=name) | Q(user__last_name__icontains=name)

        physiotherapists = Physiotherapist.objects.filter(filters).distinct()
        exact_matches = weighted_shuffle(physiotherapists)[:12]

        suggested_matches = []
        if not exact_matches and specialization:
            similar = Physiotherapist.objects.filter(
                Q(specializations__name__icontains=specialization) |
                Q(user__postal_code__icontains=postal_code)
            ).distinct()
            suggested_matches = weighted_shuffle(similar)[:12]

        def serialize(physios):
            results = []
            for physio in physios:
                specializations = physio.specializations.all()
                specialization_names = [s.name for s in specializations]

                results.append({
                    'id': physio.id,
                    'name': f'{physio.user.first_name} {physio.user.last_name}',
                    'specializations': ', '.join(specialization_names),
                    'gender': physio.gender,
                    'postalCode': physio.user.postal_code,
                    'price': physio.user.price,
                    'rating': physio.rating_avg,
                    'image': physio.user.profile_image.url if physio.user.profile_image else None,
                })
            return results

        return Response({
            'exactMatches': serialize(exact_matches),
            'suggestedMatches': serialize(suggested_matches)
        }, status=status.HTTP_200_OK)
    
def weighted_shuffle(physios):
    golds = [p for p in physios if is_gold_physio(p)]
    regulars = [p for p in physios if not is_gold_physio(p)]

    # Damos más peso a los golds repitiéndolos en el pool
    weighted_pool = golds * 3 + regulars

    # Barajamos el conjunto y eliminamos duplicados por ID
    seen_ids = set()
    shuffled = []
    for physio in random.sample(weighted_pool, k=min(len(weighted_pool), 20)):
        if physio.id not in seen_ids:
            seen_ids.add(physio.id)
            shuffled.append(physio)

    return shuffled

def is_gold_physio(physio):
    return physio.plan and physio.plan.price == Decimal('24.99')

