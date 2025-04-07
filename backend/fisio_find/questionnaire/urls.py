from django.urls import path
from .views import (
    QuestionnaireListView, QuestionnaireCreateView, QuestionnaireDetailView,
    QuestionCreateView
)

urlpatterns = [
    # Cuestionarios
    path('list/', QuestionnaireListView.as_view(), name='questionnaire_list'),
    path('create/', QuestionnaireCreateView.as_view(), name='create_questionnaire'),
    path('<int:pk>/', QuestionnaireDetailView.as_view(), name='questionnaire_detail'),

    # Preguntas dentro de un cuestionario
    path('questionnaires/<int:questionnaire_id>/questions/create/', QuestionCreateView.as_view(), name='create_question'),
]
