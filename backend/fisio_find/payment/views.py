import stripe
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from .serializers import PaymentSerializer
from appointment.models import Appointment
from django.utils import timezone
from users.permissions import IsPatient, IsPhysiotherapist
from .utils.pdf_generator import generate_invoice_pdf
from django.http import HttpResponse, JsonResponse
from django.db.models import Sum
import logging


stripe.api_key = settings.STRIPE_SECRET_KEY


def _check_deadline(appointment):
    """Check if the payment deadline has passed and cancel the appointment if needed."""
    now = timezone.now()
    if now > appointment.start_time - timezone.timedelta(hours=48) and appointment.payment.status == 'Not Paid':
        appointment.status = 'Canceled'
        appointment.save()
        return True
    return False


@api_view(['POST'])
@permission_classes([IsPatient])
def create_payment(request):
    """Create a payment for an appointment."""
    appointment_id = request.data.get('appointment_id')
    # Amount in cents: 1000 centavos = 10 EUR
    amount = request.data.get('amount', 1000)
    # payment_method = request.data.get('payment_method', 'card')

    try:
        appointment = Appointment.objects.get(id=appointment_id)

        # Check if the user is the patient associated with the appointment
        if request.user.patient != appointment.patient:
            return Response({'error': 'You can only pay for your own appointments'},
                            status=status.HTTP_403_FORBIDDEN)

        # Check if deadline has passed
        if _check_deadline(appointment):
            return Response({'error': 'Payment deadline has expired and the appointment was canceled'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create payment intent with Stripe
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='eur',
            customer=request.user.patient.stripe_customer_id,  # Agrega el Customer
            payment_method_types=['card'],
        )

        # Create or update payment record
        payment, created = Payment.objects.get_or_create(
            appointment=appointment,
            defaults={'amount': amount / 100,
                'stripe_payment_intent_id': payment_intent['id']}
        )
        serializer = PaymentSerializer(payment)
        return Response({
            'payment': serializer.data,
            # For frontend to complete payment
            'client_secret': payment_intent['client_secret']
        }, status=status.HTTP_201_CREATED)

    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f'Error processing payment: {str(e)}')
        return Response({'error': f'Error processing payment'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsPatient])
