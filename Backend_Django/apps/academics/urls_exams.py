from django.urls import path
from . import views

urlpatterns = [
    path('', views.ExamListCreateView.as_view(), name='exam-list'),
    path('<int:pk>', views.ExamDetailView.as_view(), name='exam-detail'),
]

