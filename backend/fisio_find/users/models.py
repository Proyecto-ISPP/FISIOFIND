from django.db import models
from django.contrib.auth.models import AbstractUser
from encrypted_fields.fields import EncryptedCharField, EncryptedTextField
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models.signals import post_delete
from django.dispatch import receiver


def validate_unique_DNI(data_dni) -> bool:
    enc = EncryptedValues.objects.all()

    if not enc.exists():
        return False

    DNIs_enc = enc.get().encrypted_values
    return data_dni in DNIs_enc


def add_dni_to_encryptedvalues(data_dni) -> None:
    if data_dni is None:
        return False
    enc = EncryptedValues.objects.first()
    if enc:
        if data_dni not in enc.encrypted_values:
            enc.encrypted_values += data_dni + ";"
            enc.save()
    else:
        EncryptedValues.objects.create(encrypted_values=data_dni + ";")


def delete_DNI_from_encryptedvalues(data_dni):
    if data_dni is None:
        return False
    enc = EncryptedValues.objects.all()

    if not enc.exists():
        # No se ha utilizado todavia ningun DNI, es el primer usario
        pass
    else:
        DNIs_enc = enc.get()
        DNIs_enc.encrypted_values = DNIs_enc.encrypted_values.replace(data_dni+";", "")
        if DNIs_enc.encrypted_values in ["", None]:
            DNIs_enc.delete()
        else:
            DNIs_enc.save()


ACCOUNT_STATUS_CHOICES = [
    ('ACTIVE', 'Active'),
    ('BANNED', 'Banned'),
    ('REMOVED', 'Removed'),
    ('UNVERIFIED', 'Unverified'),
]

GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
    ('P', 'Prefer not to say'),
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


def validate_image_file(value):
    # Check file size
    if value.size > 5 * 1024 * 1024:  # 5MB
        raise ValidationError('Las imágenes no peuden superar los 5MB')

    # Check file extension
    ext = value.name.split('.')[-1].lower()
    if ext not in ['jpg', 'jpeg', 'png']:
        raise ValidationError('Solo imágenes en formato JPG, JPEG o PNG son permitidos')


class AppUser(AbstractUser):
    photo = models.ImageField(null=True, blank=True, verbose_name='Foto', upload_to='user_photos/', storage=FileSystemStorage(location=settings.PROFILE_PHOTOS_ROOT, base_url=settings.PROFILE_PHOTOS_URL))
    dni = EncryptedCharField(max_length=255, null=True, unique=True, verbose_name='DNI')
    phone_number = models.CharField(max_length=9, null=True, blank=True, verbose_name='Número de teléfono')
    postal_code = models.CharField(max_length=5, verbose_name='Código postal')
    account_status = models.CharField(max_length=10, choices=ACCOUNT_STATUS_CHOICES, default='UNVERIFIED', verbose_name='Estado de la cuenta')
    is_subscribed = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.username} - {self.email}"

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def save(self, *args, **kwargs):
        if self.pk:
            old_dni = AppUser.objects.get(pk=self.pk).dni
            if old_dni != self.dni:
                delete_DNI_from_encryptedvalues(old_dni)
                add_dni_to_encryptedvalues(self.dni)
        else:
            add_dni_to_encryptedvalues(self.dni)
        super().save(*args, **kwargs)


@receiver(post_delete, sender=AppUser)
def remove_dni_on_delete(sender, instance, **kwargs):
    if instance.dni:
        delete_DNI_from_encryptedvalues(instance.dni)


class EncryptedValues(models.Model):
    # En users se guarda el DNI cifrado pero cada vez que se cifra el resultado es distinto
    # Ademas de que si intentas buscar un usuario por dni para ver si ya existe pues no puedes
    # Por eso esta clase, aqui se guardan todos los dnis en un string y se cifran todos a la vez
    # Entonces, si quiers comprobar si un DNI esta siendo utilizado, buscas en ese string
    # El formato es: dni;dni;dni;...
    encrypted_values = EncryptedTextField(blank=False)

    def __str__(self):
        return "DNIs cifrados"

    class Meta:
        verbose_name = "DNIs cifrados"
        verbose_name_plural = "DNIs cifrados"


class Patient(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='patient', verbose_name='Usuario')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name='Género')
    stripe_customer_id = EncryptedCharField(max_length=255, blank=True, null=True, verbose_name='ID Stripe')
    birth_date = models.DateField(verbose_name='Fecha de nacimiento')

    def __str__(self):
        return f"{self.user.username} - {self.user.email}"

    class Meta:
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"


class Specialization(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Nombre')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Especialización"
        verbose_name_plural = "Especializaciones"



class PhysiotherapistSpecialization(models.Model):
    physiotherapist = models.ForeignKey(
        'Physiotherapist', on_delete=models.CASCADE, related_name="physio_specializations"
    )
    specialization = models.ForeignKey(
        'Specialization', on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name = "Relación fisio-especialización"
        verbose_name_plural = "Relaciones fisio-especialización"


class Pricing(models.Model):
    name = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    video_limit = models.IntegerField()

    def __str__(self):
        return self.name


class Physiotherapist(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='physio', verbose_name='Usuario')
    bio = models.TextField(null=True, blank=True, verbose_name='Bio')
    autonomic_community = models.CharField(max_length=30, choices=AUTONOMIC_COMMUNITY_CHOICES, verbose_name='Comunidad autónoma')
    rating_avg = models.FloatField(null=True, blank=True, verbose_name='Media valoraciones')
    schedule = models.JSONField(null=True, blank=True, verbose_name='Agenda')
    birth_date = models.DateField(verbose_name='Fecha de naciemiento')
    collegiate_number = models.CharField(max_length=30, verbose_name='Número de colegiado')
    services = models.JSONField(null=True, blank=True, verbose_name='Servicios')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name='Género')
    specializations = models.ManyToManyField(Specialization, through="PhysiotherapistSpecialization", verbose_name='Especialización')
    plan = models.ForeignKey(
        Pricing,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='physios',
        verbose_name='Plan'
    )
    # Campos para integración con Stripe
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True, verbose_name='ID Stripe')
    subscription_status = models.CharField(max_length=20, default='pending', verbose_name='Estado de la suscripción')
    # Valores: 'pending', 'active', 'canceled'
    degree = models.CharField(max_length=255, blank=True, null=True)
    university = models.CharField(max_length=255, blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    workplace = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.user.email}"

    class Meta:
        verbose_name = "Fisioterapeuta"
        verbose_name_plural = "Fisioterapeutas"


class Admin(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='admin')

    def __str__(self):
        return f"{self.user.username} - {self.user.email}"
