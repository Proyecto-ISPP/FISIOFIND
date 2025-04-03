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
    path('list/', RatingListView.as_view(), name='ratings_list'),
    path('create/', create_rating, name='create_rating'),
    path('update/<int:rating_id>/', update_rating, name='update_rating'),
    path('delete/<int:rating_id>/', delete_rating, name='delete_rating'),
    path('<int:rating_id>/', get_rating_details, name='get_rating_details'),
    path('physiotherapist/<int:physiotherapist_id>/', get_physiotherapist_ratings, name='get_physiotherapist_ratings'),
]
