from django.db import models
from django.utils import timezone
from datetime import timedelta
from appointment.models import Appointment


#HAY QUE PEDIR CAMBIO EN EL UML YA QUE SI QUIEREN LAS FACTURAS SE DEBERIAN DE GUARDAR EN UNA TABLA APARTE
class Payment(models.Model):
    PAYMENT_STATUSES = (
        ('Not Paid', 'Not Paid'),
        ('Paid', 'Paid'),
        ('Refunded', 'Refunded'),
        ('Canceled', 'Canceled'),
        ('redeemed', 'redeemed'), #Pago cobrado por el fisioterapeuta
    )
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='Card')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUSES, default='Not Paid')
    payment_date = models.DateTimeField(null=True, blank=True)
    
    #Un PaymentIntent representa un intento de cobro a un cliente. Es el objeto principal que usas para procesar un pago único (como una cita en tu caso).
    stripe_payment_intent_id = models.CharField(max_length=100, null=True, blank=True) 

    #Se usa para configurar un método de pago (como una tarjeta) para futuros cobros, sin realizar un pago inmediato. Es común en suscripciones o pagos recurrentes
    stripe_setup_intent_id = models.CharField(max_length=100, null=True, blank=True)

    #Un PaymentMethod representa un medio de pago específico del cliente, como una tarjeta de crédito o débito (ej. "Visa terminada en 4242")
    stripe_payment_method_id = models.CharField(max_length=100, null=True, blank=True)

    @property
    def payment_deadline(self):
        return self.appointment.start_time - timedelta(hours=48)

    def __str__(self):
        return f"Payment for appointment {self.appointment.id} - {self.status}"