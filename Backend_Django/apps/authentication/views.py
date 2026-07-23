import random
import datetime

from django.utils import timezone
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer


class RegisterAPIView(APIView):
    """Register a new user."""

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "User registered successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Login — returns JWT access + refresh tokens and user info."""
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        token = response.data.get('access')
        if token:
            # Set HttpOnly cookie (3 days)
            response.set_cookie(
                'token', token,
                max_age=3 * 24 * 60 * 60,
                httponly=True,
                samesite='Lax'
            )

            user = User.objects.get(email=request.data.get('email'))
            response.data = {
                "success": True,
                "token": token,
                "refresh": response.data.get('refresh'),
                "message": "Logged in successfully",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "name": user.username,
                    "image": user.profile_image.url if user.profile_image else None,
                    "schoolId": user.school_id,
                }
            }

        return response


class LogoutAPIView(APIView):
    """Logout — clears the token cookie."""

    def post(self, request):
        response = Response(
            {"success": True, "message": "Logged out successfully"},
            status=status.HTTP_200_OK,
        )
        response.delete_cookie('token')
        return response


class SendOTPView(APIView):
    """Send a 6-digit OTP to the user's email."""

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_created_at = timezone.now()
            user.save()

            send_mail(
                'Your OTP Code',
                f'Your OTP code is {otp}. It will expire in 10 minutes.',
                'noreply@schoolcrm.com',
                [email],
                fail_silently=False,
            )

            return Response({'success': True, 'message': 'OTP sent successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class VerifyEmailView(APIView):
    """Verify email using the OTP."""

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            if user.otp != otp:
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

            if user.otp_created_at:
                expiration = user.otp_created_at + datetime.timedelta(minutes=10)
                if timezone.now() > expiration:
                    return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

            user.is_email_verified = True
            user.otp = None
            user.otp_created_at = None
            user.save()

            return Response({'success': True, 'message': 'Email verified successfully'})

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordView(APIView):
    """Reset password using OTP."""

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if not email or not otp or not new_password:
            return Response(
                {'error': 'Email, OTP, and new password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)

            if user.otp != otp:
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

            if user.otp_created_at:
                expiration = user.otp_created_at + datetime.timedelta(minutes=10)
                if timezone.now() > expiration:
                    return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.otp = None
            user.otp_created_at = None
            user.save()

            return Response({'success': True, 'message': 'Password reset successfully'})

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
