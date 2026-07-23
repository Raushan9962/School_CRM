from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.authentication.models import User


class UserListView(APIView):
    """List all users for the current school (Admin only)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        school = request.user.school
        users = User.objects.filter(school=school).values(
            'id', 'email', 'username', 'role', 'is_active', 'created_at'
        )
        return Response({"success": True, "data": list(users)})


class UserDetailView(APIView):
    """Get, update, or delete a single user."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk, school=request.user.school)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)

        return Response({
            "success": True,
            "data": {
                "id": user.id,
                "email": user.email,
                "name": user.username,
                "role": user.role,
                "phone": user.phone_number,
                "is_active": user.is_active,
                "created_at": user.created_at,
            }
        })

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk, school=request.user.school)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)

        allowed_fields = ['username', 'phone_number', 'is_active', 'role']
        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()

        return Response({"success": True, "message": "User updated successfully"})

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk, school=request.user.school)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=404)

        user.delete()
        return Response({"success": True, "message": "User deleted successfully"})


class MeView(APIView):
    """Get the currently logged-in user's profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "success": True,
            "data": {
                "id": user.id,
                "email": user.email,
                "name": user.username,
                "role": user.role,
                "phone": user.phone_number,
                "image": user.profile_image.url if user.profile_image else None,
                "schoolId": user.school_id,
                "is_active": user.is_active,
            }
        })
