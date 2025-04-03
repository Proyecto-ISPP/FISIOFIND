from rest_framework import serializers
from .models import Rating
from users.models import Physiotherapist, Patient


class PhysiotherapistDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Physiotherapist
        fields = ['id', 'full_name', 'profile_picture']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"



class RatingSerializer(serializers.ModelSerializer):
    physiotherapist_details = PhysiotherapistDetailSerializer(source='physiotherapist', read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'physiotherapist', 'punctuation', 'opinion', 'date',
                  'physiotherapist_details']
        read_only_fields = ['id', 'date', 'physiotherapist_details']

    def validate_punctuation(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Punctuation must be between 1 and 5.")
        return value

    def validate_opinion(self, value):
        if not value.strip():
            raise serializers.ValidationError("Opinion cannot be empty.")
        return value
