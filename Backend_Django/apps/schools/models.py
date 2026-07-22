from django.db import models
from django.conf import settings

class School(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Subscription fields
    billing_cycle = models.CharField(max_length=20, choices=(('Monthly', 'Monthly'), ('Yearly', 'Yearly')), default='Monthly')
    is_active = models.BooleanField(default=True)
    subscription_status = models.CharField(max_length=50, default='Active')
    subscription_start_date = models.DateField(blank=True, null=True)
    subscription_end_date = models.DateField(blank=True, null=True)
    
    plan = models.ForeignKey('superadmin.SubscriptionPlan', on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='students')
    class_id = models.ForeignKey('academics.Class', on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    section = models.CharField(max_length=20, blank=True, null=True)
    roll_number = models.CharField(max_length=50, blank=True, null=True)
    admission_no = models.CharField(max_length=50, unique=True, blank=True, null=True)
    father_name = models.CharField(max_length=255, blank=True, null=True)
    mother_name = models.CharField(max_length=255, blank=True, null=True)
    parent_phone = models.CharField(max_length=20, blank=True, null=True)
    parent_email = models.EmailField(blank=True, null=True)
    guardian_name = models.CharField(max_length=255, blank=True, null=True)
    religion = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    parent_occupation = models.CharField(max_length=255, blank=True, null=True)
    parent_income = models.CharField(max_length=100, blank=True, null=True)
    board = models.CharField(max_length=100, blank=True, null=True)
    medical_allergies = models.TextField(blank=True, null=True)
    medical_disabilities = models.TextField(blank=True, null=True)
    medical_doctor_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)
    transport_required = models.BooleanField(default=False)
    transport_route_id = models.CharField(max_length=100, blank=True, null=True)
    transport_stop = models.CharField(max_length=255, blank=True, null=True)
    transport_pass_number = models.CharField(max_length=100, blank=True, null=True)
    hostel_block = models.CharField(max_length=100, blank=True, null=True)
    hostel_room = models.CharField(max_length=50, blank=True, null=True)
    hostel_bed = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.admission_no}"

class Teacher(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teacher_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='teachers')
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    subject = models.CharField(max_length=100, blank=True, null=True)
    experience = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username} ({self.employee_id})"


class DisciplineLog(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='discipline_logs')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    incident_type = models.CharField(max_length=100)
    description = models.TextField()
    incident_date = models.DateField()
    action_taken = models.CharField(max_length=255, default='Pending')

class AdmissionRequest(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='admission_requests')
    student_name = models.CharField(max_length=255)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True)
    blood_group = models.CharField(max_length=10, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    aadhaar_number = models.CharField(max_length=50, blank=True, null=True)
    father_name = models.CharField(max_length=255, blank=True, null=True)
    mother_name = models.CharField(max_length=255, blank=True, null=True)
    guardian_name = models.CharField(max_length=255, blank=True, null=True)
    parent_occupation = models.CharField(max_length=255, blank=True, null=True)
    parent_income = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    alternate_phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    class_applied_for = models.ForeignKey('academics.Class', on_delete=models.SET_NULL, null=True, blank=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=20, blank=True, null=True)
    previous_school = models.CharField(max_length=255, blank=True, null=True)
    board = models.CharField(max_length=100, blank=True, null=True)
    religion = models.CharField(max_length=100, blank=True, null=True)
    medical_allergies = models.TextField(blank=True, null=True)
    medical_disabilities = models.TextField(blank=True, null=True)
    medical_doctor_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)
    transport_required = models.BooleanField(default=False)
    transport_route_id = models.CharField(max_length=100, blank=True, null=True)
    transport_stop = models.CharField(max_length=255, blank=True, null=True)
    transport_pass_number = models.CharField(max_length=100, blank=True, null=True)
    hostel_required = models.BooleanField(default=False)
    hostel_block = models.CharField(max_length=100, blank=True, null=True)
    hostel_room = models.CharField(max_length=50, blank=True, null=True)
    hostel_bed = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, default='Pending') # Pending, Approved, Rejected, Paid
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Admission Request: {self.student_name}"

class Parent(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='parent_profile')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='parents')
    relation = models.CharField(max_length=50, default='Father')
    
    def __str__(self):
        return f"{self.user.username} ({self.relation} of {self.student.user.username})"
