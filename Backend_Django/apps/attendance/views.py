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
from apps.authentication.permissions import HasRole

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

class StaffAttendanceListView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']
    
    def get(self, request):
        school = request.user.school
        date_str = request.query_params.get('date', str(datetime.date.today()))
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        staff_users = User.objects.filter(school=school).exclude(role__in=['STUDENT', 'PARENT', 'SUPER_ADMIN'])
        
        data = []
        for u in staff_users:
            att = StaffAttendance.objects.filter(user=u, date=date_str).first()
            data.append({
                'user_id': u.id,
                'name': u.username,
                'role': u.role,
                'image': u.profile_image.url if u.profile_image else None,
                'attendance_id': att.id if att else None,
                'status': att.status if att else None,
                'remarks': att.remarks if att else None
            })
            
        return Response({'success': True, 'count': len(data), 'data': data})

class MarkStaffAttendanceView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']
    
    def post(self, request):
        school = request.user.school
        user_id = request.data.get('userId')
        date_str = request.data.get('date')
        status_val = request.data.get('status')
        remarks = request.data.get('remarks', '')
        
        if not all([user_id, date_str, status_val]):
            return Response({'success': False, 'message': 'userId, date, and status are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        from django.contrib.auth import get_user_model
        User = get_user_model()
        target_user = User.objects.filter(id=user_id, school=school).exclude(role__in=['STUDENT', 'PARENT', 'SUPER_ADMIN']).first()
        
        if not target_user:
            return Response({'success': False, 'message': 'Staff not found in your school'}, status=status.HTTP_404_NOT_FOUND)
            
        att, created = StaffAttendance.objects.update_or_create(
            user=target_user,
            date=date_str,
            defaults={'status': status_val, 'remarks': remarks}
        )
        
        return Response({
            'success': True, 
            'message': 'Attendance marked' if created else 'Attendance updated',
            'data': StaffAttendanceSerializer(att).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class MyAttendanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.role == 'STUDENT':
            student = Student.objects.filter(user=user).first()
            if not student:
                return Response({'success': False, 'message': 'Student profile not found'}, status=404)
            data = Attendance.objects.filter(student=student).order_by('-date').values('date', 'status', 'remarks')
        else:
            data = StaffAttendance.objects.filter(user=user).order_by('-date').values('date', 'status', 'remarks')
            
        return Response({'success': True, 'data': list(data)})

class MarkMyAttendanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        today_str = str(datetime.date.today())
        
        if user.role == 'STUDENT':
            student = Student.objects.filter(user=user).first()
            if not student:
                return Response({'success': False, 'message': 'Student profile not found'}, status=404)
            if Attendance.objects.filter(student=student, date=today_str).exists():
                return Response({'success': False, 'message': 'Attendance already marked for today'}, status=400)
                
            Attendance.objects.create(student=student, class_id=student.class_id, date=today_str, status='Present', remarks='Self marked')
        else:
            if StaffAttendance.objects.filter(user=user, date=today_str).exists():
                return Response({'success': False, 'message': 'Attendance already marked for today'}, status=400)
                
            StaffAttendance.objects.create(user=user, date=today_str, status='Present', remarks='Self marked')
            
        return Response({'success': True, 'message': 'Attendance marked successfully'})
