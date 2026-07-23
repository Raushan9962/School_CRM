from django.urls import path
from . import views

urlpatterns = [
    path('', views.ResultListCreateView.as_view(), name='result-list'),
    path('<int:pk>', views.ResultDetailView.as_view(), name='result-detail'),
    path('student/<int:studentId>', views.StudentResultListView.as_view(), name='result-student-list'),
]

