import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from videocall import consumers  # Asegúrate de que está correcto

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fisio_find.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/room/<room_code>/", consumers.ChatConsumer.as_asgi()),  # WebSockets
        ])
    ),
})
