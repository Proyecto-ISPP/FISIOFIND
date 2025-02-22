from django.urls import path
from gestion_usuarios.views import AppUserCreate, AppUserList, AppUserDetail, AppUserUpdate, AppUserDelete

urlpatterns = [
    path('create/', AppUserCreate.as_view(), name='create_app_user'),
    path('', AppUserList.as_view()),
    path('detail/<int:pk>/', AppUserDetail.as_view(), name='retrieve_app_user'),
    path('update/<int:pk>/', AppUserUpdate.as_view(), name='update_app_user'),
    path('delete/<int:pk>/', AppUserDelete.as_view(), name='delete_app_user'),

]
