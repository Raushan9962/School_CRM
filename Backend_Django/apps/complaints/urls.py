from django.urls import path
from . import views

urlpatterns = [
    path('', views.ComplaintListCreateView.as_view(), name='complaint-list'),
    path('user/<int:userId>/', views.UserComplaintListView.as_view(), name='complaint-user-list'),
    path('<int:pk>/status/', views.ComplaintStatusUpdateView.as_view(), name='complaint-status-update'),
]
