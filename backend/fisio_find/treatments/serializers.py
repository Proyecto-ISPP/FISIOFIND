from rest_framework import serializers

from users.serializers import PatientSerializer, PhysioSerializer
from users.models import Patient, Physiotherapist
from .models import Exercise, ExerciseLog, ExerciseSession, Session, SessionTest, SessionTestResponse, SessionTest, Treatment, Series
from django.utils import timezone

class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = ['id', 'physiotherapist', 'patient', 'start_time', 'end_time', 
                 'homework', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        if 'start_time' in data and 'end_time' in data:
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError(
                    {"end_time": "La fecha de finalización debe ser posterior a la fecha de inicio."}
                )
        elif 'start_time' in data and 'end_time' not in data and self.instance:
            if data['start_time'] >= self.instance.end_time:
                raise serializers.ValidationError(
                    {"start_time": "La fecha de inicio debe ser anterior a la fecha de finalización."}
                )
        elif 'end_time' in data and 'start_time' not in data and self.instance:
            if self.instance.start_time >= data['end_time']:
                raise serializers.ValidationError(
                    {"end_time": "La fecha de finalización debe ser posterior a la fecha de inicio."}
                )
        if 'start_time' in data:
            current_time = timezone.now()
            if data['start_time'] < current_time:
                raise serializers.ValidationError(
                    {"start_time": "La fecha de inicio no puede ser anterior a la fecha actual."}
                )
        return data
        
class TreatmentDetailSerializer(serializers.ModelSerializer):
    physiotherapist = PhysioSerializer(read_only=True)
    physiotherapist_id = serializers.PrimaryKeyRelatedField(source='physiotherapist', queryset=Physiotherapist.objects.all(), write_only=True)
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(source='patient', queryset=Patient.objects.all(), write_only=True)
    
    class Meta:
        model = Treatment
        fields = ['id', 'physiotherapist', 'physiotherapist_id', 'patient', 'patient_id', 'start_time', 'end_time', 
                 'homework', 'is_active', 'created_at', 'updated_at', 'sessions']
        read_only_fields = ['id', 'created_at', 'updated_at']
        
class ExerciseSerializer(serializers.ModelSerializer):
    physiotherapist = serializers.PrimaryKeyRelatedField(queryset=Physiotherapist.objects.all())
    class Meta:
        model = Exercise
        fields = ['id', 'title', 'description', 'area', 'physiotherapist']
        read_only_fields = ['id']
        
class ExerciseSessionSerializer(serializers.ModelSerializer):
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())
    
    class Meta:
        model = ExerciseSession
        fields = ['id', 'exercise', 'session']
        read_only_fields = ['id']

class SeriesSerializer(serializers.ModelSerializer):
    exercise_session = serializers.PrimaryKeyRelatedField(queryset=ExerciseSession.objects.all())
    
    class Meta:
        model = Series
        fields = ['id', 'exercise_session', 'series_number', 'repetitions', 'weight', 'time', 'distance']
        read_only_fields = ['id']
    
    def validate(self, data):
        if data.get('repetitions', 0) <= 0:
            raise serializers.ValidationError("El número de repeticiones debe ser mayor a cero.")
        if not any([data.get('weight'), data.get('time'), data.get('distance')]):
            raise serializers.ValidationError("Debe haber al menos una métrica (peso, tiempo o distancia).")
        return data

class SessionSerializer(serializers.ModelSerializer):
    day_of_week = serializers.ListField(
        child=serializers.ChoiceField(choices=Session.DAYS_OF_WEEK_CHOICES)
    )
    class Meta:
        model = Session
        fields = ['id', 'name', 'treatment', 'day_of_week']
        read_only_fields = ['id']
        
class ExerciseLogSerializer(serializers.ModelSerializer):
    series = serializers.PrimaryKeyRelatedField(queryset=Series.objects.all())

    class Meta:
        model = ExerciseLog
        fields = ['id', 'series', 'date', 'repetitions_done', 'weight_done', 'time_done', 'distance_done', 'notes', 'patient']
        read_only_fields = ['id', 'date', 'patient']
        
class SessionTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionTest
        fields = ['id', 'session', 'question', 'test_type', 'scale_labels']
        read_only_fields = ['id']

class SessionTestResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionTestResponse
        fields = ['id', 'test', 'patient', 'response_text', 'response_scale', 'submitted_at']
        read_only_fields = ['id', 'patient', 'submitted_at']
        
    def validate(self, data):
        test = data.get('test') or self.instance.test
        
        if not test:
            raise serializers.ValidationError("No se ha especificado un test.")
        
        test_type = test.test_type
        
        if test_type == SessionTest.TEXT:
            if not data.get('response_text'):
                raise serializers.ValidationError({"response_text": "Este campo es obligatorio para respuestas abiertas."})
            if data.get('response_scale') is not None:
                raise serializers.ValidationError({"response_scale": "No debe incluir respuesta numérica en un test de texto."})
            
        elif test_type == SessionTest.SCALE:
            scale = data.get('response_scale')
            if scale is None:
                raise serializers.ValidationError({"response_scale": "Este campo es obligatorio para respuestas de escala."})
            if data.get('response_text'):
                raise serializers.ValidationError({"response_text": "No debe incluir texto en un test de escala."})
            
            # Validar que la escala esté dentro del rango definido en scale_labels
            if test.scale_labels:
                valid_keys = list(map(int, test.scale_labels.keys()))
                if scale not in valid_keys:
                    raise serializers.ValidationError({"response_scale": f"El valor debe estar entre {min(valid_keys)} y {max(valid_keys)}."})
        
        return data
           