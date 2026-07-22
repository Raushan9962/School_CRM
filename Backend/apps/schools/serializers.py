from rest_framework import serializers
from .models import School, Class, Student, Teacher, Subject, Timetable, SyllabusTracking, Exam, Result, DisciplineLog, Leave, PrincipalTask, Grievance, Event, AdmissionRequest, Parent
from apps.accounts.models import User

class SchoolSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = School
        fields = '__all__'
        read_only_fields = ('plan', 'subscription_start_date', 'subscription_end_date', 'subscription_status')

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'
        read_only_fields = ('school',)

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

class SubjectSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section = serializers.CharField(source='class_id.section', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.name', read_only=True)
    
    class Meta:
        model = Subject
        fields = '__all__'
        read_only_fields = ('school',)

class TimetableSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section = serializers.CharField(source='class_id.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.name', read_only=True)
    
    class Meta:
        model = Timetable
        fields = '__all__'
        read_only_fields = ('school',)

class SyllabusTrackingSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section = serializers.CharField(source='class_id.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.name', read_only=True)
    
    class Meta:
        model = SyllabusTracking
        fields = '__all__'
        read_only_fields = ('school',)

class ExamSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section = serializers.CharField(source='class_id.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ('school',)

class ResultSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    subject_name = serializers.CharField(source='exam.subject.name', read_only=True)
    total_marks = serializers.IntegerField(source='exam.total_marks', read_only=True)
    
    class Meta:
        model = Result
        fields = '__all__'


class DisciplineLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    class_name = serializers.CharField(source='student.class_id.name', read_only=True)
    section = serializers.CharField(source='student.class_id.section', read_only=True)
    reporter_name = serializers.CharField(source='reported_by.name', read_only=True)
    
    class Meta:
        model = DisciplineLog
        fields = '__all__'
        read_only_fields = ('school', 'reported_by')

class LeaveSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    role_name = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ('school', 'user')

class PrincipalTaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assigned_to.name', read_only=True)
    assignee_role = serializers.CharField(source='assigned_to.role', read_only=True)
    
    class Meta:
        model = PrincipalTask
        fields = '__all__'
        read_only_fields = ('school',)

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
