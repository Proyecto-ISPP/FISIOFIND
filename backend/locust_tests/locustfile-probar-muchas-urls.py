from locust import HttpUser, task, between, constant
import logging

class APIMethodCheckUser(HttpUser):
    wait_time = constant(0)#between(1, 2)

    # Lista de endpoints a probar
    endpoints = [
        "http://localhost:8000/api/app_user/account/delete/confirm/<str:token>/",
        "http://localhost:8000/api/app_user/account/delete/request/",
        "http://localhost:8000/api/app_user/change_password/",
        "http://localhost:8000/api/app_user/check-role/",
        "http://localhost:8000/api/app_user/current-user/",
        "http://localhost:8000/api/app_user/login/",
        "http://localhost:8000/api/app_user/logout/",
        "http://localhost:8000/api/app_user/patient/register/",
        "http://localhost:8000/api/app_user/physio/add-service/",
        "http://localhost:8000/api/app_user/physio/delete-service/<int:service_id>/",
        "http://localhost:8000/api/app_user/physio/payment/",
        "http://localhost:8000/api/app_user/physio/register/",
        "http://localhost:8000/api/app_user/physio/update-service/<int:service_id>/",
        "http://localhost:8000/api/app_user/physio/update/",
        "http://localhost:8000/api/app_user/physio/validate/",
        "http://localhost:8000/api/app_user/physio/verify-identity/",
        "http://localhost:8000/api/app_user/profile/",
        "http://localhost:8000/api/app_user/register/verified/<token>/",
        "http://localhost:8000/api/app_user/services/<int:physio_id>/",
        "http://localhost:8000/api/app_user/subscription/status/",
        "http://localhost:8000/api/app_user/subscription/update/",
        "http://localhost:8000/api/app_user/unsubscribe/",
        "http://localhost:8000/api/appointment/<int:appointmentId>/",
        "http://localhost:8000/api/appointment/<int:appointmentId><drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/confirm-alternative/<str:token>/",
        "http://localhost:8000/api/appointment/confirm-alternative/<str:token><drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/confirm-appointment/<str:token>/",
        "http://localhost:8000/api/appointment/confirm-appointment/<str:token><drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/delete/<int:appointment_id>/",
        "http://localhost:8000/api/appointment/delete/<int:appointment_id><drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/patient/",
        "http://localhost:8000/api/appointment/patient/list/",
        "http://localhost:8000/api/appointment/patient/list<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/patient<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/physio/",
        "http://localhost:8000/api/appointment/physio/list/",
        "http://localhost:8000/api/appointment/physio/list/finished/",
        "http://localhost:8000/api/appointment/physio/list/finished<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/physio/list<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/physio/schedule/weekly/",
        "http://localhost:8000/api/appointment/physio/schedule/weekly<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/physio<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/schedule/<int:pk>/",
        "http://localhost:8000/api/appointment/schedule/<int:pk><drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/update/<int:appointment_id>/",
        "http://localhost:8000/api/appointment/update/<int:appointment_id>/accept-alternative/",
        "http://localhost:8000/api/appointment/update/<int:appointment_id>/accept-alternative<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/update/<int:appointment_id>/confirm/",
        "http://localhost:8000/api/appointment/update/<int:appointment_id>/confirm<drf_format_suffix:format>",
        "http://localhost:8000/api/appointment/update/<int:appointment_id><drf_format_suffix:format>",
        "http://localhost:8000/api/appointment_ratings/<int:physio_id>/",
        "http://localhost:8000/api/appointment_ratings/appointment/<int:appointment_id>/",
        "http://localhost:8000/api/appointment_ratings/appointment/<int:appointment_id>/edit/",
        "http://localhost:8000/api/appointment_ratings/average/",
        "http://localhost:8000/api/appointment_ratings/check-room-rating/<str:room_code>/",
        "http://localhost:8000/api/appointment_ratings/report/<int:rating_id>/",
        "http://localhost:8000/api/appointment_ratings/room/<str:room_code>/",
        "http://localhost:8000/api/cloud/files/create-files/",
        "http://localhost:8000/api/cloud/files/delete-file/<int:file_id>/",
        "http://localhost:8000/api/cloud/files/list-file/<int:file_id>/",
        "http://localhost:8000/api/cloud/files/list-files/",
        "http://localhost:8000/api/cloud/files/update-file/<int:file_id>/",
        "http://localhost:8000/api/cloud/videos/create-video/",
        "http://localhost:8000/api/cloud/videos/delete-video/<int:video_id>/",
        "http://localhost:8000/api/cloud/videos/list-video/<int:video_id>/",
        "http://localhost:8000/api/cloud/videos/list-videos/",
        "http://localhost:8000/api/cloud/videos/stream-video/<int:video_id>/",
        "http://localhost:8000/api/cloud/videos/update-video/<int:video_id>/",
        "http://localhost:8000/api/guest_session/advanced-search/",
        "http://localhost:8000/api/guest_session/physios-with-specializations/",
        "http://localhost:8000/api/guest_session/search-physios/",
        "http://localhost:8000/api/guest_session/specializations/",
        "http://localhost:8000/api/questionnaires/<int:pk>/",
        "http://localhost:8000/api/questionnaires/create/",
        "http://localhost:8000/api/questionnaires/list/",
        "http://localhost:8000/api/questionnaires/questionnaires/<int:questionnaire_id>/questions/create/",
        "http://localhost:8000/api/ratings/<int:rating_id>/",
        "http://localhost:8000/api/ratings/create/",
        "http://localhost:8000/api/ratings/delete/<int:rating_id>/",
        "http://localhost:8000/api/ratings/has-rated/",
        "http://localhost:8000/api/ratings/list/",
        "http://localhost:8000/api/ratings/my-rating/",
        "http://localhost:8000/api/ratings/update/<int:rating_id>/",
        "http://localhost:8000/api/terms/create/",
        "http://localhost:8000/api/terms/delete/<int:pk>/",
        "http://localhost:8000/api/terms/detail/<int:pk>/",
        "http://localhost:8000/api/terms/list/",
        "http://localhost:8000/api/terms/update/<int:pk>/",
        "http://localhost:8000/api/treatments/<int:pk>/",
        "http://localhost:8000/api/treatments/<int:pk>/toggle-notifications/",
        "http://localhost:8000/api/treatments/<int:treatment_id>/evolution/",
        "http://localhost:8000/api/treatments/<int:treatment_id>/sessions/",
        "http://localhost:8000/api/treatments/<int:treatment_id>/sessions/create/",
        "http://localhost:8000/api/treatments/create/",
        "http://localhost:8000/api/treatments/exercise-logs/<int:pk>/",
        "http://localhost:8000/api/treatments/exercise-logs/create/",
        "http://localhost:8000/api/treatments/exercise-sessions/<int:exercise_session_id>/logs/",
        "http://localhost:8000/api/treatments/exercise-sessions/<int:exercise_session_id>/series/",
        "http://localhost:8000/api/treatments/exercise-sessions/<int:exercise_session_id>/series/create/",
        "http://localhost:8000/api/treatments/exercise-sessions/<int:exercise_session_id>/unassign-exercise/",
        "http://localhost:8000/api/treatments/exercises/",
        "http://localhost:8000/api/treatments/exercises/<int:exercise_id>/usage/",
        "http://localhost:8000/api/treatments/exercises/<int:pk>/",
        "http://localhost:8000/api/treatments/exercises/create/",
        "http://localhost:8000/api/treatments/exercises/search/",
        "http://localhost:8000/api/treatments/patient/",
        "http://localhost:8000/api/treatments/physio/",
        "http://localhost:8000/api/treatments/series/<int:pk>/",
        "http://localhost:8000/api/treatments/series/<int:pk>/delete/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/assign-exercise/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/exercises/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/test/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/test/delete/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/test/respond/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/test/responses/",
        "http://localhost:8000/api/treatments/sessions/<int:session_id>/test/view/",
        "http://localhost:8000/api/videocall/create-room/",
        "http://localhost:8000/api/videocall/create-test-room/",
        "http://localhost:8000/api/videocall/delete-room/<str:code>/",
        "http://localhost:8000/api/videocall/join-room/<str:code>/",
        "http://localhost:8000/api/videocall/my-rooms/",
    ]

    # Inicializamos las listas globales
    post_not_allowed = []
    get_not_allowed = []
    put_not_allowed = []

    def _check_method(self, method_name, url):
        method = getattr(self.client, method_name)
        with method(url, catch_response=True) as response:
            if response.status_code == 405:
                getattr(self, f"{method_name}_not_allowed").append(url)
                response.success()  # Para que no lo marque como error
            #elif response.status_code >= 400:
            #    response.failure(f"{method_name.upper()} {url} -> {response.status_code}")
            else:
                response.success()

    @task
    def check_methods(self):
        for url in self.endpoints:
            self._check_method("get", url)
            self._check_method("post", url)
            self._check_method("put", url)

        # Solo lo hace una vez
        #self.environment.runner.quit()

    def on_stop(self):
        pass
        """
        logging.info("GET not allowed:")
        for url in self.get_not_allowed:
            logging.info(f" - {url}")

        logging.info("POST not allowed:")
        for url in self.post_not_allowed:
            logging.info(f" - {url}")

        logging.info("PUT not allowed:")
        for url in self.put_not_allowed:
            logging.info(f" - {url}")
        """