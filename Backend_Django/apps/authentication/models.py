from django.db import models
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta:
        db_table = 'users'

    
    objects = CustomUserManager()

    class Role(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
        ADMIN = "ADMIN", "Admin"
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"
        PARENT = "PARENT", "Parent"

    email = models.EmailField(unique=True)

    phone_number = models.CharField(max_length=15, blank=True, db_column='phone')

    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True,
        db_column='image'
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
        db_column='role_name'
    )

    is_email_verified = models.BooleanField(default=False)
    
    school = models.ForeignKey(
        'schools.School', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='users',
        db_column='school_id'
    )
    
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    def check_password(self, raw_password):
        if self.password and (self.password.startswith('$2b$') or self.password.startswith('$2a$')):
            import bcrypt
            return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))
        return super().check_password(raw_password)

    def set_password(self, raw_password):
        if raw_password:
            import bcrypt
            self.password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('ascii')
        else:
            self.set_unusable_password()

class ProfileUpdateRequest(models.Model):
    class Meta:
        db_table = 'profile_update_requests'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile_update_requests')
    requested_changes = models.JSONField(help_text="JSON representation of the requested changes")
    status = models.CharField(max_length=20, default='Pending')
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Update request by {self.user.username} - {self.status}"