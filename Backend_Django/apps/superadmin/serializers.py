from rest_framework import serializers
from .models import SubscriptionPlan, Transaction, PlatformSetting


class TransactionSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'

class PlatformSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSetting
        fields = '__all__'
