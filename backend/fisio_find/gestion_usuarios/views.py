from django.shortcuts import get_object_or_404
import re
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PatientAdminViewSerializer, PhysioUpdateSerializer, PhysioRegisterSerializer, PhysioSerializer, PatientSerializer, AppUserSerializer, AppUserAdminViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Physiotherapist, Patient, AppUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from .permissions import IsPhysiotherapist
#from permissions import IsAdmin


from .permissions import IsPatient
from .models import Patient


class PatientProfileView(generics.RetrieveAPIView):
    permission_classes = [IsPatient]

    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientSerializer(patient)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({"error": "Perfil de paciente no encontrado"}, status=status.HTTP_404_NOT_FOUND)


    def patch(self, request, *args, **kwargs):
        try:
            patient = Patient.objects.get(user=request.user)  

            request_data = request.data.copy()

            user_data = request_data.get('user', {})  
            user_data['id'] = request.user.id  

            request_data['user'] = user_data  

            serializer = PatientSerializer(patient, data=request_data, partial=True, context={'request': request})

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            print("Errores en PatientSerializer:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Patient.DoesNotExist:
            return Response({"error": "Perfil de paciente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['POST'])
@permission_classes([AllowAny])
def patient_register_view(request):
    serializer = PatientRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Paciente registrado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_token_obtain_view(request):
    view = TokenObtainPairView.as_view()
    response = view(request._request)
    if 'access' in response.data:
        return Response({'access': response.data['access']})
    return Response(response.data, status=response.status_code)

@api_view(['POST'])
def logout_view(request):
    return Response({"message": "Logout exitoso."}, status=200)

@api_view(['GET'])
def check_role_view(request):
    user = request.user  # Obtenemos el usuario autenticado

    if hasattr(user, 'patient'):
        role = "patient"
    elif hasattr(user, 'physio'):
        role = "physiotherapist"
    elif hasattr(user, 'admin'):
        role = "admin"
    else:
        role = "unknown"

    return Response({"user_role": role})

@api_view(['GET'])
def return_user(request):
    user = request.user
    if hasattr(user, 'patient'):
        serializer = PatientSerializer(user.patient)
        user_serializer = AppUserSerializer(user.patient.user)
        return Response({"patient": {**serializer.data, "user_data": user_serializer.data}})
    elif hasattr(user, 'physio'):
        serializer = PhysioSerializer(user.physio)
        user_serializer = AppUserSerializer(user.physio.user)
        return Response({"physio": {**serializer.data, "user_data": user_serializer.data}})
    return Response({"error": "User role not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def physio_register_view(request):
    serializer = PhysioRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Fisioterapeuta registrado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def physio_update_view(request):
    """Actualiza los datos del fisioterapeuta autenticado"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Aplanar las claves 'user.*' para que coincidan con lo que espera el serializer
    request_data = {}
    for key, value in request.data.items():
        if key.startswith("user."):
            request_data[key[5:]] = value  # Quita el prefijo "user."
        else:
            request_data[key] = value
                
    # Usar el serializador específico para actualización
    serializer = PhysioUpdateSerializer(physio, data=request_data, partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Fisioterapeuta actualizado correctamente"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def physio_create_service_view(request):
    
    """Crea un nuevo servicio para el fisioterapeuta autenticado o actualiza los existentes"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Obtener servicios existentes
    existing_services = physio.services or {}
    
    # Obtener nuevos servicios del request
    new_services = request.data.get('services', {})
    
    # Actualizar servicios existentes o añadir nuevos
    for service_name, service_data in new_services.items():
        if service_name in existing_services:
            # Si el servicio existe, actualizar sus propiedades
            for prop_key, prop_value in service_data.items():
                existing_services[service_name][prop_key] = prop_value
        else:
            # Si el servicio no existe, añadirlo completo
            existing_services[service_name] = service_data
    
    # Preparar los datos para el serializador
    update_data = {'services': existing_services}
    
    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Servicios actualizados correctamente"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def physio_get_services_view(request, physio_id):
    physio = get_object_or_404(Physiotherapist, id=physio_id)
    return Response(physio.services)

@api_view(['DELETE'])
def physio_delete_service_view(request, service_id):
    physio = get_object_or_404(Physiotherapist, user=request.user)
    services = physio.services
    if services is None:
        return Response({"message": "No hay servicios para eliminar"}, status=status.HTTP_200_OK)
    if service_id not in services:
        return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)
    del services[service_id]
    physio.services = services
    physio.save()
    return Response({"message": "Servicio eliminado correctamente"}, status=status.HTTP_200_OK)

"""
class AdminAppUserDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo user por su id para admin.
    '''
    permission_classes = [AllowAny]
    queryset = AppUser.objects.all()
    serializer_class = AppUserAdminViewSerializer

class AdminPatientCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término para admin.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer


class AdminPatientList(generics.ListAPIView):
    '''
    API endpoint para listar los pacientes para admin.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientAdminViewSerializer

class AdminPatientnDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo paciente por su id para admin.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientAdminViewSerializer

class AdminPatientUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para que admin actualice un término.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer

class AdminPatientDelete(generics.DestroyAPIView):
    '''
    API endpoint para que admin elimine un término.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer
"""