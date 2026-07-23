from rest_framework import viewsets
from .models import HostelRoom
from .serializers import HostelRoomSerializer

class HostelRoomViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing hostel room instances.
    Provides create, retrieve, update, destroy, and list actions automatically.
    """
    queryset = HostelRoom.objects.all()
    serializer_class = HostelRoomSerializer
