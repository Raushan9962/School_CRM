from django.urls import path
from . import views

urlpatterns = [
    path('', views.BusListCreateView.as_view(), name='bus-list'),
    path('<int:pk>/', views.BusDetailView.as_view(), name='bus-detail'),
]
