from rest_framework import serializers
from apps.academics.models import Subject

class SubjectSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.username', read_only=True)
    
    class Meta:
        model = Subject
        fields = '__all__'
        read_only_fields = ('school',)
