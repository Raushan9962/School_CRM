from django.urls import path
from . import views

urlpatterns = [
    # Admin Routes
    path('', views.TeacherListCreateView.as_view(), name='teacher-list'),
    path('<int:pk>', views.TeacherDetailView.as_view(), name='teacher-detail'),
]
