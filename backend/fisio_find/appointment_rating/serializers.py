from rest_framework import serializers
from .models import AppointmentRating

class AppointmentRatingSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)
    service_name = serializers.SerializerMethodField()
    is_edited = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentRating
        fields = [
            'id',
            'patient',              # ID del paciente
            'patient_name',         # Nombre del paciente
            'physiotherapist',      # ID del fisio
            'appointment',          # ID de la cita
            'service_name',         # Nombre del servicio
            'score',
            'comment',
            'created_at',
            'updated_at',
            'is_edited',            # Booleano que indica si fue editado
        ]
        read_only_fields = ['patient', 'physiotherapist', 'created_at']

    def get_service_name(self, obj):
        # Se asume que el campo `service` en `Appointment` es un JSON con al menos la clave 'name'
        service = obj.appointment.service
        return service.get('type', '') if service and isinstance(service, dict) else ''

    def get_is_edited(self, obj):
        # Compara si `updated_at` es diferente de `created_at` para saber si fue editado
        return obj.updated_at and obj.updated_at != obj.created_at

    def validate_score(self, value):
        if value < 0 or value > 5 or value * 10 % 5 != 0:
            raise serializers.ValidationError("La puntuación debe estar entre 0 y 5 en incrementos de 0.5")
        return value
