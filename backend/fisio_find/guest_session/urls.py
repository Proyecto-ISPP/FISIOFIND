from django.urls import path
from .views import SearchPhysiotherapistView, PhysiotherapistsWithSpecializationView, ListSpecializationsView, AdvancedSearchView

urlpatterns = [
    path('search-physios/', SearchPhysiotherapistView.as_view(), name='search-physios'),
    path('physios-with-specializations/', PhysiotherapistsWithSpecializationView.as_view(),
         name='physios-with-specializations'),
    path('specializations/', ListSpecializationsView.as_view(), name='specializations')
    path('advanced-search/', AdvancedSearchView.as_view(), name='advanced-search'),

]
