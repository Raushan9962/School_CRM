from django.db import models
from apps.schools.models import School

class Bus(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='buses')
    bus_number = models.CharField(max_length=50)
    route = models.CharField(max_length=255, blank=True, null=True)
    driver_name = models.CharField(max_length=255, blank=True, null=True)
    driver_phone = models.CharField(max_length=20, blank=True, null=True)
    capacity = models.IntegerField(default=40)
