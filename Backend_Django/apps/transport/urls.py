from django.urls import path
from . import views

urlpatterns = [
    path('buses', views.BusListCreateView.as_view(), name='bus-list'),
    path('buses/<int:pk>', views.BusDetailView.as_view(), name='bus-detail'),
    path('routes', views.TransportRouteListCreateView.as_view(), name='transport-route-list'),
]