def confirm_payment(request, payment_id):
    """Confirm a payment for an appointment."""
    try:
        payment = Payment.objects.get(id=payment_id)

        # Check if the user is the patient associated with the appointment
        if request.user.patient != payment.appointment.patient:
            return Response({'error': 'You can only confirm payments for your own appointments'},
                            status=status.HTTP_403_FORBIDDEN)

        # Check if deadline has passed
        if _check_deadline(payment.appointment):
            return Response({'error': 'Payment deadline has expired and the appointment was canceled'},
                            status=status.HTTP_400_BAD_REQUEST)

        if payment.status == 'Paid':
            return Response({'error': 'Payment is already confirmed'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener el PaymentIntent desde Stripe usando el ID almacenado
        payment_intent = stripe.PaymentIntent.retrieve(
            payment.stripe_payment_intent_id)

        if payment_intent['status'] == 'requires_payment_method':
            return Response({'error': 'Payment method is required'}, status=status.HTTP_400_BAD_REQUEST)

        if payment_intent['status'] == 'canceled':
            return Response({'error': 'Payment was canceled'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar el estado del PaymentIntent en Stripe
        if payment_intent['status'] == 'succeeded':
            # El pago fue exitoso en Stripe, actualizar el estado localmente
            payment.status = 'Paid'
            payment.payment_date = timezone.now()
            payment.save()
            payment.appointment.status = 'Paid'
            payment.appointment.save()

        serializer = PaymentSerializer(payment)
        return Response({'message': 'Payment confirmed', 'payment': serializer.data},
                        status=status.HTTP_200_OK)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f'Error confirming payment: {str(e)}')
        return Response({'error': f'Error confirming payment'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsPatient])
def cancel_payment_patient(request, payment_id):
    """Cancel an appointment and handle refund if applicable."""
    try:
        payment = Payment.objects.get(id=payment_id)

        # Verificar que el usuario sea el paciente asociado
        if request.user.patient != payment.appointment.patient:
            return Response({'error': 'You can only cancel your own appointments'},
                            status=status.HTTP_403_FORBIDDEN)

        appointment = payment.appointment
        now = timezone.now()

        # No se puede cancelar si la cita ya pasó
        if now > appointment.start_time:
            return Response({'error': 'The appointment has already passed'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Caso 1: Pago no realizado antes de las 48 horas antes de la cita
        if payment.status == 'Not Paid' and now < payment.payment_deadline:
            if payment.stripe_payment_intent_id:
                stripe.PaymentIntent.cancel(payment.stripe_payment_intent_id)
            appointment.status = 'Canceled'
            appointment.save()
            payment.status = 'Canceled'
            payment.payment_date = now
            payment.save()
            return Response({'message': 'Appointment canceled without charge'}, status=status.HTTP_200_OK)

        # Caso 2: Pago realizado y antes de las 48 horas antes de la cita
        if payment.status == 'Paid' and now < payment.payment_deadline:
            payment_intent = stripe.PaymentIntent.retrieve(
                payment.stripe_payment_intent_id)
            if payment_intent['status'] != 'succeeded':
                return Response({'error': 'Payment cannot be refunded because it was not completed'},
                                status=status.HTTP_400_BAD_REQUEST)

            refund = stripe.Refund.create(
                payment_intent=payment.stripe_payment_intent_id)
            if refund['status'] == 'succeeded':
                payment.status = 'Refunded'
                payment.payment_date = now
                payment.save()
                appointment.status = 'Canceled'
                appointment.save()
                return Response({'message': 'Payment refunded and appointment canceled'},
                                status=status.HTTP_200_OK)

        # Caso 3: Pago realizado pero dentro de las 48 horas antes de la cita
        if payment.status == 'Paid' and now > payment.payment_deadline:
            return Response({'error': 'Payment cannot be refunded within 48 hours of the appointment'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Caso 4: Pago ya cancelado o reembolsado
        if payment.status in ['Canceled', 'Refunded']:
            return Response({'error': 'Payment has already been canceled or refunded'},
                            status=status.HTTP_400_BAD_REQUEST)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except stripe.error.StripeError as e:
        logging.error(f'Stripe error: {str(e)}')
        return Response({'error': 'An error occurred while processing your payment. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logging.error(f'Stripe error: {str(e)}')
        return Response({'error': 'An internal error has occurred. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def cancel_payment_pyshio(request, appointment_id):
    """Cancel an appointment and handle refund if applicable."""
    try:

        payment = Payment.objects.get(appointment_id=appointment_id)
        
        appointment = payment.appointment
        
        # Verificar que el pyshio sea el paciente asociado
        if request.user.id != appointment.physiotherapist_id:
            return Response({'error': 'You can only cancel your own appointments'}, 
                            status=status.HTTP_403_FORBIDDEN)

        appointment = payment.appointment
        now = timezone.now()

        # No se puede cancelar si la cita ya pasó
        if now > appointment.start_time:
            return Response({'error': 'The appointment has already passed'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Caso 1: Pago no realizado
        if payment.status == 'Not Paid':
            if payment.stripe_payment_intent_id:
                payment_intent = stripe.PaymentIntent.retrieve(payment.stripe_payment_intent_id)
                if payment_intent['status'] not in ['requires_payment_method', 'requires_capture', 'requires_confirmation', 'requires_action', 'processing']:
                    return Response({'error': 'PaymentIntent cannot be canceled because it is already in status: ' + payment_intent['status']}, 
                                    status=status.HTTP_400_BAD_REQUEST)

                stripe.PaymentIntent.cancel(payment.stripe_payment_intent_id)
            
            appointment.status = 'canceled'
            appointment.save()
            payment.status = 'Canceled'
            payment.save()
            
            return Response({'message': 'Appointment canceled without charge'}, status=status.HTTP_200_OK)

        # Caso 2: Pago realizado (reembolso completo siempre, antes de la cita)
        if payment.status == 'Paid':
            payment_intent = stripe.PaymentIntent.retrieve(payment.stripe_payment_intent_id)
            if payment_intent['status'] != 'succeeded':
                return Response({'error': 'Payment cannot be refunded because it was not completed'}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            refund = stripe.Refund.create(payment_intent=payment.stripe_payment_intent_id)
            if refund['status'] in ['succeeded']:
                payment.status = 'Refunded'
                payment.payment_date = now
                payment.save()
                appointment.status = 'canceled'
                appointment.save()
                return Response({'message': 'Payment refunded and appointment canceled by physiotherapist'}, 
                                status=status.HTTP_200_OK)
            else:
                return Response({'error': f'Refund failed with status: {refund["status"]}'}, 
                                status=status.HTTP_400_BAD_REQUEST)

        # Caso 3: Pago no realizado
        if payment.status == 'Not Captured':
            if payment.stripe_payment_intent_id:
                stripe.PaymentIntent.cancel(payment.stripe_payment_intent_id)
            appointment.status = 'Canceled'
            appointment.save()
            payment.status = 'Canceled'
            payment.save()
            return Response({'message': 'Appointment canceled without charge'}, 
                            status=status.HTTP_200_OK)

        # Caso 4: Pago ya cancelado o reembolsado
        if payment.status in ['Canceled', 'Refunded']:
            return Response({'error': 'Payment has already been canceled or refunded'}, 
                            status=status.HTTP_400_BAD_REQUEST)
            
        # Agregar una respuesta por si `payment.status` tiene un valor inesperado
        return Response({'error': 'Unexpected payment status'}, status=status.HTTP_400_BAD_REQUEST)


    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except stripe.error.StripeError as e:
        logging.error(f'Stripe error: {str(e)}')
        return Response({'error': 'An error occurred while processing your payment. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'An internal error has occurred. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsPatient])
def get_payment_details(request, payment_id):
    """Retrieve payment details."""
    try:
        payment = Payment.objects.get(id=payment_id)

        # Check if the user is the patient associated with the appointment
        if request.user.patient != payment.appointment.patient:
            return Response({'error': 'You can only view your own payment details'}, 
                            status=status.HTTP_403_FORBIDDEN)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsPatient])
def get_refund_status(request, payment_id):
    """Allow a patient to check the refund status of a payment."""
    try:
        # Obtener el pago
        payment = Payment.objects.get(id=payment_id)

        # Verificar que el usuario sea el paciente asociado a la cita
        if request.user.patient != payment.appointment.patient:
            return Response({'error': 'You can only check the refund status of your own payments'}, 
                            status=status.HTTP_403_FORBIDDEN)

        # Caso 1: Pago no reembolsado o no pagado
        if payment.status in ['Not Paid', 'Paid', 'Canceled']:
            return Response({'message': 'No refund has been issued for this payment', 
                             'payment_status': payment.status}, 
                            status=status.HTTP_200_OK)

        # Caso 2: Pago reembolsado
        if payment.status == 'Refunded':
            # Consultar el PaymentIntent en Stripe
            payment_intent = stripe.PaymentIntent.retrieve(payment.stripe_payment_intent_id)
            
            # Buscar reembolsos asociados al PaymentIntent
            refunds = stripe.Refund.list(payment_intent=payment.stripe_payment_intent_id, limit=1)
            if refunds.data:  # Si hay al menos un reembolso
                refund = refunds.data[0]  # Tomar el más reciente
                refund_status = refund['status']
                refund_amount = refund['amount'] / 100  # Convertir de centavos a euros
                refund_date = refund['created']  # Timestamp de Stripe (en segundos)
                
                # Convertir timestamp a formato legible
                from datetime import datetime
                refund_date_formatted = datetime.utcfromtimestam(refund_date).strftime('%Y-%m-%d %H:%M:%S UTC')

                return Response({
                    'message': 'Refund status retrieved successfully',
                    'payment_status': payment.status,
                    'refund_status': refund_status,
                    'refund_amount': refund_amount,
                    'refund_date': refund_date_formatted
                }, status=status.HTTP_200_OK)
            else:
                # Si no hay reembolso en Stripe pero el estado es 'Refunded', hay inconsistencia
                return Response({'error': 'Refund recorded locally but not found in Stripe'}, 
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'error': 'Unknown payment status'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except stripe.error.StripeError as e:
        logging.error(f'Stripe error: {str(e)}')
        return Response({'error': 'An error occurred while processing your payment.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'An internal error has occurred. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsPatient])
def invoice_pdf_view(request):
    try:
        payment_id = request.query_params.get('payment_id')
        appointment_id = request.query_params.get('appointment_id')

        if not payment_id and not appointment_id:
            return Response(
                {"error": "Se requiere el ID del pago o el ID de la cita"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if payment_id:
                payment = Payment.objects.get(id=payment_id)
            elif appointment_id:
                payment = Payment.objects.get(appointment_id=appointment_id)
        except Payment.DoesNotExist:
            return Response(
                {"error": "Pago no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user.patient != payment.appointment.patient:
            return Response(
                {"error": "No tienes permiso para ver esta factura"},
                status=status.HTTP_403_FORBIDDEN
            )

        pdf = generate_invoice_pdf(payment)

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{payment.id}.pdf"'

        return response

    except Exception as e:
        return Response(
            {"error": 'An internal error has occurred. Please try again later.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
#obtener todas las facturas de fisioterapeuta
@api_view(['GET'])
@permission_classes([IsPhysiotherapist])
def get_physio_invoices(request):
    physiotherapist = request.user.physio
    my_appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
    my_payments = Payment.objects.filter(appointment__in=my_appointments)
    serializer = PaymentSerializer(my_payments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


#obtener dinero acumulado de todas las payment pagadas por el fisioterapeuta
@api_view(['GET'])
@permission_classes([IsPhysiotherapist])
def total_money(request):
    physiotherapist = request.user.physio
    
    my_appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
    try:
        total = Payment.objects.filter(appointment__in=my_appointments, status='Paid').aggregate(Sum('amount'))['amount__sum']
        if total is None:
            total = 0
        return Response({'total': total}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'An internal error has occurred. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)

#generar un SetupIntent para almacenar el método de pago sin cobrarlo de inmediato

@api_view(['POST'])
@permission_classes([IsPatient])
def create_payment_setup(request):
    """Crea un SetupIntent para almacenar el método de pago sin cobrarlo de inmediato."""
    appointment_id = request.data.get('appointment_id')
    amount = request.data.get('amount', 1000)  # Monto en centavos
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        
        # Verificar que el paciente sea el dueño de la cita
        if request.user.patient != appointment.patient:
            return Response({'error': 'Sólo puedes pagar tus propias citas'}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        # Verificar que la fecha de pago no haya expirado
        if _check_deadline(appointment):
            return Response({'error': 'El plazo para el pago ha expirado y la cita fue cancelada'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # --- NUEVO: Crear o recuperar el Customer en Stripe ---
        patient = request.user.patient
        if not patient.stripe_customer_id:
            # Se crea el Customer en Stripe con el email del usuario
            customer = stripe.Customer.create(
                email=request.user.email,
                name=f"{request.user.first_name} {request.user.last_name}"
            )
            patient.stripe_customer_id = customer.id
            patient.save()
        else:
            customer = stripe.Customer.retrieve(patient.stripe_customer_id)
        
        # Crear SetupIntent en Stripe, asociándolo al Customer
        setup_intent = stripe.SetupIntent.create(
            payment_method_types=['card'],
            customer=customer.id
        )
        
        # Crear (o actualizar) el registro de Payment. 
        # Nota: si no tienes un campo para el setup intent, considera agregar uno (ej. stripe_setup_intent_id)
        payment, created = Payment.objects.get_or_create(
            appointment=appointment,
            defaults={
                'amount': amount / 100,  # Guardamos en euros
                'stripe_setup_intent_id': setup_intent['id'],
                'status': 'Not Paid'
            }
        )
        serializer = PaymentSerializer(payment)
        return Response({
            'payment': serializer.data,
            'client_secret': setup_intent['client_secret']  # Se envía al frontend para confirmar el SetupIntent
        }, status=status.HTTP_201_CREATED)

    except Appointment.DoesNotExist:
        return Response({'error': 'Cita no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f'Error al procesar el pago: {str(e)}')
        return Response({'error': 'An error occurred while processing your payment. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsPatient])
def update_payment_method(request, payment_id):
    """Actualiza el registro de Payment con el payment_method obtenido tras confirmar el SetupIntent y lo asocia al Customer."""
    try:
        payment = Payment.objects.get(id=payment_id)

        # Verifica que el paciente es el dueño de la cita
        if request.user.patient != payment.appointment.patient:
            return Response({'error': 'Sólo puedes actualizar tus propios pagos'}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        payment_method_id = request.data.get('payment_method_id')
        if not payment_method_id:
            return Response({'error': 'Falta el payment_method_id'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Guardar el payment_method en el registro de Payment
        payment.stripe_payment_method_id = payment_method_id
        payment.save()

        # --- NUEVO: Adjuntar el PaymentMethod al Customer ---
        # Se asume que el paciente ya tiene el stripe_customer_id configurado en create_payment_setup
        customer_id = request.user.patient.stripe_customer_id
        if not customer_id:
            return Response({'error': 'No se encontró un Customer de Stripe para el usuario'}, status=status.HTTP_400_BAD_REQUEST)
        
        stripe.PaymentMethod.attach(
            payment_method_id,
            customer=customer_id,
        )
        stripe.Customer.modify(
            customer_id,
            invoice_settings={'default_payment_method': payment_method_id},
        )
        
        return Response({'message': 'Método de pago actualizado y asociado al Customer'}, status=status.HTTP_200_OK)
    
    except Payment.DoesNotExist:
        return Response({'error': 'Pago no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f'Error al actualizar el método de pago: {str(e)}')
        return Response({'error': f'Error al actualizar el método de pago'}, 
                        status=status.HTTP_400_BAD_REQUEST)


#cobrar el pago utilizando el método almacenado previamente en el SetupIntent

def charge_payment(payment_id):
    """Cobra el pago utilizando el método almacenado previamente en el SetupIntent."""
    try:
        payment = Payment.objects.get(id=payment_id)


        # Asegúrate de que el método de pago ya fue configurado (p. ej. que se haya guardado el payment_method)
        if not payment.stripe_payment_method_id:
            return Response({'error': 'No se ha configurado un método de pago'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear PaymentIntent utilizando el payment_method almacenado
        payment_intent = stripe.PaymentIntent.create(
            amount=int(payment.amount * 100),  # monto en centavos
            currency='eur',
            payment_method=payment.stripe_payment_method_id,
            confirm=True,  # Se confirma de inmediato
            off_session=True,  # Permite cobrar sin la acción del cliente
        )

        if payment_intent['status'] == 'succeeded':
            payment.status = 'Paid'
            payment.payment_date = timezone.now()
            payment.stripe_payment_intent_id = payment_intent['id']
            payment.save()
            payment.appointment.status = 'Paid'
            payment.appointment.save()

        serializer = PaymentSerializer(payment)
        return Response({'message': 'Pago cobrado', 'payment': serializer.data}, 
                        status=status.HTTP_200_OK)
        
    except Payment.DoesNotExist:
        return Response({'error': 'Pago no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f'Error al cobrar el pago: {str(e)}')
        return Response({'error': 'Error al cobrar el pago'}, status=status.HTTP_400_BAD_REQUEST)

def process_due_payments():
    """Busca y cobra pagos que han alcanzado el deadline."""
    now = timezone.now()
    due_payments = Payment.objects.filter(
        status="Not Paid",
        appointment__start_time__lte=now + timezone.timedelta(hours=150)
    )

    for payment in due_payments:
        try:
            response = charge_payment(payment.id)  # Llama a la función de cobro
            
        except Exception as e:
            print(f"Error al procesar el pago {payment.id}: {str(e)}")

    return Response({"message": "Pagos procesados correctamente"}, status=200)

#endpoint para procesar los pagos vencidos (GitHub Actions)

@api_view(['POST'])
@permission_classes([])
def process_due_payments_api(request):
    """
    Procesa los pagos pendientes según el estado de la cita:
    
    Opción 1: Si la cita ha finalizado (now > appointment.end_time), se procesa el pago de forma inmediata.
    Opción 2: Si quedan menos de 48h para que comience la cita y la cita aún no ha finalizado,
              se crea un PaymentIntent con capture_method='manual' para retener el importe.
              (La captura final deberá realizarse cuando la cita termine).
    """
    api_key = request.headers.get("X-API-KEY")
    if api_key != settings.PAYMENT_API_KEY:
        return JsonResponse({"error": "Unauthorized"}, status=403)
    
    try:
        now = timezone.now()

        # --- Grupo 1: Citas finalizadas ---
        finished_appointments = Appointment.objects.filter(
            end_time__lt=now,
            payment__status='Not Captured'
        )
        for appointment in finished_appointments:
            payment = appointment.payment
            # Si no se ha creado el PaymentIntent, crearlo con confirmación inmediata
            if not payment.stripe_payment_intent_id:
                payment_intent = stripe.PaymentIntent.create(
                    amount=int(payment.amount * 100),  # Monto en centavos
                    currency='eur',
                    customer=appointment.patient.stripe_customer_id,
                    payment_method_types=['card'],
                    payment_method=payment.stripe_payment_method_id,
                    confirm=True,
                    off_session=True,
                )
                payment.stripe_payment_intent_id = payment_intent['id']
                payment.save()
            else:
                payment_intent = stripe.PaymentIntent.retrieve(payment.stripe_payment_intent_id)
            
            # Si el PaymentIntent aún no está cobrado, capturarlo
            if payment_intent['status'] != 'succeeded':
                captured_intent = stripe.PaymentIntent.capture(payment.stripe_payment_intent_id)
                if captured_intent['status'] == 'succeeded':
                    payment.status = 'Paid'
                    payment.payment_date = now
                    payment.save()
                    appointment.status = 'finished'
                    appointment.save()

        # --- Grupo 2: Citas próximas (en curso) ---
        upcoming_appointments = Appointment.objects.filter(
            start_time__lt=now + timezone.timedelta(hours=48),
            end_time__gt=now,
            payment__status='Not Paid'
        )
        for appointment in upcoming_appointments:
            payment = appointment.payment
            print(f"Procesando pago para cita próxima: {payment.__dict__}")
            # Si aún no se ha creado el PaymentIntent, crearlo con capture_method='manual'
            if not payment.stripe_payment_intent_id:
                payment_intent = stripe.PaymentIntent.create(
                    amount=int(payment.amount * 100),
                    currency='eur',
                    customer=appointment.patient.stripe_customer_id,
                    payment_method_types=['card'],
                    payment_method=payment.stripe_payment_method_id,
                    capture_method='manual',  # Retiene el importe sin capturarlo
                    confirm=True,
                    off_session=True,
                )
                payment.stripe_payment_intent_id = payment_intent['id']
                payment.status = 'Not Captured'
                payment.save()
            else:
                payment_intent = stripe.PaymentIntent.retrieve(payment.stripe_payment_intent_id)

            
            # Opcional: Si la cita ya finalizó, capturar el PaymentIntent manualmente.
            if now > appointment.end_time:
                captured_intent = stripe.PaymentIntent.capture(payment.stripe_payment_intent_id)
                if captured_intent['status'] == 'succeeded':
                    payment.status = 'Paid'
                    payment.payment_date = now
                    payment.save()
                    appointment.status = 'finished'
                    appointment.save()

        return HttpResponse("Payment processing completed.")
        
    except Exception as e:
        logging.error(f"Error processing payments: {str(e)}")
        return HttpResponse(f"Error processing payments")
