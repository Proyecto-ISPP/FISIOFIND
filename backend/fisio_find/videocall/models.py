# models.py
from django.db import models
from users.models import Physiotherapist, Patient
import random
import string
from appointment.models import Appointment  

class Room(models.Model):
    code = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='rooms')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='rooms',null=True,blank=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='room')
    is_test_room = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        super(Room, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.physiotherapist} with {self.patient}"
