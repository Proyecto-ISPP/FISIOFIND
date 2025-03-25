from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse


def home(request):
    return HttpResponse("¡Bienvenido a FisioFind!")


urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/app_user/', include('users.urls')),
    path('api/appointment/', include('gestion_citas.urls')),
    path('api/terms/', include('terms.urls')),
    path('api/videocall/', include('videocall.urls')),
    path('api/guest_session/', include('guest_session.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
