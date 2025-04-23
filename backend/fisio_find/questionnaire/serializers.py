from rest_framework import serializers
from .models import Questionnaire
from users.models import Patient, Physiotherapist
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
