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
    start_time = models.DateTimeField(verbose_name="start_time")
    end_time = models.DateTimeField(verbose_name="end_time")
    is_online = models.BooleanField(verbose_name="is_online")
    service = models.JSONField(verbose_name="service")
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="patient_appointments", 
        verbose_name="Patient"
    )
    physiotherapist = models.ForeignKey(
        Physiotherapist,
        on_delete=models.CASCADE,
        related_name="physio_appointments", 
        verbose_name="Physiotherapist"
    )
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.BOOKED,
        verbose_name="status"
    )
    alternatives = models.JSONField(verbose_name="alternatives", null=True, blank=True)

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointment"

    def __str__(self):
        return f"Appointment {self.id} - {self.start_time} ({self.patient.user.username} with {self.physiotherapist.user.username})"