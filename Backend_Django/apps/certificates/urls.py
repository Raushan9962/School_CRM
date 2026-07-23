from django.urls import path
from . import views

urlpatterns = [
    path('', views.CertificateListCreateView.as_view(), name='certificate-list'),
    path('<int:pk>', views.CertificateDetailView.as_view(), name='certificate-detail'),
    path('student/<int:user_id>', views.StudentCertificatesView.as_view(), name='student-certificates'),
]
