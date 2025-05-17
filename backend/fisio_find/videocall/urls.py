# urls.py

from django.urls import path
from .views import RoomCreateView, RoomJoinView, RoomDeleteView, RoomListView,TestRoomCreateView, RoomDetailView

urlpatterns = [
    path('create-room/', RoomCreateView.as_view(), name='create_room'),
    path('join-room/<str:code>/', RoomJoinView.as_view(), name='join_room'),
    path('delete-room/<str:code>/', RoomDeleteView.as_view(), name='delete_room'),
    path('my-rooms/', RoomListView.as_view(), name='my-rooms'),
    path('create-test-room/',TestRoomCreateView.as_view(),name='create_test_room'),
    path('room-info/<str:code>/', RoomDetailView.as_view(), name='room-detail'),

]
