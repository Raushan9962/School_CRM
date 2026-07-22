from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.SchoolAdminStatsView.as_view(), name='admin-stats'),
    path('list/', views.SchoolAdminSchoolListView.as_view(), name='admin-school-list'),
    path('dashboard-alerts/', views.DashboardAlertsView.as_view(), name='admin-dashboard-alerts'),
    path('leaves/', views.LeaveListCreateView.as_view(), name='admin-leave-list'),
    path('leaves/<int:pk>/status/', views.LeaveStatusUpdateView.as_view(), name='admin-leave-status'),
    path('grievances/', views.GrievanceListCreateView.as_view(), name='admin-grievance-list'),
    path('events/', views.EventListCreateView.as_view(), name='admin-event-list'),
]
