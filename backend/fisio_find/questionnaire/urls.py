from django.urls import path
from .views import (
    QuestionnaireListView, QuestionnaireCreateView, QuestionnaireDetailView,
    QuestionCreateView, store_responses, get_questionnaire_response, create_questionnaire_response, add_notes2questionnaire_responses
)

urlpatterns = [
    # Cuestionarios
    path('list/', QuestionnaireListView.as_view(), name='questionnaire_list'),
    path('create/', QuestionnaireCreateView.as_view(), name='create_questionnaire'),
    path('<int:pk>/', QuestionnaireDetailView.as_view(), name='questionnaire_detail'),

    # Preguntas dentro de un cuestionario
    path('questionnaires/<int:questionnaire_id>/questions/create/', QuestionCreateView.as_view(), name='create_question'),
    path('store-responses/<int:questionnaire_id>/', store_responses, name='store_responses'),

    # Respuestas de cuestionarios
    path('responses/<int:questionnaire_response_id>/', get_questionnaire_response, name='get_questionnaire_response'),
    path('<int:questionnaire_id>/responses/create/', create_questionnaire_response, name='create_questionnaire_response'),
    path('<int:questionnaire_id>/responses/add-notes/', add_notes2questionnaire_responses, name='add_notes2questionnaire_responses')
]
