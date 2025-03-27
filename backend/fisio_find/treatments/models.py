from multiselectfield import MultiSelectField
from django.db import models
from django.core.exceptions import ValidationError
from users.models import Patient, Physiotherapist

class Treatment(models.Model):
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='treatments')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatments')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    homework = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("La fecha de fin debe ser posterior a la fecha de inicio.")

    def __str__(self):
        return f"Tratamiento para {self.patient.user.username} por {self.physiotherapist.user.username}"


class Session(models.Model):
    """ Sesión dentro de un tratamiento """
    DAYS_OF_WEEK_CHOICES = [
        ("Monday", "Lunes"),
        ("Tuesday", "Martes"),
        ("Wednesday", "Miércoles"),
        ("Thursday", "Jueves"),
        ("Friday", "Viernes"),
        ("Saturday", "Sábado"),
        ("Sunday", "Domingo"),
    ]

    name = models.CharField(max_length=255, blank=True, null=True)
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, related_name='sessions')
    day_of_week = MultiSelectField(choices=DAYS_OF_WEEK_CHOICES, max_length=100)

    def __str__(self):
        dias = ", ".join(dict(self.DAYS_OF_WEEK_CHOICES).get(day, day) for day in self.day_of_week)
        return f"Sesión para {self.treatment.patient.user.username} los días {dias}"

class SessionTest(models.Model):
    TEXT = 'text'
    SCALE = 'scale'
    TEXT_TYPE_CHOICES = [
        (TEXT, 'Text'),
        (SCALE, 'Scale'),
    ]
    
    session = models.OneToOneField(Session, on_delete=models.CASCADE, related_name='test')
    question = models.CharField(max_length=255)
    test_type = models.CharField(max_length=10, choices=TEXT_TYPE_CHOICES, default=TEXT)
    scale_labels = models.JSONField(blank=True, null=True, help_text="Etiquetas para cada valor para preguntas de tipo escala")
    
    def __str__(self):
        return f"Test de {self.session.treatment.patient.user.username} en sesión {self.session.id}: {self.question}"
    
class SessionTestResponse(models.Model):
    test = models.ForeignKey(SessionTest, on_delete=models.CASCADE, related_name='responses')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='test_responses')
    response_text = models.TextField(blank=True, null=True)
    response_scale = models.IntegerField(blank=True, null=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Respuesta de {self.patient.user.username} al test {self.test.question} en sesión {self.test.session.id}"

class Exercise(models.Model):
    """ Catálogo de ejercicios disponibles """
    AREA_CHOICES = [
        ("UPPER_BODY", "Parte Superior del Cuerpo"),
        ("LOWER_BODY", "Parte Inferior del Cuerpo"),
        ("CORE", "Zona Media/Core"),
        ("FULL_BODY", "Cuerpo Completo"),
        ("SHOULDER", "Hombros"),
        ("ARM", "Brazos (Bíceps, Tríceps)"),
        ("CHEST", "Pecho"),
        ("BACK", "Espalda"),
        ("QUADRICEPS", "Cuádriceps"),
        ("HAMSTRINGS", "Isquiotibiales"),
        ("GLUTES", "Glúteos"),
        ("CALVES", "Pantorrillas"),
        ("NECK", "Cuello"),
        ("LOWER_BACK", "Zona Lumbar"),
        ("HIP", "Caderas"),
        ("BALANCE", "Ejercicios de Equilibrio"),
        ("MOBILITY", "Movilidad"),
        ("STRETCHING", "Estiramientos"),
        ("PROPRIOCEPTION", "Propiocepción"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    area = models.CharField(max_length=255, choices=AREA_CHOICES)
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='exercises')

    def __str__(self):
        return self.title


class ExerciseSession(models.Model):
    """ Asocia un ejercicio con una sesión específica """
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='exercise_sessions')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='exercise_sessions')

    def __str__(self):
        return f"{self.exercise.title} en sesión {self.session.id}"

class Series(models.Model):
    """ Una serie dentro de un ejercicio en una sesión """
    exercise_session = models.ForeignKey(ExerciseSession, on_delete=models.CASCADE, related_name='series')
    series_number = models.PositiveIntegerField()
    repetitions = models.PositiveIntegerField()
    weight = models.FloatField(blank=True, null=True, help_text="Carga en kg")
    time = models.DurationField(blank=True, null=True, help_text="Tiempo en segundos")
    distance = models.FloatField(blank=True, null=True, help_text="Distancia en metros")

    def clean(self):
        if self.repetitions <= 0:
            raise ValidationError("El número de repeticiones debe ser mayor a cero.")
        if self.weight is None and self.time is None and self.distance is None:
            raise ValidationError("Debe existir al menos una métrica (carga, tiempo o distancia) en la serie.")

    def __str__(self):
        details = [f"{self.repetitions} reps"]
        if self.weight is not None:
            details.append(f"{self.weight} kg")
        if self.time is not None:
            details.append(f"{self.time.total_seconds()} s")
        if self.distance is not None:
            details.append(f"{self.distance} m")
        return f"Serie {self.series_number} de {self.exercise_session.exercise.title} ({', '.join(details)})"


class ExerciseLog(models.Model):
    """ Registro del progreso del paciente en las series """
    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='exercise_logs')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='exercise_logs')
    date = models.DateField(auto_now_add=True)

    repetitions_done = models.PositiveIntegerField(default=0)
    weight_done = models.FloatField(blank=True, null=True)
    time_done = models.DurationField(blank=True, null=True)
    distance_done = models.FloatField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Log de {self.patient.user.username} en serie {self.series.series_number}"
    
