from django.core.management.base import BaseCommand
from django.utils.timezone import now
from treatments.models import Treatment
from django.conf import settings
import os
import base64
import logging
import requests
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import cryptography.hazmat.primitives.padding as padding

logger = logging.getLogger(__name__)

def encrypt_data(data):
    key = bytes.fromhex(settings.ENCRYPTION_KEY)
    iv = os.urandom(16)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(data.encode()) + padder.finalize()
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    return base64.b64encode(iv + encrypted_data).decode('utf-8')


class Command(BaseCommand):
    help = 'Envía recordatorios diarios a pacientes con ejercicios asignados hoy'

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

            self.send_encrypted_email(subject, message, patient_user.email)
            self.stdout.write(self.style.SUCCESS(f"Correo (API) enviado a {patient_user.email}"))

    def send_encrypted_email(self, subject, message, recipient_email):
        logo_url = "https://fisiofind-landing-page.netlify.app/_astro/logo.1fTJ_rhB.png"

        email_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #00a896; padding-bottom: 10px; margin-bottom: 20px;">
                <img src="{logo_url}" alt="FisioFind Logo" width="100">
                <h2 style="color: #0a2239;">Fisio <span style="color: #00a896;">Find</span></h2>
            </div>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 16px; color: #555;">
                {message}
            </div>
            <div style="margin-top: 20px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px;">
                <p style="margin: 5px 0; font-weight: bold; color: #0a2239;">Gestión de ejercicios</p>
                <p style="margin: 5px 0;">
                    ✉️ <a style="color: #0073e6;" href="mailto:info@fisiofind.com">info@fisiofind.com</a><br>
                    🌐 <a style="color: #0073e6;" href="https://fisiofind.app.com/">fisiofind.app.com</a><br>
                    📷 <a style="color: #0073e6;" href="https://www.instagram.com/fisiofindapp/">@fisiofindapp</a>
                </p>
            </div>
        </div>
        """

        encrypted_subject = encrypt_data(subject)
        encrypted_recipient = encrypt_data(recipient_email)
        encrypted_body = encrypt_data(email_body)

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
        if response.status_code != 200:
            logger.error(f"Fallo al enviar correo (API): {response.text}")
