from django.urls import path
from appointment import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('schedule/<int:pk>/', views.get_physio_schedule_by_id),
    path('physio/schedule/weekly/', views.edit_weekly_schedule ),
    path('<int:appointmentId>/', views.get_appointment_by_id, name='get_appointment_by_id'),
    path('confirm-appointment/<str:token>/', views.confirm_appointment_using_token, name='confirm_appointment'),
    path('confirm-alternative/<str:token>/', views.confirm_alternative_appointment, name='confirm_appointment_alternatives'),

    #Patients
    path('patient/', views.create_appointment_patient, name="create_appointment_patient"),
    path('patient/list/', views.list_appointments_patient),
    # Physiotherapists
    path('physio/', views.create_appointment_physio),
    path('physio/list/', views.list_appointments_physio),
    path('physio/list/finished/', views.list_finished_appointments_physio, name='list_finished_appointments_physio'),

    # Update and delete
    path('update/<int:appointment_id>/', views.update_appointment, name='update_appointment'),
    path('delete/<int:appointment_id>/', views.delete_appointment, name='delete_appointment'),
    path('update/<int:appointment_id>/confirm/', views.confirm_appointment, name='confirm_appointment'),
    path('update/<int:appointment_id>/accept-alternative/', views.accept_alternative),

]
urlpatterns = format_suffix_patterns(urlpatterns)
