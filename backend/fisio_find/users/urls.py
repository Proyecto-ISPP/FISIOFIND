from django.urls import path, re_path
from .views import *
from .subscription_views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('patient/register/', patient_register_view, name='patient_register'),
    path('login/', custom_token_obtain_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check-role/', check_role_view, name='check_role'),
    path('physio/register/', physio_register_view, name='physio_register'),
    re_path(r'^register/verified/(?P<token>.*)/$', verify_registration, name='verify_registration'),
    path('physio/validate/', validate_physio_registration, name='validate_physio_registration'),
    path('physio/payment/', process_payment, name='process_payment'),
    path('physio/update/', physio_update_view, name='physio_update'),
    path('physio/add-service/', physio_create_service_view, name='physio_create_service'),
    path('physio/update-service/<int:service_id>/', physio_update_service_view, name='physio_update_service'),
    path('physio/delete-service/<int:service_id>/', physio_delete_service_view, name='physio_delete_service'),
    path('profile/', PatientProfileView.as_view(), name='profile'),
    path('current-user/', return_user, name='current_user'),

    path('services/<int:physio_id>/', physio_get_services_view, name='physio_get_xservices'),

    path('account/delete/request/', request_account_deletion, name='request_account_deletion'),
    path('account/delete/confirm/<str:token>/', confirm_account_deletion, name='confirm_account_deletion'),
    path('subscription/status/', get_subscription_status, name='get_subscription_status'),
    path('subscription/update/', update_subscription, name='update_subscription'),
    path('unsubscribe/', unsubscribe_via_token, name='unsubscribe'),


]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
