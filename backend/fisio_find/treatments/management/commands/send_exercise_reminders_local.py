from django.core.management.base import BaseCommand
from django.utils.timezone import now
from treatments.models import Treatment
import smtplib
import ssl
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class Command(BaseCommand):
    help = 'Versión local sin verificación SSL para pruebas de recordatorios'

    def handle(self, *args, **kwargs):
        today = now().strftime("%A")
        treatments = Treatment.objects.filter(is_active=True)

        for treatment in treatments:
            patient_user = treatment.patient.user
            sessions_today = treatment.sessions.filter(day_of_week__contains=today)

            if not sessions_today.exists():
                continue

            session_names = [s.name or f"Sesión {s.id}" for s in sessions_today]
            session_list_html = "".join(f"<li>{name}</li>" for name in session_names)

            subject = "🏋️ ¡Hora de tus ejercicios de hoy!"
            message = f"""
                Hola <strong>{patient_user.first_name}</strong>,<br><br>
                Hoy tienes ejercicios asignados en las siguientes sesiones:
                <ul>{session_list_html}</ul>
                <br>¡No olvides registrar tu progreso en la plataforma! 💪
                <br><br>
                <div style="text-align: center;">
                    <a href="https://s3.fisiofind.com/"
                       style="display: inline-block; background-color: #00a896; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                        Ir a Fisio Find
                    </a>
                </div>
            """

            self.send_raw_email(subject, message, patient_user.email)
            self.stdout.write(self.style.SUCCESS(f"(LOCAL) Correo enviado a {patient_user.email}"))

    def send_raw_email(self, subject, html_message, recipient_email):
        sender_email = "citas@fisiofind.com"
        password = "RSu@FdJg5KNGG#d"
        alias_name = "noreply"  # Lo que quieres que aparezca

        # Logo directo (usamos Netlify o una CDN para evitar bloqueos de GitHub)
        logo_url = "https://fisiofind-landing-page.netlify.app/_astro/logo.1fTJ_rhB.png"

        full_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #00a896; padding-bottom: 10px; margin-bottom: 20px;">
                <img src="{logo_url}" alt="FisioFind Logo" width="100">
                <h2 style="color: #0a2239;">Fisio <span style="color: #00a896;">Find</span></h2>
            </div>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 16px; color: #555;">
                {html_message}
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
