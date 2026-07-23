from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HostelRoomViewSet

router = DefaultRouter()
router.register(r'rooms', HostelRoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
