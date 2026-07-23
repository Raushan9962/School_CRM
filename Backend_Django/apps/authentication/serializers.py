from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "confirm_password",
            "phone_number",
            "role",
        )
        extra_kwargs = {
            "username": {
                "error_messages": {
                    "unique": "user already exist"
                }
            },
            "email": {
                "error_messages": {
                    "unique": "user already exist"
                }
            }
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone_number=validated_data.get("phone_number", ""),
            role=validated_data.get("role", "STUDENT"),
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields.pop('username', None)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            if not user.is_active:
                raise serializers.ValidationError("No active account found with the given credentials")
                
            self.user = user
            refresh = self.get_token(user)
            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }
            
            from django.contrib.auth.models import update_last_login
            update_last_login(None, user)
            
            return data
        else:
            raise serializers.ValidationError("Invalid email or password.")

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims from user model
        token['email'] = user.email
        token['id'] = user.id
        token['role'] = user.role
        
        # token['schoolId'] = getattr(user, 'school_id', None)

        return token

class ProfileUpdateRequestSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    role_name = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = getattr(__import__('apps.authentication.models', fromlist=['ProfileUpdateRequest']), 'ProfileUpdateRequest')
        fields = '__all__'
