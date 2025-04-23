from django.db import models
from django.core.exceptions import ValidationError
from users.models import Patient, Physiotherapist
import json
    
class Questionnaire(models.Model):
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='questionnaires')
    title = models.CharField(max_length=75, verbose_name="Título")
    json_schema = models.JSONField()
    ui_schema = models.JSONField()
    questions = models.JSONField(verbose_name="Preguntas")
    responses = models.JSONField(verbose_name="Respuestas", default=dict, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Cuestionario"
        verbose_name_plural = "Cuestionarios"

    def clean(self):
        # Validar que el json_schema y ui_schema estén correctamente formateados
        try:
            json.dumps(self.json_schema)
            json.dumps(self.ui_schema)
        except ValueError as e:
            raise ValidationError(f"Error al procesar los esquemas JSON: {e}")
        
    def store_responses(self, patient_id, responses):
        """
        Almacenar las respuestas de un paciente combinando las preguntas y respuestas.
        """
        responses_combined = {}

        # Iteramos sobre las respuestas
        for question_id, response_data in responses.items():
            question_text = response_data.get('question')  # Extraemos la pregunta
            response = response_data.get('response')  # Extraemos la respuesta

            # Si la pregunta y la respuesta están presentes, las agregamos al diccionario combinado
            if question_text and response:
                responses_combined[question_id] = {
                    "question": question_text,
                    "response": response
                }

        # Si 'responses' es nulo, inicializamos con un diccionario vacío
        if self.responses is None:
            self.responses = {}

        if str(patient_id) not in self.responses:
            self.responses[str(patient_id)] = {}

        self.responses[str(patient_id)] = {
            #"patient_id": str(patient_id),
            "answers": responses_combined
        }
        self.save()

