from rest_framework import generics
from .models import Course, Class, Subject, Timetable, SyllabusTracking, Exam, Result, Homework, Lecture
from .serializers import (
    CourseSerializer, ClassSerializer, 
    SyllabusTrackingSerializer, ExamSerializer, ResultSerializer, HomeworkSerializer,
    LectureSerializer
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
        serializer.save()

class ResultDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

class StudentResultListView(SchoolBaseView, generics.ListAPIView):
    serializer_class = ResultSerializer
    def get_queryset(self):
        # Maps to getResultsByStudentId
        from apps.schools.models import Student
        from django.shortcuts import get_object_or_404
        student = get_object_or_404(Student, user_id=self.kwargs.get('studentId'))
        return Result.objects.filter(student=student, student__school=self.request.user.school).order_by('-exam__date')

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

class LectureListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class LectureDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
