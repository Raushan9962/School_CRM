from django.db import models
from apps.schools.models import School, Student

class Certificate(models.Model):
    class Meta:
        db_table = 'certificates'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='certificates')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='certificates')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    issue_date = models.DateField(auto_now_add=True)
    issued_by = models.CharField(max_length=255, blank=True, null=True)
