from django.db import models

class Survey(models.Model):
    
    nombre_encuesta = models.CharField(max_length=100)
    contenido = models.JSONField(null=True, blank=True)
    respuestas = models.JSONField(null=True, blank=True)