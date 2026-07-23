from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Count, Q, Avg, Max
from django.utils import timezone
from datetime import datetime

from apps.authentication.models import User
from apps.authentication.permissions import HasRole
from apps.schools.models import Teacher, Student, DisciplineLog, StudentRemark, PTMMeeting, School
from apps.schools.views import SchoolBaseView
from apps.academics.models import Class, Subject, Timetable, Exam, Result, Homework, SyllabusTracking, LessonDiary
from apps.attendance.models import Attendance, StaffAttendance, DailyAttendanceQR
from apps.leaves.models import Leave
from .serializers import TeacherSerializer, LessonDiarySerializer, StudentRemarkSerializer, PTMMeetingSerializer

# --- Existing Admin Views ---

class TeacherListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password', 'password123')
        
        if not username or not email:
            return Response({"error": "Username and email required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    role='TEACHER',
                    school=request.user.school,
                    name=data.get('name', username)
                )
                
                teacher_data = data.copy()
                teacher_data.pop('username', None)
                teacher_data.pop('email', None)
                teacher_data.pop('password', None)
                
                serializer = self.get_serializer(data=teacher_data)
                if serializer.is_valid():
                    serializer.save(user=user, school=request.user.school)
                    return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
                raise Exception(str(serializer.errors))
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TeacherDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


# --- Teacher Portal Views ---

class TeacherPortalBaseView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['TEACHER']
    
    def get_teacher(self):
        return getattr(self.request.user, 'teacher_profile', None)

class TeacherDashboardStatsView(TeacherPortalBaseView):
    def get(self, request):
        teacher = self.get_teacher()
        if not teacher:
            return Response({"success": False, "message": "Teacher profile not found."}, status=404)
        
        # Total my classes
        timetables = Timetable.objects.filter(teacher=teacher)
        total_classes = timetables.values('class_id').distinct().count()
        
        # Total students in my classes
        class_ids = timetables.values_list('class_id', flat=True)
        total_students = Student.objects.filter(class_id__in=class_ids).count()
        
        # Leave balance (Mock calculation based on approved leaves this year)
        current_year = timezone.now().year
        approved_leaves = Leave.objects.filter(user=request.user, status='Approved', start_date__year=current_year)
        casual_used = sum([(l.end_date - l.start_date).days + 1 for l in approved_leaves if 'casual' in l.leave_type.lower()])
        medical_used = sum([(l.end_date - l.start_date).days + 1 for l in approved_leaves if 'medical' in l.leave_type.lower() or 'sick' in l.leave_type.lower()])
        earned_used = sum([(l.end_date - l.start_date).days + 1 for l in approved_leaves if 'earned' in l.leave_type.lower()])
        
        leave_balance = {
            'casual': max(0, 8 - casual_used),
            'medical': max(0, 5 - medical_used),
            'earned': max(0, 12 - earned_used)
        }
        
        # Pending work (Homeworks due before today)
        pending_work = Homework.objects.filter(
            class_id__in=class_ids, 
            due_date__lt=timezone.now().date()
        ).count()
        
        # Today's schedule
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        today_day = days[timezone.now().weekday()]
        
        today_schedule_qs = timetables.filter(day_of_week=today_day).order_by('start_time')
        today_schedule = []
        for t in today_schedule_qs:
            today_schedule.append({
                'start_time': t.start_time.strftime('%H:%M'),
                'end_time': t.end_time.strftime('%H:%M'),
                'class_name': t.class_id.name,
                'section': t.class_id.section,
                'subject_name': t.subject.name if t.subject else 'N/A'
            })
            
        return Response({
            "success": True,
            "data": {
                "totalStudents": total_students,
                "totalClasses": total_classes,
                "leaveBalance": leave_balance,
                "pendingWork": pending_work,
                "todaySchedule": today_schedule,
                "teacherId": teacher.id
            }
        })

class TeacherMyClassesView(TeacherPortalBaseView):
    def get(self, request):
        teacher = self.get_teacher()
        if not teacher:
            return Response({"success": False, "message": "Teacher not found."}, status=404)
            
        timetables = Timetable.objects.filter(teacher=teacher).select_related('class_id', 'subject')
        
        classes_data = {}
        for t in timetables:
            cid = t.class_id.id
            if cid not in classes_data:
                classes_data[cid] = {
                    'id': cid,
                    'name': t.class_id.name,
                    'section': t.class_id.section,
                    'school_id': t.class_id.school_id,
                    'student_count': Student.objects.filter(class_id=cid).count(),
                    'subjects_taught': set()
                }
            if t.subject:
                classes_data[cid]['subjects_taught'].add(t.subject.name)
                
        # Format subjects
        for cid in classes_data:
            classes_data[cid]['subjects_taught'] = ", ".join(classes_data[cid]['subjects_taught'])
            
        return Response({"success": True, "data": list(classes_data.values())})

class TeacherClassStudentsView(TeacherPortalBaseView):
    def get(self, request, classId):
        try:
            students = Student.objects.filter(class_id=classId).select_related('user').order_by('roll_number')
            today = timezone.now().date()
            
            data = []
            for s in students:
                att = Attendance.objects.filter(student=s, date=today, class_id=classId).first()
                data.append({
                    'id': s.id,
                    'name': s.user.name,
                    'roll_number': s.roll_number,
                    'email': s.user.email,
                    'today_attendance': att.status if att else 'Not Marked'
                })
            return Response({"success": True, "data": data})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)

