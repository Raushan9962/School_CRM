from rest_framework import serializers
from .models import HostelRoom

class HostelRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = HostelRoom
        fields = '__all__'
