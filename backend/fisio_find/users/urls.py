from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('patient/register/', patient_register_view, name='patient_register'),
    path('login/', custom_token_obtain_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check-role/', check_role_view, name='check_role'),
    path('physio/register/', physio_register_view, name='physio_register'),
    path('physio/update/', physio_update_view, name='physio_update'),
    path('physio/create-service/', physio_create_service, name='physio_create_service'),
    # Change this line in urlpatterns
    path('physio/delete-service/<int:service_id>/', physio_delete_service_view, name='physio_delete_service'),
    # To this
    path('physio/delete-service/<str:service_name>/', physio_delete_service_view, name='physio_delete_service'),
    path('profile/', PatientProfileView.as_view(), name='profile'),
    path('current-user/', return_user, name='current_user'),
    path('services/<int:physio_id>/', physio_get_services_view, name='physio_get_xservices'),
    


]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

"""
    path('admin/patient/list/search/<str:query>/', admin_search_patients_by_user, name='admin_patient_list'),
    path('admin/physio/list/search/<str:query>/',admin_search_physios_by_user, name="admin_physio_list"),
    path('admin/patient/list/<int:pk>/', AdminPatientDetail.as_view(), name='admin_patient_detail'),
    path('admin/physio/list/<int:pk>/', AdminPhysioDetail.as_view(), name='admin_physio_detail'), 

    path('admin/patient/list/', admin_list_patient_profiles, name='admin_patient_list'),
    path('admin/physio/list/', admin_list_physioterapist_profiles, name='admin_physio_list'),
    path('admin/update-account-status/<int:user_id>/', admin_update_account_status, name='admin_update_account_status'),
    path('admin/remove-user/<int:user_id>/', admin_remove_user, name='admin_remove_user'),
    path('admin/physio/list/<int:pk>/', AdminPhysioDetail.as_view(), name='admin_physio_detail'),  
"""
