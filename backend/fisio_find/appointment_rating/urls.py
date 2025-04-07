from django.urls import path
from .views import create_last_finished_rating, create_or_update_rating, get_appointment_rating, get_my_rating, list_ratings, create_rating_by_room_code, report_rating, check_rating_by_room_code

urlpatterns = [
    path('<int:physio_id>/', list_ratings, name='ratings-list'),  # GET para obtener valoraciones de un fisio
    path('average/', get_my_rating, name='ratings-average'),  # GET para obtener la media de valoraciones de un fisio
    path('room/<str:room_code>/', create_rating_by_room_code, name='ratings-create'),  # POST para valorar a un fisio
    path('appointment/<int:appointment_id>/', get_appointment_rating, name='get_appointment_rating'),
    path('appointment/<int:appointment_id>/edit/', create_or_update_rating, name='create_or_update_rating'),
    path('last_finished/create/', create_last_finished_rating, name='create_last_finished_rating'),
    path('report/<int:rating_id>/', report_rating, name='create_last_finished_rating'),
    path('check-room-rating/<str:room_code>/', check_rating_by_room_code, name='check_rating_by_room_code'),
]
