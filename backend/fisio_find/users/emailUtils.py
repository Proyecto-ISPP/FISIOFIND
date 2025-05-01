from appointment.models import Appointment
from django.core.mail import EmailMessage
from django.core import signing
from email_validator import validate_email, EmailNotValidError
import logging
import os
import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from django.conf import settings
import requests
import cryptography.hazmat.primitives.padding as padding
from django.utils import timezone



logger = logging.getLogger(__name__)


def encrypt_data(data):
    # Convertir la clave hexadecimal a bytes (32 bytes = 256 bits)
    key = bytes.fromhex(settings.ENCRYPTION_KEY)  # La clave de cifrado

    iv = os.urandom(16)  # Valor inicial aleatorio para el cifrado (16 bytes para AES)

    # Asegurarse de que la longitud de los datos sea múltiplo de 16 (padding PKCS7)
    padder = padding.PKCS7(128).padder()  # 128 bits = 16 bytes
    padded_data = padder.update(data.encode()) + padder.finalize()

    # Crear el cifrador
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Cifrar los datos
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

    # Concatenar el IV y los datos cifrados
    encrypted_data_with_iv = iv + encrypted_data

    # Convertir a base64 para enviar como texto
    encrypted_data_b64 = base64.b64encode(encrypted_data_with_iv).decode('utf-8')

    return encrypted_data_b64

def is_deliverable_email(email):
    """
    Checks if an email is valid and deliverable.
    """
    try:
        # Validate email with deliverability check
        validation = validate_email(email, check_deliverability=True)
        # Get the normalized form of the email address
        return True, validation.normalized
    except EmailNotValidError as e:
        logger.warning(f"Invalid email address: {email}, Error: {str(e)}")
        return False, None


