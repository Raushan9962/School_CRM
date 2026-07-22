from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
import json
import datetime

from .models import Attendance, DailyAttendanceQR, StaffAttendance
from apps.schools.models import Student
from .serializers import AttendanceSerializer, StaffAttendanceSerializer, DailyAttendanceQRSerializer
from apps.accounts.permissions import HasRole

class GenerateDailyQRView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN', 'TEACHER']

    def post(self, request, *args, **kwargs):
        school = request.user.school
        date_str = datetime.date.today()
        
        import uuid
        token = uuid.uuid4().hex
        
        qr, created = DailyAttendanceQR.objects.update_or_create(
            school=school,
            date=date_str,
            defaults={'token': token}
        )
        
        data = {
            "date": date_str,
            "token": token
        }
        return Response({"success": True, "data": data}, status=status.HTTP_200_OK)

class ScanAttendanceQRView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        qr_payload = request.data.get('qrPayload')
        if not qr_payload:
            return Response({"error": "QR Payload missing"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            payload_data = json.loads(qr_payload)
        except json.JSONDecodeError:
            return Response({"error": "Invalid QR Payload format"}, status=status.HTTP_400_BAD_REQUEST)
            
        today_str = str(datetime.date.today())
        
        if payload_data.get('date') != today_str:
            return Response({"error": "QR Code is expired or invalid for today"}, status=status.HTTP_400_BAD_REQUEST)
            
        user = request.user
        role = (user.role or '').lower()
        
        try:
            with transaction.atomic():
                if role == 'student':
                    student = Student.objects.filter(user=user).first()
                    if not student:
                        return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
                        
                    existing = Attendance.objects.filter(student=student, date=today_str).exists()
                    if existing:
                        return Response({"error": "Attendance already marked for today"}, status=status.HTTP_400_BAD_REQUEST)
                        
                    Attendance.objects.create(
                        student=student,
                        class_id=student.class_id,
                        date=today_str,
                        status='Present',
                        remarks='QR Scan'
                    )
                else:
                    existing = StaffAttendance.objects.filter(user=user, date=today_str).exists()
                    if existing:
                        return Response({"error": "Attendance already marked for today"}, status=status.HTTP_400_BAD_REQUEST)
                        
                    StaffAttendance.objects.create(
                        user=user,
                        date=today_str,
                        status='Present',
                        remarks='QR Scan'
                    )
                    
            return Response({"message": "Attendance marked successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Internal server error while marking attendance", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentAttendanceListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AttendanceSerializer
    
    def get_queryset(self):
        user_id = self.kwargs.get('student_id')
        return Attendance.objects.filter(student__user_id=user_id).order_by('-date')

class AttendanceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AttendanceSerializer
    
    def get_queryset(self):
        return Attendance.objects.filter(student__school=self.request.user.school).order_by('-date')

class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AttendanceSerializer
    queryset = Attendance.objects.all()
