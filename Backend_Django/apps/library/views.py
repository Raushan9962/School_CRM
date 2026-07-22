from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Book, LibraryTransaction
from .serializers import BookSerializer, LibraryTransactionSerializer
from apps.accounts.models import User

class BookListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookSerializer
    
    def get_queryset(self):
        return Book.objects.filter(school=self.request.user.school)
        
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookSerializer
    
    def get_queryset(self):
        return Book.objects.filter(school=self.request.user.school)

class UserTransactionsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LibraryTransactionSerializer
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return LibraryTransaction.objects.filter(user_id=user_id, book__school=self.request.user.school).order_by('-issued_on')

class IssueBookView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        user_id = request.data.get('user_id')
        issued_on = request.data.get('issued_on')
        due_on = request.data.get('due_on')
        
        if not all([book_id, user_id, issued_on, due_on]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            with transaction.atomic():
                book = Book.objects.select_for_update().get(id=book_id, school=request.user.school)
                
                if book.available <= 0:
                    return Response({"error": "Book is not available"}, status=status.HTTP_400_BAD_REQUEST)
                    
                target_user = get_object_or_404(User, id=user_id)
                
                txn = LibraryTransaction.objects.create(
                    book=book,
                    user=target_user,
                    issued_on=issued_on,
                    due_on=due_on,
                    status='Issued'
                )
                
                book.available -= 1
                book.save()
                
                serializer = LibraryTransactionSerializer(txn)
                return Response({
                    "message": "Book issued successfully",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)
                
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Error issuing book", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
