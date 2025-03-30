from rest_framework import serializers
from appointment.models import Appointment, StatusChoices
from users.models import AppUser, Patient, Physiotherapist

class AppointmentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True) 
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    is_online = serializers.BooleanField()
    service = serializers.JSONField()
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())  # Removed write_only=True
    physiotherapist = serializers.PrimaryKeyRelatedField(queryset=Physiotherapist.objects.all(), write_only=True)
    
    # En salida (GET): devuelves el nombre del paciente y del fisio
    patient_name = serializers.SerializerMethodField(read_only=True)
    physiotherapist_name = serializers.SerializerMethodField(read_only=True)

    status = serializers.ChoiceField(
        choices = StatusChoices.choices,
        default='booked'
    )
    alternatives = serializers.JSONField()
    class Meta:
        model = Appointment
        fields = ['id', 'start_time', 'end_time', 'is_online', 'service', 'patient', 'patient_name', 'physiotherapist', 'physiotherapist_name', 'status', 'alternatives']
        
    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            return f"{obj.patient.user.first_name} {obj.patient.user.last_name}".strip() or obj.patient.user.username
        return None

    def get_physiotherapist_name(self, obj):
        if obj.physiotherapist and obj.physiotherapist.user:
            return f"{obj.physiotherapist.user.first_name} {obj.physiotherapist.user.last_name}".strip() or obj.physiotherapist.user.username
        return None
    
    def validate(self, data):
        """
        Validate the data before creating or updating an `Appointment` instance.
        """
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        physiotherapist = data.get('physiotherapist')
        patient = data.get('patient')


        # verify that the appointment starts and ends on the same day
        if start_time.date() != end_time.date():
            raise serializers.ValidationError("The appointment must end the same day it starts.")
        
        # verify that the start time is before the end time
        if start_time.time() >= end_time.time():
            raise serializers.ValidationError("End time must be after start time.")

        # verify that the physiotherapist is available
        overlapping_appointments_physio = Appointment.objects.filter(
            physiotherapist=physiotherapist,
            status__in=['booked', 'confirmed'],  
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(id=self.instance.id if self.instance else None)

        #verify that the patient is available
        overlapping_appointments_patient = Appointment.objects.filter(
            patient=patient,
            status__in=['booked', 'confirmed'],  
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(id=self.instance.id if self.instance else None)

        if overlapping_appointments_physio.exists():
            raise serializers.ValidationError("The physiotherapist is already booked at this time.")
        if overlapping_appointments_patient.exists():
            raise serializers.ValidationError("The patient is already booked at this time.")

        return data

    def create(self, validated_data):
        """
        Create and return a new `Appointment` instance, given the validated data.
        """
        return Appointment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Appointment` instance, given the validated data.
        """
        # Manejar el caso en que solo se envía el ID y no el objeto completo
        if "patient" in validated_data:
            validated_data["patient_id"] = validated_data["patient"]  # Es un ID, no un objeto

        if "physiotherapist" in validated_data:
            validated_data["physiotherapist_id"] = validated_data["physiotherapist"]  # También es un ID

        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.is_online = validated_data.get('is_online', instance.is_online)
        instance.service = validated_data.get('service', instance.service)
        instance.patient_id = validated_data.get('patient_id', instance.patient_id)
        instance.physiotherapist_id = validated_data.get('physiotherapist_id', instance.physiotherapist_id)
        instance.status = validated_data.get('status', instance.status)
        instance.alternatives = validated_data.get('alternatives', instance.alternatives)
        instance.save()
        return instance
