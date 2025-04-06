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
        if 'title' in data and len(data['title']) > 255:
            raise serializers.ValidationError({"title": "El título no puede exceder los 255 caracteres."})

        # Validar las preguntas si están presentes
        if 'questions' in data:
            for question in data['questions']:
                if len(str(question)) > 255:
                    raise serializers.ValidationError(
                        {"questions": "Cada pregunta no puede exceder los 255 caracteres."}
                    )

        # Validar los esquemas JSON
        try:
            if 'json_schema' in data:
                json.dumps(data['json_schema'])
            if 'ui_schema' in data:
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
