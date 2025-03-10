from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from gestion_usuarios.models import Physiotherapist
from gestion_usuarios.serializers import PhysioSerializer
from gestion_usuarios.models import Specialization

class SearchPhysiotherapistView(APIView):
    """
    Vista para buscar fisioterapeutas por nombre o apellido.
    """
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Indica un nombre."}, status=status.HTTP_400_BAD_REQUEST)
        
        physiotherapists = Physiotherapist.objects.filter(
            Q(user__first_name__icontains=query) | Q(user__last_name__icontains=query)
        )
        serializer = PhysioSerializer(physiotherapists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
            serializer = PhysioSerializer(physiotherapists, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Specialization.DoesNotExist:
            return Response({"error": "Especialidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)
