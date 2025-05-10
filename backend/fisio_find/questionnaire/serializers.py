from rest_framework import serializers
from .models import Questionnaire
from users.models import Patient, Physiotherapist
from appointment.models import Appointment
from questionnaire.models import QuestionnaireResponses
import json

class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'physiotherapist', 'title', 'json_schema', 'ui_schema', 'questions']
        read_only_fields = ['id', 'physiotherapist']

    def validate(self, data):
        # Validar el título
        if 'title' in data and len(data['title']) > 76:
            raise serializers.ValidationError({"title": "El título no puede exceder los 75 caracteres."})

        # Validar las preguntas si están presentes
        if 'questions' in data:
            for question in data['questions']:
                label = question.get('label', '')  # Obtiene el texto de la pregunta
                print(f"Pregunta: {label} (Longitud: {len(label)})")  # Depuración

                if len(label) > 76:
                    raise serializers.ValidationError(
                        {"questions": "Cada pregunta no puede exceder los 75 caracteres."}
                    )



        # Validar los esquemas JSON
        try:
            if 'json_schema' in data:
                if isinstance(data['json_schema'], dict):
                    json.dumps(data['json_schema'])  # asegurar que se puede serializar
                else:
                    parsed = json.loads(data['json_schema']) if isinstance(data['json_schema'], str) else json.loads(json.dumps(data['json_schema']))
                    if not isinstance(parsed, dict):
                        raise ValueError("json_schema debe representar un objeto JSON (dict)")
                    data['json_schema'] = parsed

            if 'ui_schema' in data:
                if isinstance(data['ui_schema'], dict):
                    json.dumps(data['ui_schema'])  # asegurar que se puede serializar
                else:
                    parsed = json.loads(data['ui_schema']) if isinstance(data['ui_schema'], str) else json.loads(json.dumps(data['ui_schema']))
                    if not isinstance(parsed, dict):
                        raise ValueError("ui_schema debe representar un objeto JSON (dict)")
                    data['ui_schema'] = parsed
        except (ValueError, TypeError, json.JSONDecodeError) as e:
            # Log the detailed exception message
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error al procesar los esquemas JSON: {e}")
            # Raise a generic ValidationError
            raise serializers.ValidationError("Error al procesar los esquemas JSON.")
        return data

class QuestionnaireDetailsView(serializers.ModelSerializer):
    physiotherapist = serializers.PrimaryKeyRelatedField(queryset=Physiotherapist.objects.all())

    class Meta:
        model = Questionnaire
        fields = ['id', 'physiotherapist', 'title', 'json_schema', 'ui_schema', 'questions','responses']
        read_only_fields = ['id', 'physiotherapist']

class QuestionnaireResponseSerializer(serializers.ModelSerializer):
    questionnaire = serializers.PrimaryKeyRelatedField(queryset=Questionnaire.objects.all())
    appointment = serializers.PrimaryKeyRelatedField(queryset=Appointment.objects.all())

    class Meta:
        model = QuestionnaireResponses
        fields = ['id', 'questionnaire', 'appointment', 'responses', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_responses(self, value):
        """
        Valida que las respuestas sean un diccionario serializable y contengan la estructura adecuada.
        """
        if not isinstance(value, dict):
            raise serializers.ValidationError("Las respuestas deben ser un objeto JSON (diccionario).")

        try:
            json.dumps(value)  # Validar que sea serializable
        except (TypeError, ValueError):
            raise serializers.ValidationError("Las respuestas contienen datos no válidos para JSON.")

        for question_id, answer in value.items():
            if not isinstance(answer, dict) or 'question' not in answer or 'response' not in answer:
                raise serializers.ValidationError(
                    f"Formato inválido para la pregunta '{question_id}'. Se esperaba un diccionario con 'question' y 'response'."
                )

        return value

    def validate(self, data):
        # Validar que no exista ya una respuesta para esa cita y ese cuestionario (si es creación)
        if self.instance is None:
            existing = QuestionnaireResponses.objects.filter(
                questionnaire=data['questionnaire'],
                appointment=data['appointment']
            ).exists()
            if existing:
                raise serializers.ValidationError(
                    "Ya existen respuestas para este cuestionario en la cita indicada."
                )
        return data
