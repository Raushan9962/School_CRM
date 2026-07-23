from django.urls import path
from . import views

urlpatterns = [
    path('dashboard-stats', views.TeacherDashboardStatsView.as_view(), name='portal-dashboard-stats'),
    path('my-classes', views.TeacherMyClassesView.as_view(), name='portal-my-classes'),
    path('class-students/<int:classId>', views.TeacherClassStudentsView.as_view(), name='portal-class-students'),
    path('submit-attendance', views.TeacherSubmitAttendanceView.as_view(), name='portal-submit-attendance'),
    path('leaves', views.TeacherLeavesView.as_view(), name='portal-leaves'),
    path('exams', views.TeacherExamsView.as_view(), name='portal-exams'),
    path('exam-students/<int:examId>', views.TeacherExamStudentsView.as_view(), name='portal-exam-students'),
    path('save-marks', views.TeacherSaveMarksView.as_view(), name='portal-save-marks'),
    path('assignments', views.TeacherAssignmentsView.as_view(), name='portal-assignments'),
    path('syllabus', views.TeacherSyllabusProgressView.as_view(), name='portal-syllabus'),
    path('diary', views.TeacherLessonDiaryView.as_view(), name='portal-diary'),
    path('timetable', views.TeacherTimetableView.as_view(), name='portal-timetable'),
    path('student-performance', views.TeacherStudentPerformanceView.as_view(), name='portal-student-performance'),
    path('student-remark', views.TeacherStudentRemarkView.as_view(), name='portal-student-remark'),
    path('behavior-log', views.TeacherBehaviorLogView.as_view(), name='portal-behavior-log'),
    path('ptm-meetings', views.TeacherPTMMeetingsView.as_view(), name='portal-ptm-meetings'),
    path('students-by-class', views.TeacherStudentsByClassView.as_view(), name='portal-students-by-class'),
    path('mark-attendance-qr', views.TeacherMarkAttendanceQRView.as_view(), name='portal-mark-attendance-qr'),
]

