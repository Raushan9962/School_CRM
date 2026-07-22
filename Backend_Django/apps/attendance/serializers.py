from rest_framework import serializers
from .models import Attendance, DailyAttendanceQR, StaffAttendance

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section = serializers.CharField(source='class_id.section', read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'

class StaffAttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='user.name', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = StaffAttendance
        fields = '__all__'

class DailyAttendanceQRSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyAttendanceQR
        fields = '__all__'
