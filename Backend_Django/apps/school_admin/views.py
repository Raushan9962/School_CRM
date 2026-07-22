from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Leave, Grievance, Event
from .serializers import LeaveSerializer, GrievanceSerializer, EventSerializer
from apps.schools.models import Student
from apps.schools.views import SchoolBaseView
from apps.accounts.permissions import HasRole

class SchoolAdminStatsView(APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['SCHOOL ADMIN']
    
    def get(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"error": "No school associated"}, status=status.HTTP_404_NOT_FOUND)
            
        try:
            total_students = Student.objects.filter(school=school).count()
            monthly_revenue = 0.0
            if school.plan:
                if school.billing_cycle == 'Monthly':
                    monthly_revenue = school.plan.monthly_price
                else:
                    monthly_revenue = school.plan.yearly_price / 12.0
                    
            stats = {
                "totalSchools": 1,
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
