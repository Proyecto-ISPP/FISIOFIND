from django.urls import re_path
from . import consumers
from .consumers import ChatConsumer

websocket_urlpatterns = [
    # Usar el código de la sala en la URL
    re_path(r'ws/room/(?P<room_code>\w+)/$', ChatConsumer.as_asgi()),
]
websocket_urlpatterns = [
    re_path(r'', consumers.ChatConsumer.as_asgi()),

]