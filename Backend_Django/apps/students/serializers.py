from rest_framework import serializers
from apps.schools.models import Student

class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    class_name = serializers.CharField(source='class_id.name', read_only=True)
    section_name = serializers.CharField(source='class_id.section', read_only=True)
    
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('user', 'school')
