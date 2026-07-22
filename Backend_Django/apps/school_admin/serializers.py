from rest_framework import serializers
from .models import Leave, Grievance, Event

class LeaveSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    role_name = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ('school', 'user')

class GrievanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grievance
        fields = '__all__'
        read_only_fields = ('school',)

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('school',)
