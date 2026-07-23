from rest_framework import generics
from django.db.models import F
from apps.superadmin.models import SubscriptionPlan
from apps.superadmin.views import SuperAdminBaseView
from .serializers import SubscriptionPlanSerializer

class SubscriptionPlanListCreateView(SuperAdminBaseView, generics.ListCreateAPIView):
    serializer_class = SubscriptionPlanSerializer
    
    def get_queryset(self):
        return SubscriptionPlan.objects.all().order_by(F('max_students').asc(nulls_last=True))

class SubscriptionPlanDetailView(SuperAdminBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
