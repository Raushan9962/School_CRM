from django.urls import path, include
from . import views

urlpatterns = [
    path('dashboard-stats', views.DashboardAlertsView.as_view(), name='admin-dashboard-alerts'),
    path('leaves', views.LeaveListCreateView.as_view(), name='admin-leave-list'),
    path('leaves/<int:pk>/status', views.LeaveStatusUpdateView.as_view(), name='admin-leave-status'),
    path('grievances', views.GrievanceListCreateView.as_view(), name='admin-grievance-list'),
    path('events', views.EventListCreateView.as_view(), name='admin-event-list'),
    path('events/<int:pk>', views.EventDetailView.as_view(), name='admin-event-detail'),
    
    path('users/create', views.CreateUserView.as_view(), name='admin-create-user'),
    path('users', views.SchoolUsersListView.as_view(), name='admin-users-list'),
    path('users/students', views.SchoolStudentsListView.as_view(), name='admin-students-list'),
    path('users/teachers', views.SchoolTeachersListView.as_view(), name='admin-teachers-list'),
    path('users/parents', views.SchoolParentsListView.as_view(), name='admin-parents-list'),
    
    path('staff-attendance', views.SchoolAttendanceView.as_view(), name='admin-attendance'),
    
    path('next-admission-no', views.NextAdmissionNoView.as_view(), name='admin-next-admission-no'),
]
