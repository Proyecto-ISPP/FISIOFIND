from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    payment_deadline = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'appointment', 'amount', 'payment_method', 'status', 'payment_date', 'payment_deadline']