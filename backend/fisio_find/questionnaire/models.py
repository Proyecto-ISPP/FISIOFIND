from django.db import models
from django.core.exceptions import ValidationError
from users.models import Patient, Physiotherapist
import json

class ResponseQuestionnaire(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='response_questionnaire')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("La fecha de fin debe ser posterior a la fecha de inicio.")

    def __str__(self):
        return f"Cuestionario para {self.patient.user.username}"
    
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

class Question(models.Model):
    QUESTION_TYPES = [
        ('text', 'Texto'),
        ('number', 'Número'),
        ('choice', 'Opción múltiple'),
    ]
    #physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='treatments')
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, related_name='questions_set')
    text = models.CharField(max_length=255)
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES, default='text')
    choices = models.JSONField(null=True, blank=True)  # Solo para las preguntas de tipo 'choice'
    
    def __str__(self):
        return self.text

class PatientResponse(models.Model):
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    responses = models.JSONField()

    def __str__(self):
        return f"Response from {self.patient} to {self.questionnaire}"
