from locust import HttpUser, task, between
import random
import string
from datetime import datetime

AUTONOMIC_COMMUNITIES = [
    'ANDALUCIA', 'ARAGON', 'ASTURIAS', 'BALEARES', 'CANARIAS', 'CANTABRIA',
    'CASTILLA Y LEON', 'CASTILLA-LA MANCHA', 'CATALUÑA', 'EXTREMADURA',
    'GALICIA', 'MADRID', 'MURCIA', 'NAVARRA', 'PAIS VASCO', 'LA RIOJA',
    'COMUNIDAD VALENCIANA'
]

def generate_random_dni():
    dni_numbers = ''.join(random.choices(string.digits, k=8))
    letters = "TRWAGMYFPDXBNJZSQVHLCKE"
    letter = letters[int(dni_numbers) % 23]
    return f"{dni_numbers}{letter}"

def generate_unique_email():
    return f"physio{random.randint(1000, 9999)}@example.com"

def generate_unique_username():
    return f"LOCUST_physio_user_{random.randint(1000, 9999)}"

# Variables para cambiar fácilmente entre local y producción
#BACKEND_BASE_URL = "http://localhost:8000"
BACKEND_BASE_URL = "https://ppl-api.fisiofind.com"
#FRONTEND_BASE_URL = "http://localhost:3000"

class Locust_tests(HttpUser):
    wait_time = between(1, 3)

    @task(1)
    def post_backend_advanced_search(self):
        """Simula el uso del filtro de búsqueda en el backend"""
        payload = {
            "specialization": random.choice(["Fisioterapia deportiva", "Pediatría", ""]),
            "gender": random.choice(["male", "female", ""]),
            "postalCode": random.choice(["28001", "08010", ""]),
            "maxPrice": random.choice(["30", "50", ""]),
            "schedule": random.choice(["mañana", "tarde", "noche", ""]),
            "name": random.choice(["", "Juan", "María"])
        }

        self.client.post(
            f"{BACKEND_BASE_URL}/api/guest_session/advanced-search/",
            json=payload,
            headers={"Content-Type": "application/json"},
            name="Backend /api/guest_session/advanced-search"
        )

    @task(2)
    def post_physio_register(self):
        """Simula el registro de fisio"""
        data = {
            "username": generate_unique_username(),
            "email": generate_unique_email(),
            "password": "StrongPassword123!",
            "first_name": random.choice(["LOCUSTAna", "LOCUSTLuis", "LOCUSTCarmen"]),
            "last_name": random.choice(["García", "Martínez", "Rodríguez"]),
            "dni": generate_random_dni(),
            "gender": random.choice(["F", "M"]),
            "birth_date": "1990-01-01",
            "collegiate_number": str(random.randint(10000, 99999)),
            "autonomic_community": random.choice(AUTONOMIC_COMMUNITIES),
            "phone_number": f"6{random.randint(10000000, 99999999)}",
            "postal_code": random.choice(["28001", "08010", "46001"]),
            "plan": "blue",
            "specializations": random.sample(["Deportiva", "Neurológica", "Pediátrica", "Traumatológica"], k=2),
            "services": {"masaje": True},
            "schedule": {"lunes": ["10:00", "12:00"]}
        }
        print("Enviando solicitud al backend...")
        with self.client.post(
            f"{BACKEND_BASE_URL}/api/app_user/physio/register/",
            json=data,
            headers={"Content-Type": "application/json"},
            name="Backend /api/app_user/physio/register",
            catch_response=True
        ) as response:
            if response.status_code != 201:
                response.failure(f"Failed to register physio: {response.status_code} | {response.text}")

