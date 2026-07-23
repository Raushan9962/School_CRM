from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet, BookCategoryViewSet, LibrarySettingsView,
    DashboardStatsView, SearchMemberView, IssueBookView, ReturnBookView
)

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='librarian-book')
router.register(r'categories', BookCategoryViewSet, basename='librarian-category')

urlpatterns = [
    path('dashboard', DashboardStatsView.as_view(), name='library-stats'),
    path('settings', LibrarySettingsView.as_view(), name='library-settings'),
    path('search-member', SearchMemberView.as_view(), name='library-search-member'),
    path('issue', IssueBookView.as_view(), name='library-issue'),
    path('return', ReturnBookView.as_view(), name='library-return'),
    path('', include(router.urls)),
]

