from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse


def home(request):
    return HttpResponse("¡Bienvenido a FisioFind!")

admin.site.index_title = "Panel de administración"
admin.site.site_title = "Fisio Find"
admin.site.site_header = "Fisio Find"

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/app_user/', include('users.urls')),
    path('api/appointment/', include('appointment.urls')),
    path('api/terms/', include('terms.urls')),
    path('api/videocall/', include('videocall.urls')),
    path('api/treatments/', include('treatments.urls')),
    path('api/guest_session/', include('guest_session.urls')),
    path('api/payments/', include('payment.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
