from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Leave
from .serializers import LeaveSerializer

class LeaveViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing leave instances.
    Provides create, retrieve, update, destroy, and list actions automatically.
    """
    serializer_class = LeaveSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned leaves to a given user,
        by filtering against a `user_id` query parameter in the URL.
        """
        queryset = Leave.objects.all().order_by('-created_at')
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    def update(self, request, *args, **kwargs):
        """
        Custom update method to handle status updates specifically if needed,
        though ModelViewSet already handles full and partial updates.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Send Email
        status_val = serializer.validated_data.get('status', instance.status)
        if status_val in ['Approved', 'Rejected', 'APPROVED', 'REJECTED']:
            from django.core.mail import send_mail
            user = instance.user
            if user.email:
                send_mail(
                    f'Leave Request {status_val}',
                    f'Dear {user.username},\n\nYour leave request has been {status_val} by the administration.\n\nRegards,\nSchool Admin',
                    'noreply@schoolcrm.com',
                    [user.email],
                    fail_silently=True,
                )
        
        return Response({'message': 'Leave updated successfully', 'data': serializer.data})

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class MyLeavesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        leaves = Leave.objects.filter(user=user).order_by('-created_at')
        
        leave_data = []
        casual_used = 0
        medical_used = 0
        earned_used = 0
        
        for l in leaves:
            days = (l.end_date - l.start_date).days + 1
            leave_data.append({
                'id': l.id,
                'leave_type': l.leave_type,
                'start_date': l.start_date,
                'end_date': l.end_date,
                'days': days,
                'reason': l.reason,
                'status': l.status,
                'created_at': l.created_at
            })
            if l.status.lower() == 'approved':
                t = (l.leave_type or '').lower()
                if 'casual' in t: casual_used += days
                if 'medical' in t or 'sick' in t: medical_used += days
                if 'earned' in t: earned_used += days
                
        balance = {
            'casual': max(0, 8 - casual_used),
            'medical': max(0, 5 - medical_used),
            'earned': max(0, 12 - earned_used)
        }
        
        return Response({'success': True, 'data': leave_data, 'balance': balance})

class ApplyLeaveView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = request.data
        if not data.get('leave_type') or not data.get('start_date') or not data.get('end_date') or not data.get('reason'):
            return Response({'success': False, 'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        leave = Leave.objects.create(
            user=request.user,
            leave_type=data.get('leave_type'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            reason=data.get('reason'),
            status='Pending'
        )
        return Response({'success': True, 'message': 'Leave application submitted successfully', 'data': LeaveSerializer(leave).data}, status=status.HTTP_201_CREATED)
