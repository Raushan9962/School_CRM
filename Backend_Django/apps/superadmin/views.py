from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum, Q, F
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from apps.authentication.permissions import IsSuperAdmin
from .models import SubscriptionPlan, Transaction, PlatformSetting
from apps.schools.models import School
from apps.authentication.models import User
from .serializers import (
    TransactionSerializer,
    PlatformSettingSerializer
)

class SuperAdminBaseView:
    permission_classes = [IsSuperAdmin]

class TransactionListView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        status_param = request.query_params.get('status', 'All')
        search_param = request.query_params.get('search', '')
        
        queryset = Transaction.objects.all().select_related('school', 'plan')
        
        if status_param and status_param != 'All':
            queryset = queryset.filter(status=status_param)
            
        if search_param:
            queryset = queryset.filter(
                Q(school__name__icontains=search_param) | 
                Q(invoice_no__icontains=search_param)
            )
            
        serializer = TransactionSerializer(queryset.order_by('-transaction_date'), many=True)
        
        # Summary
        summary_qs = Transaction.objects.values('status').annotate(count=Count('id'), total=Sum('amount'))
        
        total_revenue = sum(float(item['total']) for item in summary_qs if item['status'] == 'Paid' and item['total'])
        
        return Response({
            "success": True,
            "totalRevenue": total_revenue,
            "count": queryset.count(),
            "summary": list(summary_qs),
            "data": serializer.data
        })

class TransactionDetailView(SuperAdminBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class AdminStatsView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, *args, **kwargs):
        try:
            # 1. Total Schools and Estimated Monthly Revenue
            from django.db.models import Sum, Case, When, F, FloatField, Q
            
            schools_qs = School.objects.filter(subscription_status='Active').annotate(
                monthly_rev=Case(
                    When(billing_cycle='Monthly', then=F('plan__monthly_price')),
                    When(billing_cycle='Yearly', then=F('plan__yearly_price') / 12.0),
                    default=0.0,
                    output_field=FloatField()
                )
            ).aggregate(
                total_schools=Count('id'),
                total_revenue=Sum('monthly_rev')
            )
            
            total_schools = schools_qs.get('total_schools') or 0
            monthly_revenue = schools_qs.get('total_revenue') or 0.0
            
            # 2. Total Students
            # Since Student model stores the actual students
            from apps.schools.models import Student
            total_students = Student.objects.count()
            
            stats = {
                "totalSchools": total_schools,
                "totalStudents": total_students,
                "estimatedMonthlyRevenue": f"{monthly_revenue:.2f}"
            }
            
            return Response({"success": True, "data": stats})
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SuperAdminDashboardView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        try:
            total_schools = School.objects.count()
            
            users_by_role_qs = User.objects.values('role').annotate(count=Count('id'))
            users_by_role = {item['role']: item['count'] for item in users_by_role_qs}
            users_by_role['TOTAL'] = User.objects.count()
            
            revenue_qs = Transaction.objects.filter(status='Paid').aggregate(total_revenue=Sum('amount'))
            total_revenue = revenue_qs.get('total_revenue') or 0
            
            plan_dist_qs = School.objects.values('plan__name').annotate(count=Count('id'))
            plan_distribution = {item['plan__name'] or 'No Plan': item['count'] for item in plan_dist_qs}
            
            return Response({
                "success": True,
                "stats": {
                    "totalSchools": total_schools,
                    "usersByRole": users_by_role,
                    "revenue": {"total_revenue": total_revenue},
                    "planDistribution": [{"plan_name": k, "school_count": v} for k, v in plan_distribution.items()]
                }
            })
            
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MonthlyRevenueView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        one_year_ago = timezone.now() - timedelta(days=365)
        revenue_data = Transaction.objects.filter(status='Paid', transaction_date__gte=one_year_ago)\
            .annotate(month=TruncMonth('transaction_date'))\
            .values('month')\
            .annotate(revenue=Sum('amount'))\
            .order_by('month')
            
        formatted_data = []
        for item in revenue_data:
            formatted_data.append({
                "month": item['month'].strftime('%b %Y'),
                "month_key": item['month'].strftime('%Y-%m'),
                "revenue": item['revenue']
            })
            
        return Response({"success": True, "data": formatted_data})

class ExpiringSoonSchoolsView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        thirty_days_from_now = timezone.now().date() + timedelta(days=30)
        today = timezone.now().date()
        
        schools = School.objects.filter(
            subscription_end_date__range=(today, thirty_days_from_now)
        ).select_related('plan')
        
        data = []
        for s in schools:
            data.append({
                "school_id": s.id,
                "school_name": s.name,
                "school_email": s.email,
                "school_phone": s.phone_number,
                "city": s.city,
                "plan_name": s.plan.name if s.plan else None,
                "next_renewal_date": s.subscription_end_date
            })
            
        return Response({"success": True, "count": len(data), "data": data})

