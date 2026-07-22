from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers import CertificateSerializer
from apps.schools.views import SchoolBaseView

class CertificateListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class CertificateDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer

class StudentCertificatesView(SchoolBaseView, generics.ListAPIView):
    serializer_class = CertificateSerializer
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Certificate.objects.filter(student__user_id=user_id, school=self.request.user.school).order_by('-issue_date')
