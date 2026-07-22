from django.db import models

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    max_students = models.IntegerField(blank=True, null=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2)
    yearly_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name

class Transaction(models.Model):
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, related_name='crm_transactions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, default='Monthly')
    status = models.CharField(max_length=50, default='Pending') # Pending, Paid, Pending Verification
    payment_method = models.CharField(max_length=100)
    payment_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    invoice_no = models.CharField(max_length=100, unique=True)
    receipt_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"CRM Payment {self.invoice_no} for {self.school.name}"

class PlatformSetting(models.Model):
    setting_key = models.CharField(max_length=100, unique=True)
    setting_value = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.setting_key
