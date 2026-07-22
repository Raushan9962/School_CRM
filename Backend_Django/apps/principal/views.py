from rest_framework import generics
from .models import PrincipalTask
from .serializers import PrincipalTaskSerializer
from apps.schools.views import SchoolBaseView

class PrincipalTaskListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = PrincipalTask.objects.all()
    serializer_class = PrincipalTaskSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)
