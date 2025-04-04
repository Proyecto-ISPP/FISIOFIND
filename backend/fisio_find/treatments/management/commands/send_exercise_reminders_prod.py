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
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);">
            <div style="text-align: center; padding-bottom: 24px; border-bottom: 2px solid #00a896;">
                <img src="{logo_url}" alt="FisioFind Logo" width="90" style="margin-bottom: 10px;">
                <h1 style="margin: 0; font-size: 26px; color: #0a2239;">Fisio <span style="color: #00a896;">Find</span></h1>
            </div>

            <div style="background-color: #f4fdfd; padding: 25px; border-radius: 10px; margin-top: 24px; font-size: 16px; color: #333;">
                {message}
            </div>

            <div style="text-align: center; margin-top: 32px;">
                <a href="https://s3.fisiofind.com/"
                style="display: inline-block; background-color: #00a896; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
                    Ir a Fisio Find
                </a>
            </div>

            <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 16px; font-size: 14px; color: #777;">
                <p style="margin: 4px 0;">📧 <a href="mailto:info@fisiofind.com" style="color: #0073e6; text-decoration: none;">info@fisiofind.com</a></p>
                <p style="margin: 4px 0;">🌐 <a href="https://s3.fisiofind.app.com/" style="color: #0073e6; text-decoration: none;">fisiofind.app.com</a></p>
                <p style="margin: 4px 0;">📸 <a href="https://www.instagram.com/fisiofindapp/" style="color: #0073e6; text-decoration: none;">@fisiofindapp</a></p>
                <p style="margin-top: 16px; font-size: 12px; color: #aaa;">Este es un correo automático. Por favor, no respondas a este mensaje.<br>© 2025 Fisio Find</p>
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
