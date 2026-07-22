from rest_framework import serializers
from .models import Certificate

class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)

    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ('school',)
