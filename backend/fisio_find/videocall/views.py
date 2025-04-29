# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from users.permissions import IsPhysiotherapist
from .models import Room
from .serializers import RoomSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from users.models import Physiotherapist, Patient
from django.utils.timezone import now
from datetime import timedelta
# views.py

class RoomCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        physiotherapist_id = request.data.get('physiotherapist_id')
        patient_id = request.data.get('patient_id')

        if not physiotherapist_id or not patient_id:
            return Response({'detail': 'physiotherapist_id y patient_id son necesarios'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            physiotherapist = Physiotherapist.objects.get(id=physiotherapist_id)
            patient = Patient.objects.get(id=patient_id)
        except (Physiotherapist.DoesNotExist, Patient.DoesNotExist):
            return Response({'detail': 'ID de fisioterapeuta o paciente inválidos'}, status=status.HTTP_404_NOT_FOUND)

        room = Room.objects.create(physiotherapist=physiotherapist, patient=patient)
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RoomJoinView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        try:
            room = Room.objects.get(code=code)
        except Room.DoesNotExist:
            return Response({'detail': 'Sala no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        # Validación de acceso por usuario
        if hasattr(user, 'physio') and room.physiotherapist != user.physio:
            return Response({'detail': 'No autorizado para unirse a esta sala'}, status=status.HTTP_403_FORBIDDEN)
        if hasattr(user, 'patient'):
            if room.is_test_room:
                return Response({'detail': 'Esta sala de prueba es solo para el fisioterapeuta'}, status=status.HTTP_403_FORBIDDEN)
            elif room.patient != user.patient:
                return Response({'detail': 'No autorizado para unirse a esta sala'}, status=status.HTTP_403_FORBIDDEN)
        if not room.is_test_room and room.appointment:
            start = room.appointment.start_time
            end = room.appointment.end_time
            current = now()
            #Quiza demasiado tiempo pero así evitamos problemas en la demo
            start_window = start - timedelta(minutes=120)
            end_window = end + timedelta(minutes=120)

            if not (start_window <= current <= end_window):
                return Response({
                    'detail': 'Esta sala solo está disponible desde 30 minutos antes hasta 60 minutos después de la cita.'
                }, status=status.HTTP_403_FORBIDDEN) 
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RoomDeleteView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, code):
        # Elimina una sala
        try:
            room = Room.objects.get(code=code)
            room.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Room.DoesNotExist:
            return Response({'detail': 'Sala no encontrada'}, status=status.HTTP_404_NOT_FOUND)

class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        Room.objects.filter(
            appointment__end_time__lt=now() - timedelta(minutes=120),
            is_test_room=False
        ).delete()

        if hasattr(user, 'physio'):
            rooms = Room.objects.filter(physiotherapist=user.physio)
        elif hasattr(user, 'patient'):
            rooms = Room.objects.filter(patient=user.patient)
        else:
            return Response({'detail': 'No se encontraron salas para este usuario'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TestRoomCreateView(APIView):
    permission_classes = [IsAuthenticated, IsPhysiotherapist]

    def post(self, request):
        physiotherapist = request.user.physio

        existing = Room.objects.filter(
            physiotherapist=physiotherapist,
            is_test_room=True
        ).first()

        if existing:
            return Response({
                "detail": "Ya tienes una sala de prueba activa.",
                "code": existing.code
            }, status=status.HTTP_200_OK)  

        room = Room.objects.create(
            physiotherapist=physiotherapist,
            patient=None,
            is_test_room=True
        )
        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

