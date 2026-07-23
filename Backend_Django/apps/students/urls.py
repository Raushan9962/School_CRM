from django.urls import path
from . import views

urlpatterns = [
    path('', views.StudentListCreateView.as_view(), name='student-list'),
    path('user/<int:pk>', views.StudentProfileDetailView.as_view(), name='student-full-profile'),
    path('dashboard/<int:pk>', views.StudentDashboardStatsView.as_view(), name='student-dashboard-stats'),
    path('<int:pk>', views.StudentDetailView.as_view(), name='student-detail'),
]
