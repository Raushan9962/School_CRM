from rest_framework import generics
from apps.academics.models import Subject
from apps.schools.views import SchoolBaseView
from .serializers import SubjectSerializer

class SubjectListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class SubjectDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
