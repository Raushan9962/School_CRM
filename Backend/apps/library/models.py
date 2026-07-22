from django.db import models
from django.conf import settings
from apps.schools.models import School

class Book(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='books')
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    isbn = models.CharField(max_length=100, blank=True, null=True)
    available = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.title} by {self.author}"

class LibraryTransaction(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='transactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='library_transactions')
    issued_on = models.DateField()
    due_on = models.DateField()
    status = models.CharField(max_length=50, default='Issued')
    
    def __str__(self):
        return f"{self.book.title} issued to {self.user.username}"
