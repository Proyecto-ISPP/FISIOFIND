from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Questionnaire, QuestionnaireResponses
from videocall.models import Room
from .serializers import QuestionnaireSerializer, QuestionnaireDetailsView, QuestionnaireResponseSerializer
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
    
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])  # Verificamos que el usuario esté autenticado y sea paciente
def create_questionnaire_response(request, questionnaire_id):
    """
    Endpoint para almacenar las respuestas de un paciente a un cuestionario específico.
    """
    # Obtener el paciente desde el token (usando request.user.patient.id)
    patient = request.user.patient

    data = request.data.copy()
    appointment_id = Room.objects.get(code=data["room_code"]).appointment.id  # Obtener el ID de la cita desde el cuestionario
    data['questionnaire'] = questionnaire_id  # Asignar el ID del cuestionario al campo correspondiente
    data['appointment'] = appointment_id  # Asignar el ID de la cita al campo correspondiente
    print(data)
    serializer = QuestionnaireResponseSerializer(data=data)
    if serializer.is_valid():
        questionnaire_response = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])  # Verificamos que el usuario esté autenticado y sea fisioterapeuta
def add_notes2questionnaire_responses(request, questionnaire_id):
    """
    Endpoint para añadir notas a las respuestas de un cuestionario específico por parte de un fisioterapeuta.
    """
    try:
        appointment_id = Room.objects.get(code=request.data["room_code"]).appointment.id  # Obtener el ID de la cita desde el cuestionario
        questionnaire_response = QuestionnaireResponses.objects.get(questionnaire=questionnaire_id, appointment=appointment_id)
        
        # Verificar que el usuario sea el fisioterapeuta dueño
        if questionnaire_response.questionnaire.physiotherapist.user != request.user:
            return Response(
                {'detail': 'Solo el fisioterapeuta propietario del cuestionario puede añadir notas a las respuestas de este cuestionario'},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        
        # Validación de longitud de notas
        if 'notes' in data and len(data['notes']) > 255:
            return Response(
                {'detail': 'Las notas no pueden exceder los 255 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = QuestionnaireResponseSerializer(questionnaire_response, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except QuestionnaireResponses.DoesNotExist:
        return Response(
            {'detail': 'No se ha encontrado la respuesta del cuestionario'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Verificamos que el usuario esté autenticado y sea paciente
def get_questionnaire_response(request, questionnaire_response_id):
    """
    Endpoint para obtener las respuestas de un paciente a un cuestionario específico.
    """
    try:
        questionnaire_response = QuestionnaireResponses.objects.get(id=questionnaire_response_id)
        serializer = QuestionnaireResponseSerializer(questionnaire_response)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except QuestionnaireResponses.DoesNotExist:
        return Response({'detail': 'No se ha encontrado la respuesta del cuestionario'}, status=status.HTTP_404_NOT_FOUND)