from django.utils import timezone
from multiselectfield import MultiSelectField
from django.db import models
from django.core.exceptions import ValidationError
from users.models import Patient, Physiotherapist


class Treatment(models.Model):
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='treatments', verbose_name = "Fisioterapeuta")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatments', verbose_name = "Paciente")
    notifications_enabled = models.BooleanField(default=True, help_text="Si está activado, el paciente recibirá recordatorios de realización de ejercicios por email")
    start_time = models.DateTimeField(verbose_name = "Inicio")
    end_time = models.DateTimeField( verbose_name = "Final")
    homework = models.TextField(blank=True, null=True, verbose_name = "Deberes")
    is_active = models.BooleanField(default=True, verbose_name = "Está activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name = "Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name = "Fecha de actualización")

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("La fecha de fin debe ser posterior a la fecha de inicio.")

    def __str__(self):
        return f"Tratamiento para {self.patient.user.username} por {self.physiotherapist.user.username} (inicio: {self.start_time.date()})"

    class Meta:
        verbose_name = "Tratamiento"
        verbose_name_plural = "Tratamientos"


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

    name = models.CharField(max_length=255, blank=True, null=True, verbose_name = "Nombre")
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, related_name='sessions', verbose_name = "Tratamiento")
    day_of_week = MultiSelectField(choices=DAYS_OF_WEEK_CHOICES, max_length=100, verbose_name = "Día de la semana")

    def __str__(self):
        dias = ", ".join(dict(self.DAYS_OF_WEEK_CHOICES).get(day, day) for day in self.day_of_week)
        return f"Sesión para {self.treatment.patient.user.username} los días {dias}"

    class Meta:
        verbose_name = "Sesión"
        verbose_name_plural = "Sesiones"

class SessionTest(models.Model):
    TEXT = 'text'
    SCALE = 'scale'
    TEXT_TYPE_CHOICES = [
        (TEXT, 'Text'),
        (SCALE, 'Scale'),
    ]
    
    session = models.OneToOneField(Session, on_delete=models.CASCADE, related_name='test', verbose_name = "Sesión")
    question = models.CharField(max_length=255, verbose_name = "Preguntas")
    test_type = models.CharField(max_length=10, choices=TEXT_TYPE_CHOICES, default=TEXT, verbose_name = "Tipo de test")
    scale_labels = models.JSONField(blank=True, null=True, help_text="Etiquetas para cada valor para preguntas de tipo escala", verbose_name = "Etiquetas de la escala")
    
    def __str__(self):
        return f"Test de {self.session.treatment.patient.user.username} en sesión {self.session.id}: {self.question}"

    class Meta:
        verbose_name = "Test de sesión"
        verbose_name_plural = "Tests de sesiones"
    
class SessionTestResponse(models.Model):
    test = models.ForeignKey(SessionTest, on_delete=models.CASCADE, related_name='responses', verbose_name = "Test")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='test_responses', verbose_name = "Pacientes")
    response_text = models.TextField(blank=True, null=True, verbose_name = "Texto de respuesta")
    response_scale = models.IntegerField(blank=True, null=True, verbose_name = "Escala de respuesta")
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Respuesta de {self.patient.user.username} al test {self.test.question} en sesión {self.test.session.id}  (enviado: {self.submitted_at.date()})"
    
    class Meta:
        verbose_name = "Respuesta a test de sesión"
        verbose_name_plural = "Respuestas a test de sesión"

