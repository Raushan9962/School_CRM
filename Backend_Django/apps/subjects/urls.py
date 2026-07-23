from django.urls import path
from . import views

urlpatterns = [
    path('', views.SubjectListCreateView.as_view(), name='subject-list'),
    path('<int:pk>', views.SubjectDetailView.as_view(), name='subject-detail'),
]
