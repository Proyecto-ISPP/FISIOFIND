from django.shortcuts import get_object_or_404
import re
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PatientAdminViewSerializer, PhysioRegisterSerializer, PhysioSerializer, PatientSerializer, AppUserSerializer, AppUserAdminViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Physiotherapist, Patient, AppUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from permissions import IsAdmin
from .models import ACCOUNT_STATUS_CHOICES


from .permissions import IsPatient
from .models import Patient
from rest_framework.permissions import IsAuthenticated

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

@api_view(['POST'])
@permission_classes([AllowAny])
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
                
    # Serializar y validar los datos enviados
    serializer = PhysioRegisterSerializer(physio, data=request_data, partial=True)
    print(request_data['schedule'])
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Fisioterapeuta actualizado correctamente"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_list_pacient_profiles(request):
    user = request.user
    if hasattr(user, 'admin'):
        patients = Patient.objects.all()   
        patient_data = [{
            "patient": PatientSerializer(patient).data,
            "user_data": AppUserSerializer(patient.user).data
        } for patient in patients]
        return Response({"patients": patient_data}, status=status.HTTP_200_OK)
    return Response({"error": "No tienes permisos para ver esta información."}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_list_physioterapist_profiles(request):
    user = request.user
    if hasattr(user, 'admin'):
        physioterapists = Physiotherapist.objects.all()   
        physioterapist_data = [{
            "physioterapist": PhysioSerializer(physioterapist).data,
            "user_data": AppUserSerializer(physioterapist.user).data
        } for physioterapist in physioterapists]
        return Response({"physioterapists": physioterapist_data}, status=status.HTTP_200_OK)

    return Response({"error": "No tienes permisos para ver esta información."}, status=status.HTTP_403_FORBIDDEN)

@api_view(['DELETE'])
@permission_classes([IsAdmin]) 
def admin_delete_user(request, user_id):
    user_to_delete = get_object_or_404(AppUser, id=user_id)

    if hasattr(user_to_delete, 'admin'):
        return Response({"error": "No puedes eliminar a otro administrador."}, status=status.HTTP_403_FORBIDDEN)

    user_to_delete.delete()
    return Response({"message": "Usuario eliminado correctamente."}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
def admin_update_account_status(request, user_id):
    user_to_update = get_object_or_404(AppUser, id=user_id)

    new_status = request.data.get('account_status')
    if not new_status:
        return Response({"error": "Debes proporcionar un nuevo estado de cuenta."}, status=status.HTTP_400_BAD_REQUEST)

    valid_statuses = [choice[0] for choice in ACCOUNT_STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response({"error": "Estado de cuenta inválido."}, status=status.HTTP_400_BAD_REQUEST)

    user_to_update.account_status = new_status
    user_to_update.save()

    return Response({"message": "Estado de cuenta actualizado correctamente.", "new_status": new_status}, status=status.HTTP_200_OK)


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