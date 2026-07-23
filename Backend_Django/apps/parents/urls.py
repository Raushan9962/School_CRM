from django.urls import path
from .views import (
    ChildrenListView, ChildOverviewView, ChildProfileView,
    ChildAttendanceView, ChildFeesView, ChildResultsView,
    ChildHomeworkView, ChildTimetableView
)

urlpatterns = [
    path('children', ChildrenListView.as_view(), name='parents-children'),
    path('child/<int:childId>/overview', ChildOverviewView.as_view(), name='parents-child-overview'),
    path('child/<int:childId>/profile', ChildProfileView.as_view(), name='parents-child-profile'),
    path('child/<int:childId>/attendance', ChildAttendanceView.as_view(), name='parents-child-attendance'),
    path('child/<int:childId>/fees', ChildFeesView.as_view(), name='parents-child-fees'),
    path('child/<int:childId>/results', ChildResultsView.as_view(), name='parents-child-results'),
    path('child/<int:childId>/homework', ChildHomeworkView.as_view(), name='parents-child-homework'),
    path('child/<int:childId>/timetable', ChildTimetableView.as_view(), name='parents-child-timetable'),
]
