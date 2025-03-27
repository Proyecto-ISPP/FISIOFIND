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
