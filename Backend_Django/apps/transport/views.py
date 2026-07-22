from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Bus
from .serializers import BusSerializer
from apps.schools.views import SchoolBaseView

class BusListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class BusDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
