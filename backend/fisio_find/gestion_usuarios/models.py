from django.db import models
from django.contrib.auth.models import AbstractUser

ACCOUNT_STATUS_CHOICES = [
    ('ACTIVE', 'Active'),
    ('BANNED', 'Banned'),
    ('REMOVED', 'Removed'),
]

GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
]

AUTONOMIC_COMMUNITY_CHOICES = [
    ('ANDALUCIA', 'Andalucía'),
    ('ARAGON', 'Aragón'),
    ('ASTURIAS', 'Asturias'),
    ('BALEARES', 'Baleares'),
    ('CANARIAS', 'Canarias'),
    ('CANTABRIA', 'Cantabria'),
    ('CASTILLA Y LEON', 'Castilla y León'),
    ('CASTILLA-LA MANCHA', 'Castilla-La Mancha'),
    ('CATALUÑA', 'Cataluña'),
    ('EXTREMADURA', 'Extremadura'),
    ('GALICIA', 'Galicia'),
    ('MADRID', 'Madrid'),
    ('MURCIA', 'Murcia'),
    ('NAVARRA', 'Navarra'),
    ('PAIS VASCO', 'País Vasco'),
    ('LA RIOJA', 'La Rioja'),
    ('COMUNIDAD VALENCIANA', 'Comunidad Valenciana')
]

class AppUser(AbstractUser):
    photo = models.ImageField(null=True, blank=True)
    dni = models.CharField(max_length=9, unique=True)
    phone_number = models.CharField(max_length=9)
    postal_code = models.CharField(max_length=5)
    account_status = models.CharField(max_length=10, choices=ACCOUNT_STATUS_CHOICES, default='ACTIVE')
    
    def __str__(self):
        return f"{self.username} - {self.email}"

class Patient(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='patient')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    birth_date = models.DateField()
    
    def __str__(self):
        return f"{self.user.username} - {self.user.email}"
    
class Specialization(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
class PhysiotherapistSpecialization(models.Model):
    physiotherapist = models.ForeignKey(
        'Physiotherapist', on_delete=models.CASCADE, related_name="physio_specializations"
    )
    specialization = models.ForeignKey(
        'Specialization', on_delete=models.SET_NULL, null=True, blank=True
    )

class Physiotherapist(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='physio')
    bio = models.TextField(null=True, blank=True)
    autonomic_community = models.CharField(max_length=30, choices=AUTONOMIC_COMMUNITY_CHOICES)
    rating_avg = models.FloatField(null=True, blank=True)
    schedule = models.JSONField(null=True, blank=True)
    birth_date = models.DateField()
    collegiate_number = models.CharField(max_length=30)
    services = models.JSONField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    specializations = models.ManyToManyField(Specialization, through="PhysiotherapistSpecialization")

    def __str__(self):
        return f"{self.user.username} - {self.user.email}"

class Admin(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='admin')
    
    def __str__(self):
        return f"{self.user.username} - {self.user.email}"