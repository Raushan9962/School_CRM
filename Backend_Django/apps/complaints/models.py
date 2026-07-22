from django.db import models
from django.conf import settings
from apps.schools.models import School

class Complaint(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='complaints')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints')
    subject = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} - {self.status}"
