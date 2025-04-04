from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    appointment_start_time = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    physiotherapist_name = serializers.SerializerMethodField() 

    class Meta:
        model = Room
        fields = [
            'code',
            'created_at',
            'physiotherapist',
            'patient',
            'appointment',
            'appointment_start_time',
            'is_test_room',
            'patient_name',
            'physiotherapist_name',
        ]

    def get_appointment_start_time(self, obj):
        if obj.appointment:
            return obj.appointment.start_time
        return None

    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            return obj.patient.user.get_full_name() or obj.patient.user.username
        return "Sin paciente"

    def get_physiotherapist_name(self, obj):
        if obj.physiotherapist and obj.physiotherapist.user:
            return obj.physiotherapist.user.get_full_name() or obj.physiotherapist.user.username
        return "Sin fisioterapeuta"