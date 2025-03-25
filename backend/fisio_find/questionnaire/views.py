from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Questionnaire, Question, PatientResponse
from .serializers import QuestionnaireSerializer, QuestionnaireDetailsView, PatientResponseSerializer
from users.permissions import IsPhysiotherapist, IsPatient
from rest_framework.permissions import IsAuthenticated

class QuestionnaireListView(APIView):
    """
    Vista para listar todos los cuestionarios creados por un fisioterapeuta.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request):
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para ver los cuestionarios'}, 
                status=status.HTTP_403_FORBIDDEN
                )
        questionnaire = Questionnaire.objects.filter(physiotherapist=physiotherapist)                       
        serializer = QuestionnaireDetailsView(questionnaire, many=True)
        return Response(serializer.data)



class QuestionnaireCreateView(APIView):
    """
    Vista para crear un nuevo cuestionario.
    """
    permission_classes = [IsPhysiotherapist]

    def post(self, request):
        physiotherapist = request.user.physio
        if physiotherapist is None:
            return Response(
                {'detail': 'Debe ser fisioterapeuta para crear tratamientos'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        data = request.data.copy()
        data['physiotherapist'] = physiotherapist.id

        serializer = QuestionnaireSerializer(data=data)
        if serializer.is_valid():
            questionnaire = serializer.save(physiotherapist=physiotherapist)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class QuestionnaireDetailView(APIView):
    """
    Vista para ver, editar o eliminar un cuestionario.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request, pk):
        try:
            questionnaire = Questionnaire.objects.get(pk=pk)
            serializer = QuestionnaireSerializer(questionnaire)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Questionnaire.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el cuestionario'},
                status=status.HTTP_404_NOT_FOUND
            )


    def put(self, request, pk):
        try:
            questionnaire = Questionnaire.objects.get(pk=pk)

            # Verificar que el usuario sea el fisioterapeuta
            if questionnaire.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta puede editar este cuestionario'},
                    status=status.HTTP_403_FORBIDDEN
                )
            data = request.data.copy()
            serializer = QuestionnaireSerializer(questionnaire, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Questionnaire.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el cuestionario'},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        try:
            questionnaire = Questionnaire.objects.get(pk=pk)
            
            # Solo el fisioterapeuta puede eliminar el tratamiento
            if questionnaire.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta puede eliminar este cuestionario'},
                    status=status.HTTP_403_FORBIDDEN
                )

            questionnaire.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Questionnaire.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el cuestionario'},
                status=status.HTTP_404_NOT_FOUND
            )

class QuestionCreateView(APIView):
    """
    Vista para crear una nueva pregunta en un cuestionario.
    """
    permission_classes = [IsPhysiotherapist]

    def post(self, request, questionnaire_id):
        # Validar y crear una nueva pregunta en el campo JSON del cuestionario
        try:
            questionnaire = Questionnaire.objects.get(id=questionnaire_id)
            question_data = request.data  # Esperamos que las preguntas lleguen como JSON
            questions = questionnaire.questions
            questions.append(question_data)  # Agregamos la nueva pregunta al campo JSON
            questionnaire.questions = questions  # Actualizamos el campo questions
            questionnaire.save()
            return Response(question_data, status=status.HTTP_201_CREATED)
        except Questionnaire.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el cuestionario'},
                status=status.HTTP_404_NOT_FOUND
            )

class QuestionListView(APIView):
    """
    Vista para listar todas las preguntas de un cuestionario.
    """
    permission_classes = [IsPhysiotherapist]

    def get(self, request, questionnaire_id):
        try:
            questionnaire = Questionnaire.objects.get(id=questionnaire_id)
            questions = questionnaire.questions  # Accedemos directamente al campo questions
            return Response(questions, status=status.HTTP_200_OK)
        except Questionnaire.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el cuestionario'},
                status=status.HTTP_404_NOT_FOUND
            )

class PatientResponseCreateView(APIView):
    """
    Vista para que un paciente registre sus respuestas a un cuestionario.
    """
    permission_classes = [IsPatient]

    def post(self, request, questionnaire_id):
        try:
            questionnaire = Questionnaire.objects.get(id=questionnaire_id)
            # Verificar que el paciente esté asociado al tratamiento
            if questionnaire.patient != request.user.patient:
                return Response(
                    {'detail': 'No tiene permiso para responder este cuestionario'},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data.copy()
            data['patient'] = request.user.patient.id
            data['questionnaire'] = questionnaire.id
            serializer = PatientResponseSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Questionnaire.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el cuestionario'},
                status=status.HTTP_404_NOT_FOUND
            )


class PatientResponseListView(APIView):
    """
    Vista para listar las respuestas de un paciente a sus cuestionarios.
    """
    permission_classes = [IsPatient]

    def get(self, request):
        try:
            # Obtener las respuestas del paciente autenticado
            responses = PatientResponse.objects.filter(patient=request.user.patient)
            serializer = PatientResponseSerializer(responses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'detail': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PatientResponseDetailView(APIView):
    """
    Vista para ver, editar o eliminar las respuestas de un paciente a un cuestionario.
    """
    permission_classes = [IsPatient]

    def get(self, request, pk):
        try:
            response = PatientResponse.objects.get(pk=pk)
            if response.patient != request.user.patient:
                return Response(
                    {'detail': 'No tiene permiso para ver esta respuesta'},
                    status=status.HTTP_403_FORBIDDEN
                )
            serializer = PatientResponseSerializer(response)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PatientResponse.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la respuesta'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        try:
            response = PatientResponse.objects.get(pk=pk)
            if response.patient != request.user.patient:
                return Response(
                    {'detail': 'No tiene permiso para editar esta respuesta'},
                    status=status.HTTP_403_FORBIDDEN
                )
            serializer = PatientResponseSerializer(response, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PatientResponse.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la respuesta'},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        try:
            response = PatientResponse.objects.get(pk=pk)
            if response.patient != request.user.patient:
                return Response(
                    {'detail': 'No tiene permiso para eliminar esta respuesta'},
                    status=status.HTTP_403_FORBIDDEN
                )
            response.delete()
            return Response(
                {'detail': 'Respuesta eliminada correctamente'},
                status=status.HTTP_204_NO_CONTENT
            )
        except PatientResponse.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la respuesta'},
                status=status.HTTP_404_NOT_FOUND
            )
