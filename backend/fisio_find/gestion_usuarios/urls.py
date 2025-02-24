from django.urls import path
from .views import AppUserCreate, AppUserList, AppUserDetail, AppUserUpdate, AppUserDelete, test_json_response

urlpatterns = [
    path('create/', AppUserCreate.as_view(), name='app_user_create'),
    path('list/', AppUserList.as_view(), name='app_user_list'),
    path('<int:pk>/', AppUserDetail.as_view(), name='app_user_detail'),
    path('update/<int:pk>/', AppUserUpdate.as_view(), name='app_user_update'),
    path('delete/<int:pk>/', AppUserDelete.as_view(), name='app_user_delete'),
    path('prueba/', test_json_response, name='test_json_response'),
]
