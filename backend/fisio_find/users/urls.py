from django.urls import path
from .views import patient_register_view, physio_delete_service_view, physio_get_services_view, physio_create_service_view, custom_token_obtain_view, logout_view, check_role_view, physio_register_view, return_user, physio_update_view, PatientProfileView, admin_search_patients_by_user, admin_search_physios_by_user, AdminPatientDetail, AdminPhysioDetail #, AdminPatientList, AdminPatientCreate, AdminPatientnDetail, AdminPatientUpdate, AdminPatientDelete, AdminAppUserDetail
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('patient/register/', patient_register_view, name='patient_register'),
    path('login/', custom_token_obtain_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check-role/', check_role_view, name='check_role'),
    path('physio/register/', physio_register_view, name='physio_register'),
    path('physio/update/', physio_update_view, name='physio_update'),
    path('physio/add-service/', physio_create_service_view, name='physio_create_service'),
    path('physio/delete-service/<int:service_id>/', physio_delete_service_view, name='physio_delete_service'),
    path('profile/', PatientProfileView.as_view(), name='profile'),
    path('current-user/', return_user, name='current_user'),
    path('services/<int:physio_id>/', physio_get_services_view, name='physio_get_xservices'),
    
    path('admin/patient/list/search/<str:query>/', admin_search_patients_by_user, name='admin_patient_list'),
    path('admin/physio/list/search/<str:query>/',admin_search_physios_by_user, name="admin_physio_list"),
    path('admin/patient/list/<int:pk>/', AdminPatientDetail.as_view(), name='admin_patient_detail'),
    path('admin/physio/list/<int:pk>/', AdminPhysioDetail.as_view(), name='admin_physio_detail'),    
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

"""
    path('admin/patient/list/', AdminPatientList.as_view(), name='admin_patient_list'),
    path('admin/patient/list/<int:pk>/', AdminPatientnDetail.as_view(), name='admin_patient_detail'),
    path('admin/patient/create/', AdminPatientCreate.as_view(), name='admin_patient_create'),
    path('admin/patient/edit/<int:pk>/', AdminPatientUpdate.as_view(), name='admin_patient_update'),
    path('admin/patient/delete/<int:pk>/', AdminPatientDelete.as_view(), name='admin_patient_delete'),
    path('admin/user/list/<int:pk>/', AdminAppUserDetail.as_view(), name='admin_app_user_detail'),

]
"""

