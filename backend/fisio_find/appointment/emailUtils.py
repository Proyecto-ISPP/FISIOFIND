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
from users.models import AppUser
import cryptography.hazmat.primitives.padding as padding

logger = logging.getLogger(__name__)


def encrypt_data(data):
    # Convertir la clave hexadecimal a bytes (32 bytes = 256 bits)
    key = bytes.fromhex(settings.ENCRYPTION_KEY)  # La clave de cifrado

    # Valor inicial aleatorio para el cifrado (16 bytes para AES)
    iv = os.urandom(16)

    # Asegurarse de que la longitud de los datos sea múltiplo de 16 (padding PKCS7)
    padder = padding.PKCS7(128).padder()  # 128 bits = 16 bytes
    padded_data = padder.update(data.encode()) + padder.finalize()

    # Crear el cifrador
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv),
                    backend=default_backend())
    encryptor = cipher.encryptor()

    # Cifrar los datos
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

    # Concatenar el IV y los datos cifrados
    encrypted_data_with_iv = iv + encrypted_data

    # Convertir a base64 para enviar como texto
    encrypted_data_b64 = base64.b64encode(
        encrypted_data_with_iv).decode('utf-8')

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


def send_appointment_email(appointment_id, action_type, role=None):
    """
    Envía correos electrónicos según la acción realizada en una cita.
    """
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        patient_user = AppUser.objects.get(id=appointment.patient.user.id)
        physio_user = AppUser.objects.get(
            id=appointment.physiotherapist.user.id)
        patient_name = appointment.patient.user.first_name
        physio_name = appointment.physiotherapist.user.first_name
        physio_surname = appointment.physiotherapist.user.last_name
        appointment_date = appointment.start_time.strftime("%d/%m/%Y %H:%M")
        patient_email = appointment.patient.user.email
        physio_email = appointment.physiotherapist.user.email
        frontend_domain = settings.FRONTEND_URL

        # Generamos un token firmado temporal (sin almacenarlo en la base de datos)
        token = signing.dumps({'appointment_id': appointment.id,
                              'physio_user_id': appointment.physiotherapist.user.id})
        link = f"{frontend_domain}/confirm-appointment/{token}"

        recipient_email = None
        subject = ""
        message = ""

        if action_type == "booked":
            # Notificación al fisioterapeuta
            if physio_user.is_subscribed:
                subject_physio = "📅 Nueva Cita Agendada – Pendiente de Aceptación"
                message_physio = f"""
                    Hola <strong>{physio_name}</strong>,<br><br>
                    El paciente <strong>{patient_name}</strong> ha solicitado una cita para el <strong>{appointment_date}</strong>.
                    <br><br>Puedes aceptar o cancelar la cita haciendo clic en el siguiente botón:
                    <br><br>
                    <a href="{link}" style="display: inline-block; background-color: #00a896; color: white; text-align: center; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                        Confirmar Cita
                    </a>
                    <br><br>Si necesitas modificar o cancelar la cita, accede a la plataforma.
                """
                send_email(subject_physio, message_physio, physio_email)

            # Notificación al paciente
            if patient_user.is_subscribed:
                subject_patient = "📅 Solicitud de Reserva Recibida – Pendiente de Confirmación"
                message_patient = f"""
                    Hola <strong>{patient_name}</strong>,<br><br>
                    Tu solicitud de reserva para el <strong>{appointment_date}</strong> con <strong>{physio_name} {physio_surname}</strong> se ha realizado correctamente.
                    <br><br>Ahora está pendiente de ser confirmada por el fisioterapeuta. Recibirás una notificación una vez que se confirme.
                """
                send_email(subject_patient, message_patient, patient_email)

        elif action_type == "confirmed":
            if patient_user.is_subscribed:
                subject = "✅ Tu Cita ha sido Confirmada"
                message = f"""
                    Hola <strong>{patient_name}</strong>,<br><br>
                    Tu cita con el fisioterapeuta <strong>{physio_name} {physio_surname}</strong> ha sido confirmada para el <strong>{appointment_date}</strong>.<br><br>Si tienes dudas, no dudes en contactarnos.
                """
                recipient_email = patient_email

        elif action_type == "canceled":
            if role == "patient":
                if physio_user.is_subscribed:  # Si es el paciente quien cancela
                    subject = "❌ Cita Cancelada por el Paciente"
                    message = f"""
                        Hola <strong>{physio_name}</strong>,<br><br>
                        El paciente <strong>{patient_name}</strong> ha cancelado su cita programada para el <strong>{appointment_date}</strong>.
                        <br><br>Por favor, revisa tu disponibilidad para reagendar si es necesario.
                    """
                    recipient_email = physio_email
            elif role == "physio":  # Si es el fisioterapeuta quien cancela
                if patient_user.is_subscribed:
                    subject = "❌ Cita Cancelada por el Fisioterapeuta"
                    message = f"""
                        Hola <strong>{patient_name}</strong>,<br><br>
                        Lamentamos informarte que el fisioterapeuta <strong>{physio_name} {physio_surname}</strong> ha cancelado la cita programada para el <strong>{appointment_date}</strong>.
                        <br><br>Si deseas, puedes agendar una nueva cita en la plataforma.
                    """
                    recipient_email = patient_email

        elif action_type == "modified":
            if patient_user.is_subscribed:
                subject = "🔄 Modificación en tu Cita"

                # Construimos la lista de alternativas en HTML
                alternatives_html = ""

                for date, slots in appointment.alternatives.items():
                    alternatives_html += f"<h4>📅 {date}</h4>"
                    for slot in slots:
                        start = slot["start"]
                        end = slot["end"]
                        start_time = f"{date} {start}"
                        end_time = f"{date} {end}"
                        # Construimos el enlace con los parámetros start_time y end_time
                        token = signing.dumps(
                            {'appointment_id': appointment.id, 'patient_user_id': appointment.patient.user.id})
                        link = f"{frontend_domain}/confirm-alternative/{token}?start_time={start_time}&end_time={end_time}"
                        alternatives_html += f"""
                            <div style="border:1px solid #ddd; padding:10px; border-radius:8px; margin:10px 0; text-align: center;">
                                ⏰ <strong>{start} - {end}</strong>  
                                <br><br> 
                                <a href="{link}" 
                                style="display:inline-block; padding:10px 15px; background-color:#1E5AAD; color:white; text-decoration:none; border-radius:5px;">
                                    Confirmar este horario
                                </a>
                            </div>
                        """

                message = f"""
                    <p>Hola <strong>{patient_name}</strong>,</p>
                    <p>Tu cita con el fisioterapeuta <strong>{physio_name} {physio_surname}</strong> ha sido modificada.</p>
                    <p>Te ofrecemos las siguientes opciones de reprogramación:</p>
                    {alternatives_html}
                    <p>Por favor, accede a la plataforma para confirmar o proponer otro horario.</p>
                    <br>
                    <div style="text-align: center;">
                        <a href="{frontend_domain}/mis-citas" 
                        style="display:inline-block; padding:10px 15px; background-color:#00a896; color:white; text-decoration:none; border-radius:5px;">
                            Ir a la plataforma
                        </a>
                    </div>
                """
                recipient_email = patient_email

        elif action_type == "modified-accepted":
            # Notificación al fisioterapeuta
            if physio_user.is_subscribed:
                subject_physio = "✅ Cita Reprogramada y Aceptada"
                message_physio = f"""
                    Hola <strong>{physio_name}</strong>,<br><br>
                    El paciente <strong>{patient_name}</strong> ha aceptado la propuesta de reprogramación.
                    <br><br>La hora final seleccionada es el <strong>{appointment_date}</strong>.
                    <br><br>La cita ha sido reprogramada exitosamente.
                """
                send_email(subject_physio, message_physio, physio_email)

            # Notificación al paciente
            if patient_user.is_subscribed:
                subject_patient = "✅ Confirmación de Cita Reprogramada"
                message_patient = f"""
                    Hola <strong>{patient_name}</strong>,<br><br>
                    Has aceptado la propuesta de cita del fisioterapeuta <strong>{physio_name} {physio_surname}</strong>.
                    <br><br>La cita ha sido confirmada para el <strong>{appointment_date}</strong>.
                    <br><br>Gracias por confiar en nosotros.
                """
                send_email(subject_patient, message_patient, patient_email)

        # if recipient_email:
        #     send_email(subject, message, recipient_email)

    except Appointment.DoesNotExist:
        print("Error: Cita no encontrada")


def send_email(subject, message, recipient_email):
    """
    Envía un correo electrónico con el asunto y el mensaje proporcionados.
    """
    # URL del logo
    image_url = "https://fisiofind-landing-page.netlify.app/_astro/logo.1fTJ_rhB.png"

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

    encrypted_subject = encrypt_data(subject)
    encrypted_recipient = encrypt_data(recipient_email)
    encrypted_body = encrypt_data(email_body)

    # Realizar la llamada a la API
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

    response = requests.post(url, json=data, headers=headers)
    return response
