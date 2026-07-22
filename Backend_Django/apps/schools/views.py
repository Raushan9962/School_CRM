from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import (
    School, Class, Student, Teacher, Subject, Timetable, SyllabusTracking, 
    Exam, Result, DisciplineLog, Leave, 
    PrincipalTask, Grievance, Event, AdmissionRequest, Parent
)
from apps.accounts.models import User
from .serializers import (
    SchoolSerializer,
    ClassSerializer,
    StudentSerializer,
    TeacherSerializer, SubjectSerializer, TimetableSerializer, 
    SyllabusTrackingSerializer, ExamSerializer, ResultSerializer, 
    DisciplineLogSerializer, LeaveSerializer, 
    PrincipalTaskSerializer, GrievanceSerializer, EventSerializer,
    AdmissionRequestSerializer, ParentSerializer
)
from apps.finance.models import FeeStructure, StudentFeeInvoice
import uuid
from apps.accounts.permissions import HasRole

class SchoolBaseView:
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Base filter to ensure isolation per school
        # The school model doesn't have a 'school' field, so we must be careful here.
        # But Class and Student DO have a 'school' field.
        return self.queryset.filter(school=self.request.user.school)

class SchoolProfileView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SUPER ADMIN', 'SCHOOL ADMIN']
    
    def get(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"error": "No school associated with this user"}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = SchoolSerializer(school)
        return Response({"success": True, "data": serializer.data})
        
    def put(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"error": "No school associated with this user"}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = SchoolSerializer(school, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Profile updated successfully", "data": serializer.data})
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SchoolAdminStatsView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']
    
    def get(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"error": "No school associated"}, status=status.HTTP_404_NOT_FOUND)
            
        try:
            # 1. Total Students in THIS school
            total_students = Student.objects.filter(school=school).count()
            
            # 2. Monthly Revenue (Cost of their plan)
            monthly_revenue = 0.0
            if school.plan:
                if school.billing_cycle == 'Monthly':
                    monthly_revenue = school.plan.monthly_price
                else:
                    monthly_revenue = school.plan.yearly_price / 12.0
                    
            stats = {
                "totalSchools": 1,  # They only have 1 school
                "totalStudents": total_students,
                "estimatedMonthlyRevenue": f"{monthly_revenue:.2f}"
            }
            
            return Response({"success": True, "data": stats})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SchoolAdminSchoolListView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']
    
    def get(self, request, *args, **kwargs):
        # Returns just their school in a list to match the getSchoolsList format
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

class ClassListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class ClassDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

class StudentListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        phone_number = data.get('phone_number')
        
        if not username or not email or not password:
            return Response({"error": "Username, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            with transaction.atomic():
                # 1. Create the User record
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    phone_number=phone_number,
                    role='STUDENT',
                    school=request.user.school
                )
                
                # 2. Create the Student record
                student_data = data.copy()
                student_data.pop('username', None)
                student_data.pop('email', None)
                student_data.pop('password', None)
                student_data.pop('phone_number', None)
                
                serializer = self.get_serializer(data=student_data)
                if serializer.is_valid():
                    serializer.save(user=user, school=request.user.school)
                    return Response({"success": True, "message": "Student created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
                else:
                    raise Exception(str(serializer.errors))
                    
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentDetailView(SchoolBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

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

class ResultListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)


class DisciplineLogListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = DisciplineLog.objects.all()
    serializer_class = DisciplineLogSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, reported_by=self.request.user)

class LeaveListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, user=self.request.user)

class LeaveStatusUpdateView(SchoolBaseView, generics.UpdateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

class PrincipalTaskListCreateView(SchoolBaseView, generics.ListCreateAPIView):
    queryset = PrincipalTask.objects.all()
    serializer_class = PrincipalTaskSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

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

class StudentProfileDetailView(SchoolBaseView, APIView):
    def get(self, request, pk, *args, **kwargs):
        student = get_object_or_404(Student, pk=pk, school=request.user.school)
        data = {
            "basic_info": {
                "name": student.user.name or student.user.username,
                "admission_number": student.admission_no,
                "roll_number": student.roll_number,
                "class": student.class_id.name if student.class_id else 'Unassigned',
                "section": student.section,
                "gender": "Male",
                "blood_group": "O+",
            },
            "contact_info": {
                "mobile": student.parent_phone,
                "email": student.user.email,
            },
            "attendance_summary": {
                "working_days": 120,
                "present": 112,
                "percentage": '93%'
            }
        }
        return Response({"success": True, "data": data})

class AdmissionApplyView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        data = request.data
        phone = data.get('phone')
        if phone:
            existing_staff = User.objects.filter(phone_number=phone).exclude(role='PARENT').exists()
            if existing_staff:
                return Response({"success": False, "message": "Phone number belongs to Staff/Admin. Please use another."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AdmissionRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save(school=request.user.school)
            return Response({"success": True, "message": "Admission request submitted", "request": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AdmissionRequestListView(SchoolBaseView, generics.ListAPIView):
    queryset = AdmissionRequest.objects.all().order_by('-created_at')
    serializer_class = AdmissionRequestSerializer

class AdmissionApproveView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN', 'SUPER ADMIN']
    
    def post(self, request, pk, *args, **kwargs):
        from django.db.models import Q
        school = request.user.school
        try:
            req = AdmissionRequest.objects.get(pk=pk, school=school)
        except AdmissionRequest.DoesNotExist:
            return Response({"success": False, "message": "Request not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if req.status == 'Approved':
            existing = Student.objects.filter(school=school, class_id=req.class_applied_for, user__name=req.student_name).first()
            if existing:
                return Response({"success": True, "message": "Already approved. Student account exists.", "credentials": {"student": {"username": existing.user.username, "password": "(use existing password)"}}})
                
        try:
            with transaction.atomic():
                req.status = 'Approved'
                req.save()
                
                total = 5000
                fee_struct = FeeStructure.objects.filter(school=school, class_id=req.class_applied_for, fee_type='Admission Fee').first()
                if fee_struct:
                    total = fee_struct.amount
                else:
                    fee_struct = FeeStructure.objects.create(school=school, class_id=req.class_applied_for, fee_type='Admission Fee', amount=total)
                    
                parent_email = f"p_{req.email}" if req.email else None
                existing_parent = User.objects.filter(role='PARENT', school=school).filter(
                    Q(email=parent_email) | Q(phone_number=req.phone)
                ).first()
                
                parent_pass = "(Existing — use your current password)"
                if existing_parent:
                    p_user = existing_parent
                    parent_username = p_user.username
                else:
                    parent_username = f"PAR{str(uuid.uuid4().int)[:6]}"
                    parent_pass = uuid.uuid4().hex[:8]
                    p_user = User.objects.create_user(
                        username=parent_username,
                        email=parent_email,
                        password=parent_pass,
                        phone_number=req.phone,
                        role='PARENT',
                        school=school,
                        name=req.father_name or req.guardian_name or 'Parent'
                    )
                
                student_username = f"STU{str(uuid.uuid4().int)[:6]}"
                student_pass = uuid.uuid4().hex[:8]
                student_email = f"stu_{req.id}_{req.email}" if req.email else None
                
                s_user = User.objects.create_user(
                    username=student_username,
                    email=student_email,
                    password=student_pass,
                    role='STUDENT',
                    school=school,
                    name=req.student_name
                )
                
                admission_no = f"ADM{str(uuid.uuid4().int)[:6]}"
                
                student = Student.objects.create(
                    user=s_user,
                    school=school,
                    class_id=req.class_applied_for,
                    admission_no=admission_no,
                    father_name=req.father_name,
                    mother_name=req.mother_name,
                    parent_phone=req.phone,
                    religion=req.religion,
                    guardian_name=req.guardian_name,
                    parent_occupation=req.parent_occupation,
                    parent_income=req.parent_income,
                    board=req.board,
                    medical_allergies=req.medical_allergies,
                    medical_disabilities=req.medical_disabilities,
                    medical_doctor_name=req.medical_doctor_name,
                    emergency_contact=req.emergency_contact,
                    transport_route_id=req.transport_route_id,
                    transport_stop=req.transport_stop,
                    transport_pass_number=req.transport_pass_number,
                    hostel_block=req.hostel_block,
                    hostel_room=req.hostel_room,
                    hostel_bed=req.hostel_bed,
                    transport_required=req.transport_required,
                    parent_email=req.email,
                    category=req.category
                )
                
                Parent.objects.update_or_create(
                    user=p_user,
                    defaults={'student': student, 'relation': 'Father'}
                )
                
                StudentFeeInvoice.objects.create(
                    school=school,
                    student=student,
                    fee_structure=fee_struct,
                    due_amount=total,
                    paid_amount=0,
                    status='Pending'
                )
                
                return Response({
                    "success": True,
                    "message": "Approved, pending fee added, and users created",
                    "credentials": {
                        "student": {"username": student_username, "password": student_pass},
                        "parent": {"username": parent_username, "password": parent_pass}
                    }
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response({"success": False, "message": "Server error", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
