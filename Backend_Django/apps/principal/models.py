from django.db import models
from django.conf import settings
from apps.schools.models import School

class PrincipalTask(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='principal_tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    priority = models.CharField(max_length=50, default='Medium')
    status = models.CharField(max_length=50, default='Pending')
    due_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
