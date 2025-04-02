from rest_framework import serializers
from .models import Rating
from users.models import Physiotherapist, Patient


class PhysiotherapistDetailSerializer(serializers.ModelSerializer):
    """Simplified serializer for physiotherapist details in ratings"""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Physiotherapist
        fields = ['id', 'full_name', 'profile_picture']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class PatientDetailSerializer(serializers.ModelSerializer):
    """Simplified serializer for patient details in ratings"""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ['id', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class RatingSerializer(serializers.ModelSerializer):
    physiotherapist_details = PhysiotherapistDetailSerializer(source='physiotherapist', read_only=True)
    patient_details = PatientDetailSerializer(source='patient', read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'physiotherapist', 'patient', 'punctuation', 'opinion', 'date',
                  'physiotherapist_details', 'patient_details']
        read_only_fields = ['id', 'date', 'physiotherapist_details', 'patient_details']
