from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'physiotherapist', 'patient', 'punctuation', 'opinion', 'date']
        read_only_fields = ['id', 'date']