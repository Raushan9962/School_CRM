"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from django.urls import path, include
from .views import home 


urlpatterns = [
    path('admin/', admin.site.urls),
    path("", home, name="home"),

    path("api/auth/", include("apps.authentication.urls_auth")),
    path("api/users/", include("apps.users.urls")),
    path("api/profile-updates/", include("apps.profiles.urls")),
    path("api/students/", include("apps.students.urls")),
    path("api/teachers/", include("apps.teachers.urls")),
    path("api/teacher-portal/", include("apps.teachers.urls_portal")),
    path("api/classes/", include("apps.academics.urls_classes")),
    path("api/subjects/", include("apps.subjects.urls")),
    path("api/exams/", include("apps.academics.urls_exams")),
    path("api/homeworks/", include("apps.academics.urls_homeworks")),
    path("api/results/", include("apps.academics.urls_results")),
    path("api/courses/", include("apps.academics.urls_courses")),
    path("api/lectures/", include("apps.academics.urls_lectures")),
    path("api/attendance/", include("apps.attendance.urls")),
    path("api/fees/", include("apps.finance.urls_fees")),
    path("api/accountant/", include("apps.accountant.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/timetables/", include("apps.timetables.urls")),
    path("api/buses/", include("apps.transport.urls")),
    path("api/hostel-rooms/", include("apps.hostels.urls")),
    path("api/books/", include("apps.library.urls_books")),
    path("api/librarian/", include("apps.library.urls_librarian")),
    path("api/inventory/", include("apps.inventory.urls")),
    path("api/events/", include("apps.events.urls")),
    path("api/certificates/", include("apps.certificates.urls")),
    path("api/subscriptions/", include("apps.subscriptions.urls")),
    path("api/admin/", include("apps.school_admin.urls_admin")),
    path("api/school-admin/", include("apps.school_admin.urls")),
    path("api/super-admin/", include("apps.superadmin.urls")),
    path("api/principal/", include("apps.principal.urls")),
    path("api/leaves/", include("apps.leaves.urls")),
    path("api/complaints/", include("apps.complaints.urls")),
    path("api/admission/", include("apps.admissions.urls")),
    path("api/parent/", include("apps.parents.urls")),
    path("api/staff/", include("apps.staff.urls")),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )