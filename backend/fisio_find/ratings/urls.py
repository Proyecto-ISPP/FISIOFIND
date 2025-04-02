from django.urls import path
from .views import (
    RatingListView,
    create_rating,
    update_rating,
    delete_rating,
    get_rating_details,
    get_physiotherapist_ratings
)

urlpatterns = [
    path('', RatingListView.as_view(), name='rating_list'),
    path('create/', create_rating, name='create_rating'),
    path('<int:rating_id>/update/', update_rating, name='update_rating'),
    path('<int:rating_id>/delete/', delete_rating, name='delete_rating'),
    path('<int:rating_id>/', get_rating_details, name='get_rating_details'),
    path('physiotherapist/<int:physiotherapist_id>/', get_physiotherapist_ratings, name='get_physiotherapist_ratings'),
]
