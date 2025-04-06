from django.db import models
from django.core.exceptions import ValidationError
from users.models import Patient, Physiotherapist
import json
    
class Questionnaire(models.Model):
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='questionnaires')
    title = models.CharField(max_length=255)
    json_schema = models.JSONField()
    ui_schema = models.JSONField()
    questions = models.JSONField()

    def __str__(self):
        return self.title

    def clean(self):
        # Validar que el json_schema y ui_schema estén correctamente formateados
        try:
            json.dumps(self.json_schema)
            json.dumps(self.ui_schema)
        except ValueError as e:
            raise ValidationError(f"Error al procesar los esquemas JSON: {e}")

