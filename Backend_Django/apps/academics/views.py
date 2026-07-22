from rest_framework import generics
from .models import Course, Class, Subject, Timetable, SyllabusTracking, Exam, Result, Homework
from .serializers import (
    CourseSerializer, ClassSerializer, SubjectSerializer, TimetableSerializer, 
    SyllabusTrackingSerializer, ExamSerializer, ResultSerializer, HomeworkSerializer
)
from apps.schools.views import SchoolBaseView

class CourseListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class CourseDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class ClassListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class ClassDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

class SubjectListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class SubjectDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class TimetableListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class TimetableDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer

class SyllabusTrackingListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = SyllabusTracking.objects.all()
    serializer_class = SyllabusTrackingSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class ExamListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class ExamDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class ResultListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class HomeworkListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class HomeworkDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer

class ClassHomeworkListView(SchoolBaseView, generics.ListAPIView):
    serializer_class = HomeworkSerializer
    def get_queryset(self):
        return Homework.objects.filter(school=self.request.user.school, class_id_id=self.kwargs.get('classId')).order_by('due_date')

class StudentHomeworkListView(SchoolBaseView, generics.ListAPIView):
    serializer_class = HomeworkSerializer
    def get_queryset(self):
        from apps.schools.models import Student
        from django.shortcuts import get_object_or_404
        student = get_object_or_404(Student, user_id=self.kwargs.get('userId'), school=self.request.user.school)
        return Homework.objects.filter(school=self.request.user.school, class_id=student.class_id).order_by('due_date')
