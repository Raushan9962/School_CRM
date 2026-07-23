from django.urls import path
from . import views

urlpatterns = [
    # Profile update requests
    path('', views.ProfileUpdateRequestsView.as_view(), name='profile-update-requests'),
    path('<int:pk>/process', views.ProfileUpdateProcessView.as_view(), name='profile-update-process'),

    # Profile image
    path('upload-image', views.ProfileImageUploadView.as_view(), name='profile-upload-image'),
    path('remove-image', views.ProfileImageRemoveView.as_view(), name='profile-remove-image'),
]
