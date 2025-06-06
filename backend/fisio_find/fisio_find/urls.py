from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse


def home(request):
    return HttpResponse("¡Bienvenido a FisioFind!")


def robots_txt(request):
    content = "User-agent: *\nDisallow: /"
    return HttpResponse(content, content_type="text/plain")


admin.site.index_title = "Panel de administración"
admin.site.site_title = "Fisio Find"
admin.site.site_header = "Fisio Find"

urlpatterns = [
    path('', home, name='home'),
    path('robots.txt', robots_txt, name='robots_txt'),
    path('admin/', admin.site.urls),
    path('api/app_user/', include('users.urls')),
    path('api/appointment/', include('appointment.urls')),
    path('api/terms/', include('terms.urls')),
    path('api/videocall/', include('videocall.urls')),
    path('api/treatments/', include('treatments.urls')),
    path('api/guest_session/', include('guest_session.urls')),
    path('api/questionnaires/', include('questionnaire.urls')),
    path('api/payments/', include('payment.urls')),
    path('api/ratings/', include('ratings.urls')),
    path('api/cloud/', include('files.urls')),
    path('api/appointment_ratings/', include('appointment_rating.urls')),
]

if settings.DEBUG:
    # Serve profile photos
    urlpatterns += static(settings.PROFILE_PHOTOS_URL, document_root=settings.PROFILE_PHOTOS_ROOT)
    # Serve other media files
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
