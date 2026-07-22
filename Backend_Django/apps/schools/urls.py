from django.urls import path
from . import views

urlpatterns = [
    # Dashboard & Profile
    path('profile/', views.SchoolProfileView.as_view(), name='school-profile'),
    
    path('teachers/', views.TeacherListCreateView.as_view(), name='teacher-list'),
    
    path('students/', views.StudentListCreateView.as_view(), name='student-list'),
    path('students/<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),
    path('students/<int:pk>/profile/', views.StudentProfileDetailView.as_view(), name='student-full-profile'),
    path('teachers/<int:pk>/', views.TeacherDetailView.as_view(), name='teacher-detail'),
    
    path('discipline/', views.DisciplineLogListCreateView.as_view(), name='discipline-list'),
    
    path('admissions/apply/', views.AdmissionApplyView.as_view(), name='admission-apply'),
    path('admissions/', views.AdmissionRequestListView.as_view(), name='admission-list'),
    path('admissions/<int:pk>/approve/', views.AdmissionApproveView.as_view(), name='admission-approve'),
]