class TeacherSubmitAttendanceView(TeacherPortalBaseView):
    def post(self, request):
        classId = request.data.get('classId')
        date_str = request.data.get('date')
        attendanceData = request.data.get('attendanceData') # [{'studentId': 1, 'status': 'Present'}]
        
        if not classId or not date_str or not isinstance(attendanceData, list):
            return Response({"success": False, "message": "Invalid input."}, status=400)
            
        try:
            with transaction.atomic():
                for record in attendanceData:
                    Attendance.objects.update_or_create(
                        student_id=record['studentId'],
                        date=date_str,
                        defaults={
                            'class_id_id': classId,
                            'status': record['status']
                        }
                    )
            return Response({"success": True, "message": "Attendance saved successfully."})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)

class TeacherLeavesView(TeacherPortalBaseView):
    def get(self, request):
        leaves = Leave.objects.filter(user=request.user).order_by('-created_at')
        data = [{
            'id': l.id,
            'leave_type': l.leave_type,
            'start_date': l.start_date,
            'end_date': l.end_date,
            'reason': l.reason,
            'status': l.status,
            'created_at': l.created_at
        } for l in leaves]
        return Response({"success": True, "data": data})
        
    def post(self, request):
        data = request.data
        try:
            leave = Leave.objects.create(
                user=request.user,
                school=request.user.school,
                leave_type=data.get('leave_type'),
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
                reason=data.get('reason'),
                status='Pending'
            )
            return Response({"success": True, "message": "Leave application submitted.", "data": {"id": leave.id}}, status=201)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

class TeacherExamsView(TeacherPortalBaseView):
    def get(self, request):
        exams = Exam.objects.filter(school=request.user.school).order_by('-date')[:30]
        data = [{
            'id': e.id,
            'name': e.name,
            'exam_type': 'Standard', # Adjust based on actual model
            'start_date': e.date,
            'end_date': e.date,
            'max_marks': e.total_marks,
            'class_name': e.class_id.name if e.class_id else '',
            'section': e.class_id.section if e.class_id else '',
            'subject_name': e.subject.name if e.subject else ''
        } for e in exams]
        return Response({"success": True, "data": data})

class TeacherExamStudentsView(TeacherPortalBaseView):
    def get(self, request, examId):
        try:
            exam = Exam.objects.get(id=examId, school=request.user.school)
            students = Student.objects.filter(class_id=exam.class_id).order_by('roll_number')
            
            students_data = []
            for s in students:
                res = Result.objects.filter(student=s, exam=exam).first()
                students_data.append({
                    'id': s.id,
                    'name': s.user.name,
                    'roll_number': s.roll_number,
                    'theory_marks': res.marks_obtained if res else 0,
                    'practical_marks': 0, # Assuming no separate practical for now
                    'total_marks': res.marks_obtained if res else 0,
                    'grade': res.grade if res else '',
                    'remarks': res.remarks if res else ''
                })
                
            exam_data = {
                'id': exam.id, 'name': exam.name, 'max_marks': exam.total_marks
            }
            return Response({"success": True, "data": {"exam": exam_data, "students": students_data}})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=404)

class TeacherSaveMarksView(TeacherPortalBaseView):
    def post(self, request):
        examId = request.data.get('examId')
        marksData = request.data.get('marksData')
        
        if not examId or not isinstance(marksData, list):
            return Response({"success": False, "message": "Invalid input."}, status=400)
            
        try:
            exam = Exam.objects.get(id=examId)
            
            def get_grade(pct):
                if pct >= 91: return 'A1'
                if pct >= 81: return 'A2'
                if pct >= 71: return 'B1'
                if pct >= 61: return 'B2'
                if pct >= 51: return 'C1'
                if pct >= 41: return 'C2'
                if pct >= 33: return 'D'
                return 'F'
                
            with transaction.atomic():
                for m in marksData:
                    total = float(m.get('theoryMarks', 0)) + float(m.get('practicalMarks', 0))
                    pct = (total / exam.total_marks) * 100 if exam.total_marks > 0 else 0
                    grade = get_grade(pct)
                    
                    Result.objects.update_or_create(
                        student_id=m['studentId'],
                        exam=exam,
                        defaults={
                            'marks_obtained': total,
                            'grade': grade
                        }
                    )
            return Response({"success": True, "message": "Marks saved successfully."})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)

