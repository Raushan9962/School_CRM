from rest_framework import serializers
from .models import Book, LibraryTransaction, BookCategory, LibrarySettings

class LibrarySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibrarySettings
        fields = '__all__'
        read_only_fields = ('school',)

class BookCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCategory
        fields = '__all__'
        read_only_fields = ('school',)

class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('school',)

class LibraryTransactionSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_barcode = serializers.CharField(source='book.barcode', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = LibraryTransaction
        fields = '__all__'

