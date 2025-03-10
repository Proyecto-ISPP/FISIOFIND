from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/app_user/', include('gestion_usuarios.urls')),
    path('api/app_appointment/', include('gestion_citas.urls')),
    path('api/terminos/', include('gestion_terminos.urls')),
    path('api/sesion_invitado/', include('sesion_invitado.urls'))   
]
