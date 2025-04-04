from rest_framework import serializers
from .models import AppointmentRating

class AppointmentRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentRating
        fields = ['id', 'patient', 'physiotherapist', 'appointment', 'score', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['patient', 'physiotherapist', 'created_at']

    def validate_score(self, value):
        # Asegura que la puntuación es múltiplo de 0.5 y está entre 0 y 5
        if value < 0 or value > 5 or value * 10 % 5 != 0:
            raise serializers.ValidationError("La puntuación debe estar entre 0 y 5 en incrementos de 0.5")
        return value
