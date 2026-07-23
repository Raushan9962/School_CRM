from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/stats', views.SchoolAdminStatsView.as_view(), name='admin-stats'),
    path('dashboard/schools', views.SchoolAdminSchoolListView.as_view(), name='admin-school-list'),
]