def send_registration_confirmation_email(user_id, email, first_name):
    """
    Envía un correo de confirmación de registro al usuario.
    """
    try:
        # Validar el email
        is_email_valid, normalized_email = is_deliverable_email(email)
        if not is_email_valid:
            logger.error(f"Invalid email for user registration: {email}")
            return False

        # Generar un token único y seguro con expiración
        token = signing.dumps({
            'user_id': user_id,
            'email': email,
            'timestamp': timezone.now().isoformat()
        }, salt='registration-confirm', compress=True)

        # Configurar el enlace de confirmación con expiración (por ejemplo, 24 horas)
        frontend_domain = settings.FRONTEND_URL
        confirmation_link = f"{frontend_domain}register/verified/{token}"

        # Crear el contenido del correo en HTML profesional
        subject = "✅ Confirma tu registro en FisioFind"

        message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Confirma tu registro</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                <h2 style="color: #1E5AAD; text-align: center;">¡Bienvenido, {first_name}!</h2>
                <p style="color: #333;">Gracias por registrarte en FisioFind. Para activar tu cuenta, por favor haz clic en el botón de abajo:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{confirmation_link}" 
                       style="display: inline-block; background-color: #00a896; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                        Confirmar mi cuenta
                    </a>
                </div>
                <p style="color: #666;">Este enlace expirará en <strong>24 horas</strong>. Si no solicitaste este registro, por favor ignora este correo.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
               <p style="font-size: 12px; color: #999; text-align: center;">Si tienes problemas para acceder mediante el botón, haz clic aquí: <a href="{confirmation_link}" style="color: #00a896; text-decoration: underline;">link</a></p>
                <p style="font-size: 12px; color: #999; text-align: center;">© 2025 FisioFind. Todos los derechos reservados.</p>
            </div>
        </body>
        </html>
        """

        # Enviar el correo
        return send_email(subject, message, normalized_email)

    except Exception as e:
        logger.error(f"Error sending registration confirmation email: {str(e)}")
        return False

def send_email(subject, message, recipient_email):
    """
    Envía un correo electrónico cifrado a través de una API externa.
    """
    # URL del logo (puedes incluirlo en el mensaje si la API lo permite)
    image_url = "https://fisiofind-landing-page.netlify.app/_astro/logo.1fTJ_rhB.png"

    # Construir el cuerpo del correo HTML
    email_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; background-color: #ffffff;">
        <!-- Encabezado -->
        <div style="text-align: center; border-bottom: 2px solid #00a896; padding-bottom: 10px; margin-bottom: 20px;">
            <img src="{image_url}" alt="FisioFind Logo" width="100" height="100" style="display: block; margin: auto;">
            <h2 style="color: #0a2239; margin: 10px 0;">Fisio <span style="color: #00a896;">Find</span></h2>
        </div>

        <!-- Contenido del correo -->
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 16px; color: #555;">
            {message}
        </div>

        <!-- Footer -->
        <div style="margin-top: 20px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px;">
            <p style="margin: 5px 0; font-weight: bold; color: #0a2239;">Gestión de consultas</p>
            <p style="margin: 5px 0;">
                ✉️ <a style="color: #0073e6; text-decoration: none;" href="mailto:info@fisiofind.com">info@fisiofind.com</a> <br>
                🌐 <a style="color: #0073e6; text-decoration: none;" href="https://fisiofind.app.com/">fisiofind.app.com</a> <br>
                📷 <a style="color: #0073e6; text-decoration: none;" href="https://www.instagram.com/fisiofindapp/">@fisiofindapp</a>
            </p>
        </div>
    </div>
    """

    try:
        # Cifrar los datos
        encrypted_subject = encrypt_data(subject)
        encrypted_recipient = encrypt_data(recipient_email)
        encrypted_body = encrypt_data(email_body)

        # Configurar la solicitud a la API
        url = settings.API_MAIL_URL
        headers = {
            'X-API-Key': settings.API_KEY,
            'Content-Type': 'application/json'
        }
        data = {
            "encrypted_subject": encrypted_subject,
            "encrypted_recipient": encrypted_recipient,
            "encrypted_body": encrypted_body
        }

        # Enviar la solicitud a la API
        response = requests.post(url, json=data, headers=headers, timeout=10)

        # Verificar si la solicitud fue exitosa
        if response.status_code == 200:
            logger.info(f"Email sent successfully to {recipient_email}")
            return True
        else:
            logger.error(f"Failed to send email. Status code: {response.status_code}, Response: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        logger.error(f"Network error while sending email: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error while sending email: {str(e)}")
        return False


def send_account_deletion_email(user):
    """
    Sends an account deletion confirmation email to the user.
    """
    try:
        # Get email and name from user object
        email = user.email
        first_name = user.first_name
        user_id = user.id

        # Skip email validation since the email was already validated during registration
        normalized_email = email

        # Generate secure token
        token = signing.dumps({
            'user_id': user_id,
            'email': email,
            'timestamp': timezone.now().isoformat(),
            'action': 'delete_account'
        }, salt='account-deletion', compress=True)

        frontend_domain = settings.FRONTEND_URL
        deletion_link = f"{frontend_domain}/account/delete/confirm/{token}"

        subject = "⚠️ Confirma la eliminación de tu cuenta en FisioFind"
        message = f"""
            <div style="text-align: center;">
                <h2 style="color: #dc3545;">Confirmación de eliminación de cuenta</h2>
            </div>
            <p>Hola <strong>{first_name}</strong>,</p>
            <p>Has solicitado eliminar tu cuenta de FisioFind. Esta acción es irreversible y eliminará todos tus datos de nuestra plataforma.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{deletion_link}" 
                   style="display: inline-block; background-color: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Confirmar eliminación de cuenta
                </a>
            </div>
            <p style="color: #666;">Este enlace expirará en <strong>24 horas</strong>.</p>
            <p style="color: #666;">Si no solicitaste eliminar tu cuenta, por favor ignora este correo y contacta con soporte.</p>
        """

        # Use the existing send_email function
        response = send_email(subject, message, normalized_email)
        
        if response.status_code == 200:
            return True
        else:
            logger.error(f"Failed to send deletion email. Status code: {response.status_code}")
            return False

    except Exception as e:
        logger.error(f"Error sending account deletion email: {str(e)}")
        return False
