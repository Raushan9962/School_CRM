from django.db import models
from apps.schools.models import School

class Notification(models.Model):
    class Meta:
        db_table = 'notifications'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    target_role = models.CharField(max_length=50, blank=True, null=True, help_text="e.g., 'Student', 'Teacher', 'All', or null for everyone")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
