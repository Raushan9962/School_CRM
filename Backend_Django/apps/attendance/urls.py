from django.urls import path
from . import views

urlpatterns = [
    path('generate-qr', views.GenerateDailyQRView.as_view(), name='generate-qr'),
    path('scan-qr', views.ScanAttendanceQRView.as_view(), name='scan-qr'),
    path('student/<int:student_id>', views.StudentAttendanceListView.as_view(), name='student-attendance-list'),
    path('staff', views.StaffAttendanceListView.as_view(), name='staff-attendance-list'),
    path('staff/mark', views.MarkStaffAttendanceView.as_view(), name='staff-attendance-mark'),
    path('my', views.MyAttendanceView.as_view(), name='my-attendance'),
    path('my/mark', views.MarkMyAttendanceView.as_view(), name='my-attendance-mark'),
    path('', views.AttendanceListCreateView.as_view(), name='attendance-list'),
    path('<int:pk>', views.AttendanceDetailView.as_view(), name='attendance-detail'),
]
