# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room
from .serializers import RoomSerializer
from rest_framework.permissions import AllowAny

class RoomCreateView(APIView):
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Crea una nueva sala
        room = Room.objects.create()  # El código se generará automáticamente
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RoomJoinView(APIView):
    
    permission_classes = [AllowAny]
    
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
    
    permission_classes = [AllowAny]
    
    def delete(self, request, code):
        # Elimina una sala
        try:
            room = Room.objects.get(code=code)
            room.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Room.DoesNotExist:
            return Response({'detail': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)