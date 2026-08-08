from django.urls import path
from . import views

from apps.school_admin.views import LeaveListCreateView, LeaveStatusUpdateView, GrievanceListCreateView

urlpatterns = [
    path('tasks', views.PrincipalTaskListCreateView.as_view(), name='principal-task-list'),
    path('staff-list', views.PrincipalStaffListView.as_view(), name='principal-staff-list'),
    path('grievances', GrievanceListCreateView.as_view(), name='principal-grievances'),
    path('leaves', LeaveListCreateView.as_view(), name='principal-leaves-list'),
    path('leaves/<int:pk>/status', LeaveStatusUpdateView.as_view(), name='principal-leaves-status'),
]
