from rest_framework import serializers
from .models import School, Student, Teacher, DisciplineLog, AdmissionRequest, Parent
from apps.accounts.models import User

class SchoolSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = School
        fields = '__all__'
        read_only_fields = ('plan', 'subscription_start_date', 'subscription_end_date', 'subscription_status')

class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section_name = serializers.CharField(source='class_id.section', read_only=True)
    
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('user', 'school')

class TeacherSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Teacher
        fields = '__all__'
        read_only_fields = ('user', 'school')

class DisciplineLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    class_name = serializers.CharField(source='student.class_id.name', read_only=True)
    section = serializers.CharField(source='student.class_id.section', read_only=True)
    reporter_name = serializers.CharField(source='reported_by.name', read_only=True)
    
    class Meta:
        model = DisciplineLog
        fields = '__all__'
        read_only_fields = ('school', 'reported_by')

class AdmissionRequestSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_applied_for.name', read_only=True)
    
    class Meta:
        model = AdmissionRequest
        fields = '__all__'
        read_only_fields = ('school', 'status')

class ParentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone_number', read_only=True)
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    
    class Meta:
        model = Parent
        fields = '__all__'
        read_only_fields = ('user', 'student')
