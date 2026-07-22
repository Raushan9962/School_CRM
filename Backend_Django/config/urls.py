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
     path(
        "api/accounts/",
        include("apps.accounts.urls"),
    ),
    path(
        "api/finance/",
        include("apps.finance.urls"),
    ),
    path(
        "api/superadmin/",
        include("apps.superadmin.urls"),
    ),
    path(
        "api/schools/",
        include("apps.schools.urls"),
    ),
    path(
        "api/attendance/",
        include("apps.attendance.urls"),
    ),
    path(
        "api/library/",
        include("apps.library.urls"),
    ),
    path(
        "api/transport/",
        include("apps.transport.urls"),
    ),
    path(
        "api/certificates/",
        include("apps.certificates.urls"),
    ),
    path(
        "api/school-admin/",
        include("apps.school_admin.urls"),
    ),
    path(
        "api/principal/",
        include("apps.principal.urls"),
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )