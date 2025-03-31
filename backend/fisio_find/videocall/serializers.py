from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    appointment_start_time = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'code',
            'created_at',
            'physiotherapist',
            'patient',
            'appointment',
            'appointment_start_time',
        ]

    def get_appointment_start_time(self, obj):
        if obj.appointment:
            return obj.appointment.start_time
        return None
