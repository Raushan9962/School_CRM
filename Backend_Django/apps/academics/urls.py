from django.urls import path
from . import views

urlpatterns = [
    path('courses/', views.CourseListCreateView.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    
    path('classes/', views.ClassListCreateView.as_view(), name='class-list'),
    path('classes/<int:pk>/', views.ClassDetailView.as_view(), name='class-detail'),
    
    path('subjects/', views.SubjectListCreateView.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', views.SubjectDetailView.as_view(), name='subject-detail'),
    
    path('timetables/', views.TimetableListCreateView.as_view(), name='timetable-list'),
    path('timetables/<int:pk>/', views.TimetableDetailView.as_view(), name='timetable-detail'),
    
    path('syllabus/', views.SyllabusTrackingListCreateView.as_view(), name='syllabus-list'),
    
    path('homework/', views.HomeworkListCreateView.as_view(), name='homework-list'),
    path('homework/<int:pk>/', views.HomeworkDetailView.as_view(), name='homework-detail'),
    path('homework/class/<int:classId>/', views.ClassHomeworkListView.as_view(), name='homework-class-list'),
    path('homework/student/<int:userId>/', views.StudentHomeworkListView.as_view(), name='homework-student-list'),
    
    path('exams/', views.ExamListCreateView.as_view(), name='exam-list'),
    path('exams/<int:pk>/', views.ExamDetailView.as_view(), name='exam-detail'),
    path('results/', views.ResultListCreateView.as_view(), name='result-list'),
]
