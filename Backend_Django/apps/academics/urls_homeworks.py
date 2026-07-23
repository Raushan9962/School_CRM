from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomeworkListCreateView.as_view(), name='homework-list'),
    path('<int:pk>', views.HomeworkDetailView.as_view(), name='homework-detail'),
    path('class/<int:classId>', views.ClassHomeworkListView.as_view(), name='homework-class-list'),
    path('student/<int:userId>', views.StudentHomeworkListView.as_view(), name='homework-student-list'),
]

