from rest_framework import serializers
from apps.superadmin.models import SubscriptionPlan

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'
