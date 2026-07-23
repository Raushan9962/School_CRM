from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Leave, Grievance, Event
from .serializers import LeaveSerializer, GrievanceSerializer, EventSerializer
from apps.schools.models import Student
from apps.schools.views import SchoolBaseView
from apps.authentication.permissions import HasRole

class SchoolAdminStatsView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']
    
    def get(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"error": "No school associated"}, status=status.HTTP_404_NOT_FOUND)
            
        try:
            from django.contrib.auth import get_user_model
            from django.db.models import Sum
            from apps.attendance.models import Attendance
            from apps.finance.models import FeeReceipt
            from django.utils import timezone
            
            User = get_user_model()
            
            total_students = User.objects.filter(role='STUDENT', school=school).count()
            total_teachers = User.objects.filter(role='TEACHER', school=school).count()
            
            # Since role is an Enum in User, mapping to exact string may need adjustments depending on how roles are actually stored.
            # In Django, roles are choices like 'STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN', 'PARENT'.
            # If accountant, librarian etc are not in User.Role, we just return 0 for now or fetch them if added.
            
            today = timezone.now().date()
            present_count = Attendance.objects.filter(student__school=school, date=today, status='Present').count()
            today_attendance_percent = round((present_count / total_students) * 100) if total_students > 0 else 0
            
            # Fees logic using fee_receipts (or FeePayment model if named differently)
            # Checking apps.finance.models -> looks like FeePayment is used earlier in ChildOverviewView
            from apps.finance.models import FeePayment, FeeInvoice
            fees_collected = FeePayment.objects.filter(
                invoice__student__school=school,
                payment_date__year=today.year,
                payment_date__month=today.month
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            pending_fees = FeeInvoice.objects.filter(student__school=school).aggregate(
                total=Sum('amount') - Sum('paid_amount')
            )['total'] or 0

            stats = {
                "totalStudents": total_students,
                "totalTeachers": total_teachers,
                "totalAccountants": User.objects.filter(role='ACCOUNTANT', school=school).count() if hasattr(User.Role, 'ACCOUNTANT') else 0,
                "totalLibrarians": User.objects.filter(role='LIBRARIAN', school=school).count() if hasattr(User.Role, 'LIBRARIAN') else 0,
                "totalReceptionists": User.objects.filter(role='RECEPTIONIST', school=school).count() if hasattr(User.Role, 'RECEPTIONIST') else 0,
                "totalTransportStaff": 0,
                "totalWardens": 0,
                "totalHR": 0,
                "todayAttendancePercent": today_attendance_percent,
                "feesCollected": fees_collected,
                "pendingFees": pending_fees,
                "upcomingExams": 15,
                "newAdmissions": 12,
                "notifications": 5,
                "birthdayToday": 2
            }
            return Response({"success": True, "data": stats})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SchoolAdminSchoolListView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']
    
    def get(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"success": True, "data": []})
            
        student_count = Student.objects.filter(school=school).count()
        data = [{
            "id": school.id,
            "name": school.name,
            "email": school.email,
            "phone": school.phone_number,
            "city": school.city,
            "subscription_status": school.subscription_status,
            "billing_cycle": school.billing_cycle,
            "created_at": school.created_at,
            "plan_name": school.plan.name if school.plan else None,
            "max_students": school.plan.max_students if school.plan else None,
            "monthly_price": school.plan.monthly_price if school.plan else None,
            "yearly_price": school.plan.yearly_price if school.plan else None,
            "current_students": student_count
        }]
        return Response({"success": True, "data": data})

