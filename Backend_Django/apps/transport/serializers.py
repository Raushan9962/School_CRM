from rest_framework import serializers
from .models import Bus

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'
        read_only_fields = ('school',)

from .models import TransportRoute
class TransportRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportRoute
        fields = '__all__'
        read_only_fields = ('school',)
