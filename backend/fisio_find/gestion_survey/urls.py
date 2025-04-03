from django.urls import path
from .views import SurveyCreate, SurveyDelete, SurveyList, SurveyUpdate, SurveyDetail

urlpatterns = [
    path('create/', SurveyCreate.as_view(), name='survey_create'),
    path('list/', SurveyList.as_view(), name='survey_list'),
    path('list/<int:pk>/', SurveyDetail.as_view(), name='survey_detail'),
    path('update/<int:pk>/', SurveyUpdate.as_view(), name='survey_update'),
    path('delete/<int:pk>/', SurveyDelete.as_view(), name='survey_delete'),
]
