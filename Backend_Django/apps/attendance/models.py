from django.db import models
from django.conf import settings
from apps.schools.models import Student, School
from apps.academics.models import Class

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance')
    class_id = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    status = models.CharField(max_length=20, default='Present')
    remarks = models.TextField(blank=True, null=True)

class DailyAttendanceQR(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    date = models.DateField()
    token = models.CharField(max_length=255)
    
    class Meta:
        unique_together = ('school', 'date')

class StaffAttendance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='staff_attendance')
    date = models.DateField()
    status = models.CharField(max_length=20, default='Present')
    remarks = models.TextField(blank=True, null=True)
