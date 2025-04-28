import random
from locust import HttpUser, task, between

class UserBehavior(HttpUser):
    wait_time = between(1, 5)

    @task(2)
    def register_physio(self):
        payload = {
            "username": "LOCUST_USER",
            "email": "LOCUST@sample.com",
            "password": "Usuar1o_5",
            "first_name": "Guadalupe",
            "last_name": "Moto Pino",
            "dni": "76966713L",
            "phone_number": "666666666",
            "postal_code": "41960",
            "gender": "M",
            "birth_date": "2000-01-01",
            "collegiate_number": "1488",
            "autonomic_community": "EXTREMADURA",
            "specializations": ["Obstetricia", "Deportiva"],
            "plan":"blue"
        }
        headers = {"Content-Type": "application/json"}
        
        with self.client.post(
            "/api/app_user/physio/register/",
            json=payload,
            headers=headers,
            name="Register Physio",
            catch_response=True  # Necesario para controlar manualmente la respuesta
        ) as response:
            print("Physio response status:", response.status_code)
            print("Physio response body:", response.text)
            if response.status_code == 400:
                response.success()  # Lo marcamos como "éxito" aunque sea 400
            elif response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")  # Solo fallamos si es error de servidor


    @task(1)  # Peso 1: menos frecuente que register_physio
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
            "/api/guest_session/advanced-search/",
            json=payload,
            headers={"Content-Type": "application/json"},
            name="Advanced Search"
        )

    @task(1)
    def register_patient(self):
        payload = {
            "username": "LOCUST_patient",
            "email": "LOCUST_patient@sample.com",
            "password": "74066738E74066738E",
            "first_name": "Sample",
            "last_name": "Sample",
            "dni": "74066738E",
            "phone_number": "666666666",
            "postal_code": "41960",
            "gender": "M",
            "birth_date": "2000-01-01"
        }
        headers = {"Content-Type": "application/json"}
        
        with self.client.post(
            "/api/app_user/patient/register/",
            json=payload,
            headers=headers,
            name="Register Patient",
            catch_response=True
        ) as response:
            print("Patient response status:", response.status_code)
            print("Patient response body:", response.text)
            if response.status_code == 400:
                response.success()
            elif response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
                
    @task(1)
    def login_and_add_service(self):
        """Se loguea como fisioterapeuta y añade un servicio"""
        login_payload = {
            "username": "LOCUST_USER",
            "password": "Usuar1o_5"
        }
        headers = {"Content-Type": "application/json"}

        with self.client.post(
            "/api/app_user/login/",
            json=login_payload,
            headers=headers,
            name="Login Physio",
            catch_response=True
        ) as login_response:
            if login_response.status_code == 200:
                token = login_response.json().get("access")
                if token:
                    add_service_payload = {"title":"Primera consulta","description":"ejemplo","price":90,"duration":60,"tipo":"PRIMERA_CONSULTA","custom_questionnaire":{"UI Schema":{"type":"Group","label":"Cuestionario Personalizado","elements":[{"type":"Number","label":"Peso (kg)","scope":"#/properties/peso"},{"type":"Number","label":"Altura (cm)","scope":"#/properties/altura"},{"type":"Number","label":"Edad","scope":"#/properties/edad"},{"type":"Control","label":"Nivel de actividad física","scope":"#/properties/actividad_fisica"},{"type":"Control","label":"Motivo de la consulta","scope":"#/properties/motivo_consulta"}]}}}
                    auth_headers = {
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json"
                    }
                    with self.client.post(
                        "/api/app_user/physio/add-service/",
                        json=add_service_payload,
                        headers=auth_headers,
                        name="Add Service",
                        catch_response=True
                    ) as service_response:
                        print("Add Service response status:", service_response.status_code)
                        print("Add Service response body:", service_response.text)
                        if service_response.status_code == 400:
                            service_response.success()
                        elif service_response.status_code >= 500:
                            service_response.failure(f"Server error: {service_response.status_code}")
                else:
                    login_response.failure("No access token received")
            elif login_response.status_code == 400:
                login_response.success()
            elif login_response.status_code >= 500:
                login_response.failure(f"Server error: {login_response.status_code}")


    @task(1)
    def login_and_update_physio(self):
        """Se loguea como fisioterapeuta y actualiza su perfil"""
        login_payload = {
            "username": "LOCUST_USER",
            "password": "Usuar1o_5"
        }
        headers = {"Content-Type": "application/json"}

        with self.client.post(
            "/api/app_user/login/",
            json=login_payload,
            headers=headers,
            name="Login Physio for Update",
            catch_response=True
        ) as login_response:
            if login_response.status_code == 200:
                token = login_response.json().get("access")
                if token:
                    update_payload = {
                        "user.dni": "76966713L",
                        "user.email": "LOCUST@sample.com",
                        "user.first_name": "Guadalupe",
                        "user.last_name": "Moto Pino",
                        "user.phone_number": "666666666",
                        "user.postal_code": "41960",
                        "user.user_id": "13",
                        "user.username": "LOCUST_USER",
                        "gender": "M",
                        "birth_date": "2000-01-01",
                        "autonomic_community": "EXTREMADURA",
                        "collegiate_number": "1488",
                        "bio": "Mi biografía",
                        "rating_avg": "",
                        "specializations": '["Obstetricia","Deportiva"]',  # OJO, string
                        "degree": "La mejor titulación",
                        "university": "La mejor universidad",
                        "experience": "Mucha experiencia",
                        "workplace": "En el mejor sitio"
                    }
                    auth_headers = {
                        "Authorization": f"Bearer {token}"
                    }
                    with self.client.put(
                        "/api/app_user/physio/update/",
                        data=update_payload,
                        headers=auth_headers,
                        name="Update Physio",
                        catch_response=True
                    ) as update_response:
                        print("Update Physio response status:", update_response.status_code)
                        print("Update Physio response body:", update_response.text)

                        if update_response.status_code == 400:
                            update_response.success()
                        elif update_response.status_code >= 500:
                            update_response.failure(f"Server error: {update_response.status_code}")
                else:
                    print("No access token received. Login response:", login_response.text)
                    login_response.failure("No access token received")
            elif login_response.status_code == 400:
                login_response.success()
            elif login_response.status_code >= 500:
                login_response.failure(f"Server error: {login_response.status_code}")


    @task(1)
    def login_and_update_patient(self):
        """Se loguea como paciente y actualiza su perfil"""
        login_payload = {
            "username": "LOCUST_patient",
            "password": "74066738E74066738E"
        }
        headers = {"Content-Type": "application/json"}

        with self.client.post(
            "/api/app_user/login/",
            json=login_payload,
            headers=headers,
            name="Login Patient for Update",
            catch_response=True
        ) as login_response:
            if login_response.status_code == 200:
                token = login_response.json().get("access")
                if token:
                    update_payload = {
                        "user.first_name": "Sample",
                        "user.last_name": "Sample",
                        "user.email": "LOCUST_patient@sample.com",
                        "user.phone_number": "666666667",
                        "user.postal_code": "66666",
                        "user.username": "LOCUST_patient",
                        "gender": "F",
                        "birth_date": "2000-01-01"
                    }
                    auth_headers = {
                        "Authorization": f"Bearer {token}"
                    }
                    with self.client.patch(
                        "/api/app_user/profile/",
                        data=update_payload,
                        headers=auth_headers,
                        name="Update Patient Profile",
                        catch_response=True
                    ) as update_response:
                        print("Update Patient response status:", update_response.status_code)
                        print("Update Patient response body:", update_response.text)

                        if update_response.status_code == 400:
                            update_response.success()
                        elif update_response.status_code >= 500:
                            update_response.failure(f"Server error: {update_response.status_code}")
                else:
                    print("No access token received. Login response:", login_response.text)
                    login_response.failure("No access token received")
            elif login_response.status_code == 400:
                login_response.success()
            elif login_response.status_code >= 500:
                login_response.failure(f"Server error: {login_response.status_code}")

    @task(1)
    def login_physio_and_list_appointments(self):
        """Se loguea como fisio y lista sus citas"""
        login_payload = {
            "username": "LOCUST_USER",
            "password": "Usuar1o_5"
        }
        headers = {"Content-Type": "application/json"}

        with self.client.post(
            "/api/app_user/login/",
            json=login_payload,
            headers=headers,
            name="Login Physio for Appointments",
            catch_response=True
        ) as login_response:
            if login_response.status_code == 200:
                token = login_response.json().get("access")
                if token:
                    auth_headers = {
                        "Authorization": f"Bearer {token}"
                    }
                    with self.client.get(
                        "/api/appointment/physio/list/",
                        headers=auth_headers,
                        name="List Physio Appointments",
                        catch_response=True
                    ) as list_response:
                        print("List Appointments physio response status:", list_response.status_code)
                        print("List Appointments physio response body:", list_response.text)

                        if list_response.status_code == 400:
                            list_response.success()
                        elif list_response.status_code >= 500:
                            list_response.failure(f"Server error: {list_response.status_code}")
                else:
                    print("No access token received. Login response:", login_response.text)
                    login_response.failure("No access token received")
            elif login_response.status_code == 400:
                login_response.success()
            elif login_response.status_code >= 500:
                login_response.failure(f"Server error: {login_response.status_code}")


    @task(1)
    def login_patient_and_list_appointments(self):
        """Se loguea como paciente y lista sus citas"""
        login_payload = {
            "username": "LOCUST_patient",
            "password": "74066738E74066738E"
        }
        headers = {"Content-Type": "application/json"}

        with self.client.post(
            "/api/app_user/login/",
            json=login_payload,
            headers=headers,
            name="Login Patient for Appointments",
            catch_response=True
        ) as login_response:
            if login_response.status_code == 200:
                token = login_response.json().get("access")
                if token:
                    auth_headers = {
                        "Authorization": f"Bearer {token}"
                    }
                    with self.client.get(
                        "/api/appointment/patient/list/",
                        headers=auth_headers,
                        name="List Patient Appointments",
                        catch_response=True
                    ) as list_response:
                        print("List Appointments patient response status:", list_response.status_code)
                        print("List Appointments patient response body:", list_response.text)

                        if list_response.status_code == 400:
                            list_response.success()
                        elif list_response.status_code >= 500:
                            list_response.failure(f"Server error: {list_response.status_code}")
                else:
                    print("No access token received. Login response:", login_response.text)
                    login_response.failure("No access token received")
            elif login_response.status_code == 400:
                login_response.success()
            elif login_response.status_code >= 500:
                login_response.failure(f"Server error: {login_response.status_code}")