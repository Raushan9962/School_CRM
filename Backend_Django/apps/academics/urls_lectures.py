from django.urls import path
from . import views

urlpatterns = [
    path('', views.LectureListCreateView.as_view(), name='lecture-list'),
    path('<int:pk>', views.LectureDetailView.as_view(), name='lecture-detail'),
]

