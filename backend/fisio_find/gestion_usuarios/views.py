from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import PatientRegisterSerializer, PatientAdminViewSerializer, PhysioRegisterSerializer, PhysioSerializer, PatientSerializer, AppUserSerializer, AppUserAdminViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
#from permissions import IsAdmin
from gestion_usuarios.models import Patient, AppUser


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
