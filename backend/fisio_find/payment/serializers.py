from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    payment_deadline = serializers.DateTimeField(read_only=True)
    patient_name = serializers.CharField(source='appointment.patient.user.username', read_only=True)
    appointment_date = serializers.DateTimeField(source='appointment.start_time', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'appointment_id', 'patient_name', 'amount', 'status', 'payment_date', 'payment_deadline', 'appointment_date']