from django.db import models
from django.conf import settings
from apps.schools.models import School

class Leave(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='leaves')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=50, default='General')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Grievance(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='grievances')
    subject = models.CharField(max_length=255)
    raised_by = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Open')
    date = models.DateField(auto_now_add=True)

class Event(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='events')
    event_name = models.CharField(max_length=255)
    event_type = models.CharField(max_length=100, default='General')
    event_date = models.DateField()
