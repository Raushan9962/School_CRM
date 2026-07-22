from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Complaint
from .serializers import ComplaintSerializer
from apps.schools.views import SchoolBaseView

class ComplaintListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, user=self.request.user)

class UserComplaintListView(SchoolBaseView, generics.ListAPIView):
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('userId')
        return Complaint.objects.filter(school=self.request.user.school, user_id=user_id).order_by('-created_at')

class ComplaintStatusUpdateView(SchoolBaseView, generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Complaint updated successfully",
            "data": serializer.data
        })
