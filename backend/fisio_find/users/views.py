import os
import requests
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PhysioUpdateSerializer, PhysioRegisterSerializer
from .serializers import PhysioSerializer, PatientSerializer, AppUserSerializer
from .models import AppUser, Physiotherapist, Patient, Specialization
from django.conf import settings
from django.shortcuts import get_object_or_404

import logging
import stripe
import json

from .permissions import (
    IsPatient,
    IsPhysiotherapist,
)

from users.util import check_service_json
from .emailUtils import send_account_deletion_email
from django.core import signing


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
        patient = serializer.save()

        user_id = patient.id 
        email = patient.user.email 
        first_name = patient.user.first_name

        email_sent = send_registration_confirmation_email(user_id, email, first_name)

        if email_sent:
            return Response({
                "message": "Paciente registrado correctamente. Revisa tu correo para confirmar tu cuenta."
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "message": "Paciente registrado correctamente, pero hubo un problema al enviar el correo de confirmación. Por favor, contacta soporte.",
                "warning": "No se pudo enviar el correo de confirmación."
            }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def verify_user_and_update_status(user_id):
    """
    Función para cambiar el estado del usuario a verified y devolver una Response.
    """
    try:
        user = AppUser.objects.get(id=user_id)  
        user.account_status = 'ACTIVE'
        user.save()
        return Response({
            "message": "Usuario verificado exitosamente.",
            "status": "success"
        }, status=status.HTTP_200_OK)
    except Patient.DoesNotExist:
        return Response({
            "error": f"No se encontró el usuario con ID {user_id}.",
            "status": "error"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": "Ocurrió un error al verificar el usuario.",
            "status": "error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_registration(request, token):
    """
    Vista para verificar el token de registro y actualizar el estado del usuario.
    Esta vista recibe una solicitud GET con el token en la URL y devuelve una respuesta JSON.
    """
    try:
        data = signing.loads(token, salt='registration-confirm', max_age=86400)
        user_id = data['user_id']
        response = verify_user_and_update_status(user_id)
        return response

    except signing.SignatureExpired:
        return Response({
            "error": "El enlace de confirmación ha expirado. Por favor, solicita un nuevo enlace.",
            "status": "error"
        }, status=status.HTTP_400_BAD_REQUEST)

    except signing.BadSignature:
        return Response({
            "error": "Enlace de confirmación inválido. Por favor, verifica el enlace o solicita uno nuevo.",
            "status": "error"
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            "error": "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
            "status": "error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
def verify_physio_id(request):
    inquiry_id = request.data.get('inquiryId')
    form_data = request.data.get('formData')

    if not inquiry_id or not form_data:
        return Response(
            {"error": "Faltan campos requeridos (inquiryId o formData)."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Construimos la URL para llamar a la API de Persona
    persona_api_url = f"https://api.withpersona.com/api/v1/inquiries/{inquiry_id}"
    headers = {
        "Authorization": f"Bearer {os.getenv('PERSONA_API_KEY')}",  # Asegúrate de que la clave API esté configurada en tus variables de entorno
        "accept": "application/json",
        "Persona-Version": "2023-01-05"
    }

    try:
        persona_response = requests.get(persona_api_url, headers=headers)
        if persona_response.status_code != 200:
            return Response(
                {"error": "Error al obtener la información de Persona."},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        logging.error(f"Error en la conexión con Persona: {str(e)}")
        return Response(
            {"error": "Error en la conexión con Persona."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Ejemplo de extracción y comparación de datos:
    # Se asume que la respuesta de Persona tiene un campo "document" con el número del documento.
    cleaned_response = persona_response.json().get("data", {}).get("attributes", {}) # obtiene el json limpio
    document_number = cleaned_response.get("identification-number", {}) # obtiene el dni de la respuesta de persona
    form_dni = form_data.get("dni", "").upper()
    
    # para cuando tengamos el entorno de produccion
    persona_name = cleaned_response.get("name-first", {}) + " " + cleaned_response.get("name-last", {})
    form_name = form_data.get("first_name", "") + " " + form_data.get("last_name", "")

    # Se compara el número del documento obtenido de Persona con el enviado en formData
    verifiedDNI = document_number == form_dni
    verifiedName = persona_name == form_name

    return Response({"verified": True}) # hay que cambiar esto XD


@api_view(['POST'])
@permission_classes([AllowAny])
def physio_register_view(request):
    serializer = PhysioRegisterSerializer(data=request.data)
    if serializer.is_valid():
        pyshio = serializer.save()
        user_id = pyshio.id
        verify_user_and_update_status(user_id)
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
            return Response({"error": "El pago no fue exitoso.", "status": intent.status},
                            status=status.HTTP_400_BAD_REQUEST)

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
            # Comprueba estructura y parametros obligatorios de
            if isinstance(request_data["services"], str):
                request_data["services"] = json.loads(request_data["services"])
            elif isinstance(request_data["services"], dict):
                request_data["services"] = request_data["services"]
            else:
                raise json.JSONDecodeError()

            lista_ids = set()

            for key, service in request_data["services"].items():
                service = check_service_json(service)
                if "id" not in service or service["id"] == None or not isinstance(service["id"], int):
                    raise json.JSONDecodeError()
                lista_ids.add(service["id"])

            if len(lista_ids) != len(request_data["services"]):
                # Hay ids repetidos y el id tiene que ser unico
                raise json.JSONDecodeError()

        except json.JSONDecodeError:
            return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
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

    try:
        # Comprueba la estructura general y parametros obligatorios del json
        new_service = check_service_json(request.data)
    except json.JSONDecodeError:
        return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)

    # Actualizar servicios existentes o añadir nuevos
    service_id = new_service.get('id')
    service_updated = False

    # Buscar si el servicio ya existe por ID
    if service_id and service_id in existing_services:
        # Actualizar el servicio existente
        existing_services[service_id].update(new_service)
        service_updated = True
    if not service_updated:
        # Si el servicio no existe, asignar una nueva ID única y añadirlo completo
        new_id = 1
        while str(new_id) in existing_services.keys():
            new_id += 1
        new_service['id'] = new_id
        existing_services[str(new_id)] = new_service

    # Preparar los datos para el serializador
    update_data = {'services': existing_services}

    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)

    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Servicios actualizados correctamente", "services": existing_services},
                        status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def physio_update_service_view(request, service_id):
    """Actualiza un servicio existente para el fisioterapeuta autenticado"""

    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)

    # Obtener servicios existentes (asegurar que sea un diccionario)
    existing_services = physio.services or {}

    # Obtener nuevos servicios del request
    try:
        # Comprueba la estructura y parametros necesarios del json de service
        new_service = check_service_json(request.data)

    except json.JSONDecodeError:
        return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)

    # Obtener datos del servicio a actualizar
    new_service_data = request.data

    # Convertir service_id a string para asegurar comparación correcta
    service_id_str = str(service_id)

    # Verificar si el servicio existe
    service_found = False

    # Depuración
    logging.debug(f"Buscando servicio con ID: {service_id_str}")
    logging.debug(f"Servicios disponibles: {list(existing_services.keys())}")
    # Verificar si el ID del servicio existe directamente en las claves
    if service_id_str in existing_services:
        print(f"Servicio encontrado con ID {service_id_str}")
        # Actualizar el servicio existente
        existing_services[service_id_str].update(new_service_data)
        service_found = True

    # Si no se encontró por ID directo, buscar por el campo 'id' dentro del objeto
    if not service_found:
        for existing_id, service_data in existing_services.items():
            print(f"Comparando {service_id} con {service_data.get('id', 'no-id')}")
            # Asegurar que ambos se comparan como strings
            if str(service_data.get('id', '')) == str(service_id):
                print(f"Servicio encontrado con ID interno {service_id}")
                # Actualizar el servicio existente
                existing_services[existing_id].update(new_service_data)
                service_found = True
                break

    if not service_found:
        return Response({"error": f"No se encontró ningún servicio con ID {service_id}"},
                        status=status.HTTP_404_NOT_FOUND)

    # Preparar los datos para el serializador
    update_data = {'services': existing_services}

    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)

    if serializer.is_valid():
        updated_physio = serializer.save()
        # Verificar que los cambios se guardaron
        if updated_physio.services == existing_services:
            print("Servicios actualizados correctamente en la base de datos")
        else:
            print("ADVERTENCIA: Los servicios pueden no haberse actualizado correctamente")

        return Response({
            "message": "Servicio actualizado correctamente",
            "services": existing_services,
            "updated_service_id": service_id
        }, status=status.HTTP_200_OK)

    print("Errores en el serializador:", serializer.errors)
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
def physio_delete_service_view(request, service_id):
    physio = get_object_or_404(Physiotherapist, user=request.user)
    services = physio.services or {}

    # Buscar el servicio por su 'id' dentro del JSON anidado
    service_found = None
    for key, service in services.items():
        if str(service.get('id')) == str(service_id):
            service_found = key
            break

    if not service_found:
        return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)

    # Eliminar el servicio
    del services[service_found]
    physio.services = services
    physio.save()

    return Response({"message": "Servicio eliminado correctamente", "services": services}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_account_deletion(request):
    """
    Request account deletion and send confirmation email
    """
    try:
        user = request.user
        email_sent = send_account_deletion_email(user)

        if email_sent:
            return Response({
                "message": "Por favor, revisa tu correo para confirmar la eliminación de tu cuenta."
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": "No se pudo enviar el correo de confirmación. Verifica tu dirección de correo electrónico."
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Error in account deletion request: {str(e)}")
        return Response({
            "error": "Ocurrió un error al procesar tu solicitud."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def confirm_account_deletion(request, token):
    """
    Confirm and process account deletion
    """
    try:
        data = signing.loads(token, salt='account-deletion', max_age=86400)
        
        if data.get('action') != 'delete_account':
            raise signing.BadSignature('Invalid token type')

        user = AppUser.objects.get(id=data['user_id'])
        user.delete()

        return Response({
            "message": "Tu cuenta ha sido eliminada correctamente.",
            "status": "success"
        }, status=status.HTTP_200_OK)

    except (signing.SignatureExpired, signing.BadSignature):
        return Response({
            "error": "El enlace ha expirado o no es válido.",
            "status": "error"
        }, status=status.HTTP_400_BAD_REQUEST)

    except AppUser.DoesNotExist:
        return Response({
            "error": "Usuario no encontrado.",
            "status": "error"
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            "error": "Ocurrió un error al procesar tu solicitud.",
            "status": "error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)