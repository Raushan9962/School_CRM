from django.db import models
from django.conf import settings
from apps.schools.models import Student, School

class Parent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='parent_profiles')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='parent_app_parents')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='parent_app_parents')
    relation = models.CharField(max_length=50, blank=True, null=True, help_text="e.g., Father, Mother, Guardian")
    
    class Meta:
        unique_together = ('user', 'student')
        
    def __str__(self):
        return f"{self.user.username} - Parent of {self.student.user.username}"
