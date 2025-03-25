from django.urls import path
from .views import (
    SessionTestCreateOrUpdateView, SessionTestDeleteView, SessionTestResponseListView, SessionTestResponseView, SessionTestRetrieveView, TreatmentCreateView, PhysiotherapistTreatmentListView, PatientTreatmentListView, TreatmentDetailView,
    SessionCreateView, SessionListView, SessionDetailView,
    ExerciseCreateView, ExerciseListView, ExerciseDetailView, ExerciseSearchView, ExerciseByAreaView,
    AssignExerciseToSessionView, UnassignExerciseFromSessionView, ExerciseListBySessionView,
    SeriesCreateView, SeriesDetailView, SeriesListByExerciseSessionView, SeriesDeleteView,
    ExerciseLogCreateView, ExerciseLogListView, ExerciseLogDetailView, 
    AdminExerciseCreate, AdminExerciseDelete, AdminExerciseDetail, AdminExerciseList, AdminExerciseLogCreate,
    AdminExerciseLogDelete, AdminExerciseLogDetail, AdminExerciseLogList, AdminExerciseLogUpdate,
    AdminExerciseSessionCreate, AdminExerciseSessionDelete, AdminExerciseSessionDetail, AdminExerciseSessionList,
    AdminExerciseSessionUpdate, AdminExerciseUpdate, AdminSeriesCreate, AdminSeriesDelete, AdminSeriesDetail,
    AdminSeriesList, AdminSeriesUpdate, AdminSessionCreate, AdminSessionDelete, AdminSessionDetail, AdminSessionList,
    AdminSessionTestCreate, AdminSessionTestDelete, AdminSessionTestDetail, AdminSessionTestList, AdminSessionTestResponseCreate,
    AdminSessionTestResponseDelete, AdminSessionTestResponseDetail, AdminSessionTestResponseDetail, AdminSessionTestResponseList, 
    AdminSessionTestResponseUpdate, AdminSessionTestUpdate, AdminSessionUpdate, AdminTreatmentCreate, AdminTreatmentDelete,
    AdminTreatmentDetail, AdminTreatmentList, AdminTreatmentUpdate
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
    
    # Admin treatment
    path('admin/treatment/create/', AdminTreatmentCreate.as_view(),name="admin_treatment_detail"),
    path('admin/treatment/list/', AdminTreatmentList.as_view(),name="admin_treatment_list"),
    path('admin/treatment/list/<int:pk>/', AdminTreatmentDetail.as_view(),name="admin_treatment_detail"),
    path('admin/treatment/update/<int:pk>/', AdminTreatmentUpdate.as_view(),name="admin_treatment_update"),
    path('admin/treatment/delete/<int:pk>/', AdminTreatmentDelete.as_view(),name="admin_treatment_delete"),

    # Admin session
    path('admin/session/create/', AdminSessionCreate.as_view(),name="admin_session_detail"),
    path('admin/session/list/', AdminSessionList.as_view(),name="admin_session_list"),
    path('admin/session/list/<int:pk>/', AdminSessionDetail.as_view(),name="admin_session_detail"),
    path('admin/session/update/<int:pk>/', AdminSessionUpdate.as_view(),name="admin_session_update"),
    path('admin/session/delete/<int:pk>/', AdminSessionDelete.as_view(),name="admin_session_delete"),

    # Admin sessionTest
    path('admin/session_test/create/', AdminSessionTestCreate.as_view(),name="admin_session_test_detail"),
    path('admin/session_test/list/', AdminSessionTestList.as_view(),name="admin_session_test_list"),
    path('admin/session_test/list/<int:pk>/', AdminSessionTestDetail.as_view(),name="admin_session_test_detail"),
    path('admin/session_test/update/<int:pk>/', AdminSessionTestUpdate.as_view(),name="admin_session_test_update"),
    path('admin/session_test/delete/<int:pk>/', AdminSessionTestDelete.as_view(),name="admin_session_test_delete"),

    # Admin sessionTestResponse
    path('admin/session_test_response/create/', AdminSessionTestResponseCreate.as_view(),name="admin_session_test_response_detail"),
    path('admin/session_test_response/list/', AdminSessionTestResponseList.as_view(),name="admin_session_test_response_list"),
    path('admin/session_test_response/list/<int:pk>/', AdminSessionTestResponseDetail.as_view(),name="admin_session_test_response_detail"),
    path('admin/session_test_response/update/<int:pk>/', AdminSessionTestResponseUpdate.as_view(),name="admin_session_test_response_update"),
    path('admin/session_test_response/delete/<int:pk>/', AdminSessionTestResponseDelete.as_view(),name="admin_session_test_response_delete"),
    
    # Admin exercise
    path('admin/exercise/create/', AdminExerciseCreate.as_view(),name="admin_exercise_detail"),
    path('admin/exercise/list/', AdminExerciseList.as_view(),name="admin_exercise_list"),
    path('admin/exercise/list/<int:pk>/', AdminExerciseDetail.as_view(),name="admin_exercise_detail"),
    path('admin/exercise/update/<int:pk>/', AdminExerciseUpdate.as_view(),name="admin_exercise_update"),
    path('admin/exercise/delete/<int:pk>/', AdminExerciseDelete.as_view(),name="admin_exercise_delete"),

    # Admin exerciseSession
    path('admin/exercise_session/create/', AdminExerciseSessionCreate.as_view(),name="admin_exercise_session_detail"),
    path('admin/exercise_session/list/', AdminExerciseSessionList.as_view(),name="admin_exercise_session_list"),
    path('admin/exercise_session/list/<int:pk>/', AdminExerciseSessionDetail.as_view(),name="admin_exercise_session_detail"),
    path('admin/exercise_session/update/<int:pk>/', AdminExerciseSessionUpdate.as_view(),name="admin_exercise_session_update"),
    path('admin/exercise_session/delete/<int:pk>/', AdminExerciseSessionDelete.as_view(),name="admin_exercise_session_delete"),

    # Admin series
    path('admin/series/create/', AdminSeriesCreate.as_view(),name="admin_series_detail"),
    path('admin/series/list/', AdminSeriesList.as_view(),name="admin_series_list"),
    path('admin/series/list/<int:pk>/', AdminSeriesDetail.as_view(),name="admin_series_detail"),
    path('admin/series/update/<int:pk>/', AdminSeriesUpdate.as_view(),name="admin_series_update"),
    path('admin/series/delete/<int:pk>/', AdminSeriesDelete.as_view(),name="admin_series_delete"),

    # Admin exerciseLog
    path('admin/exercise_log/create/', AdminExerciseLogCreate.as_view(),name="admin_exercise_log_detail"),
    path('admin/exercise_log/list/', AdminExerciseLogList.as_view(),name="admin_exercise_log_list"),
    path('admin/exercise_log/list/<int:pk>/', AdminExerciseLogDetail.as_view(),name="admin_exercise_log_detail"),
    path('admin/exercise_log/update/<int:pk>/', AdminExerciseLogUpdate.as_view(),name="admin_exercise_log_update"),
    path('admin/exercise_log/delete/<int:pk>/', AdminExerciseLogDelete.as_view(),name="admin_exercise_log_delete"),
    
    
    
    



]
