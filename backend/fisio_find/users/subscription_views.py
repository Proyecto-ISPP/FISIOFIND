from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.core import signing
from users.models import AppUser


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_subscription_status(request):
    """
    Endpoint to retrieve the status of the email subscription for the authenticated user.
    If an error occurs, returns a 500 Internal Server Error response.
    """
    user = request.user
    try:
        subscription_status = user.is_subscribed
        return Response({"subscription_status": subscription_status}, status=status.HTTP_200_OK)
    except AttributeError:
        return Response({"error": "El usuario no tiene un estado de suscripción definido."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"error": "No se pudo obtener el estado de la suscripción a las notificaciones por correo electrónico."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_subscription(request):
    """
    Endpoint to update the email subscription status for the authenticated user.
    """
    user = request.user
    is_subscribed = request.data.get('is_subscribed')
    if is_subscribed is None:
        return Response({"error": "El estado de suscripción no fue proporcionado."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user.is_subscribed = is_subscribed
        user.save()
        return Response({"success": "Estado de suscripción actualizado correctamente."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "No se pudo actualizar el estado de la suscripción."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def unsubscribe_via_token(request):
        token = request.query_params.get('token')
        if not token:
            return Response({'detail': 'Se requiere un token.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Puedes definir un tiempo de expiración si lo consideras necesario (por ejemplo, 3600 segundos)
            data = signing.loads(token, max_age=3600*24)
            email = data.get('email')
            if not email:
                return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                user = AppUser.objects.get(email=email)
            except AppUser.DoesNotExist:
                return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
            user.is_subscribed = False
            user.save()
            return Response({'detail': 'Has cancelado tu suscripción correctamente.'}, status=status.HTTP_200_OK)
        except signing.SignatureExpired:
            return Response({'detail': 'El token ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        except signing.BadSignature:
            return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)