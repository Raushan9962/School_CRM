from django.urls import path
from . import views

urlpatterns = [
    # Dashboard & Profile
    path('stats/', views.SchoolAdminStatsView.as_view(), name='school-stats'),
    path('list/', views.SchoolAdminSchoolListView.as_view(), name='school-list'),
    path('profile/', views.SchoolProfileView.as_view(), name='school-profile'),
    
    path('classes/', views.ClassListCreateView.as_view(), name='class-list'),
    path('classes/<int:pk>/', views.ClassDetailView.as_view(), name='class-detail'),
    
    path('students/', views.StudentListCreateView.as_view(), name='student-list'),
    path('students/<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),
    path('students/<int:pk>/profile/', views.StudentProfileDetailView.as_view(), name='student-full-profile'),
    
    path('teachers/', views.TeacherListCreateView.as_view(), name='teacher-list'),
    path('teachers/<int:pk>/', views.TeacherDetailView.as_view(), name='teacher-detail'),
    
    path('subjects/', views.SubjectListCreateView.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', views.SubjectDetailView.as_view(), name='subject-detail'),
    
    path('timetables/', views.TimetableListCreateView.as_view(), name='timetable-list'),
    path('timetables/<int:pk>/', views.TimetableDetailView.as_view(), name='timetable-detail'),
    
    path('syllabus/', views.SyllabusTrackingListCreateView.as_view(), name='syllabus-list'),
    
    path('exams/', views.ExamListCreateView.as_view(), name='exam-list'),
    path('results/', views.ResultListCreateView.as_view(), name='result-list'),
    
    path('discipline/', views.DisciplineLogListCreateView.as_view(), name='discipline-list'),
    
    path('leaves/', views.LeaveListCreateView.as_view(), name='leave-list'),
    path('leaves/<int:pk>/status/', views.LeaveStatusUpdateView.as_view(), name='leave-status'),
    
    path('tasks/', views.PrincipalTaskListCreateView.as_view(), name='task-list'),
    path('grievances/', views.GrievanceListCreateView.as_view(), name='grievance-list'),
    path('events/', views.EventListCreateView.as_view(), name='event-list'),
    
    path('dashboard-alerts/', views.DashboardAlertsView.as_view(), name='dashboard-alerts'),
    
    path('admissions/apply/', views.AdmissionApplyView.as_view(), name='admission-apply'),
    path('admissions/', views.AdmissionRequestListView.as_view(), name='admission-list'),
    path('admissions/<int:pk>/approve/', views.AdmissionApproveView.as_view(), name='admission-approve'),
]
