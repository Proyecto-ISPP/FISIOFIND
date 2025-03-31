# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room
from .serializers import RoomSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from users.models import Physiotherapist, Patient

# views.py

class RoomCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        physiotherapist_id = request.data.get('physiotherapist_id')
        patient_id = request.data.get('patient_id')

        if not physiotherapist_id or not patient_id:
            return Response({'detail': 'physiotherapist_id and patient_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            physiotherapist = Physiotherapist.objects.get(id=physiotherapist_id)
            patient = Patient.objects.get(id=patient_id)
        except (Physiotherapist.DoesNotExist, Patient.DoesNotExist):
            return Response({'detail': 'Invalid physiotherapist or patient ID'}, status=status.HTTP_404_NOT_FOUND)

        room = Room.objects.create(physiotherapist=physiotherapist, patient=patient)
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RoomJoinView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, code):
        # Verifica si la sala existe
        try:
            room = Room.objects.get(code=code)
            print(room)
            serializer = RoomSerializer(room)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({'detail': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

class RoomDeleteView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, code):
        # Elimina una sala
        try:
            room = Room.objects.get(code=code)
            room.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Room.DoesNotExist:
            return Response({'detail': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        



class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, 'physio'):
            rooms = Room.objects.filter(physiotherapist=user.physio)
        elif hasattr(user, 'patient'):
            rooms = Room.objects.filter(patient=user.patient)
        else:
            return Response({'detail': 'No se encontraron salas para este usuario'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)