from django.urls import path
from . import views

urlpatterns = [
    path('', views.ClassListCreateView.as_view(), name='class-list'),
    path('<int:pk>', views.ClassDetailView.as_view(), name='class-detail'),
    path('syllabus', views.SyllabusTrackingListCreateView.as_view(), name='syllabus-list'),
]

