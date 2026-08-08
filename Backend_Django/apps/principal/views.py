from rest_framework import generics
from .models import PrincipalTask
from .serializers import PrincipalTaskSerializer
from apps.schools.views import SchoolBaseView

class PrincipalTaskListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = PrincipalTask.objects.all()
    serializer_class = PrincipalTaskSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

from rest_framework.views import APIView
from rest_framework.response import Response
from apps.authentication.models import User

class PrincipalStaffListView(SchoolBaseView, APIView):
    def get(self, request):
        users = User.objects.filter(school=request.user.school).exclude(role__in=['PRINCIPAL', 'STUDENT', 'PARENT']).order_by('first_name')
        data = [{
            "id": u.id, 
            "name": u.get_full_name() or u.username, 
            "email": u.email,
            "role_name": u.role.replace('_', ' ').title() if u.role else ''
        } for u in users]
        return Response({"success": True, "count": len(data), "data": data})
