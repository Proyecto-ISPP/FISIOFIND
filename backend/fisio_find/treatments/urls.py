from django.urls import path
from .views import (
    SessionTestCreateOrUpdateView, SessionTestDeleteView, SessionTestResponseListView, SessionTestResponseView, SessionTestRetrieveView, TreatmentCreateView, PhysiotherapistTreatmentListView, PatientTreatmentListView, TreatmentDetailView,
    SessionCreateView, SessionListView, SessionDetailView,
    ExerciseCreateView, ExerciseListView, ExerciseDetailView, ExerciseSearchView, ExerciseByAreaView,
    AssignExerciseToSessionView, UnassignExerciseFromSessionView, ExerciseListBySessionView,
    SeriesCreateView, SeriesDetailView, SeriesListByExerciseSessionView, SeriesDeleteView,
    ExerciseLogCreateView, ExerciseLogListView, ExerciseLogDetailView
)

urlpatterns = [
    # Tratamientos
    path('create/', TreatmentCreateView.as_view(), name='create_treatment'),
    path('physio/', PhysiotherapistTreatmentListView.as_view(), name='physio_treatment_list'),
    path('patient/', PatientTreatmentListView.as_view(), name='patient_treatment_list'),
    path('<int:pk>/', TreatmentDetailView.as_view(), name='treatment_detail'),

    # Sesiones dentro de un tratamiento y sus tests
    path('<int:treatment_id>/sessions/create/', SessionCreateView.as_view(), name='create_session'),
    path('<int:treatment_id>/sessions/', SessionListView.as_view(), name='session_list'),
    path('sessions/<int:session_id>/', SessionDetailView.as_view(), name='session_detail'),
    path('sessions/<int:session_id>/test/', SessionTestCreateOrUpdateView.as_view(), name='create_update_test'),
    path('sessions/<int:session_id>/test/view/', SessionTestRetrieveView.as_view(), name='view_test'),
    path('sessions/<int:session_id>/test/delete/', SessionTestDeleteView.as_view(), name='delete_test'),
    path('sessions/<int:session_id>/test/respond/', SessionTestResponseView.as_view(), name='respond_test'),
    path('sessions/<int:session_id>/test/responses/', SessionTestResponseListView.as_view(), name='list_test_responses'),

    # Ejercicios
    path('exercises/create/', ExerciseCreateView.as_view(), name='create_exercise'),
    path('exercises/', ExerciseListView.as_view(), name='exercise_list'),
    path('exercises/<int:pk>/', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercises/search/', ExerciseSearchView.as_view(), name='search_exercise'),
    path('exercises/by-area/', ExerciseByAreaView.as_view(), name='exercise_by_area'),

    # Asignación de ejercicios a sesiones
    path('sessions/<int:session_id>/assign-exercise/', AssignExerciseToSessionView.as_view(), name='assign_exercise'),
    path('exercise-sessions/<int:exercise_session_id>/unassign-exercise/', UnassignExerciseFromSessionView.as_view(), name='unassign_exercise'),
    path('sessions/<int:session_id>/exercises/', ExerciseListBySessionView.as_view(), name='exercise_list_by_session'),

    # Series dentro de ejercicios en sesiones
    path('exercise-sessions/<int:exercise_session_id>/series/create/', SeriesCreateView.as_view(), name='create_series'),
    path('exercise-sessions/<int:exercise_session_id>/series/', SeriesListByExerciseSessionView.as_view(), name='series_list_by_exercise_session'),
    path('series/<int:pk>/', SeriesDetailView.as_view(), name='series_detail'),
    path('series/<int:pk>/delete/', SeriesDeleteView.as_view(), name='delete_series'),

    # Registro de progreso en ejercicios
    path('exercise-logs/create/', ExerciseLogCreateView.as_view(), name='create_exercise_log'),
    path('exercise-sessions/<int:exercise_session_id>/logs/', ExerciseLogListView.as_view(), name='exercise_log_list'),
    path('exercise-logs/<int:pk>/', ExerciseLogDetailView.as_view(), name='exercise_log_detail'),
]
