from django.urls import path
from . import views

urlpatterns = [
    # Dashboard & Profile
    path('profile', views.SchoolProfileView.as_view(), name='school-profile'),
    
    path('discipline', views.DisciplineLogListCreateView.as_view(), name='discipline-list'),
    
    path('admissions/apply', views.AdmissionApplyView.as_view(), name='admission-apply'),
    path('admissions', views.AdmissionRequestListView.as_view(), name='admission-list'),
    path('admissions/<int:pk>/approve', views.AdmissionApproveView.as_view(), name='admission-approve'),
]
