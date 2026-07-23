from django.db import models
from apps.schools.models import School

class Course(models.Model):
    class Meta:
        db_table = 'courses'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Class(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='classes')
    name = models.CharField(max_length=50)
    section = models.CharField(max_length=20, blank=True, null=True)
    class_teacher = models.ForeignKey('schools.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='class_teacher_of')
    
    class Meta:
        unique_together = ('school', 'name', 'section')
    
    def __str__(self):
        return f"{self.name} {self.section or ''}".strip()

class Subject(models.Model):
    class Meta:
        db_table = 'subjects'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True, null=True)
    class_id = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True, related_name='subjects')
    teacher = models.ForeignKey('schools.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='subjects')

class Timetable(models.Model):
    class Meta:
        db_table = 'timetables'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='timetables')
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='timetables')
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    teacher = models.ForeignKey('schools.Teacher', on_delete=models.SET_NULL, null=True, blank=True)
    day_of_week = models.CharField(max_length=20)
    start_time = models.TimeField()
    end_time = models.TimeField()

class SyllabusTracking(models.Model):
    class Meta:
        db_table = 'syllabustrackings'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='syllabus_tracks')
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey('schools.Teacher', on_delete=models.SET_NULL, null=True, blank=True)
    chapter_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='Pending')
    completion_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Exam(models.Model):
    class Meta:
        db_table = 'exams'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='exams')
    name = models.CharField(max_length=100)
    date = models.DateField()
    class_id = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    total_marks = models.IntegerField(default=100)

class Result(models.Model):
    class Meta:
        db_table = 'results'

    student = models.ForeignKey('schools.Student', on_delete=models.CASCADE, related_name='results')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
    marks_obtained = models.FloatField()
    grade = models.CharField(max_length=10, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)



class Homework(models.Model):
    class Meta:
        db_table = 'homeworks'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='homeworks')
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='homeworks')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='homeworks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class Lecture(models.Model):
    class Meta:
        db_table = 'lectures'

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='lectures')
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='lectures')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='lectures')
    teacher = models.ForeignKey('schools.Teacher', on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.subject.name if self.subject else 'No Subject'}"

class LessonDiary(models.Model):
    teacher = models.ForeignKey('schools.Teacher', on_delete=models.CASCADE, related_name='lesson_diaries')
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='lesson_diaries')
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    topics_covered = models.TextField()
    topics_planned = models.TextField(blank=True, null=True)
    homework_assigned = models.TextField(blank=True, null=True)
    class_behavior = models.CharField(max_length=50, default='Good')
    special_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('teacher', 'class_id', 'date')
