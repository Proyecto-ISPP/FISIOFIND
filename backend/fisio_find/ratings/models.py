from django.db import models
from django.conf import settings

class Rating(models.Model):
    physiotherapist = models.ForeignKey(
        'users.Physiotherapist', on_delete=models.CASCADE, related_name='ratings'
    )
    patient = models.ForeignKey(
        'users.Patient', on_delete=models.CASCADE, related_name='ratings'
    )
    punctuation = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    opinion = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.punctuation} for {self.physiotherapist.user.username} by {self.patient.user.username}"