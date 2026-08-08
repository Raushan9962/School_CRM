from rest_framework import serializers
from .models import PrincipalTask

class PrincipalTaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assigned_to', read_only=True)
    
    class Meta:
        model = PrincipalTask
        fields = '__all__'
        read_only_fields = ('school',)
