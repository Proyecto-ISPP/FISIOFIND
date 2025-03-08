from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from gestion_citas.permissions import IsOwner
from gestion_citas.models import Appointment
from gestion_citas.serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from gestion_usuarios.permissions import IsAdmin

class AppointmentList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['patient', 'physiotherapist', 'status', 'is_online']
    ordering_fields = ['start_time', 'end_time']

class AppointmentDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
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