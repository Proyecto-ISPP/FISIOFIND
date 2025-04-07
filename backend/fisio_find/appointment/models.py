from django.db import models
from users.models import AppUser, Physiotherapist, Patient

class StatusChoices(models.TextChoices):
    FINISHED = "finished", "Finished"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELED = "canceled", "Canceled"
    BOOKED = "booked", "Booked"
    PENDING = "pending", "Pending"

class Appointment(models.Model):
    id = models.AutoField(primary_key=True) 
    start_time = models.DateTimeField(verbose_name='Inicio')
    end_time = models.DateTimeField(verbose_name='Final')
    is_online = models.BooleanField( verbose_name='Es online')
    service = models.JSONField(verbose_name='Servicio')
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="patient_appointments", 
        verbose_name='Paciente'
    )
    physiotherapist = models.ForeignKey(
        Physiotherapist,
        on_delete=models.CASCADE,
        related_name="physio_appointments",
        verbose_name='Fisioterapeuta'
    )
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.BOOKED,
        verbose_name='Estado'
    )
    alternatives = models.JSONField(null=True, blank=True, verbose_name='Alternativas')

    class Meta:
        verbose_name = "Cita"
        verbose_name_plural = "Citas"

    def __str__(self):
        return f"Cita {self.id} - {self.start_time} ({self.patient.user.username} Con {self.physiotherapist.user.username})"