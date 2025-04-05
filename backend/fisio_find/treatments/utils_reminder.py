# utils/email_reminder.py (puedes crear este archivo)

from datetime import datetime
from django.core.mail import EmailMessage
from .models import Treatment
from django.utils.timezone import now

def send_exercise_reminder_email():
    today_weekday = now().strftime("%A")  # "Monday", "Tuesday", etc.
    
    treatments = Treatment.objects.filter(is_active=True)
    for treatment in treatments:
        patient = treatment.patient.user
        sessions_today = treatment.sessions.filter(day_of_week__contains=today_weekday)

        if not sessions_today.exists():
            continue

        session_names = [session.name or f"Sesión {session.id}" for session in sessions_today]
        session_list_html = "".join(f"<li>{name}</li>" for name in session_names)

        subject = "🏋️ ¡Hora de tus ejercicios de hoy!"
        message = f"""
        Hola <strong>{patient.first_name}</strong>,<br><br>
        Te recordamos que hoy tienes ejercicios asignados en las siguientes sesiones:
        <ul>{session_list_html}</ul>
        <br>
        ¡No olvides registrar tu progreso en la plataforma! 💪
        <br><br>
        <a href="https://fisiofind.app.com/" 
           style="display: inline-block; background-color: #00a896; color: white; text-align: center; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Ir a la plataforma
        </a>
        """

        send_html_email(subject, message, patient.email)

def send_html_email(subject, message, recipient_email):
    image_url = "https://fisiofind-landing-page.netlify.app/_astro/logo.1fTJ_rhB.png"

    email_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #00a896; padding-bottom: 10px; margin-bottom: 20px;">
            <img src="{image_url}" alt="FisioFind Logo" width="100" height="100" style="display: block; margin: auto;">
            <h2 style="color: #0a2239; margin: 10px 0;">Fisio <span style="color: #00a896;">Find</span></h2>
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 16px; color: #555;">
            {message}
        </div>
        <div style="margin-top: 20px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px;">
            <p style="margin: 5px 0; font-weight: bold; color: #0a2239;">Gestión de ejercicios</p>
            <p style="margin: 5px 0;">
                ✉️ <a style="color: #0073e6; text-decoration: none;" href="mailto:info@fisiofind.com">info@fisiofind.com</a> <br>
                🌐 <a style="color: #0073e6; text-decoration: none;" href="https://fisiofind.app.com/">fisiofind.app.com</a> <br>
                📷 <a style="color: #0073e6; text-decoration: none;" href="https://www.instagram.com/fisiofindapp/">@fisiofindapp</a>
            </p>
        </div>
    </div>
    """

    email = EmailMessage(
        subject=subject,
        body=email_body,
        from_email="noreply@fisiofind.com",
        to=[recipient_email],
    )
    email.content_subtype = "html"
    email.send()
