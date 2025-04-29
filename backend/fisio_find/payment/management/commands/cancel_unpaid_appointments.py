from django.core.management.base import BaseCommand
from django.utils import timezone
from payment.models import Payment

#SIRVE PARA CANCELAR CITAS NO PAGADAS CUYA FECHA DE PAGO HA EXPIRADO AUTOMATICAMENTE
class Command(BaseCommand):
    help = 'Cancels unpaid appointments whose payment deadline has expired'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        unpaid_appointments = Payment.objects.filter(
            status='Not Paid',
            appointment__appointment_start__gt=now, #comporbar que funciona 
            appointment__status='Reserved'
        ).filter(payment_deadline__lt=now)

        for payment in unpaid_appointments:
            payment.appointment.status = 'Canceled'
            payment.appointment.save()

        self.stdout.write(self.style.SUCCESS(f'{unpaid_appointments.count()} unpaid appointments canceled successfully'))