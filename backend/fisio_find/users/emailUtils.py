from appointment.models import Appointment
from django.core.mail import EmailMessage
from django.core import signing
from email_validator import validate_email, EmailNotValidError
import logging
from datetime import timedelta
from django.utils import timezone
import uuid

logger = logging.getLogger(__name__)

def is_deliverable_email(email):
    """
    Checks if an email is valid and deliverable.
    """
    try:
        validation = validate_email(email, check_deliverability=True)
        return True, validation.normalized
    except EmailNotValidError as e:
        logger.warning(f"Invalid email address: {email}, Error: {str(e)}")
        return False, None

def send_email(subject, message, recipient_email):
    """
    Sends an email after validating the recipient's email address.
    """
    try:
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email="noreply@fisiofind.com",
            to=[recipient_email],
        )
        email.content_subtype = "html"  # Usa HTML para un diseño profesional
        email.send()
        logger.info(f"Email sent successfully to {recipient_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
        return False

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
        frontend_domain = "http://localhost:3000"
        confirmation_link = f"{frontend_domain}/register/verified/{token}"

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
                <div style="text-align: center; padding: 20px 0;">
                    <img src="https://s2.fisiofind.com/static/images/logo.png" alt="FisioFind Logo" style="max-width: 200px;">
                </div>
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
                <p style="font-size: 12px; color: #999; text-align: center;">Si tienes problemas para hacer clic en el botón, copia y pega este enlace en tu navegador: {confirmation_link}</p>
                <p style="font-size: 12px; color: #999; text-align: center;">© 2023 FisioFind. Todos los derechos reservados.</p>
            </div>
        </body>
        </html>
        """

        # Enviar el correo
        return send_email(subject, message, normalized_email)

    except Exception as e:
        logger.error(f"Error sending registration confirmation email: {str(e)}")
        return False