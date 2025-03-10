from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("¡Bienvenido a FisioFind!")

urlpatterns = [
    path('', home, name='home'),  # Agregar esta línea para la página principal
    path('admin/', admin.site.urls),
    path('api/app_user/', include('gestion_usuarios.urls')),
    path('api/app_appointment/', include('gestion_citas.urls')),
    path('api/terminos/', include('gestion_terminos.urls')),
    path('api/videocall/', include('videocall.urls')),
]
