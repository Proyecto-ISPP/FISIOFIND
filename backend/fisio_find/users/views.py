import logging
import stripe
import os
from django.conf import settings
import json
import boto3
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.http import HttpResponse, StreamingHttpResponse
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PhysioUpdateSerializer, PhysioRegisterSerializer
from .serializers import PhysioSerializer, PatientSerializer, AppUserSerializer
from .models import AppUser, Physiotherapist, Patient, Specialization
from rest_framework import generics
from .permissions import IsPhysiotherapist
from .permissions import IsPatient
import json
from .permissions import IsAdmin
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    PatientRegisterSerializer,
    PhysioRegisterSerializer,
    PhysioSerializer,
    PatientSerializer,
    AppUserSerializer,
    VideoSerializer,
    PhysioUpdateSerializer,
)
from .models import Physiotherapist, Patient, AppUser, Video
from .permissions import (
    IsPatient,
    IsPhysiotherapist,
    IsPhysioOrPatient,
    IsAdmin,
)


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
@permission_classes([AllowAny])
def check_role_view(request):
    if not request.user.is_authenticated:
        return Response({"user_role": "unknown"})

    user = request.user

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
def validate_physio_registration(request):
    """
    Valida los datos de registro sin crear el usuario.
    """
    serializer = PhysioRegisterSerializer(data=request.data)
    if serializer.is_valid():
        return Response({"valid": True}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def physio_register_view(request):
    serializer = PhysioRegisterSerializer(data=request.data)
    if serializer.is_valid():
        
        serializer.save()
        return Response({"message": "Fisioteraputa registrado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def process_payment(request):
    """
    Endpoint para procesar el pago usando Stripe.
    Se espera recibir:
      - payment_method_id: El ID del método de pago generado por Stripe.
      - amount: Monto en céntimos (por ejemplo, 1799 para 17,99€).
      - currency: Moneda (por defecto "eur").
    """

    stripe.api_key = settings.STRIPE_SECRET_KEY
    payment_method_id = request.data.get("payment_method_id")
    amount = request.data.get("amount")
    currency = request.data.get("currency", "eur")
    

    if not payment_method_id or not amount:
        print("estamos aqui")
        return Response({"error": "Faltan parámetros obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Aseguramos que amount es un entero
        amount = int(amount)
    except ValueError:
        print("estamos aqui en el monto")
        return Response({"error": "El monto debe ser un número entero."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Crear y confirmar el PaymentIntent
        intent = stripe.PaymentIntent.create(
            payment_method=payment_method_id,
            amount=amount,
            currency=currency,
            confirm=True,
            off_session=True,
            automatic_payment_methods={
                'enabled': True,
                'allow_redirects': 'never'  # Evita métodos de redirección
},
            
            
        )

        if intent.status == "succeeded":
            return Response({"success": True, "payment_intent": intent}, status=status.HTTP_200_OK)
        elif intent.status == "requires_action":
            return Response({
                "requires_action": True,
                "payment_intent_client_secret": intent.client_secret
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "El pago no fue exitoso.", "status": intent.status}, status=status.HTTP_400_BAD_REQUEST)

    except stripe.error.CardError as e:
        print("error de tarjeta")
        return Response({"error": e.user_message or str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("error general")
        return Response({"error": "Error procesando el pago: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def physio_update_view(request):
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Extraer especializaciones primero para manejarlas por separado
    specializations_data = None
    
    # Procesar el campo specializations
    if "specializations" in request.data:
        if isinstance(request.data["specializations"], str):
            try:
                # Intentar convertirlo desde un string JSON
                specializations_data = json.loads(request.data["specializations"])
            except json.JSONDecodeError:
                # Si no es JSON, podría ser una cadena separada por comas
                if "," in request.data["specializations"]:
                    specializations_data = [s.strip() for s in request.data["specializations"].split(",")]
                else:
                    # Si es un solo valor, crear una lista con ese valor
                    specializations_data = [request.data["specializations"]]
        elif isinstance(request.data["specializations"], list):
            specializations_data = request.data["specializations"]
    
    # Preparar datos para el serializador, excluyendo las especializaciones
    request_data = {}
    for key, value in request.data.items():
        if key == "specializations":
            continue  # Las procesamos después
        if key.startswith("user."):
            request_data[key[5:]] = value  # Remove "user." prefix
        else:
            request_data[key] = value

    # Ensure services are parsed as JSON if provided
    if "services" in request_data and isinstance(request_data["services"], str):
        try:
            request_data["services"] = json.loads(request_data["services"])
        except json.JSONDecodeError:
            return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)

    # Serialize and validate the data
    serializer = PhysioUpdateSerializer(physio, data=request_data, partial=True, context={'request': request})

    if serializer.is_valid():
        # Guardar primero los datos principales
        updated_physio = serializer.save()
        
        # Actualizar especializaciones
        if specializations_data is not None:
            try:
                # Obtenemos los IDs de las especializaciones existentes o las creamos si no existen
                specialization_ids = []
                for spec_name in specializations_data:
                    # Buscamos por nombre en el modelo de Specialization
                    spec, created = Specialization.objects.get_or_create(name=spec_name)
                    specialization_ids.append(spec.id)
                
                # Ahora asignamos los IDs al campo ManyToMany
                updated_physio.specializations.set(specialization_ids)
                
                # Guardar explícitamente después de modificar las relaciones M2M
                updated_physio.save()
                
                # Refrescar objeto para tener los datos actualizados
                updated_physio.refresh_from_db()
                
            except Exception as e:
                logging.error(f"Error al guardar especializaciones: {str(e)}")
                return Response({"error": "Error al guardar especializaciones"},  
                              status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Usar serializers para convertir los datos a JSON
        physio_serializer = PhysioSerializer(updated_physio)
        user_serializer = AppUserSerializer(updated_physio.user)
        
        response_data = {
            "message": "Fisioterapeuta actualizado correctamente"
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def physio_create_service_view(request):
    
    """Crea un nuevo servicio para el fisioterapeuta autenticado o actualiza el existente"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Obtener servicios existentes
    existing_services = physio.services or {}
    
    # Obtener nuevos servicios del request
    new_service = request.data
    
    # Actualizar servicios existentes o añadir nuevos
    service_title = new_service.get('id')
    if service_title in existing_services:
        # Si el servicio ya existe, actualizarlo
        existing_services[str(service_title)].update(new_service)
    else:
        # Si el servicio no existe, asignar una nueva ID única y añadirlo completo
        new_id = 1
        while str(new_id) in existing_services:
            new_id += 1
        new_service['id'] = new_id
        existing_services[str(new_id)] = new_service
    
    # Preparar los datos para el serializador
    update_data = {'services': existing_services}
    
    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Servicios actualizados correctamente", "services": existing_services}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def physio_update_service_view(request, service_id):
    
    """Actualiza un nuevo servicio para el fisioterapeuta autenticado o actualiza el existente"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Obtener servicios existentes
    existing_services = physio.services or {}
    
    # Obtener nuevos servicios del request
    new_service = request.data
    
    if str(service_id) not in existing_services:
        return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)
    existing_services[str(service_id)].update(new_service)

    # Preparar los datos para el serializador
    update_data = {'services': existing_services}
    
    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Servicios actualizados correctamente", "services": existing_services}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def physio_get_services_view(request, physio_id):
    physio = get_object_or_404(Physiotherapist, id=physio_id)
    physio_name = physio.user.first_name + " " + physio.user.last_name
    response_data = {
        'physio_name': physio_name,
        'services': physio.services
    }
    return Response(response_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def physio_delete_service_view(request, service_name):
    try:
        # Get the physiotherapist profile
        physio = Physiotherapist.objects.get(user=request.user)
        
        # Get current services
        services = physio.services
        return Response(services)
    except Exception as e:
        logging.error("Error retrieving services for physiotherapist %s: %s", physio_id, str(e))
        return Response({"error": "An internal error has occurred."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def physio_delete_service_view(request, service_id):
    physio = get_object_or_404(Physiotherapist, user=request.user)
    services = physio.services or {}
    
    # Comprobar si el service_id está en alguno de los campos 'id' de los servicios
    if str(service_id) not in services:
        return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)
    
    # Eliminar el servicio
    del services[str(service_id)]
    physio.services = services
    physio.save()
    
    return Response({"message": "Servicio eliminado correctamente", "services": services}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_search_patients_by_user(request, query):
    matched_users = AppUser.objects.filter(
        Q(dni__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    )

    patients = Patient.objects.filter(user__in=matched_users)
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_search_physios_by_user(request, query):
    matched_users = AppUser.objects.filter(
        Q(dni__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    )

    physios = Physiotherapist.objects.filter(user__in=matched_users)
    serializer = PhysioSerializer(physios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class AdminPatientDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo paciente por su id para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
class AdminPhysioDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo paciente por su id para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Physiotherapist.objects.all()
    serializer_class = PhysioSerializer
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
    permission_classes = [IsAdmin]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer

class AdminPhysioCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Physiotherapist.objects.all()
    serializer_class = PhysioRegisterSerializer
    
class AdminPhysioUpdate(generics.UpdateAPIView):
    permission_classes = [IsAdmin]
    queryset = Physiotherapist.objects.all()
    serializer_class = PhysioRegisterSerializer
    
class AdminPatientUpdate(generics.UpdateAPIView):
    permission_classes = [IsAdmin]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer


class AdminAppUserDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo user por su id para admin.
    '''
    permission_classes = [AllowAny]
    queryset = AppUser.objects.all()
    serializer_class = AppUserAdminViewSerializer
    

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_list_patient_profiles(request):
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

@api_view(['PATCH'])
@permission_classes([IsAdmin])
def admin_remove_user(request, user_id):
    user_to_update = get_object_or_404(AppUser, id=user_id)

    if hasattr(user_to_update, 'admin'):
        return Response({"error": "No puedes eliminar a otro administrador."}, status=status.HTTP_403_FORBIDDEN)
    
    user_to_update.account_status = "REMOVED"
    user_to_update.save()

    return Response({"message": "Usuario marcado como REMOVED correctamente. Para eliminarlo, debe hacerlo directamente desde la base de datos."}, status=status.HTTP_200_OK)


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
"""
'''
class AdminPatientDelete(generics.DestroyAPIView):
    
    #API endpoint para que admin elimine un término.

    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer
"""

@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def create_file(request):
    print("🔍 Datos recibidos:", request.data)

    # Convertir request.data en un diccionario mutable (para modificar el QueryDict)
    mutable_data = request.data.copy()

    # Manejo de `patients` usando emails en lugar de IDs
    patients_raw = mutable_data.get("patients")
    if patients_raw:
        if isinstance(patients_raw, str):
            try:
                # Se espera una cadena JSON con una lista de emails, por ejemplo: '["email1@example.com", "email2@example.com"]'
                patients_list = json.loads(patients_raw)
                if isinstance(patients_list, list) and all(isinstance(i, str) for i in patients_list):
                    # Buscar usuarios que coincidan con los emails proporcionados
                    users = AppUser.objects.filter(email__in=patients_list)
                    found_emails = set(users.values_list("email", flat=True))
                    missing_emails = set(patients_list) - found_emails
                    if missing_emails:
                        return Response(
                            {"errorManaged": f"Usuarios no encontrados para emails: {', '.join(list(missing_emails))}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    # Obtener los pacientes asociados a esos usuarios
                    patients = Patient.objects.filter(user__in=users)
                    patients_found_emails = set(patients.values_list("user__email", flat=True))
                    missing_patients = found_emails - patients_found_emails
                    if missing_patients:
                        return Response(
                            {"errorManaged": f"Paciente no encontrado para usuarios con emails: {', '.join(list(missing_patients))}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    # Convertir el queryset a una lista de IDs de Patient
                    patient_ids = list(patients.values_list("id", flat=True))
                    mutable_data.setlist("patients", patient_ids)
                else:
                    return Response(
                        {"errorManaged": "Formato de patients incorrecto, debe ser una lista de emails"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except json.JSONDecodeError:
                return Response(
                    {"errorManaged": "Formato de patients inválido"},
                    status=status.HTTP_400_BAD_REQUEST
                )

    print("📌 Datos después de procesar:", mutable_data)  # Para depuración

    # Pasamos mutable_data en lugar de request.data al serializer
    serializer = VideoSerializer(data=mutable_data, context={"request": request})

    if serializer.is_valid():
        video = serializer.save()
        return Response(
            {
                "message": "Archivo creado correctamente",
                "video": VideoSerializer(video).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsPhysiotherapist])
def delete_video(request, video_id):
    user = request.user
    print(user.physio.id)  # Depuración
    print(f"Usuario autenticado: {user}, Rol: {getattr(user, 'physiotherapist', None)}")  # Depuración
    try:
        video = Video.objects.get(id=video_id)
        print(f"Video encontrado: {video}")  # Depuración
    
        if not hasattr(user, 'physio') or video.physiotherapist.id != user.physio.id:
            return Response({"error": "No tienes permiso para eliminar este video"}, status=status.HTTP_403_FORBIDDEN)

        video.delete_from_storage()
        video.delete()

        return Response({"message": "Video eliminado correctamente"}, status=status.HTTP_200_OK)

    except Video.DoesNotExist:
        return Response({"error": "Video no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])  
def list_my_videos(request):
    user = request.user

    try:
        if hasattr(user, 'patient'):
            print("Patient:", user.patient.id)
            videos = Video.objects.filter(patients__id=user.patient.id)

        elif hasattr(user, 'physio'):
            print("Physio:", user.physio.id)
            videos = Video.objects.filter(physiotherapist=user.physio.id)

        else:
            return Response({"error": "No tienes permisos para ver estos videos"}, status=status.HTTP_403_FORBIDDEN)

        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error al obtener los videos: {e}")
        return Response({"error": "Hubo un problema al obtener los videos"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
    aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
    region_name=settings.DIGITALOCEAN_REGION,
    endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL,
)


@api_view(['GET'])
@permission_classes([IsPatient])
def stream_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        if not hasattr(request.user, "patient"):
            return Response({'error': 'No tienes un perfil de paciente'}, status=403)

        patient_id = request.user.patient.id  # Obtener el ID del paciente

        if patient_id not in video.patients.values_list('id', flat=True):
            return Response({'error': 'No tienes acceso a este video'}, status=403)

        video_object = s3_client.get_object(
            Bucket=settings.DIGITALOCEAN_SPACE_NAME,
            Key=video.file_key
        )

        video_size = video_object["ContentLength"]
        video_body = video_object["Body"]

        # Manejar streaming por fragmentos (range requests)
        range_header = request.headers.get("Range", None)
        if range_header:
            range_value = range_header.replace("bytes=", "").split("-")
            start = int(range_value[0]) if range_value[0] else 0
            end = int(range_value[1]) if len(range_value) > 1 and range_value[1] else video_size - 1
            chunk_size = end - start + 1

            # Leer solo el fragmento necesario
            video_body.seek(start)
            video_chunk = video_body.read(chunk_size)

            # Responder con `206 Partial Content`
            response = HttpResponse(video_chunk, content_type="video/mp4")
            response["Content-Range"] = f"bytes {start}-{end}/{video_size}"
            response["Accept-Ranges"] = "bytes"
            response["Content-Length"] = str(chunk_size)
            response["Cache-Control"] = "no-cache"
            response["Connection"] = "keep-alive"
            response.status_code = 206
        else:
            # Streaming completo en fragmentos
            def stream_file():
                for chunk in video_body.iter_chunks():
                    yield chunk

            response = StreamingHttpResponse(stream_file(), content_type="video/mp4")
            response["Content-Length"] = str(video_size)
            response["Accept-Ranges"] = "bytes"
            response["Cache-Control"] = "no-cache"
            response["Connection"] = "keep-alive"
        
        return response

    except Video.DoesNotExist:
        return Response({"error": "El video no existe"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])  # Solo usuarios autenticados pueden acceder
def update_video(request, video_id):
    try:
        # Obtener el video desde la BD
        video = Video.objects.get(id=video_id)

        # Verificar que el usuario autenticado es el fisioterapeuta propietario del video
        if request.user.physio != video.physiotherapist:
            return Response({'error': 'No tienes permiso para actualizar este video'}, status=status.HTTP_403_FORBIDDEN)

    except Video.DoesNotExist:
        return Response({'error': 'El video no existe'}, status=status.HTTP_404_NOT_FOUND)

    # Convertir request.data en un diccionario mutable
    mutable_data = request.data.copy()

    # Manejo de `patients`
    patients_raw = mutable_data.get("patients")
    if patients_raw:
        if isinstance(patients_raw, str):
            try:
                patients_list = json.loads(patients_raw)  # Convierte "[1, 3]" a [1, 3]
            except json.JSONDecodeError:
                return Response({"error": "Formato de patients inválido"}, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(patients_raw, list):
            patients_list = patients_raw
        else:
            return Response({"error": "Formato de patients incorrecto, debe ser una lista de enteros"}, status=status.HTTP_400_BAD_REQUEST)
        
    # Serializar con los datos nuevos
    serializer = VideoSerializer(video, data=mutable_data, partial=True, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Video actualizado correctamente", "video": serializer.data}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