class TeacherAssignmentsView(TeacherPortalBaseView):
    def get(self, request):
        # We need to map teacher to Homework. Right now Homework doesn't have teacher_id in models.py
        # We'll just fetch homeworks for classes this teacher teaches
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        class_ids = Timetable.objects.filter(teacher=teacher).values_list('class_id', flat=True)
        assignments = Homework.objects.filter(class_id__in=class_ids).order_by('-created_at')[:30]
        
        data = []
        for h in assignments:
            data.append({
                'id': h.id,
                'title': h.title,
                'description': h.description,
                'due_date': h.due_date,
                'created_at': h.created_at,
                'class_name': h.class_id.name,
                'section': h.class_id.section,
                'subject_name': h.subject.name if h.subject else '',
                'total_students': Student.objects.filter(class_id=h.class_id).count()
            })
        return Response({"success": True, "data": data})
        
    def post(self, request):
        data = request.data
        try:
            hw = Homework.objects.create(
                school=request.user.school,
                class_id_id=data.get('class_id'),
                subject_id=data.get('subject_id'),
                title=data.get('title'),
                description=data.get('description', ''),
                due_date=data.get('due_date')
            )
            return Response({"success": True, "message": "Assignment created.", "data": {"id": hw.id}}, status=201)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

class TeacherSyllabusProgressView(TeacherPortalBaseView):
    def get(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        progress = SyllabusTracking.objects.filter(teacher=teacher).order_by('subject__name', 'chapter_name')
        data = [{
            'id': p.id,
            'subject_id': p.subject_id,
            'class_id': p.class_id_id,
            'chapter_name': p.chapter_name,
            'topic_name': p.chapter_name, # Mapped chapter to topic for now
            'is_completed': p.status == 'Completed',
            'completion_date': p.completion_date,
            'notes': '',
            'subject_name': p.subject.name if p.subject else '',
            'class_name': p.class_id.name,
            'section': p.class_id.section
        } for p in progress]
        return Response({"success": True, "data": data})
        
    def post(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        data = request.data
        try:
            status_val = 'Completed' if data.get('is_completed') else 'Pending'
            date_val = datetime.now().date() if data.get('is_completed') else None
            
            # Using update_or_create for idempotency (Note: model doesn't have topic_name, only chapter_name)
            obj, created = SyllabusTracking.objects.update_or_create(
                teacher=teacher,
                subject_id=data.get('subject_id'),
                class_id_id=data.get('class_id'),
                chapter_name=data.get('chapter_name'),
                defaults={
                    'school': request.user.school,
                    'status': status_val,
                    'completion_date': date_val
                }
            )
            return Response({"success": True, "data": {"id": obj.id}})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)


class TeacherLessonDiaryView(TeacherPortalBaseView):
    def get(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        diaries = LessonDiary.objects.filter(teacher=teacher).order_by('-date')[:30]
        serializer = LessonDiarySerializer(diaries, many=True)
        return Response({"success": True, "data": serializer.data})
        
    def post(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        data = request.data
        try:
            diary, created = LessonDiary.objects.update_or_create(
                teacher=teacher,
                class_id_id=data.get('class_id'),
                date=data.get('date'),
                defaults={
                    'subject_id': data.get('subject_id'),
                    'topics_covered': data.get('topics_covered'),
                    'topics_planned': data.get('topics_planned', ''),
                    'homework_assigned': data.get('homework_assigned', ''),
                    'class_behavior': data.get('class_behavior', 'Good'),
                    'special_notes': data.get('special_notes', '')
                }
            )
            return Response({"success": True, "message": "Diary entry saved.", "data": LessonDiarySerializer(diary).data}, status=201)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

class TeacherTimetableView(TeacherPortalBaseView):
    def get(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        timetables = Timetable.objects.filter(teacher=teacher)
        day_mapping = {'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7}
        
        data = []
        for t in timetables:
            data.append({
                'id': t.id,
                'day_of_week': t.day_of_week,
                'start_time': t.start_time.strftime('%H:%M'),
                'end_time': t.end_time.strftime('%H:%M'),
                'class_name': t.class_id.name,
                'section': t.class_id.section,
                'subject_name': t.subject.name if t.subject else '',
                '_day_val': day_mapping.get(t.day_of_week, 8)
            })
            
        data.sort(key=lambda x: (x['_day_val'], x['start_time']))
        return Response({"success": True, "data": data})

class TeacherStudentPerformanceView(TeacherPortalBaseView):
    def get(self, request):
        classId = request.query_params.get('classId')
        if not classId: return Response({"success": False, "message": "classId is required."}, status=400)
        
        try:
            students = Student.objects.filter(class_id=classId).select_related('user').order_by('roll_number')
            
            data = []
            for s in students:
                results = Result.objects.filter(student=s)
                avg = results.aggregate(Avg('marks_obtained'))['marks_obtained__avg'] or 0
                max_val = results.aggregate(Max('marks_obtained'))['marks_obtained__max'] or 0
                count = results.count()
                
                total_att = Attendance.objects.filter(student=s).count()
                present_att = Attendance.objects.filter(student=s, status='Present').count()
                att_pct = round((present_att / total_att * 100), 1) if total_att > 0 else 0
                
                data.append({
                    'id': s.id,
                    'name': s.user.name,
                    'roll_number': s.roll_number,
                    'avg_marks': round(avg, 2),
                    'max_marks': max_val,
                    'exams_given': count,
                    'attendance_pct': att_pct
                })
                
            data.sort(key=lambda x: x['avg_marks'], reverse=True)
            return Response({"success": True, "data": data})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)

class TeacherStudentRemarkView(TeacherPortalBaseView):
    def post(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        data = request.data
        try:
            remark = StudentRemark.objects.create(
                teacher=teacher,
                student_id=data.get('student_id'),
                remark_type=data.get('remark_type'),
                remark=data.get('remark'),
                recommendation=data.get('recommendation', '')
            )
            return Response({"success": True, "message": "Remark added.", "data": StudentRemarkSerializer(remark).data}, status=201)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

class TeacherBehaviorLogView(TeacherPortalBaseView):
    def get(self, request):
        classId = request.query_params.get('classId')
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        logs = DisciplineLog.objects.filter(reported_by=request.user).order_by('-incident_date')[:30]
        if classId:
            logs = logs.filter(student__class_id=classId)
            
        data = [{
            'id': l.id,
            'incident_type': l.incident_type,
            'description': l.description,
            'action_taken': l.action_taken,
            'date': l.incident_date,
            'student_name': l.student.user.name,
            'roll_number': l.student.roll_number,
            'class_name': l.student.class_id.name if l.student.class_id else '',
            'section': l.student.class_id.section if l.student.class_id else ''
        } for l in logs]
        return Response({"success": True, "data": data})
        
    def post(self, request):
        data = request.data
        try:
            log = DisciplineLog.objects.create(
                school=request.user.school,
                student_id=data.get('student_id'),
                reported_by=request.user,
                incident_type=data.get('incident_type'),
                description=data.get('description'),
                action_taken=data.get('action_taken', 'Pending'),
                incident_date=data.get('date', timezone.now().date())
            )
            return Response({"success": True, "message": "Behavior logged.", "data": {"id": log.id}}, status=201)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

class TeacherPTMMeetingsView(TeacherPortalBaseView):
    def get(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        meetings = PTMMeeting.objects.filter(teacher=teacher).order_by('-meeting_date')[:20]
        return Response({"success": True, "data": PTMMeetingSerializer(meetings, many=True).data})
        
    def post(self, request):
        teacher = self.get_teacher()
        if not teacher: return Response({"success": False, "message": "Teacher not found"}, status=404)
        
        data = request.data
        try:
            meeting = PTMMeeting.objects.create(
                teacher=teacher,
                student_id=data.get('student_id'),
                meeting_date=data.get('meeting_date'),
                meeting_time=data.get('meeting_time', '10:00:00'),
                agenda=data.get('agenda'),
                status='Scheduled'
            )
            return Response({"success": True, "message": "PTM scheduled.", "data": PTMMeetingSerializer(meeting).data}, status=201)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

class TeacherStudentsByClassView(TeacherPortalBaseView):
    def get(self, request):
        classId = request.query_params.get('classId')
        if not classId: return Response({"success": False, "message": "classId required."}, status=400)
        
        students = Student.objects.filter(class_id=classId).order_by('roll_number')
        data = [{'id': s.id, 'name': s.user.name, 'roll_number': s.roll_number} for s in students]
        return Response({"success": True, "data": data})

class TeacherMarkAttendanceQRView(TeacherPortalBaseView):
    def post(self, request):
        qrToken = request.data.get('qrToken')
        if not qrToken: return Response({"success": False, "message": "QR Token is required"}, status=400)
        
        date_str = timezone.now().date()
        school = request.user.school
        
        qr_exists = DailyAttendanceQR.objects.filter(school=school, date=date_str, token=qrToken).exists()
        if not qr_exists:
            return Response({"success": False, "message": "Invalid or expired QR code."}, status=400)
            
        try:
            StaffAttendance.objects.update_or_create(
                user=request.user,
                date=date_str,
                defaults={'status': 'Present'}
            )
            return Response({"success": True, "message": "Attendance marked successfully!"})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)
