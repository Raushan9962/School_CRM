from django.db import models

class Inventory(models.Model):
    class Meta:
        db_table = 'inventories'

    item_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.item_name} (Qty: {self.quantity})"
