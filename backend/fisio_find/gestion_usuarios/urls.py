from django.urls import path
from .views import CheckRoleView, CustomTokenObtainView, LogoutView, PatientRegisterView

urlpatterns = [
    path('patient/register/', PatientRegisterView.as_view(), name='patient_register'),
    path('login/', CustomTokenObtainView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-role/', CheckRoleView.as_view(), name='check_role'),

]
    

