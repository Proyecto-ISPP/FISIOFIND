from rest_framework import serializers
from .models import Questionnaire, ResponseQuestionnaire, Question, PatientResponse
from users.models import Patient, Physiotherapist
import json

class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'physiotherapist', 'title', 'json_schema', 'ui_schema', 'questions']
        read_only_fields = ['id', 'physiotherapist']

    def validate(self, data):
        # Validar los esquemas JSON
        if 'title' in data and len(data['title']) > 255:
            raise serializers.ValidationError({"title": "El título no puede exceder los 255 caracteres."})

        try:
            json.dumps(data['json_schema'])
            json.dumps(data['ui_schema'])
        except ValueError as e:
            raise serializers.ValidationError(f"Error al procesar los esquemas JSON: {e}")
        return data

class QuestionnaireDetailsView(serializers.ModelSerializer):
    physiotherapist = serializers.PrimaryKeyRelatedField(queryset=Physiotherapist.objects.all())

    class Meta:
        model = Questionnaire
        fields = ['id', 'physiotherapist', 'title', 'json_schema', 'ui_schema', 'questions']
        read_only_fields = ['id', 'physiotherapist']



class ResponseQuestionnaireSerializer(serializers.ModelSerializer):
    physiotherapist = serializers.PrimaryKeyRelatedField(queryset=Physiotherapist.objects.all())
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    
    class Meta:
        model = ResponseQuestionnaire
        fields = ['id', 'physiotherapist', 'patient', 'start_time', 'end_time', 'is_active']
        read_only_fields = ['id']

    def validate(self, data):
        # Validar que la fecha de fin sea posterior a la fecha de inicio
        if data['end_time'] <= data['start_time']:
            raise serializers.ValidationError(
                {"end_time": "La fecha de finalización debe ser posterior a la fecha de inicio."}
            )
        return data

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question  # Asegúrate de tener este modelo definido en tu archivo models.py
        fields = ['id', 'question_text', 'question_type', 'options']
        read_only_fields = ['id']

    def validate(self, data):
        # Validar que el texto de la pregunta no esté vacío
        if 'question_text' in data and len(data['question_text']) == 0:
            raise serializers.ValidationError({"question_text": "El texto de la pregunta no puede estar vacío."})
        
        # Si hay opciones, asegurarse de que sean válidas
        if 'options' in data and len(data['options']) < 2:
            raise serializers.ValidationError({"options": "Debe haber al menos dos opciones."})
        
        return data

class PatientResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientResponse  # Asegúrate de tener este modelo definido en tu archivo models.py
        fields = ['id', 'questionnaire', 'patient', 'response_data']
        read_only_fields = ['id']

    def validate(self, data):
        # Validar que la respuesta no esté vacía
        if 'response_data' in data and len(data['response_data']) == 0:
            raise serializers.ValidationError({"response_data": "Las respuestas no pueden estar vacías."})
        return data
