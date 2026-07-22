from rest_framework import serializers
from .models import PrincipalTask

class PrincipalTaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assigned_to.name', read_only=True)
    assignee_role = serializers.CharField(source='assigned_to.role', read_only=True)
    
    class Meta:
        model = PrincipalTask
        fields = '__all__'
        read_only_fields = ('school',)
