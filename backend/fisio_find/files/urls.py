from django.urls import path
from .views import *
from django.conf import settings

urlpatterns = [
    path('files/create-files/', create_file, name='create_file'),
    path('files/delete-file/<int:file_id>/', delete_patient_file, name='delete_patient_file'),
    path('files/update-file/<int:file_id>/', update_patient_file, name='update_patient_file'),
    path('files/list-file/<int:file_id>/', get_patient_file_by_id, name='get_patient_file_by_id'),
    path('files/list-files/', get_patient_files, name='get_patient_files'),
]