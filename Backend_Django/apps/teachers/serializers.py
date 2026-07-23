from rest_framework import serializers
from apps.schools.models import Teacher, StudentRemark, PTMMeeting
from apps.academics.models import LessonDiary

class TeacherSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Teacher
        fields = '__all__'
        read_only_fields = ('user', 'school')

class LessonDiarySerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section = serializers.CharField(source='class_id.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = LessonDiary
        fields = '__all__'
        read_only_fields = ('teacher',)

class StudentRemarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    roll_number = serializers.CharField(source='student.roll_number', read_only=True)

    class Meta:
        model = StudentRemark
        fields = '__all__'
        read_only_fields = ('teacher',)

class PTMMeetingSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    class_name = serializers.CharField(source='student.class_id.name', read_only=True)
    section = serializers.CharField(source='student.class_id.section', read_only=True)

    class Meta:
        model = PTMMeeting
        fields = '__all__'
        read_only_fields = ('teacher',)
