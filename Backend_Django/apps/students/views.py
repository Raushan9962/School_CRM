from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction

from apps.schools.models import Student
from apps.authentication.models import User
from apps.schools.views import SchoolBaseView
from .serializers import StudentSerializer

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

class StudentProfileDetailView(SchoolBaseView, APIView):
    def get(self, request, pk, *args, **kwargs):
        student = get_object_or_404(Student, pk=pk, school=request.user.school)
        from apps.attendance.models import Attendance
        att_qs = Attendance.objects.filter(student=student)
        total_days = att_qs.count()
        present = att_qs.filter(status='Present').count()
        percentage = round((present / total_days) * 100) if total_days > 0 else 0

        data = {
            "basic_info": {
                "name": student.user.name or student.user.username,
                "admission_number": student.admission_no,
                "roll_number": student.roll_number,
                "class": student.class_id.name if student.class_id else 'Unassigned',
                "section": student.section,
                "gender": student.gender or "Not Specified",
                "blood_group": student.blood_group or "Not Specified",
            },
            "contact_info": {
                "mobile": student.parent_phone,
                "email": student.user.email,
            },
            "attendance_summary": {
                "working_days": total_days,
                "present": present,
                "percentage": f'{percentage}%'
            }
        }
        return Response({"success": True, "data": data})

class StudentDashboardStatsView(SchoolBaseView, APIView):
    def get(self, request, pk, *args, **kwargs):
        student = get_object_or_404(Student, user_id=pk, school=request.user.school)
        
        # 1. Attendance %
        from apps.attendance.models import Attendance
        att_qs = Attendance.objects.filter(student=student)
        total_days = att_qs.count()
        present_days = att_qs.filter(status='Present').count()
        attendance_percentage = round((present_days / total_days) * 100) if total_days > 0 else 0

        # 2. Pending Fees
        from apps.finance.models import StudentFeeInvoice, LegacyFee
        invoices = StudentFeeInvoice.objects.filter(student=student, status='Pending')
        pending_invoices = sum(inv.due_amount - inv.paid_amount for inv in invoices)
        
        legacy_fees = LegacyFee.objects.filter(student=student, status='Pending')
        pending_legacy = sum(fee.amount for fee in legacy_fees)
        
        pendingFees = pending_invoices + pending_legacy

        # 3. Latest Result
        from apps.academics.models import Result
        latest_result_obj = Result.objects.filter(student=student).order_by('-created_at').first()
        latestResult = None
        if latest_result_obj:
            latestResult = {
                "marks_obtained": latest_result_obj.marks_obtained,
                "total_marks": latest_result_obj.total_marks,
                "grade": latest_result_obj.grade
            }

        # 4. Check for pending admission fee
        admission_invoices = StudentFeeInvoice.objects.filter(
            student=student, 
            status='Pending', 
            fee_structure__fee_type__iexact='Admission Fee'
        )
        hasPendingAdmissionFee = admission_invoices.exists()

        return Response({
            "attendancePercentage": attendance_percentage,
            "pendingFees": pendingFees,
            "latestResult": latestResult,
            "hasPendingAdmissionFee": hasPendingAdmissionFee
        })