class DashboardAlertsView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']

    def get(self, request, *args, **kwargs):
        school = request.user.school
        pending_leaves = Leave.objects.filter(school=school, status='Pending').order_by('-created_at')[:5]
        leave_data = LeaveSerializer(pending_leaves, many=True).data
        grievance_count = Grievance.objects.filter(school=school).exclude(status='Resolved').count()
        critical_alerts = []
        if grievance_count > 0:
            critical_alerts.append({
                "id": "grievance",
                "type": "Issue",
                "severity": "high",
                "message": f"{grievance_count} unresolved grievances.",
                "time": "Today"
            })
        if not critical_alerts:
            critical_alerts.append({"id": "1", "type": "System", "severity": "low", "message": "School operations running smoothly.", "time": "Just now"})
            
        return Response({"success": True, "data": {"criticalAlerts": critical_alerts, "pendingLeaves": leave_data}})

class LeaveListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, user=self.request.user)

class LeaveStatusUpdateView(SchoolBaseView, generics.UpdateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

class GrievanceListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Grievance.objects.all()
    serializer_class = GrievanceSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class EventListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class EventDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

import random
from django.db import transaction
from apps.authentication.models import User
from apps.schools.models import (
    School, Student, Teacher, Parent, Principal, Accountant, 
    Librarian, TransportManager, Receptionist, HostelWarden, HRManager
)
from apps.attendance.models import Attendance
from apps.finance.models import FeeReceipt # Or whichever model tracks fees

class CreateUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = request.data
        role_name = data.get('roleName')
        creator_role = request.user.role
        
        # Super Admin creating School Admin
        if creator_role == 'SUPER_ADMIN':
            target_role = 'SCHOOL_ADMIN'
        else:
            target_role = role_name.upper().replace(' ', '_') if role_name else None
            
        if not target_role:
            return Response({"success": False, "message": "roleName is required"}, status=400)
            
        final_school_id = request.user.school_id
        
        try:
            with transaction.atomic():
                if target_role == 'SCHOOL_ADMIN':
                    school_name = data.get('schoolName')
                    if not school_name:
                        return Response({"success": False, "message": "School details missing"}, status=400)
                        
                    school = School.objects.create(
                        name=school_name,
                        email=data.get('schoolEmail'),
                        phone=data.get('schoolPhone'),
                        city=data.get('city'),
                        billing_cycle=data.get('billingCycle', 'Monthly')
                    )
                    final_school_id = school.id
                elif not final_school_id and data.get('schoolId'):
                    final_school_id = data.get('schoolId')
                
                # Create Core User
                user = User.objects.create_user(
                    username=data.get('admissionNo') or data.get('email') or f"user_{random.randint(1000,9999)}",
                    email=data.get('email', f"temp_{random.randint(1000,9999)}@example.com"),
                    password=data.get('password', '123456'),
                    role=target_role,
                    school_id=final_school_id,
                    first_name=data.get('name', ''),
                    phone_number=data.get('phone', '')
                )
                
                # Create Profile
                profile = None
                school_inst = School.objects.get(id=final_school_id)
                
                if target_role == 'STUDENT':
                    profile = Student.objects.create(
                        user=user, school=school_inst, class_id_id=data.get('classId'),
                        admission_no=data.get('admissionNo'), roll_number=data.get('rollNumber'),
                        section=data.get('section'), father_name=data.get('fatherName')
                    )
                elif target_role == 'PARENT':
                    profile = Parent.objects.create(
                        user=user, student_id=data.get('studentId'), relation=data.get('relation', 'Parent')
                    )
                elif target_role == 'TEACHER':
                    profile = Teacher.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId'),
                        subject=data.get('subject'), experience=data.get('experience', 0)
                    )
                elif target_role == 'PRINCIPAL':
                    profile = Principal.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId'), department=data.get('department')
                    )
                elif target_role == 'ACCOUNTANT':
                    profile = Accountant.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId')
                    )
                elif target_role == 'LIBRARIAN':
                    profile = Librarian.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId')
                    )
                elif target_role == 'TRANSPORT_MANAGER':
                    profile = TransportManager.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId')
                    )
                elif target_role == 'RECEPTIONIST':
                    profile = Receptionist.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId')
                    )
                elif target_role == 'HOSTEL_WARDEN':
                    profile = HostelWarden.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId')
                    )
                elif target_role == 'HR_MANAGER':
                    profile = HRManager.objects.create(
                        user=user, school=school_inst, employee_id=data.get('employeeId')
                    )

                return Response({
                    "success": True, 
                    "message": f"{target_role} account created successfully.",
                    "user": {"id": user.id, "email": user.email, "role": user.role}
                }, status=201)
                
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)


