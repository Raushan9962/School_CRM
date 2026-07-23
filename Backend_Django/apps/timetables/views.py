from rest_framework import generics
from django.db.models import Case, When, Value, IntegerField
from django.shortcuts import get_object_or_404
from apps.academics.models import Timetable
from apps.schools.models import Student
from apps.schools.views import SchoolBaseView
from .serializers import TimetableSerializer

class TimetableListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class TimetableDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer

class StudentTimetableView(SchoolBaseView, generics.ListAPIView):
    serializer_class = TimetableSerializer
    
    def get_queryset(self):
        student_id = self.kwargs.get('studentId')
        student = get_object_or_404(Student, user_id=student_id, school=self.request.user.school)
        
        # Order by day_of_week correctly, then by start_time
        return Timetable.objects.filter(school=self.request.user.school, class_id=student.class_id).annotate(
            day_order=Case(
                When(day_of_week='Monday', then=Value(1)),
                When(day_of_week='Tuesday', then=Value(2)),
                When(day_of_week='Wednesday', then=Value(3)),
                When(day_of_week='Thursday', then=Value(4)),
                When(day_of_week='Friday', then=Value(5)),
                When(day_of_week='Saturday', then=Value(6)),
                When(day_of_week='Sunday', then=Value(7)),
                default=Value(8),
                output_field=IntegerField(),
            )
        ).order_by('day_order', 'start_time')
