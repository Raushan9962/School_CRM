from rest_framework import viewsets
from .models import Inventory
from .serializers import InventorySerializer

class InventoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing inventory instances.
    Provides create, retrieve, update, destroy, and list actions automatically.
    """
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