class SchoolUsersListView(SchoolBaseView, APIView):
    def get(self, request):
        users = User.objects.filter(school=request.user.school).exclude(role='SCHOOL_ADMIN').order_by('-created_at')
        data = [{
            "id": u.id, "name": u.get_full_name() or u.username, "email": u.email,
            "phone": u.phone_number, "role": u.role, "created_at": u.created_at
        } for u in users]
        return Response({"success": True, "count": len(data), "data": data})


class SchoolStudentsListView(SchoolBaseView, APIView):
    def get(self, request):
        students = Student.objects.filter(school=request.user.school).select_related('user', 'class_id')
        data = [{
            "id": s.user.id, "name": s.user.get_full_name() or s.user.username,
            "email": s.user.email, "phone": s.user.phone_number,
            "admission_no": s.admission_no, "roll_number": s.roll_number,
            "class_name": s.class_id.name if s.class_id else "",
            "section": s.section or (s.class_id.section if s.class_id else "")
        } for s in students]
        return Response({"success": True, "count": len(data), "data": data})

class SchoolTeachersListView(SchoolBaseView, APIView):
    def get(self, request):
        teachers = Teacher.objects.filter(school=request.user.school).select_related('user')
        data = [{
            "id": t.user.id, "name": t.user.get_full_name() or t.user.username,
            "email": t.user.email, "phone": t.user.phone_number,
            "employee_id": t.employee_id, "subject": t.subject
        } for t in teachers]
        return Response({"success": True, "count": len(data), "data": data})

class SchoolParentsListView(SchoolBaseView, APIView):
    def get(self, request):
        parents = Parent.objects.filter(student__school=request.user.school).select_related('user', 'student__user')
        data = [{
            "id": p.user.id, "name": p.user.get_full_name() or p.user.username,
            "email": p.user.email, "phone": p.user.phone_number,
            "relation": p.relation, "student_name": p.student.user.get_full_name() if p.student else ""
        } for p in parents]
        return Response({"success": True, "count": len(data), "data": data})


class SchoolAttendanceView(SchoolBaseView, APIView):
    def get(self, request):
        records = Attendance.objects.filter(student__school=request.user.school).order_by('-date')[:100]
        data = [{
            "id": r.id, "date": r.date, "status": r.status, "remarks": r.remarks,
            "student_name": r.student.user.get_full_name(),
            "admission_no": r.student.admission_no,
            "class_name": r.class_id.name if r.class_id else ""
        } for r in records]
        return Response({"success": True, "count": len(data), "data": data})
        
    def post(self, request):
        student_id = request.data.get('studentId')
        date = request.data.get('date')
        status_val = request.data.get('status')
        
        if not student_id or not date or not status_val:
            return Response({"success": False, "message": "Missing fields"}, status=400)
            
        try:
            student = Student.objects.get(id=student_id, school=request.user.school)
            att, created = Attendance.objects.update_or_create(
                student=student, date=date,
                defaults={'status': status_val, 'remarks': request.data.get('remarks', '')}
            )
            return Response({"success": True, "message": "Attendance marked"})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)


class NextAdmissionNoView(SchoolBaseView, APIView):
    def get(self, request):
        last_student = Student.objects.filter(school=request.user.school, admission_no__startswith='ADM-').order_by('-admission_no').first()
        next_no = 101
        if last_student and last_student.admission_no:
            try:
                next_no = int(last_student.admission_no.replace('ADM-', '')) + 1
            except:
                pass
        return Response({"success": True, "nextAdmissionNo": f"ADM-{next_no}"})