class Exercise(models.Model):
    """ Catálogo de ejercicios disponibles para fisioterapia """

    BODY_REGION_CHOICES = [
        ("NECK", "Cuello"),
        ("SHOULDER", "Hombros"),
        ("ARM", "Brazos (Bíceps, Tríceps)"),
        ("ELBOW", "Codo"),
        ("WRIST_HAND", "Muñeca y Mano"),
        ("CHEST", "Pecho"),
        ("UPPER_BACK", "Espalda Alta"),
        ("LOWER_BACK", "Zona Lumbar"),
        ("CORE", "Zona Media / Core"),
        ("QUADRICEPS", "Cuádriceps"),
        ("HAMSTRINGS", "Isquiotibiales"),
        ("KNEE", "Rodilla"),
        ("CALVES", "Pantorrillas"),
        ("ANKLE_FOOT", "Tobillo y Pie"),
        ("UPPER_BODY", "Parte Superior del Cuerpo"),
        ("LOWER_BODY", "Parte Inferior del Cuerpo"),
        ("FULL_BODY", "Cuerpo Completo"),
    ]

    EXERCISE_TYPE_CHOICES = [
        ("STRENGTH", "Fortalecimiento Muscular"),
        ("MOBILITY", "Movilidad Articular"),
        ("STRETCHING", "Estiramientos"),
        ("BALANCE", "Ejercicios de Equilibrio"),
        ("PROPRIOCEPTION", "Propiocepción"),
        ("COORDINATION", "Coordinación"),
        ("BREATHING", "Ejercicios Respiratorios"),
        ("RELAXATION", "Relajación / Descarga"),
        ("CARDIO", "Resistencia Cardiovascular"),
        ("FUNCTIONAL", "Ejercicio Funcional"),
    ]

    title = models.CharField(max_length=255, verbose_name = "Título")
    description = models.TextField(blank=True, null=True, verbose_name = "Descripción")
    body_region = models.CharField(max_length=50, choices=BODY_REGION_CHOICES, default="UPPER_BODY", verbose_name = "Región del cuerpo")
    exercise_type = models.CharField(max_length=50, choices=EXERCISE_TYPE_CHOICES, default="STRENGTH", verbose_name = "Tipo de ejercicio")
    physiotherapist = models.ForeignKey(
        Physiotherapist, 
        on_delete=models.CASCADE, 
        related_name='exercises',
        verbose_name = "Fisioterapeuta"
    )

    def __str__(self):
        return f"{self.title} - {self.get_body_region_display()}"

    class Meta:
        verbose_name = "Ejercicio"
        verbose_name_plural = "Ejercicios"

class ExerciseSession(models.Model):
    """ Asocia un ejercicio con una sesión específica """
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='exercise_sessions', verbose_name = "Ejercicio")
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='exercise_sessions', verbose_name = "Sesión")

    def __str__(self):
         return f"{self.exercise.title} asignado a sesión {self.session.id} de {self.session.treatment.patient.user.username}"

    class Meta:
        verbose_name = "Relación sesión-ejercicio"
        verbose_name_plural = "Relación sesión-ejercicio"

class Series(models.Model):
    """ Una serie dentro de un ejercicio en una sesión """
    exercise_session = models.ForeignKey(ExerciseSession, on_delete=models.CASCADE, related_name='series', verbose_name = "Sesión de ejercicio")
    series_number = models.PositiveIntegerField(verbose_name = "Número de series")
    repetitions = models.PositiveIntegerField(verbose_name = "Repeticiones")
    weight = models.FloatField(blank=True, null=True, help_text="Carga en kg", verbose_name = "Peso")
    time = models.DurationField(blank=True, null=True, help_text="Tiempo en segundos", verbose_name = "Tiempo")
    distance = models.FloatField(blank=True, null=True, help_text="Distancia en metros", verbose_name = "Distancia")

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

    class Meta:
        verbose_name = "Serie"
        verbose_name_plural = "Series"

class ExerciseLog(models.Model):
    """ Registro del progreso del paciente en las series """
    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='exercise_logs', verbose_name = "Series")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='exercise_logs' , verbose_name = "Paciente")
    date = models.DateField(default=timezone.now, verbose_name = "Fecha")

    repetitions_done = models.PositiveIntegerField(default=0, verbose_name = "Repeticiones hechas")
    weight_done = models.FloatField(blank=True, null=True, verbose_name = "Peso hecho")
    time_done = models.DurationField(blank=True, null=True, verbose_name = "Tiempo hecho")
    distance_done = models.FloatField(blank=True, null=True, verbose_name = "Distancia hecha")
    notes = models.TextField(blank=True, null=True,verbose_name = "Notas")

    def __str__(self):
        return f"Log de {self.patient.user.username} ({self.date}) en serie {self.series.series_number}"

    class Meta:
        verbose_name = "Log de ejercicio"
        verbose_name_plural = "Logs de ejercicio"
    
