from django.core.management.base import BaseCommand
from django.utils.timezone import now
from treatments.models import Treatment
import smtplib
import ssl
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.conf import settings

class Command(BaseCommand):
    help = 'Versión local sin verificación SSL para pruebas de recordatorios'

    def handle(self, *args, **kwargs):
        today = now().strftime("%A")
        treatments = Treatment.objects.filter(is_active=True, notifications_enabled=True)

        for treatment in treatments:
            patient_user = treatment.patient.user
            sessions_today = treatment.sessions.filter(day_of_week__contains=today)

            if not sessions_today.exists():
                continue

            session_names = [s.name or f"Sesión {s.id}" for s in sessions_today]
            session_list_html = "".join(f"<li>{name}</li>" for name in session_names)

            subject = "🏋️ ¡Hora de tus ejercicios de hoy!"
            message = f"""
                <p style="font-size: 18px; color: #333;">Hola <strong>{patient_user.first_name}</strong>,</p>
                <p style="margin-bottom: 10px;">
                    Hoy tienes ejercicios asignados en las siguientes sesiones:
                </p>
                <ul style="margin-left: 20px; color: #444; line-height: 1.6;">{session_list_html}</ul>
                <p>¡No olvides registrar tu progreso en la plataforma! 💪</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://s3.fisiofind.com/"
                       style="display: inline-block; background-color: #00a896; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
                        Ir a Fisio Find
                    </a>
                </div>
            """

            self.send_raw_email(subject, message, patient_user.email)
            self.stdout.write(self.style.SUCCESS(f"(LOCAL) Correo enviado a {patient_user.email}"))

    def send_raw_email(self, subject, html_message, recipient_email):
        sender_email = settings.EMAIL_HOST_USER
        password = settings.EMAIL_HOST_PASSWORD
        alias_name = "noreply"

        logo_url = "https://fisiofind-landing-page.netlify.app/_astro/logo.1fTJ_rhB.png"

        full_html = f"""
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #00a896;">
                <img src="{logo_url}" alt="FisioFind Logo" width="90" style="margin-bottom: 10px;">
                <h1 style="margin: 0; font-size: 26px; color: #0a2239;">Fisio <span style="color: #00a896;">Find</span></h1>
            </div>
            <div style="background-color: #f4fdfd; padding: 25px; border-radius: 10px; margin-top: 20px; font-size: 16px; color: #333;">
                {html_message}
            </div>
            <div style="text-align: center; margin-top: 40px; font-size: 13px; color: #999;">
                <p style="margin: 0;">Este es un correo automático. Por favor, no respondas a este mensaje.</p>
                <p style="margin: 5px 0 0;">© 2025 Fisio Find</p>
            </div>
        </div>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{alias_name} <{sender_email}>"
        msg["To"] = recipient_email
        msg.attach(MIMEText(full_html, "html"))

        context = ssl._create_unverified_context()
        with smtplib.SMTP("smtp.ionos.es", 587) as server:
            server.starttls(context=context)
            server.login(sender_email, password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
