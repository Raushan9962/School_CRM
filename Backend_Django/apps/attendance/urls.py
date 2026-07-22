from django.urls import path
from . import views

urlpatterns = [
    path('generate-qr/', views.GenerateDailyQRView.as_view(), name='generate-qr'),
    path('scan-qr/', views.ScanAttendanceQRView.as_view(), name='scan-qr'),
    path('student/<int:student_id>/', views.StudentAttendanceListView.as_view(), name='student-attendance-list'),
    path('', views.AttendanceListCreateView.as_view(), name='attendance-list'),
    path('<int:pk>/', views.AttendanceDetailView.as_view(), name='attendance-detail'),
]
