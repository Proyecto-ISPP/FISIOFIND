from django.db import models
import random
import string

class Room(models.Model):
    code = models.CharField(max_length=10, unique=True)  # Código único de la sala
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.code:  # Si no tiene código, generamos uno aleatorio
            self.code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        super(Room, self).save(*args, **kwargs)

    def __str__(self):
        return self.code