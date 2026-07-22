from django.db import models
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    
    objects = CustomUserManager()

    class Role(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
        ADMIN = "ADMIN", "Admin"
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"
        PARENT = "PARENT", "Parent"

    email = models.EmailField(unique=True)

    phone_number = models.CharField(max_length=15, blank=True)

    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True,
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
    )

    is_email_verified = models.BooleanField(default=False)
    
    school = models.ForeignKey(
        'schools.School', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='users'
    )
    
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username