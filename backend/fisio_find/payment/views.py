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
from .utils.pdf_generator import PaymentPhysioInvoicePDF, generate_invoice_pdf
from django.http import HttpResponse, JsonResponse
from django.db.models import Sum
import logging
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.http import FileResponse


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


def cancel_payment_patient(payment_id):
    """Cancel an appointment and handle refund if applicable."""
    try:
        payment = Payment.objects.get(id=payment_id)

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
    

def cancel_payment_pyshio(appointment_id):
    """Cancel an appointment and handle refund if applicable."""
    try:

        payment = Payment.objects.get(appointment_id=appointment_id)

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
    try:
        if not hasattr(request.user, 'physio'):
            return Response({"error": "Usuario no es fisioterapeuta"}, status=status.HTTP_403_FORBIDDEN)

        physiotherapist = request.user.physio
        my_appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
        my_payments = Payment.objects.filter(appointment__in=my_appointments)

        today = timezone.now()

        not_paid_payments = [
            payment for payment in my_payments
            if payment.status == 'Not Paid'
        ]
        paid_payments = [
            payment for payment in my_payments
            if payment.status == 'Paid'
        ]
        redeemed_payments = [
            payment for payment in my_payments
            if payment.status == 'Redeemed' or payment.status == 'Completed'
        ]

        monthly_stats = []
        for i in range(12):
            target_date = today - relativedelta(months=i)
            month = target_date.strftime("%Y-%m")
            month_earnings = my_payments.filter(
                status__in=['Redeemed', 'Completed'],
                payment_date__month=target_date.month,
                payment_date__year=target_date.year
            ).aggregate(total_earnings=Sum('amount'))['total_earnings'] or 0
            month_appointments = my_appointments.filter(
                start_time__month=target_date.month,
                start_time__year=target_date.year
            ).count()
            monthly_stats.append({
                "month": month,
                "total_earnings": float(month_earnings),
                "appointment_count": month_appointments
            })
        monthly_stats = monthly_stats[::-1]

        total_earned = sum(payment.amount for payment in redeemed_payments)
        total_pending = sum(payment.amount for payment in not_paid_payments) + sum(payment.amount for payment in paid_payments)
        total_appointments = my_appointments.count()
        payment_rate = total_earned / (total_earned + total_pending) if (total_earned + total_pending) > 0 else 0

        response_data = {
            "not_paid_payments": PaymentSerializer(not_paid_payments, many=True).data,
            "paid_payments": PaymentSerializer(paid_payments, many=True).data,
            "redeemed_payments": PaymentSerializer(redeemed_payments, many=True).data,
            "monthly_stats": monthly_stats,
            "overall_stats": {
                "total_earned": float(total_earned),
                "total_pending": float(total_pending),
                "total_appointments": total_appointments,
                "payment_rate": payment_rate
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logging.error("An error occurred: %s", str(e), exc_info=True)
        return Response({"error": "An internal error has occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def redeem_physio_payments(request):
    try:
        if not hasattr(request.user, 'physio'):
            return Response({"error": "Usuario no es fisioterapeuta"}, status=status.HTTP_403_FORBIDDEN)

        physiotherapist = request.user.physio
        my_appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
        paid_payments = Payment.objects.filter(appointment__in=my_appointments, status='Paid')

        if not paid_payments.exists():
            return Response({"message": "No hay pagos pendientes de reclamar"}, status=status.HTTP200_OK)

        # Cambiar estado a "Redeemed"
        updated_count = paid_payments.update(status='Redeemed', payment_date=timezone.now())
        
        # Generar factura
        total_amount = paid_payments.aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "message": f"{updated_count} pagos reclamados exitosamente",
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def collect_payments(request):
    try:
        if not hasattr(request.user, 'physio'):
            return Response({"error": "Usuario no es fisioterapeuta"}, status=status.HTTP_403_FORBIDDEN)

        physiotherapist = request.user.physio
        my_appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
        
        # Verificar si ya existen pagos Redeemed
        redeemed_payments = Payment.objects.filter(
            appointment__in=my_appointments,
            status='Redeemed'
        )
        if redeemed_payments.exists():
            return Response({
                "error": "No se pueden reclamar pagos porque ya existen pagos redimidos"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Obtener pagos en estado Paid
        paid_payments = Payment.objects.filter(
            appointment__in=my_appointments,
            status='Paid'
        )
        
        if not paid_payments.exists():
            return Response({
                "message": "No hay pagos pendientes de reclamar"
            }, status=status.HTTP_200_OK)

        # Obtener IBAN del request
        iban = request.data.get('iban')
        if not iban:
            return Response({
                "error": "Se requiere un IBAN para procesar el cobro"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Generar invoice_number basado en los IDs de los pagos
        payment_ids = [str(payment.id) for payment in paid_payments]
        invoice_number = f"{timezone.now().strftime('%Y')}-{'-'.join(payment_ids)}"

        # Generar PDF usando la clase PaymentPhysioInvoicePDF
        pdf_generator = PaymentPhysioInvoicePDF(
            physiotherapist=physiotherapist, 
            iban=iban,
            paid_payments=paid_payments,
            invoice_number=invoice_number
        )
        buffer = pdf_generator.generate_pdf()

        # Actualizar todos los pagos a Redeemed
        updated_count = paid_payments.update(
            status='Redeemed',
            payment_date=timezone.now()
        )

        # Devolver respuesta con el PDF
        response = FileResponse(
            buffer,
            as_attachment=True,
            filename=f"factura_pagos_{invoice_number}.pdf"
        )
        
        response['X-Message'] = f"{updated_count} pagos reclamados exitosamente"
        
        return response

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#generar un SetupIntent para almacenar el método de pago sin cobrarlo de inmediato
def create_payment_setup(appointment_id, amount, user):
    """Crea un SetupIntent para almacenar el método de pago sin cobrarlo de inmediato."""
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        
        # --- NUEVO: Crear o recuperar el Customer en Stripe ---
        patient = user.patient
        if not patient.stripe_customer_id:
            # Se crea el Customer en Stripe con el email del usuario
            customer = stripe.Customer.create(
                email=user.email,
                name=f"{user.first_name} {user.last_name}"
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
        return {'payment': serializer.data,
                'client_secret': setup_intent['client_secret']}  # Se envía al frontend para confirmar el SetupIntent

    except Appointment.DoesNotExist:
        return Response({'error': 'Cita no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.error(f'Error al procesar el pago: {str(e)}')
        appointment.delete()  # Eliminar la cita si ocurre un error
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
