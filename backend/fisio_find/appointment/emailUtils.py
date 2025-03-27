from appointment.models import Appointment
from django.core.mail import EmailMessage
from django.core import signing
from email_validator import validate_email, EmailNotValidError
import logging

logger = logging.getLogger(__name__)

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
        email.content_subtype = "html"
        email.send()
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
        return False

def send_appointment_email(appointment_id, action_type, role=None):
    """
    Envía correos electrónicos según la acción realizada en una cita.
    """
    try:
        appointment = Appointment.objects.get(id=appointment_id)

        patient_name = appointment.patient.user.first_name
        physio_name = appointment.physiotherapist.user.first_name
        physio_surname = appointment.physiotherapist.user.last_name
        appointment_date = appointment.start_time.strftime("%d/%m/%Y %H:%M")
        patient_email = appointment.patient.user.email
        physio_email = appointment.physiotherapist.user.email
        
        # Validate both emails at the beginning
        is_patient_email_valid, normalized_patient_email = is_deliverable_email(patient_email)
        is_physio_email_valid, normalized_physio_email = is_deliverable_email(physio_email)
        
        # Log if any email is invalid
        if not is_patient_email_valid:
            logger.warning(f"Patient email not deliverable: {patient_email}")
        if not is_physio_email_valid:
            logger.warning(f"Physiotherapist email not deliverable: {physio_email}")
            
        # If both emails are invalid, exit early
        if not is_patient_email_valid and not is_physio_email_valid:
            logger.error("Both patient and physiotherapist emails are invalid. No emails will be sent.")
            return
            
        frontend_domain = "https://s2.fisiofind.com"

        # Generamos un token firmado temporal (sin almacenarlo en la base de datos)
        token = signing.dumps({'appointment_id': appointment.id,
                              'physio_user_id': appointment.physiotherapist.user.id})
        link = f"{frontend_domain}/confirm-appointment/{token}"

        if action_type == "booked":
            # Only send to physio if their email is valid
            if is_physio_email_valid:
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
                send_email(subject_physio, message_physio, normalized_physio_email)

            # Only send to patient if their email is valid
            if is_patient_email_valid:
                subject_patient = "📅 Solicitud de Reserva Recibida – Pendiente de Confirmación"
                message_patient = f"""
                    Hola <strong>{patient_name}</strong>,<br><br>
                    Tu solicitud de reserva para el <strong>{appointment_date}</strong> con <strong>{physio_name} {physio_surname}</strong> se ha realizado correctamente.
                    <br><br>Ahora está pendiente de ser confirmada por el fisioterapeuta. Recibirás una notificación una vez que se confirme.
                """
                send_email(subject_patient, message_patient, normalized_patient_email)

        elif action_type == "confirmed":
            if is_patient_email_valid:
                subject = "✅ Tu Cita ha sido Confirmada"
                message = f"""
                    Hola <strong>{patient_name}</strong>,<br><br>
                    Tu cita con el fisioterapeuta <strong>{physio_name} {physio_surname}</strong> ha sido confirmada para el <strong>{appointment_date}</strong>.<br><br>Si tienes dudas, no dudes en contactarnos.
                """
                send_email(subject, message, normalized_patient_email)

        elif action_type == "canceled":
            if role == "patient" and is_physio_email_valid:  # Si es el paciente quien cancela
                subject = "❌ Cita Cancelada por el Paciente"
                message = f"""
                    Hola <strong>{physio_name}</strong>,<br><br>
                    El paciente <strong>{patient_name}</strong> ha cancelado su cita programada para el <strong>{appointment_date}</strong>.
                    <br><br>Por favor, revisa tu disponibilidad para reagendar si es necesario.
                """
                send_email(subject, message, normalized_physio_email)
            elif role == "physio" and is_patient_email_valid:  # Si es el fisioterapeuta quien cancela
                subject = "❌ Cita Cancelada por el Fisioterapeuta"
                message = f"""
                    Hola <strong>{patient_name}</strong>,<br><br>
                    Lamentamos informarte que el fisioterapeuta <strong>{physio_name} {physio_surname}</strong> ha cancelado la cita programada para el <strong>{appointment_date}</strong>.
                    <br><br>Si deseas, puedes agendar una nueva cita en la plataforma.
                """
                send_email(subject, message, normalized_patient_email)

        elif action_type == "modified" and is_patient_email_valid:
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
                    token = signing.dumps({'appointment_id': appointment.id, 'patient_user_id': appointment.patient.user.id})
                    link = f"{frontend_domain}/confirm-alternative/{token}?start_time={start_time}&end_time={end_time}"
                    alternatives_html += f"""
                        <div style="border:1px solid #ddd; padding:10px; border-radius:8px; margin:10px 0; text-align: center;">
                            ⏰ <strong>{start} - {end}</strong>  
                            <br><br> 
                            <a href="{link}" 
                            style="display:inline-block; padding:10px 15px; background-color:#1E5AAD; color:white; text-decoration:none; border-radius:5px;">
                                Confirmar esta hora
                            </a>
                        </div>
                    """

            message = f"""
                Hola <strong>{patient_name}</strong>,<br><br>
                El fisioterapeuta <strong>{physio_name} {physio_surname}</strong> ha propuesto cambiar tu cita programada para el <strong>{appointment_date}</strong>.
                <br><br>Por favor, selecciona una de las siguientes alternativas:
                <br><br>
                {alternatives_html}
                <br><br>Si ninguna de estas opciones te conviene, por favor contacta directamente con el fisioterapeuta.
            """
            send_email(subject, message, normalized_patient_email)

    except Exception as e:
        logger.error(f"Error in send_appointment_email: {str(e)}")