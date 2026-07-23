from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.schools.views import SchoolBaseView
from apps.schools.models import Student
from apps.parents.models import Parent
from apps.attendance.models import Attendance
from apps.finance.models import StudentFeeInvoice, FeeReceipt
from apps.academics.models import Result, Homework, Timetable
from apps.leaves.models import Leave

class ChildrenListView(SchoolBaseView, APIView):
    def get(self, request):
        parents = Parent.objects.filter(user=request.user, school=request.user.school)
        
        children = []
        for p in parents:
            student = p.student
            children.append({
                'studentId': student.user.id,
                'name': student.user.username,
                'email': student.user.email,
                'admissionNo': student.admission_no,
                'studentDbId': student.id,
                'class': student.class_id.name if student.class_id else None,
                'section': student.class_id.section if student.class_id else None,
            })
            
        if not children:
            # Fallback mock data
            return Response([
                { 'studentId': 101, 'name': "Rahul Sharma", 'class': "10th", 'section': "A", 'admissionNo': "AD1001", 'rollNo': "45", 'image': "" },
                { 'studentId': 102, 'name': "Priya Sharma", 'class': "8th", 'section': "B", 'admissionNo': "AD1050", 'rollNo': "12", 'image': "" }
            ], status=status.HTTP_200_OK)
            
        return Response(children, status=status.HTTP_200_OK)


class ChildOverviewView(SchoolBaseView, APIView):
    def get(self, request, childId):
        from django.db.models import Sum, Count, Q
        
        student = Student.objects.filter(user_id=childId, school=request.user.school).first()
        if not student:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # 1. Fee Metrics
        invoices = StudentFeeInvoice.objects.filter(student=student)
        total_paid = sum(inv.paid_amount for inv in invoices)
        total_pending = sum(inv.due_amount - inv.paid_amount for inv in invoices)

        # 2. Attendance Metric
        att_qs = Attendance.objects.filter(student=student)
        total_days = att_qs.count()
        present_days = att_qs.filter(status='Present').count()
        attendance_percentage = round((present_days / total_days) * 100) if total_days > 0 else 0

        # 3. Exams Metric
        total_exams = Result.objects.filter(student=student).values('exam').distinct().count()

        # 4. Recent Activity
        recent_activity = []
        
        recent_payments = FeeReceipt.objects.filter(student=student).order_by('-payment_date')[:3]
        for p in recent_payments:
            recent_activity.append({
                'title': 'Fee Paid',
                'description': f'₹{p.amount_paid} was paid.',
                'time': p.payment_date,
                'type': 'fee'
            })
            
        recent_leaves = Leave.objects.filter(user_id=childId).order_by('-created_at')[:3]
        for l in recent_leaves:
            recent_activity.append({
                'title': f'Leave {l.status}',
                'description': f'Leave request was {l.status.lower()}.',
                'time': l.created_at,
                'type': 'leave'
            })
            
        recent_activity.sort(key=lambda x: x['time'], reverse=True)

        return Response({
            'success': True,
            'data': {
                'total_paid': total_paid,
                'total_pending': total_pending,
                'attendance_percentage': attendance_percentage,
                'total_exams': total_exams,
                'recent_activity': recent_activity[:5]
            }
        })


class ChildProfileView(SchoolBaseView, APIView):
    def get(self, request, childId):
        # Mock logic
        return Response({
            'id': childId,
            'name': "Rahul Sharma",
            'admissionNumber': "AD1001",
            'rollNumber': "45",
            'dob': "2010-05-15",
            'gender': "Male",
            'bloodGroup': "O+",
            'religion': "Hindu",
            'class': "10th",
            'section': "A",
            'house': "Red House",
            'fatherName': "Rajesh Sharma",
            'motherName': "Sunita Sharma",
            'mobile': "9876543210",
            'address': "123 Main St, City"
        })

class ChildAttendanceView(SchoolBaseView, APIView):
    def get(self, request, childId):
        return Response({
            'percentage': 85,
            'presentDays': 170,
            'absentDays': 30,
            'recent': [
                { 'date': "2023-10-01", 'status': "Present" },
                { 'date': "2023-10-02", 'status': "Absent" }
            ]
        })

class ChildFeesView(SchoolBaseView, APIView):
    def get(self, request, childId):
        return Response({
            'totalAnnualFee': 50000,
            'paidAmount': 30000,
            'pendingAmount': 20000,
            'nextDueDate': "2023-11-10",
            'history': [
                { 'receiptNo': "REC101", 'date': "2023-04-05", 'amount': 15000, 'status': "Paid" },
                { 'receiptNo': "REC102", 'date': "2023-07-10", 'amount': 15000, 'status': "Paid" }
            ]
        })

class ChildResultsView(SchoolBaseView, APIView):
    def get(self, request, childId):
        return Response({
            'recentExam': "Mid Term",
            'percentage': 88,
            'grade': "A",
            'rank': 5,
            'subjects': [
                { 'name': "Math", 'marks': 95, 'maxMarks': 100 },
                { 'name': "Science", 'marks': 85, 'maxMarks': 100 },
                { 'name': "English", 'marks': 84, 'maxMarks': 100 }
            ]
        })

class ChildHomeworkView(SchoolBaseView, APIView):
    def get(self, request, childId):
        return Response([
            { 'id': 1, 'subject': "Math", 'teacher': "Mr. Smith", 'assignment': "Algebra Chap 2", 'dueDate': "2023-10-25", 'status': "Pending" },
            { 'id': 2, 'subject': "Science", 'teacher': "Mrs. Jones", 'assignment': "Physics Lab Report", 'dueDate': "2023-10-24", 'status': "Submitted" }
        ])

class ChildTimetableView(SchoolBaseView, APIView):
    def get(self, request, childId):
        return Response([
            { 'period': 1, 'subject': "Mathematics", 'teacher': "Mr. Smith", 'time': "8:00-8:45" },
            { 'period': 2, 'subject': "Science", 'teacher': "Mrs. Jones", 'time': "8:45-9:30" }
        ])
