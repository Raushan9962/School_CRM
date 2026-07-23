from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Book, LibraryTransaction, BookCategory, LibrarySettings
from .serializers import (
    BookSerializer, LibraryTransactionSerializer, BookCategorySerializer, LibrarySettingsSerializer
)
from apps.schools.views import SchoolBaseView

class BookCategoryViewSet(SchoolBaseView, viewsets.ModelViewSet):
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class BookViewSet(SchoolBaseView, viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    def perform_create(self, serializer):
        # By default, available matches quantity if not specified, 
        # handled simply by initializing in serializer or model default.
        quantity = serializer.validated_data.get('quantity', 1)
        serializer.save(school=self.request.user.school, available=quantity)
        
    def perform_update(self, serializer):
        serializer.save()

class LibrarySettingsView(SchoolBaseView, APIView):
    def get(self, request):
        settings_obj, created = LibrarySettings.objects.get_or_create(school=request.user.school)
        serializer = LibrarySettingsSerializer(settings_obj)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        settings_obj, created = LibrarySettings.objects.get_or_create(school=request.user.school)
        serializer = LibrarySettingsSerializer(settings_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Settings updated successfully', 'data': serializer.data})
        return Response({'success': False, 'message': 'Failed to update settings', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DashboardStatsView(SchoolBaseView, APIView):
    def get(self, request):
        school = request.user.school
        
        total_books = Book.objects.filter(school=school).count()
        issued_books = LibraryTransaction.objects.filter(book__school=school, status='Issued').count()
        overdue_books = LibraryTransaction.objects.filter(book__school=school, status='Issued', due_on__lt=timezone.now().date()).count()
        due_today = LibraryTransaction.objects.filter(book__school=school, status='Issued', due_on=timezone.now().date()).count()
        
        available_books = total_books - issued_books
        
        fines_res = LibraryTransaction.objects.filter(book__school=school, status='Returned').aggregate(total_fines=Sum('fine'))
        fines_collected = fines_res['total_fines'] or 0.00
        
        return Response({
            'success': True,
            'stats': {
                'totalBooks': total_books,
                'availableBooks': available_books,
                'issuedBooks': issued_books,
                'overdueBooks': overdue_books,
                'dueToday': due_today,
                'finesCollected': fines_collected,
                'newBooksAdded': 0,
                'activeMembers': 0
            }
        })


class SearchMemberView(SchoolBaseView, APIView):
    def get(self, request):
        query = request.query_params.get('query')
        if not query:
            return Response({'success': False, 'message': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Simple search across username, email, etc.
        # In a real app we'd query Student or Teacher profiles explicitly, but sticking to user for simplicity
        user = User.objects.filter(Q(username__icontains=query) | Q(email__icontains=query), school=request.user.school).first()
        
        if not user:
            return Response({'success': False, 'message': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)
            
        active_issues = LibraryTransaction.objects.filter(user=user, status='Issued')
        issues_data = LibraryTransactionSerializer(active_issues, many=True).data
        
        settings_obj, _ = LibrarySettings.objects.get_or_create(school=request.user.school)
        fine_per_day = settings_obj.fine_per_day
        
        pending_fine = 0
        today = timezone.now().date()
        for issue in active_issues:
            if today > issue.due_on:
                diff = (today - issue.due_on).days
                pending_fine += (diff * float(fine_per_day))
                
        member_data = {
            'user_id': user.id,
            'name': user.username,
            'email': user.email,
            'role': user.role,
            'activeIssues': issues_data,
            'pendingFine': pending_fine
        }
        
        return Response({'success': True, 'data': member_data})


class IssueBookView(SchoolBaseView, APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        barcode = request.data.get('barcode')
        
        if not user_id or not barcode:
            return Response({'success': False, 'message': 'User ID and Book Barcode are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        book = Book.objects.filter(barcode=barcode, school=request.user.school).first()
        if not book:
            return Response({'success': False, 'message': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if book.available <= 0 or book.status != 'Available':
            return Response({'success': False, 'message': 'Book is currently not available for issue'}, status=status.HTTP_400_BAD_REQUEST)
            
        from django.contrib.auth import get_user_model
        User = get_user_model()
        target_user = User.objects.filter(id=user_id).first()
        if not target_user:
            return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        settings_obj, _ = LibrarySettings.objects.get_or_create(school=request.user.school)
        
        is_student = (target_user.role == 'student')
        max_books = settings_obj.max_books_student if is_student else settings_obj.max_books_teacher
        issue_days = settings_obj.issue_duration_student if is_student else settings_obj.issue_duration_teacher
        
        active_issues_count = LibraryTransaction.objects.filter(user=target_user, status='Issued').count()
        if active_issues_count >= max_books:
            return Response({'success': False, 'message': f'User has reached maximum limit of {max_books} issued books'}, status=status.HTTP_400_BAD_REQUEST)
            
        due_date = timezone.now().date() + timedelta(days=issue_days)
        
        trans = LibraryTransaction.objects.create(
            book=book,
            user=target_user,
            due_on=due_date,
            status='Issued'
        )
        
        book.available -= 1
        if book.available == 0:
            book.status = 'Issued'
        book.save()
        
        return Response({
            'success': True,
            'message': 'Book issued successfully',
            'data': LibraryTransactionSerializer(trans).data,
            'dueDate': str(due_date)
        })


class ReturnBookView(SchoolBaseView, APIView):
    def post(self, request):
        transaction_id = request.data.get('transaction_id')
        remarks = request.data.get('remarks', '')
        condition = request.data.get('condition', 'Good')
        
        if not transaction_id:
            return Response({'success': False, 'message': 'Transaction ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        trans = LibraryTransaction.objects.filter(id=transaction_id, status='Issued').first()
        if not trans:
            return Response({'success': False, 'message': 'Active transaction not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if trans.book.school != request.user.school:
            return Response({'success': False, 'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            
        settings_obj, _ = LibrarySettings.objects.get_or_create(school=request.user.school)
        fine_per_day = settings_obj.fine_per_day
        
        fine = 0
        today = timezone.now().date()
        if today > trans.due_on:
            diff_days = (today - trans.due_on).days
            fine = diff_days * float(fine_per_day)
            
        trans.status = 'Returned'
        trans.returned_on = today
        trans.fine = fine
        trans.remarks = remarks
        trans.condition_on_return = condition
        trans.save()
        
        book = trans.book
        book.available += 1
        if condition in ['Lost', 'Damaged']:
            book.status = condition
        else:
            book.status = 'Available'
        book.save()
        
        return Response({
            'success': True,
            'message': 'Book returned successfully',
            'fine': fine
        })
