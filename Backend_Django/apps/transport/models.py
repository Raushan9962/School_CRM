from django.db import models
from apps.schools.models import School

class Bus(models.Model):
    class Meta:
        db_table = 'buses'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='buses')
    bus_number = models.CharField(max_length=50)
    route = models.CharField(max_length=255, blank=True, null=True)
    driver_name = models.CharField(max_length=255, blank=True, null=True)
    driver_phone = models.CharField(max_length=20, blank=True, null=True)
    capacity = models.IntegerField(default=40)

class TransportRoute(models.Model):
    class Meta:
        db_table = 'transportroutes'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='transport_routes')
    route_name = models.CharField(max_length=255)
    bus_number = models.CharField(max_length=50)
    driver_name = models.CharField(max_length=255)
    driver_phone = models.CharField(max_length=20, blank=True, null=True)
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.route_name} ({self.bus_number})"
