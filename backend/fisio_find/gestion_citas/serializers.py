from rest_framework import serializers
from gestion_citas.models import Appointment, StatusChoices
from gestion_usuarios.models import AppUser

class AppointmentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True) 
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    is_online = serializers.BooleanField()
    service = serializers.JSONField()
    patient = serializers.PrimaryKeyRelatedField(queryset=AppUser.objects.all())
    physiotherapist = serializers.PrimaryKeyRelatedField(queryset=AppUser.objects.all())
    status = serializers.ChoiceField(
        choices = StatusChoices.choices,
        default='booked'
    )
    class Meta:
        model = Appointment
        fields = ['id', 'start_time', 'end_time', 'is_online', 'service', 'patient', 'physiotherapist', 'status']
        
    def validate(self, data):
        """
        Validate the data before creating or updating an `Appointment` instance.
        """
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        physiotherapist = data.get('physiotherapist')

        # verify that the appointment starts and ends on the same day
        if start_time.date() != end_time.date():
            raise serializers.ValidationError("The appointment must end the same day it starts.")
        
        # verify that the start time is before the end time
        if start_time.time() >= end_time.time():
            raise serializers.ValidationError("End time must be after start time.")

        # verify that the physiotherapist is available
        overlapping_appointments = Appointment.objects.filter(
            physiotherapist=physiotherapist,
            status__in=['booked', 'confirmed'],  
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(id=self.instance.id if self.instance else None)

        if overlapping_appointments.exists():
            raise serializers.ValidationError("The physiotherapist is already booked at this time.")

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
        if not "patient_id" in validated_data:
            validated_data["patient_id"] = validated_data["patient"].id
        
        if not "physiotherapist_id" in validated_data:
            validated_data["physiotherapist_id"] = validated_data["physiotherapist"].id   

        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.is_online = validated_data.get('is_online', instance.is_online)
        instance.service = validated_data.get('service', instance.service)
        instance.patient_id = validated_data.get('patient_id', instance.patient_id)
        instance.physiotherapist_id = validated_data.get('physiotherapist_id', instance.physiotherapist_id)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance