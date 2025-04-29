from rest_framework import serializers
from .models import Terms


class TermsSerializer(serializers.ModelSerializer):
    tag_display = serializers.CharField(source='get_tag_display', read_only=True)

    class Meta:
        model = Terms
        fields = ['id', 'content', 'version', 'tag', 'tag_display', 'created_at', 'updated_at', 'modifier']
        read_only_fields = ['created_at', 'updated_at']