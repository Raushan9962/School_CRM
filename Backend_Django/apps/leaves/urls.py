from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveViewSet

router = DefaultRouter()
router.register(r'requests', LeaveViewSet, basename='leave')

from .views import MyLeavesView, ApplyLeaveView

urlpatterns = [
    path('my', MyLeavesView.as_view(), name='my-leaves'),
    path('apply', ApplyLeaveView.as_view(), name='apply-leave'),
    path('', include(router.urls)),
]
