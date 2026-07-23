import django.utils.timezone
from django.db import models
from django.conf import settings
from apps.schools.models import School

class LibrarySettings(models.Model):
    class Meta:
        db_table = 'librarysettingses'

    school = models.OneToOneField(School, on_delete=models.CASCADE, related_name='library_settings')
    max_books_student = models.IntegerField(default=2)
    max_books_teacher = models.IntegerField(default=5)
    issue_duration_student = models.IntegerField(default=7)
    issue_duration_teacher = models.IntegerField(default=30)
    fine_per_day = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    updated_at = models.DateTimeField(auto_now=True)

class BookCategory(models.Model):
    class Meta:
        db_table = 'bookcategories'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='book_categories')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='books')
    category = models.ForeignKey(BookCategory, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    isbn = models.CharField(max_length=100, blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    rack_location = models.CharField(max_length=100, blank=True, null=True)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    edition = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    purchase_date = models.DateField(blank=True, null=True)
    vendor_details = models.TextField(blank=True, null=True)
    cover_image = models.URLField(blank=True, null=True) # Assuming URL for now, could be FileField
    quantity = models.IntegerField(default=1)
    available = models.IntegerField(default=1)
    status = models.CharField(max_length=50, default='Available')
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    
    class Meta:
        unique_together = ('school', 'barcode')

    def __str__(self):
        return f"{self.title} by {self.author}"

class LibraryTransaction(models.Model):
    class Meta:
        db_table = 'librarytransactions'

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='transactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='library_transactions')
    issued_on = models.DateField(auto_now_add=True)
    due_on = models.DateField()
    returned_on = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, default='Issued')
    fine = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    remarks = models.TextField(blank=True, null=True)
    condition_on_return = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"{self.book.title} issued to {self.user.username}"
