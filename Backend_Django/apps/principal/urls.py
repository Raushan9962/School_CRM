from django.urls import path
from . import views

urlpatterns = [
    path('tasks', views.PrincipalTaskListCreateView.as_view(), name='principal-task-list'),
]
