from django.urls import path
from .views import (
    QuestionnaireListView, QuestionnaireCreateView, QuestionnaireDetailView,
    QuestionCreateView, QuestionListView, PatientResponseCreateView,
    PatientResponseListView, PatientResponseDetailView
)

urlpatterns = [
    # Cuestionarios
    path('list/', QuestionnaireListView.as_view(), name='questionnaire_list'),
    path('create/', QuestionnaireCreateView.as_view(), name='create_questionnaire'),
    path('<int:pk>/', QuestionnaireDetailView.as_view(), name='questionnaire_detail'),

    # Preguntas dentro de un cuestionario
    path('questionnaires/<int:questionnaire_id>/questions/create/', QuestionCreateView.as_view(), name='create_question'),
    path('questionnaires/<int:questionnaire_id>/questions/', QuestionListView.as_view(), name='question_list'),

    # Respuestas de los pacientes
    path('questionnaires/<int:questionnaire_id>/responses/create/', PatientResponseCreateView.as_view(), name='create_patient_response'),
    path('patient/responses/', PatientResponseListView.as_view(), name='patient_response_list'),
    path('patient/responses/<int:pk>/', PatientResponseDetailView.as_view(), name='patient_response_detail'),
]
