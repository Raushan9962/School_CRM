from rest_framework import serializers
from apps.academics.models import Timetable

class TimetableSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.username', read_only=True)
    
    class Meta:
        model = Timetable
        fields = '__all__'
        read_only_fields = ('school',)
