from django.urls import path
from . import views

urlpatterns = [
    path('', views.SubscriptionPlanListCreateView.as_view(), name='subscription-plan-list'),
    path('<int:pk>', views.SubscriptionPlanDetailView.as_view(), name='subscription-plan-detail'),
]
