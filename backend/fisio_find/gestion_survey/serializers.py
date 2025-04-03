from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Survey

class SurveySerializer(serializers.ModelSerializer):

    class Meta:
        model = Survey
        fields = '__all__'