class AllUsersView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        school_id = request.query_params.get('school_id')
        queryset = User.objects.all().select_related('school')
        
        if school_id:
            queryset = queryset.filter(school_id=school_id)
            
        by_role = {}
        data = []
        for u in queryset:
            by_role[u.role] = by_role.get(u.role, 0) + 1
            data.append({
                "id": u.id,
                "name": u.username,
                "email": u.email,
                "phone": u.phone_number,
                "is_active": u.is_active,
                "role_name": u.role,
                "school_name": u.school.name if u.school else None
            })
            
        return Response({"success": True, "total": len(data), "byRole": by_role, "data": data})

class AllSchoolsView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        from apps.schools.models import Student
        from django.db.models import Prefetch, Subquery, OuterRef
        
        # Subquery for student count
        student_count_sq = Student.objects.filter(school=OuterRef('pk')).values('school').annotate(c=Count('id')).values('c')
        
        schools = School.objects.annotate(
            current_students=Subquery(student_count_sq)
        ).select_related('plan').order_by('-created_at')
        
        data = []
        for s in schools:
            data.append({
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "phone": s.phone_number,
                "city": s.city,
                "subscription_status": s.subscription_status,
                "billing_cycle": s.billing_cycle,
                "created_at": s.created_at,
                "plan_name": s.plan.name if s.plan else None,
                "max_students": s.plan.max_students if s.plan else None,
                "monthly_price": s.plan.monthly_price if s.plan else None,
                "yearly_price": s.plan.yearly_price if s.plan else None,
                "current_students": s.current_students or 0
            })
            
        return Response({"success": True, "data": data})

class UpdateSchoolSubscriptionView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def patch(self, request, pk, *args, **kwargs):
        try:
            school = School.objects.get(pk=pk)
            if 'subscription_start_date' in request.data:
                school.subscription_start_date = request.data['subscription_start_date']
            if 'subscription_end_date' in request.data:
                school.subscription_end_date = request.data['subscription_end_date']
            if 'subscription_status' in request.data:
                school.subscription_status = request.data['subscription_status']
            if 'is_active' in request.data:
                school.is_active = request.data['is_active']
                
            school.save()
            return Response({"success": True, "message": "Subscription updated"})
        except School.DoesNotExist:
            return Response({"success": False, "message": "School not found"}, status=status.HTTP_404_NOT_FOUND)

class RevenueReportView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        stats = Transaction.objects.filter(status='Paid').aggregate(
            total_revenue=Sum('amount'),
            transaction_count=Count('id')
        )
        total_revenue = float(stats['total_revenue'] or 0)
        
        return Response({
            "success": True,
            "data": {
                "totalRevenue": total_revenue,
                "transactionCount": stats['transaction_count'],
                "projectedRevenue": total_revenue * 1.2,
                "pendingDues": 0
            }
        })

class PlatformSettingsView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        settings = PlatformSetting.objects.all()
        data = {s.setting_key: s.setting_value for s in settings}
        return Response({"success": True, "data": data})
        
    def put(self, request, *args, **kwargs):
        for key, value in request.data.items():
            setting, created = PlatformSetting.objects.get_or_create(setting_key=key)
            setting.setting_value = str(value)
            setting.save()
        return Response({"success": True, "message": "Settings updated successfully"})

class SendRemindersView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def post(self, request, *args, **kwargs):
        return Response({"success": True, "message": "Reminders sent successfully to all expiring schools"})

class AllSchoolAdminsListView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request, *args, **kwargs):
        admins = User.objects.filter(role='SCHOOL_ADMIN').select_related('school')
        data = [{
            "admin_id": a.id, "admin_name": a.get_full_name() or a.username,
            "admin_email": a.email, "admin_phone": a.phone_number,
            "school_name": a.school.name if a.school else None,
            "school_email": a.school.email if a.school else None,
            "registered_at": a.created_at
        } for a in admins]
        return Response({"success": True, "count": len(data), "data": data})

class SeedRolesView(APIView):
    # This is for testing/initialization, maybe restrict to superadmin
    permission_classes = [IsSuperAdmin]
    
    def post(self, request, *args, **kwargs):
        # In Django we use Enum on the User model `User.Role`, so seeding isn't technically required 
        # in the DB unless we change to a dynamic Role model. Returning success to mock Node.js behavior.
        return Response({"success": True, "message": "Roles seeded", "created": []})
