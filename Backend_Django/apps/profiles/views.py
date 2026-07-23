from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone

from apps.authentication.models import User, ProfileUpdateRequest
from apps.authentication.serializers import ProfileUpdateRequestSerializer


class ProfileUpdateRequestsView(APIView):
    """List all pending profile update requests (Admin), or submit a new one (User)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending = ProfileUpdateRequest.objects.filter(status='Pending').order_by('-created_at')
        serializer = ProfileUpdateRequestSerializer(pending, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        changes = request.data.get('changes')
        if not changes or not isinstance(changes, dict) or not changes.keys():
            return Response(
                {"success": False, "message": "No changes provided"},
                status=400
            )

        req_obj = ProfileUpdateRequest.objects.create(
            user=request.user,
            requested_changes=changes
        )
        serializer = ProfileUpdateRequestSerializer(req_obj)
        return Response(
            {"success": True, "message": "Profile update request submitted successfully", "data": serializer.data},
            status=201
        )


class ProfileUpdateProcessView(APIView):
    """Approve or Reject a profile update request (Admin only)."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        action = request.data.get('action')
        if action not in ['Approve', 'Reject']:
            return Response({"success": False, "message": "Invalid action"}, status=400)

        try:
            req_obj = ProfileUpdateRequest.objects.get(pk=pk, status='Pending')
        except ProfileUpdateRequest.DoesNotExist:
            return Response({"success": False, "message": "Request not found or already processed"}, status=404)

        if action == 'Approve':
            changes = req_obj.requested_changes
            user = req_obj.user

            if 'phone' in changes:
                user.phone_number = changes['phone']

            user.save()

        req_obj.status = 'Approved' if action == 'Approve' else 'Rejected'
        req_obj.resolved_at = timezone.now()
        req_obj.save()

        return Response({"success": True, "message": f"Request {action.lower()}d successfully"})


class ProfileImageUploadView(APIView):
    """Upload a profile image for the current user."""
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({"success": False, "message": "No image file provided"}, status=400)

        user = request.user
        user.profile_image = request.FILES['image']
        user.save()

        image_url = request.build_absolute_uri(user.profile_image.url)
        return Response({"success": True, "message": "Profile image updated", "imageUrl": image_url})


class ProfileImageRemoveView(APIView):
    """Remove the profile image of the current user."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.profile_image:
            user.profile_image.delete(save=True)

        fallback_image = f"https://api.dicebear.com/5.x/initials/svg?seed={user.username or user.email}"
        return Response({"success": True, "message": "Profile image removed", "imageUrl": fallback_image})
