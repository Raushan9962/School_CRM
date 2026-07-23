from django.db import models

class HostelRoom(models.Model):
    class Meta:
        db_table = 'hostelrooms'

    room_number = models.CharField(max_length=50, unique=True)
    capacity = models.PositiveIntegerField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Room {self.room_number}"
