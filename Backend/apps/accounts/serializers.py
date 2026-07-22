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
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims from user model
        token['email'] = user.email
        token['id'] = user.id
        token['role'] = user.role
        
        # If you add school_id to User later, uncomment this:
        # token['schoolId'] = getattr(user, 'school_id', None)

        return token