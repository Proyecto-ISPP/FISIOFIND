# urls.py

from django.urls import path
from .views import RoomCreateView, RoomJoinView, RoomDeleteView

urlpatterns = [
    path('create-room/', RoomCreateView.as_view(), name='create_room'),
    path('join-room/<str:code>/', RoomJoinView.as_view(), name='join_room'),
    path('delete-room/<str:code>/', RoomDeleteView.as_view(), name='delete_room'),
]