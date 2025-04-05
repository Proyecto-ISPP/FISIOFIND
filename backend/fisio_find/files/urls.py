from django.urls import path
from .views import *
from django.conf import settings

urlpatterns = [
    path('files/create-files/', create_file, name='create_file'),
    path('files/delete-file/<int:file_id>/', delete_patient_file, name='delete_patient_file'),
    path('files/update-file/<int:file_id>/', update_patient_file, name='update_patient_file'),
    path('files/list-file/<int:file_id>/', get_patient_file_by_id, name='get_patient_file_by_id'),
    path('files/list-files/', get_patient_files, name='get_patient_files'),

    path('videos/create-video/', create_video, name='create_video'),
    path('videos/delete-video/<int:video_id>/', delete_video, name='delete_video'),
    path('videos/list-video/<int:video_id>/', list_video_by_id, name='list_video_by_id'),
    path('videos/list-videos/', list_my_videos, name='list_my_videos'),
    path('videos/update-video/<int:video_id>/', update_video, name='update_video'),
    path('videos/stream-video/<int:video_id>/', stream_video, name='stream_video'),
]