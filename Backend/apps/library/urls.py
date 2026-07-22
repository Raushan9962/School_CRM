from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.BookListCreateView.as_view(), name='book-list'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('issue/', views.IssueBookView.as_view(), name='issue-book'),
    path('user/<int:user_id>/', views.UserTransactionsView.as_view(), name='user-transactions'),
]
