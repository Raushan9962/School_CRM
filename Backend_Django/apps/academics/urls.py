from django.urls import path
from . import views

urlpatterns = [
    path('courses', views.CourseListCreateView.as_view(), name='course-list'),
    path('courses/<int:pk>', views.CourseDetailView.as_view(), name='course-detail'),
    
    path('classes', views.ClassListCreateView.as_view(), name='class-list'),
    path('classes/<int:pk>', views.ClassDetailView.as_view(), name='class-detail'),

    path('syllabus', views.SyllabusTrackingListCreateView.as_view(), name='syllabus-list'),
    
    path('homework', views.HomeworkListCreateView.as_view(), name='homework-list'),
    path('homework/<int:pk>', views.HomeworkDetailView.as_view(), name='homework-detail'),
    path('homework/class/<int:classId>', views.ClassHomeworkListView.as_view(), name='homework-class-list'),
    path('homework/student/<int:userId>', views.StudentHomeworkListView.as_view(), name='homework-student-list'),
    
    path('exams', views.ExamListCreateView.as_view(), name='exam-list'),
    path('exams/<int:pk>', views.ExamDetailView.as_view(), name='exam-detail'),
    path('results', views.ResultListCreateView.as_view(), name='result-list'),
    path('results/<int:pk>', views.ResultDetailView.as_view(), name='result-detail'),
    path('results/student/<int:studentId>', views.StudentResultListView.as_view(), name='result-student-list'),
    path('lectures', views.LectureListCreateView.as_view(), name='lecture-list'),
    path('lectures/<int:pk>', views.LectureDetailView.as_view(), name='lecture-detail'),
]
