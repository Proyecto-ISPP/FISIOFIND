from django.urls import path
from .views import TermsCreate, TermsList, TermsDetail, TermsUpdate, TermsDelete

urlpatterns = [
    path('create/', TermsCreate.as_view(), name='terms_create'),
    path('list/', TermsList.as_view(), name='terms_list'),
    path('detail/<int:pk>/', TermsDetail.as_view(), name='terms_detail'),
    path('update/<int:pk>/', TermsUpdate.as_view(), name='terms_update'),
    path('delete/<int:pk>/', TermsDelete.as_view(), name='terms_delete'),
]
