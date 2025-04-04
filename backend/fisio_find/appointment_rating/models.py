from django.db import models

from appointment.models import Appointment
from users.models import Patient, Physiotherapist

# Modelo para valoraciones y comentarios
class AppointmentRating(models.Model):
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='appointment_rating')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, unique=True)
    score = models.DecimalField(max_digits=3, decimal_places=1)  # Permite valores como 4.5, 3.0, etc.
    comment = models.TextField(blank=True, null=True)  # Comentario opcional
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('physiotherapist', 'patient')  # Una única valoración por usuario para cada fisioterapeuta

    def __str__(self):
        return f'Rating de {self.patient} para {self.physiotherapist}: {self.score}'
