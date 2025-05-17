from django.urls import path
from .views import (
    create_file,
    delete_patient_file,
    update_patient_file,
    get_patient_file_by_id,
    get_patient_files,
    view_or_download_patient_file,
    create_video,
    delete_video,
    list_video_by_id,
    list_my_videos,
    update_video,
    stream_video
)

urlpatterns = [
    path('files/create-files/', create_file, name='create_file'),
    path('files/delete-file/<int:file_id>/', delete_patient_file, name='delete_patient_file'),
    path('files/update-file/<int:file_id>/', update_patient_file, name='update_patient_file'),
    path('files/list-file/<int:file_id>/', get_patient_file_by_id, name='get_patient_file_by_id'),
    path('files/list-files/<int:id_treatment>/', get_patient_files, name='get_patient_files'),
    path('files/view-file/<int:file_id>/', view_or_download_patient_file, name='view_or_download_patient_file'),

    path('videos/create-video/', create_video, name='create_video'),
    path('videos/delete-video/<int:video_id>/', delete_video, name='delete_video'),
    path('videos/list-video/<int:video_id>/', list_video_by_id, name='list_video_by_id'),
    path('videos/list-videos/<int:id_treatment>/', list_my_videos, name='list_my_videos'),
    path('videos/update-video/<int:video_id>/', update_video, name='update_video'),
    path('videos/stream-video/<int:video_id>/', stream_video, name='stream_video'),
]