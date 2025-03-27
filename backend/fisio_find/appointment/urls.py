from django.urls import path
from appointment import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('schedule/<int:pk>/', views.get_physio_schedule_by_id),
    path('physio/schedule/weekly/', views.edit_weekly_schedule ),
    path('physio/schedule/add-unavailable/', views.add_unavailable_day),
    path('<int:appointmentId>/', views.get_appointment_by_id, name='get_appointment_by_id'),
    path('confirm/<str:token>/', views.confirm_appointment_using_token, name='confirm_appointment'),
    path('confirm-alternative/<str:token>/', views.confirm_alternative_appointment, name='confirm_appointment_alternatives'),

    #Patients
    path('patient/', views.create_appointment_patient),
    path('patient/list/', views.list_appointments_patient),
    #Physiotherapists
    path('physio/', views.create_appointment_physio),
    path('physio/list/', views.list_appointments_physio),
    path('physio/list/finished/', views.list_finished_appointments_physio, name='list_finished_appointments_physio'),

    #Update and delete
    path('update/<int:appointment_id>/', views.update_appointment, name='update_appointment'),
    path('delete/<int:appointment_id>/', views.delete_appointment, name='delete_appointment'),
    path('update/<int:appointment_id>/confirm/', views.confirm_appointment, name='confirm_appointment'),
    path('update/<int:appointment_id>/accept-alternative/', views.accept_alternative),
    
    path('admin/create/', views.create_appointment_admin, name="create_appointment_admin"),
    path('admin/list/', views.AdminAppointmenList.as_view(), name="list_appointments_admin"),
    path('admin/list/<int:pk>/', views.AdminAppointmennDetail.as_view()),
    path('admin/edit/<int:pk>/', views.AdminAppointmenUpdate.as_view()),
    path('admin/delete/<int:pk>/', views.AdminAppointmenDelete.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)
"""
    #Admin 
    path('admin/create/', views.AdminAppointmenCreate.as_view()),
    path('admin/list/', views.AdminAppointmenList.as_view()),
    path('admin/list/<int:pk>/', views.AdminAppointmennDetail.as_view()),
    path('admin/edit/<int:pk>/', views.AdminAppointmenUpdate.as_view()),
    path('admin/delete/<int:pk>/', views.AdminAppointmenDelete.as_view()),
"""