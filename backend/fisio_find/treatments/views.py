import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from users.permissions import IsPatient, IsPhysioOrPatient, IsPhysiotherapist
from .models import Exercise, ExerciseLog, ExerciseSession, Series, Session, SessionTest, Treatment
from appointment.models import Appointment
from .serializers import ExerciseLogSerializer, ExerciseSerializer, ExerciseSessionSerializer, SeriesSerializer, SessionSerializer, SessionTestResponseSerializer, SessionTestSerializer, TreatmentSerializer, TreatmentDetailSerializer

class TreatmentCreateView(APIView):
    """
    Vista para crear tratamientos. Solo los fisioterapeutas pueden crear tratamientos.
    Un tratamiento se crea desde una cita finalizada y se le añade al paciente de la misma.
    """
    # PRUEBAS: AllowAny
    permission_classes = [IsPhysiotherapist]
    
    def post(self, request):
        # PRUEBAS: Tomamos el id del request.data y lo asignamos al campo physiotherapist
        # data = request.data.copy()
        
        # Verificar si el usuario autenticado es fisioterapeuta
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para crear tratamientos'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Verificar que se proporciona el ID de la cita finalizada
        appointment_id = request.data.get('appointment_id')
        if appointment_id is None:
            return Response(
                {'detail': 'Se debe proporcionar el id de la cita'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verficar que la cita finalizada existe
        try:
            appointment = Appointment.objects.get(id=appointment_id, status='finished')
        except Appointment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la cita finalizada'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener el paciente asociado a la cita
        patient = appointment.patient
        if not patient:
            return Response(
                {'detail': 'No se ha encontrado el paciente asociado a la cita'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        data = request.data.copy()
        data['physiotherapist'] = physiotherapist.id
        data['patient'] = patient.id

        serializer = TreatmentSerializer(data=data)
        if serializer.is_valid():
            treatment = serializer.save(physiotherapist=physiotherapist, patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhysiotherapistTreatmentListView(APIView):
    """
    Vista para listar los tratamientos que un fisioterapeuta tiene creados.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request):
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para ver los tratamientos'}, 
                status=status.HTTP_403_FORBIDDEN
                )
                        
        # Obtener el parámetro de filtro, si existe
        is_active_param = request.query_params.get('is_active', None)                        
        # Filtrar tratamientos por fisioterapeuta
        treatments = Treatment.objects.filter(physiotherapist=physiotherapist)
                        
        # Aplicar filtro de activo/inactivo si se ha proporcionado
        if is_active_param is not None:
            if is_active_param.lower() in ['true', 'false']:
                is_active_value = is_active_param.lower() == 'true'
                treatments = treatments.filter(is_active=is_active_value)
            else:
                return Response(
                    {'detail': 'El parámetro is_active debe ser "true" o "false"'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                        
        serializer = TreatmentDetailSerializer(treatments, many=True)
        return Response(serializer.data)

class PatientTreatmentListView(APIView):
    """
    Vista para listar los tratamientos asignados a un paciente.
    """
    permission_classes = [IsPatient]

    def get(self, request):
        # Verificar si el usuario autenticado es un paciente
        patient = request.user.patient
        if patient is None:
            return Response(
                {'detail': 'Debe ser paciente para ver los tratamientos asignados'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener el parámetro de filtro `is_active`, si existe
        is_active_param = request.query_params.get('is_active', None)
        
        # Filtrar tratamientos por paciente
        treatments = Treatment.objects.filter(patient=patient)
        
        # Aplicar filtro de activo/inactivo si se ha proporcionado
        if is_active_param is not None:
            if is_active_param.lower() in ['true', 'false']:
                is_active_value = is_active_param.lower() == 'true'
                treatments = treatments.filter(is_active=is_active_value)
            else:
                return Response(
                    {'detail': 'El parámetro "is_active" debe ser "true" o "false".'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Serializar y devolver los tratamientos
        serializer = TreatmentSerializer(treatments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TreatmentDetailView(APIView):
    """
    Vista para ver los detalles de un tratamiento (paciente y fisioterapeuta), editarlos o eliminarlos (solo el fisioterapeuta).
    """
    permission_classes = [IsPhysioOrPatient]
    
    # Fisioterapeutas y pacientes pueden ver los detalles de un tratamiento
    def get(self, request, pk):
        try:
            treatment = Treatment.objects.get(pk=pk)
            
            # Verificamos que el usuario sea el fisioterapeuta o el paciente asociado
            if treatment.physiotherapist.user != request.user and treatment.patient.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para ver este tratamiento'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = TreatmentDetailSerializer(treatment)
            return Response(serializer.data)
            
        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    # Solo los fisioterapeutas pueden editar los tratamientos
    def put(self, request, pk):
        try:
            treatment = Treatment.objects.get(pk=pk)

            # Verificar que el usuario sea el fisioterapeuta
            if treatment.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta puede editar este tratamiento'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Permitir al fisioterapeuta actualizar todos los campos, incluido `is_active`
            data = request.data.copy()
            serializer = TreatmentSerializer(treatment, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    # Solo los fisioterapeutas pueden eliminar los tratamientos
    def delete(self, request, pk):
        try:
            treatment = Treatment.objects.get(pk=pk)
            
            # Solo el fisioterapeuta puede eliminar el tratamiento
            if treatment.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta puede eliminar este tratamiento'},
                    status=status.HTTP_403_FORBIDDEN
                )

            treatment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'},
                status=status.HTTP_404_NOT_FOUND
            )
            
class SessionCreateView(APIView):
    """
    Vista para que un fisioterapeuta pueda crear distintas sesiones de entrenamiento dentro de un tratamiento.
    Cada sesión tendrá unos días de la semana asignados.
    """
    permission_classes = [IsPhysiotherapist]
    
    def post(self, request, treatment_id):
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para crear sesiones'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        # Verificar que el tratamiento existe y pertenece al fisioterapeuta
        try:
            treatment = Treatment.objects.get(id=treatment_id)
            if treatment.physiotherapist != physiotherapist:
                return Response(
                    {'detail': 'No tiene permiso para crear sesiones en este tratamiento'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            if not treatment.is_active:
                return Response(
                    {'detail': 'No se pueden crear sesiones en un tratamiento inactivo'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        data = request.data.copy() 
        data['treatment'] = treatment.id
        serializer = SessionSerializer(data=data)
        if serializer.is_valid():
            session = serializer.save(treatment=treatment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SessionListView(APIView):
    """
    Vista para listar todas las sesiones de un tratamiento.
    Tanto el fisioterapeuta como el paciente asociado al tratamiento pueden acceder.
    """
    permission_classes = [IsPhysioOrPatient]

    def get(self, request, treatment_id):
        try:
            # Verificar que el tratamiento existe
            treatment = Treatment.objects.get(id=treatment_id)

            # Verificar que el usuario sea el fisioterapeuta o el paciente asociado
            user = request.user
            if treatment.physiotherapist.user != user and treatment.patient.user != user:
                return Response(
                    {'detail': 'No tiene permiso para ver las sesiones de este tratamiento'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Listar las sesiones del tratamiento
            sessions = treatment.sessions.all()
            serializer = SessionSerializer(sessions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'Tratamiento no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error("Unexpected error occurred", exc_info=True)
            return Response(
                {'detail': 'An unexpected error has occurred. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )           

class SessionDetailView(APIView):
    """
    Vista para ver, editar y eliminar una sesión.
    Los fisioterapeutas pueden editar y eliminar sesiones.
    Tanto el fisioterapeuta como el paciente pueden ver los detalles de una sesión.
    """
    permission_classes = [IsPhysioOrPatient]

    def get(self, request, session_id):
        """
        Ver los detalles de una sesión.
        """
        try:
            session = Session.objects.get(pk=session_id)
            treatment = session.treatment

            # Verificar que el usuario sea el fisioterapeuta o el paciente asociado
            user = request.user
            if treatment.physiotherapist.user != user and treatment.patient.user != user:
                return Response(
                    {'detail': 'No tiene permiso para ver esta sesión'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = SessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Session.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, session_id):
        """
        Editar una sesión (solo fisioterapeutas).
        """
        try:
            session = Session.objects.get(pk=session_id)
            treatment = session.treatment

            # Verificar que el usuario sea el fisioterapeuta
            if treatment.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta puede editar esta sesión'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Permitir al fisioterapeuta actualizar los campos de la sesión
            data = request.data.copy()
            serializer = SessionSerializer(session, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Session.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, session_id):
        """
        Eliminar una sesión (solo fisioterapeutas).
        """
        try:
            session = Session.objects.get(pk=session_id)
            treatment = session.treatment

            # Verificar que el usuario sea el fisioterapeuta
            if treatment.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta puede eliminar esta sesión'},
                    status=status.HTTP_403_FORBIDDEN
                )

            session.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Session.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )

class SessionTestCreateOrUpdateView(APIView):
    """
    Vista para que un fisioterapeuta pueda crear o actualizar tests en una sesión.
    """
    permission_classes = [IsPhysiotherapist]
    
    def post(self, request, session_id):
        pyshiotherapist = request.user.physio
        try:
            session = Session.objects.get(id=session_id)
            if session.treatment.physiotherapist != pyshiotherapist:
                return Response(
                    {'detail': 'No tiene permiso para crear tests en esta sesión'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Session.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        data = request.data.copy()
        data['session'] = session.id
        
        try:
            instance = session.test
            serializer = SessionTestSerializer(instance, data=data, partial=True)
        except SessionTest.DoesNotExist:
            serializer = SessionTestSerializer(data=data)
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SessionTestRetrieveView(APIView):
    """
    Vista para que un fisioterapeuta o un paciente puedan ver los tests de una sesión.
    """
    permission_classes = [IsPhysioOrPatient]

    def get(self, request, session_id):
        try:
            session = Session.objects.get(id=session_id)
            test = session.test
        except (Session.DoesNotExist, SessionTest.DoesNotExist):
            return Response({'detail': 'Test no encontrado'}, status=404)

        # Validar acceso del usuario
        user = request.user
        if session.treatment.physiotherapist.user != user and session.treatment.patient.user != user:
            return Response({'detail': 'No tiene permiso'}, status=403)

        serializer = SessionTestSerializer(test)
        return Response(serializer.data, status=200)


class SessionTestDeleteView(APIView):
    """
    Vista para que un fisioterapeuta pueda eliminar un test de una sesión.
    """
    permission_classes = [IsPhysiotherapist]

    def delete(self, request, session_id):
        physiotherapist = request.user.physio
        try:
            session = Session.objects.get(id=session_id)
            if session.treatment.physiotherapist != physiotherapist:
                return Response({'detail': 'No tiene permiso'}, status=403)

            test = session.test
            test.delete()
            return Response({'detail': 'Test eliminado'}, status=204)

        except (Session.DoesNotExist, SessionTest.DoesNotExist):
            return Response({'detail': 'Test no encontrado'}, status=404)
            
    
class SessionTestResponseView(APIView):
    """
    Vista para que un paciente pueda responder a un test de una sesión.
    """
    permission_classes = [IsPatient]
    
    def post(self, request, session_id):
        patient = request.user.patient
        try:
            session = Session.objects.get(id=session_id)
            if session.treatment.patient != patient:
                return Response(
                    {'detail': 'No tiene permiso para responder a este test'},
                    status=status.HTTP_403_FORBIDDEN
                )
            test = session.test
        except (SessionTest.DoesNotExist, Session.DoesNotExist):
            return Response(
                {'detail': 'No se ha encontrado el test'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = request.data.copy()
        data['test'] = test.id
        data['patient'] = patient.id
        
        serializer = SessionTestResponseSerializer(data=data)
        if serializer.is_valid():
            serializer.save(patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SessionTestResponseListView(APIView):
    """
    Vista para que un fisioterapeuta o un paciente puedan ver las respuestas a un test de una sesión.
    """
    permission_classes = [IsPhysioOrPatient]
    
    def get(self, request, session_id):
        try:
            session = Session.objects.get(id=session_id)
            test = session.test
        except (Session.DoesNotExist, SessionTest.DoesNotExist):
            return Response(
                {'detail': 'No se ha encontrado el test'},
                status=status.HTTP_404_NOT_FOUND
            )
        user = request.user
        if session.treatment.physiotherapist.user != user and session.treatment.patient.user != user:
            return Response(
                {'detail': 'No tiene permiso para ver las respuestas a este test'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        responses = test.responses.all()
        serializer = SessionTestResponseSerializer(responses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ExerciseCreateView(APIView):
    """
    Vista para que un fisioterapeuta pueda crear ejercicios en su biblioteca personal.
    """
    permission_classes = [IsPhysiotherapist]

    def post(self, request):
        # Verificar si el usuario autenticado es un fisioterapeuta
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para crear ejercicios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Preparar los datos para asociar el ejercicio al fisioterapeuta
        data = request.data.copy()
        data['physiotherapist'] = physiotherapist.id

        # Validar y guardar el ejercicio
        serializer = ExerciseSerializer(data=data)
        if serializer.is_valid():
            exercise = serializer.save(physiotherapist=physiotherapist)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Manejar errores de validación
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ExerciseListView(APIView):
    """
    Vista para listar todos los ejercicios creados por un fisioterapeuta en su biblioteca personal.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request):
        # Verificar si el usuario autenticado es un fisioterapeuta
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para ver su biblioteca de ejercicios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener todos los ejercicios creados por el fisioterapeuta
        exercises = Exercise.objects.filter(physiotherapist=physiotherapist)

        # Serializar y devolver los ejercicios
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ExerciseDetailView(APIView):
    """
    Vista para ver, editar y eliminar un ejercicio.
    Solo el fisioterapeuta que creó el ejercicio tiene permiso para realizar estas acciones.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request, pk):
        """
        Ver los detalles de un ejercicio.
        """
        try:
            exercise = Exercise.objects.get(pk=pk)

            # Verificar que el usuario sea el fisioterapeuta que creó el ejercicio
            if exercise.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para ver este ejercicio'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = ExerciseSerializer(exercise)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exercise.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el ejercicio'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        """
        Editar un ejercicio (solo fisioterapeutas).
        """
        try:
            exercise = Exercise.objects.get(pk=pk)

            # Verificar que el usuario sea el fisioterapeuta que creó el ejercicio
            if exercise.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta que creó el ejercicio puede editarlo'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Permitir al fisioterapeuta actualizar los campos del ejercicio
            data = request.data.copy()
            serializer = ExerciseSerializer(exercise, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exercise.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el ejercicio'},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        """
        Eliminar un ejercicio (solo fisioterapeutas).
        """
        try:
            exercise = Exercise.objects.get(pk=pk)

            # Verificar que el usuario sea el fisioterapeuta que creó el ejercicio
            if exercise.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta que creó el ejercicio puede eliminarlo'},
                    status=status.HTTP_403_FORBIDDEN
                )

            exercise.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exercise.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el ejercicio'},
                status=status.HTTP_404_NOT_FOUND
            )
            
class ExerciseSearchView(APIView):
    """
    Vista para buscar ejercicios en la biblioteca personal de un fisioterapeuta por parte del título.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request):
        # Verificar si el usuario autenticado es un fisioterapeuta
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para buscar ejercicios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener el parámetro de búsqueda
        query = request.query_params.get('query', '').strip()
        if not query:
            return Response(
                {'detail': 'Debe proporcionar un término de búsqueda en el parámetro "query"'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Filtrar ejercicios por título que contengan el término de búsqueda
        exercises = Exercise.objects.filter(
            physiotherapist=physiotherapist,
            title__icontains=query
        )

        # Serializar y devolver los resultados
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

from collections import defaultdict

class ExerciseByAreaView(APIView):
    """
    Vista para listar los ejercicios de un fisioterapeuta organizados por etiquetas de área.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request):
        # Verificar si el usuario autenticado es un fisioterapeuta
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para ver los ejercicios organizados por área'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener todos los ejercicios del fisioterapeuta
        exercises = Exercise.objects.filter(physiotherapist=physiotherapist)

        # Organizar los ejercicios por área
        exercises_by_area = defaultdict(list)
        for exercise in exercises:
            exercises_by_area[exercise.area].append({
                'id': exercise.id,
                'title': exercise.title,
                'description': exercise.description,
            })

        # Formatear la respuesta
        response_data = [
            {
                'area': area,
                'exercises': exercises
            }
            for area, exercises in exercises_by_area.items()
        ]

        return Response(response_data, status=status.HTTP_200_OK)
    
class AssignExerciseToSessionView(APIView):
    """
    Vista para que un fisioterapeuta pueda asignar ejercicios a una sesión de un tratamiento.
    """
    permission_classes = [IsPhysiotherapist]

    def post(self, request, session_id):
        # Verificar si el usuario autenticado es un fisioterapeuta
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para asignar ejercicios a sesiones'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verificar que la sesión existe y pertenece al tratamiento del fisioterapeuta
        try:
            session = Session.objects.get(id=session_id)
            if session.treatment.physiotherapist != physiotherapist:
                return Response(
                    {'detail': 'No tiene permiso para asignar ejercicios a esta sesión'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Session.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Verificar que el ejercicio existe y pertenece al fisioterapeuta
        exercise_id = request.data.get('exercise')
        if not exercise_id:
            return Response(
                {'detail': 'Debe proporcionar el ID del ejercicio a asignar'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            exercise = Exercise.objects.get(id=exercise_id, physiotherapist=physiotherapist)
        except Exercise.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el ejercicio o no tiene permiso para asignarlo'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Crear la relación entre el ejercicio y la sesión
        data = {
            'exercise': exercise.id,
            'session': session.id
        }
        serializer = ExerciseSessionSerializer(data=data)
        if serializer.is_valid():
            exercise_session = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Manejar errores de validación
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UnassignExerciseFromSessionView(APIView):
    """
    Vista para que un fisioterapeuta pueda deshacer la asignación de un ejercicio a una sesión.
    """
    permission_classes = [IsPhysiotherapist]

    def delete(self, request, exercise_session_id):
        # Verificar si el usuario autenticado es un fisioterapeuta
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para deshacer la asignación de ejercicios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verificar que la relación entre el ejercicio y la sesión existe
        try:
            exercise_session = ExerciseSession.objects.get(id=exercise_session_id)
            session = exercise_session.session
            treatment = session.treatment

            # Verificar que el tratamiento pertenece al fisioterapeuta
            if treatment.physiotherapist != physiotherapist:
                return Response(
                    {'detail': 'No tiene permiso para deshacer la asignación de este ejercicio'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Eliminar la relación entre el ejercicio y la sesión
            exercise_session.delete()
            return Response(
                {'detail': 'La asignación del ejercicio a la sesión ha sido eliminada'},
                status=status.HTTP_204_NO_CONTENT
            )

        except ExerciseSession.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la asignación del ejercicio a la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )

class SeriesCreateView(APIView):
    """
    Vista para que un fisioterapeuta predefina la cantidad de series dentro de un ejercicio en una sesión.
    """
    permission_classes = [IsPhysiotherapist]

    MAX_SERIES_PER_EXERCISE = 10  # Establece el límite de series permitidas

    def post(self, request, exercise_session_id):
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para crear series'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            exercise_session = ExerciseSession.objects.get(id=exercise_session_id)
            session = exercise_session.session
            treatment = session.treatment

            if treatment.physiotherapist != physiotherapist:
                return Response(
                    {'detail': 'No tiene permiso para crear series en este ejercicio'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Verificar cuántas series ya existen para este ejercicio en la sesión
            series_count = Series.objects.filter(exercise_session=exercise_session).count()
            if series_count >= self.MAX_SERIES_PER_EXERCISE:
                return Response(
                    {'detail': f'No se pueden asignar más de {self.MAX_SERIES_PER_EXERCISE} series a un ejercicio en una sesión'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except ExerciseSession.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la relación entre el ejercicio y la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )

        data = request.data.copy()
        data['exercise_session'] = exercise_session.id

        serializer = SeriesSerializer(data=data)
        if serializer.is_valid():
            series = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

class SeriesDetailView(APIView):
    """
    Vista para ver, editar y eliminar una serie.
    Solo el fisioterapeuta que creó el tratamiento tiene permiso para realizar estas acciones.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request, pk):
        """
        Ver los detalles de una serie.
        """
        try:
            series = Series.objects.get(pk=pk)
            exercise_session = series.exercise_session
            session = exercise_session.session
            treatment = session.treatment

            # Verificar que el tratamiento pertenece al fisioterapeuta
            if treatment.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para ver esta serie'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = SeriesSerializer(series)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Series.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la serie'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        """
        Editar una serie (solo fisioterapeutas).
        """
        try:
            series = Series.objects.get(pk=pk)
            exercise_session = series.exercise_session
            session = exercise_session.session
            treatment = session.treatment

            # Verificar que el tratamiento pertenece al fisioterapeuta
            if treatment.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para editar esta serie'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Permitir al fisioterapeuta actualizar los campos de la serie
            data = request.data.copy()
            serializer = SeriesSerializer(series, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Series.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la serie'},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        """
        Eliminar una serie (solo fisioterapeutas).
        """
        try:
            series = Series.objects.get(pk=pk)
            exercise_session = series.exercise_session
            session = exercise_session.session
            treatment = session.treatment

            # Verificar que el tratamiento pertenece al fisioterapeuta
            if treatment.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para eliminar esta serie'},
                    status=status.HTTP_403_FORBIDDEN
                )

            series.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Series.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la serie'},
                status=status.HTTP_404_NOT_FOUND
            )

class SeriesDeleteView(APIView):
    """
    Vista para eliminar una serie específica de un ejercicio en una sesión.
    """
    permission_classes = [IsPhysiotherapist]

    def delete(self, request, pk):
        try:
            # Verificar que la serie existe
            series = Series.objects.get(id=pk)
            
            # Guardar el ID de la sesión de ejercicio para reordenar las series después
            exercise_session_id = series.exercise_session.id
            
            # Eliminar la serie
            series.delete()
            
            # Reordenar las series restantes
            remaining_series = Series.objects.filter(exercise_session_id=exercise_session_id).order_by('series_number')
            
            # Actualizar los números de serie
            for index, serie in enumerate(remaining_series, 1):
                serie.series_number = index
                serie.save()
            
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Series.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la serie'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class SeriesListByExerciseSessionView(APIView):
    """
    Vista para listar las series de un ejercicio en una sesión específica.
    """
    permission_classes = [IsPhysioOrPatient]

    def get(self, request, exercise_session_id):
        try:
            # Verificar que la sesión de ejercicio existe
            exercise_session = ExerciseSession.objects.get(id=exercise_session_id)
            
            # Obtener todas las series asociadas a esta sesión de ejercicio
            series = Series.objects.filter(exercise_session=exercise_session).order_by('series_number')
            
            serializer = SeriesSerializer(series, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ExerciseSession.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión de ejercicio'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class ExerciseListBySessionView(APIView):
    """
    Vista para listar los ejercicios asignados a una sesión.
    Tanto el fisioterapeuta como el paciente asociado al tratamiento pueden acceder.
    """
    permission_classes = [IsPhysioOrPatient]

    def get(self, request, session_id):
        try:
            # Verificar que la sesión existe
            session = Session.objects.select_related('treatment').get(id=session_id)
            treatment = session.treatment
            user = request.user

            # Verificar que el usuario sea el fisioterapeuta o el paciente asociado
            if treatment.physiotherapist.user != user and treatment.patient.user != user:
                return Response(
                    {'detail': 'No tiene permiso para ver los ejercicios de esta sesión'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Obtener los ejercicios asignados a la sesión
            exercise_sessions = ExerciseSession.objects.filter(session=session).select_related('exercise')
            serializer = ExerciseSessionSerializer(exercise_sessions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Session.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logging.error(f'Unexpected error: {str(e)}')
            return Response(
                 {'detail': 'An internal error has occurred.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class ExerciseLogCreateView(APIView):
    """
    Vista para que un paciente registre su progreso en una serie.
    """
    permission_classes = [IsPatient]

    def post(self, request):
        # Verificar si el usuario autenticado es un paciente
        patient = request.user.patient
        if patient is None:
            return Response(
                {'detail': 'Debe ser paciente para registrar progreso en ejercicios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verificar que la serie existe y pertenece al tratamiento del paciente
        data = request.data.copy()
        try:
            series = Series.objects.get(id=data.get('series'))
            if series.exercise_session.session.treatment.patient != patient:
                return Response(
                    {'detail': 'No tiene permiso para registrar progreso en esta serie'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Series.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la serie'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validar y guardar el registro
        serializer = ExerciseLogSerializer(data=data)
        if serializer.is_valid():
            exercise_log = serializer.save(patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ExerciseLogListView(APIView):
    """
    Vista para listar los registros de progreso de una sesión de ejercicios.
    Tanto el fisioterapeuta como el paciente asociado pueden acceder.
    """
    permission_classes = [IsPhysioOrPatient]

    def get(self, request, exercise_session_id):
        try:
            # Verificar que la sesión de ejercicios existe
            exercise_session = ExerciseSession.objects.get(id=exercise_session_id)
            treatment = exercise_session.session.treatment
            user = request.user

            # Verificar que el usuario sea el fisioterapeuta o el paciente asociado
            if treatment.physiotherapist.user != user and treatment.patient.user != user:
                return Response(
                    {'detail': 'No tiene permiso para ver los registros de este ejercicio'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Obtener los registros de progreso
            exercise_logs = exercise_session.exercise_logs.all()
            serializer = ExerciseLogSerializer(exercise_logs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ExerciseSession.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión de ejercicios'},
                status=status.HTTP_404_NOT_FOUND
            )
            
class ExerciseLogDetailView(APIView):
    """
    Vista para ver, editar y eliminar un registro de progreso.
    Solo el paciente que creó el registro puede realizar estas acciones.
    """
    permission_classes = [IsPatient]

    def get(self, request, pk):
        """
        Ver los detalles de un registro de progreso.
        """
        try:
            exercise_log = ExerciseLog.objects.get(pk=pk)

            # Verificar que el registro pertenece al paciente autenticado
            if exercise_log.patient.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para ver este registro'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = ExerciseLogSerializer(exercise_log)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ExerciseLog.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el registro'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        """
        Editar un registro de progreso (solo pacientes).
        """
        try:
            exercise_log = ExerciseLog.objects.get(pk=pk)

            # Verificar que el registro pertenece al paciente autenticado
            if exercise_log.patient.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para editar este registro'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Validar y actualizar el registro
            data = request.data.copy()
            serializer = ExerciseLogSerializer(exercise_log, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ExerciseLog.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el registro'},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        """
        Eliminar un registro de progreso (solo pacientes).
        """
        try:
            exercise_log = ExerciseLog.objects.get(pk=pk)

            # Verificar que el registro pertenece al paciente autenticado
            if exercise_log.patient.user != request.user:
                return Response(
                    {'detail': 'No tiene permiso para eliminar este registro'},
                    status=status.HTTP_403_FORBIDDEN
                )

            exercise_log.delete()
            return Response(
                {'detail': 'El registro ha sido eliminado'},
                status=status.HTTP_204_NO_CONTENT
            )

        except ExerciseLog.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el registro'},
                status=status.HTTP_404_NOT_FOUND
            )
