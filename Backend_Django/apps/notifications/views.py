from rest_framework import viewsets
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing notifications.
    Provides create, retrieve, update, destroy, and list actions automatically.
    """
    serializer_class = NotificationSerializer

    def get_queryset(self):
        queryset = Notification.objects.all().order_by('-created_at')
        role = self.request.query_params.get('role')
        if role:
            # Matches Node logic: target_role = role OR target_role = 'All' OR target_role IS NULL
            queryset = queryset.filter(
                Q(target_role__iexact=role) | 
                Q(target_role__iexact='All') | 
                Q(target_role__isnull=True) |
                Q(target_role='')
            )
        return queryset
