from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Questionnaire
from .serializers import QuestionnaireSerializer, QuestionnaireDetailsView
from users.permissions import IsPhysiotherapist, IsPatient
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

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

            # Verificar que el usuario sea el fisioterapeuta dueño
            if questionnaire.physiotherapist.user != request.user:
                return Response(
                    {'detail': 'Solo el fisioterapeuta puede editar este cuestionario'},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data.copy()
            
            # Validación de longitud del título
            if 'title' in data and len(data['title']) > 76:
                return Response(
                    {'detail': 'El título no puede exceder los 75 caracteres'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validación de longitud de preguntas
            if 'questions' in data:
                for question in data['questions']:
                    if len(str(question['label'])) > 76:
                        return Response(
                            {'detail': 'Cada pregunta no puede exceder los 75 caracteres'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

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
        try:
            questionnaire = Questionnaire.objects.get(id=questionnaire_id)
            question_data = request.data
            
            # Validar que la pregunta no exceda los 255 caracteres
            if len(str(question_data)) > 76:
                return Response(
                    {'detail': 'Cada pregunta no puede exceder los 75 caracteres'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            questions = questionnaire.questions
            questions.append(question_data)
            questionnaire.questions = questions
            questionnaire.save()
            return Response(question_data, status=status.HTTP_201_CREATED)
        except Questionnaire.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el cuestionario'},
                status=status.HTTP_404_NOT_FOUND
            )
        
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])  # Verificamos que el usuario esté autenticado y sea paciente
def store_responses(request, questionnaire_id):
    # Obtener el paciente desde el token (usando request.user.patient.id)
    patient_id = request.user.patient.id  # Extraemos el ID del paciente desde el token

    # Obtener los datos enviados desde el frontend
    responses = request.data.get('responses')

    print("HOLA ESTOY AQUÍ")

    if not responses:
        return Response({'detail': 'Faltan respuestas'}, status=400)

    try:
        # Obtener el cuestionario
        questionnaire = Questionnaire.objects.get(id=questionnaire_id)

        # Almacenar las respuestas combinadas en el campo 'responses' del cuestionario
        questionnaire.store_responses(patient_id, responses)

        return Response({'detail': 'Respuestas guardadas correctamente'}, status=200)
    except Questionnaire.DoesNotExist:
        return Response({'detail': 'Cuestionario no encontrado'}, status=404)