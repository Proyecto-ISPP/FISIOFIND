from django.urls import path
from .views import list_ratings, create_rating

urlpatterns = [
    path('<int:physio_id>/', list_ratings, name='ratings-list'),  # GET para obtener valoraciones de un fisio
    path('', create_rating, name='ratings-create'),  # POST para valorar a un fisio
]
