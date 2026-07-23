from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404
import uuid

from django.utils import timezone
from .models import FeeStructure, StudentFeeInvoice, FeeReceipt, Expense, Payroll, Vendor, VendorPayment, ScholarshipDiscount, LegacyFee
from apps.schools.models import Student
from .serializers import (
    FeeStructureSerializer,
    StudentFeeInvoiceSerializer,
    FeeReceiptSerializer,
    ExpenseSerializer,
    PayrollSerializer,
    VendorSerializer,
    VendorPaymentSerializer,
    ScholarshipDiscountSerializer,
    LegacyFeeSerializer
)

class FinanceBaseView:
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Automatically filter by the user's school
        return self.queryset.filter(school=self.request.user.school)

class FeeStructureListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    
    def post(self, request, *args, **kwargs):
        school = request.user.school
        class_id = request.data.get('class_id')
        fee_type = request.data.get('fee_type')
        amount = request.data.get('amount')
        
        if class_id == 'ALL':
            from apps.academics.models import Class
            classes = Class.objects.filter(school=school)
            with transaction.atomic():
                for cls in classes:
                    if not FeeStructure.objects.filter(school=school, class_id=cls, fee_type=fee_type).exists():
                        FeeStructure.objects.create(school=school, class_id=cls, fee_type=fee_type, amount=amount)
            return Response({"success": True, "message": "Fee structure applied to all classes successfully."}, status=status.HTTP_201_CREATED)
        else:
            return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class FeeStructureRetrieveUpdateDestroyView(FinanceBaseView, generics.RetrieveUpdateDestroyAPIView):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer

class StudentFeeInvoiceListView(FinanceBaseView, generics.ListAPIView):
    queryset = StudentFeeInvoice.objects.all()
    serializer_class = StudentFeeInvoiceSerializer

class FeeReceiptListView(FinanceBaseView, generics.ListAPIView):
    queryset = FeeReceipt.objects.all()
    serializer_class = FeeReceiptSerializer

class ExpenseListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, created_by=self.request.user)

class CollectFeeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        school = request.user.school
        data = request.data
        student_id = data.get('student_id')
        invoice_ids = data.get('invoice_ids', [])
        amount_paid = data.get('amount_paid')
        payment_mode = data.get('payment_mode', 'Cash')
        transaction_id = data.get('transaction_id', '')
        
        if not student_id or not invoice_ids or amount_paid is None:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            amount_paid = float(amount_paid)
            # Need to fix the related name issue here, student.user__school is wrong, student.user.school is right but for filtering we can just use student__user__school if we want to filter from something else. Wait, student has no school ForeignKey directly? Oh, Student has class_id which has school. But wait! User has school.
            # We can just filter Student.objects.filter(id=student_id, user__school=school).first()
            student = get_object_or_404(Student, id=student_id, user__school=school)
            
            with transaction.atomic():
                invoices = StudentFeeInvoice.objects.filter(id__in=invoice_ids, student=student, school=school)
                total_due = sum(inv.due_amount - inv.paid_amount for inv in invoices)
                
                if amount_paid > total_due:
                    return Response({"error": "Amount paid cannot exceed total due"}, status=status.HTTP_400_BAD_REQUEST)
                
                remaining_payment = amount_paid
                for inv in invoices:
                    if remaining_payment <= 0:
                        break
                    inv_balance = float(inv.due_amount - inv.paid_amount)
                    pay_this_invoice = min(inv_balance, remaining_payment)
                    
                    inv.paid_amount = float(inv.paid_amount) + pay_this_invoice
                    remaining_payment -= pay_this_invoice
                    
                    if float(inv.paid_amount) >= float(inv.due_amount):
                        inv.status = 'Paid'
                    elif float(inv.paid_amount) > 0:
                        inv.status = 'Partial'
                        
                    inv.save()
                
                receipt_number = f"REC-{uuid.uuid4().hex[:8].upper()}"
                
                receipt = FeeReceipt.objects.create(
                    school=school,
                    receipt_number=receipt_number,
                    student=student,
                    payment_mode=payment_mode,
                    transaction_id=transaction_id,
                    total_amount=total_due,
                    amount_paid=amount_paid,
                    balance=total_due - amount_paid,
                    status='Paid' if (total_due - amount_paid) <= 0 else 'Partial',
                    created_by=request.user
                )
                
                serializer = FeeReceiptSerializer(receipt)
                return Response({
                    "message": "Fee collected successfully",
                    "receipt": serializer.data
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PayrollListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class MySalaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        payrolls = Payroll.objects.filter(staff=user).order_by('-year', '-month')
        
        # Simple sorting fix by sending data mapped by month name if needed or let frontend handle it
        data = []
        for p in payrolls:
            data.append({
                'id': p.id,
                'month': p.month,
                'year': p.year,
                'basic_salary': p.basic_salary,
                'allowances': p.allowances,
                'deductions': p.deductions,
                'net_salary': p.net_salary,
                'payment_date': p.payment_date,
                'status': p.status
            })
            
        return Response({'success': True, 'data': data})

class VendorListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

import datetime

class PayVendorView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        school = request.user.school
        vendor_id = request.data.get('vendor_id')
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method', 'Bank Transfer')
        
        if not vendor_id or not amount:
            return Response({"error": "Missing vendor_id or amount"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            amount = float(amount)
            vendor = get_object_or_404(Vendor, id=vendor_id, school=school)
            
            with transaction.atomic():
                vendor.pending_due = float(vendor.pending_due) - amount
                vendor.save()
                
                payment_date = request.data.get('payment_date')
                if not payment_date:
                    payment_date = datetime.date.today()
                
                payment = VendorPayment.objects.create(
                    school=school,
                    vendor=vendor,
                    amount=amount,
                    payment_date=payment_date,
                    payment_method=payment_method,
                    created_by=request.user
                )
                
                serializer = VendorPaymentSerializer(payment)
                return Response({
                    "message": "Vendor paid successfully",
                    "payment": serializer.data,
                    "new_pending_due": vendor.pending_due
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ScholarshipListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = ScholarshipDiscount.objects.all()
    serializer_class = ScholarshipDiscountSerializer
    
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, created_by=self.request.user)

class ScholarshipStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk, *args, **kwargs):
        school = request.user.school
        scholarship = get_object_or_404(ScholarshipDiscount, pk=pk, school=school)
        
        status_val = request.data.get('status')
        if not status_val:
            return Response({"error": "Missing status"}, status=status.HTTP_400_BAD_REQUEST)
            
        scholarship.status = status_val
        scholarship.save()
        
        serializer = ScholarshipDiscountSerializer(scholarship)
        return Response(serializer.data)

class LegacyFeeListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = LegacyFee.objects.all()
    serializer_class = LegacyFeeSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class LegacyFeeRetrieveDestroyView(FinanceBaseView, generics.RetrieveDestroyAPIView):
    queryset = LegacyFee.objects.all()
    serializer_class = LegacyFeeSerializer

class UnifiedStudentFeeListView(FinanceBaseView, APIView):
    def get(self, request, studentId):
        school = request.user.school
        student = get_object_or_404(Student, user_id=studentId, school=school)
        
        legacy_fees = LegacyFee.objects.filter(student=student).order_by('-due_date')
        new_invoices = StudentFeeInvoice.objects.filter(student=student).order_by('-created_at')
        
        results = []
        for lf in legacy_fees:
            results.append({
                'id': f'old_{lf.id}',
                'due_date': lf.due_date,
                'description': 'General Fee',
                'status': lf.status,
                'amount': lf.amount,
                'paid_date': lf.paid_date,
                'payment_method': lf.payment_method,
                'transaction_ref': lf.transaction_ref
            })
            
        for nfi in new_invoices:
            results.append({
                'id': f'new_{nfi.id}',
                'due_date': nfi.created_at,
                'description': nfi.fee_structure.fee_type,
                'status': nfi.status,
                'amount': nfi.due_amount,
                'paid_date': nfi.updated_at,
                'payment_method': None,
                'transaction_ref': None
            })
            
        results.sort(key=lambda x: x['due_date'] if x['due_date'] else timezone.now(), reverse=True)
        return Response(results)

class UnifiedFeeUpdateView(FinanceBaseView, APIView):
    def patch(self, request, fee_id_str):
        school = request.user.school
        
        if str(fee_id_str).startswith('new_'):
            actual_id = str(fee_id_str).replace('new_', '')
            invoice = get_object_or_404(StudentFeeInvoice, id=actual_id, school=school)
            
            status_val = request.data.get('status')
            if status_val:
                invoice.status = status_val
                if status_val == 'Paid':
                    invoice.paid_amount = invoice.due_amount
            invoice.save()
            
            return Response({'message': 'Fee updated successfully'})
            
        elif str(fee_id_str).startswith('old_'):
            actual_id = str(fee_id_str).replace('old_', '')
            legacy_fee = get_object_or_404(LegacyFee, id=actual_id, school=school)
            
            status_val = request.data.get('status')
            if status_val:
                legacy_fee.status = status_val
            if 'paid_date' in request.data:
                legacy_fee.paid_date = request.data['paid_date']
            if 'payment_method' in request.data:
                legacy_fee.payment_method = request.data['payment_method']
            if 'transaction_ref' in request.data:
                legacy_fee.transaction_ref = request.data['transaction_ref']
                
            legacy_fee.save()
            return Response({'message': 'Fee updated successfully'})

class LegacyFeeListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = LegacyFee.objects.all()
    serializer_class = LegacyFeeSerializer
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)

class LegacyFeeRetrieveDestroyView(FinanceBaseView, generics.RetrieveDestroyAPIView):
    queryset = LegacyFee.objects.all()
    serializer_class = LegacyFeeSerializer

class UnifiedStudentFeeListView(FinanceBaseView, APIView):
    def get(self, request, studentId):
        school = request.user.school
        student = get_object_or_404(Student, user_id=studentId, school=school)
        
        legacy_fees = LegacyFee.objects.filter(student=student).order_by('-due_date')
        new_invoices = StudentFeeInvoice.objects.filter(student=student).order_by('-created_at')
        
        results = []
        for lf in legacy_fees:
            results.append({
                'id': f'old_{lf.id}',
                'due_date': lf.due_date,
                'description': 'General Fee',
                'status': lf.status,
                'amount': lf.amount,
                'paid_date': lf.paid_date,
                'payment_method': lf.payment_method,
                'transaction_ref': lf.transaction_ref
            })
            
        for nfi in new_invoices:
            results.append({
                'id': f'new_{nfi.id}',
                'due_date': nfi.created_at,
                'description': nfi.fee_structure.fee_type,
                'status': nfi.status,
                'amount': nfi.due_amount,
                'paid_date': nfi.updated_at,
                'payment_method': None,
                'transaction_ref': None
            })
            
        results.sort(key=lambda x: x['due_date'] if x['due_date'] else timezone.now(), reverse=True)
        return Response(results)

class UnifiedFeeUpdateView(FinanceBaseView, APIView):
    def patch(self, request, fee_id_str):
        school = request.user.school
        
        if str(fee_id_str).startswith('new_'):
            actual_id = str(fee_id_str).replace('new_', '')
            invoice = get_object_or_404(StudentFeeInvoice, id=actual_id, school=school)
            
            status_val = request.data.get('status')
            if status_val:
                invoice.status = status_val
                if status_val == 'Paid':
                    invoice.paid_amount = invoice.due_amount
            invoice.save()
            
            return Response({'message': 'Fee updated successfully'})
            
        elif str(fee_id_str).startswith('old_'):
            actual_id = str(fee_id_str).replace('old_', '')
            legacy_fee = get_object_or_404(LegacyFee, id=actual_id, school=school)
            
            status_val = request.data.get('status')
            if status_val:
                legacy_fee.status = status_val
            if 'paid_date' in request.data:
                legacy_fee.paid_date = request.data['paid_date']
            if 'payment_method' in request.data:
                legacy_fee.payment_method = request.data['payment_method']
            if 'transaction_ref' in request.data:
                legacy_fee.transaction_ref = request.data['transaction_ref']
                
            legacy_fee.save()
            return Response({'message': 'Fee updated successfully'})
            
        else:
            # Fallback for standard integer IDs
            legacy_fee = get_object_or_404(LegacyFee, id=fee_id_str, school=school)
            status_val = request.data.get('status')
            legacy_fee.save()
            return Response({'message': 'Fee updated successfully'})

from django.db.models import Sum, Count
from apps.authentication.permissions import HasRole

class AccountantDashboardStatsView(FinanceBaseView, APIView):
    permission_classes = [IsAuthenticated, HasRole]
    required_roles = ['ACCOUNTANT', 'SCHOOL_ADMIN', 'SUPER_ADMIN']
    
    def get(self, request):
        school = request.user.school
        
        # Calculate stats
        total_collected = FeeReceipt.objects.filter(school=school, status='Paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        total_pending = StudentFeeInvoice.objects.filter(school=school, status__in=['Pending', 'Partial']).aggregate(total=Sum('due_amount') - Sum('paid_amount'))['total'] or 0
        total_expenses = Expense.objects.filter(school=school).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Recent transactions (mix of receipts and expenses)
        receipts = list(FeeReceipt.objects.filter(school=school).order_by('-created_at')[:5])
        expenses = list(Expense.objects.filter(school=school).order_by('-created_at')[:5])
        
        recent_transactions = []
        for r in receipts:
            recent_transactions.append({
                'id': f"REC-{r.id}", 'type': 'Income', 'amount': r.amount_paid,
                'date': r.created_at, 'description': f"Fee Receipt {r.receipt_number}"
            })
        for e in expenses:
            recent_transactions.append({
                'id': f"EXP-{e.id}", 'type': 'Expense', 'amount': e.amount,
                'date': e.created_at, 'description': e.category
            })
            
        recent_transactions.sort(key=lambda x: x['date'], reverse=True)
        
        return Response({
            "success": True,
            "data": {
                "totalCollected": total_collected,
                "totalPending": total_pending,
                "totalExpenses": total_expenses,
                "recentTransactions": recent_transactions[:5]
            }
        })


from .models import CRMSubscriptionRecord
from .serializers import CRMSubscriptionRecordSerializer

class CRMSubscriptionListCreateView(FinanceBaseView, generics.ListCreateAPIView):
    queryset = CRMSubscriptionRecord.objects.all()
    serializer_class = CRMSubscriptionRecordSerializer
    
    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, created_by=self.request.user)


class StudentFeeListView(FinanceBaseView, APIView):
    def get(self, request):
        school = request.user.school
        invoices = StudentFeeInvoice.objects.filter(school=school).select_related('student__user', 'fee_structure')
        
        data = []
        for inv in invoices:
            data.append({
                'id': inv.id,
                'student_name': inv.student.user.get_full_name() or inv.student.user.username,
                'admission_no': inv.student.admission_no,
                'fee_type': inv.fee_structure.fee_type,
                'due_amount': inv.due_amount,
                'paid_amount': inv.paid_amount,
                'status': inv.status,
                'created_at': inv.created_at
            })
        return Response({"success": True, "data": data})

class AssignStudentFeeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        school = request.user.school
        student_id = request.data.get('student_id')
        fee_structure_id = request.data.get('fee_structure_id')
        due_amount = request.data.get('due_amount')
        
        if not student_id or not fee_structure_id or due_amount is None:
            return Response({"success": False, "message": "Missing fields"}, status=400)
            
        student = get_object_or_404(Student, id=student_id, school=school)
        fee_structure = get_object_or_404(FeeStructure, id=fee_structure_id, school=school)
        
        invoice = StudentFeeInvoice.objects.create(
            school=school, student=student, fee_structure=fee_structure,
            due_amount=due_amount, assigned_by=request.user
        )
        return Response({"success": True, "message": "Fee assigned", "data": {"id": invoice.id}}, status=201)

class BulkGenerateStudentFeesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        school = request.user.school
        class_id = request.data.get('class_id')
        fee_structure_id = request.data.get('fee_structure_id')
        
        if not class_id or not fee_structure_id:
            return Response({"success": False, "message": "Missing fields"}, status=400)
            
        fee_structure = get_object_or_404(FeeStructure, id=fee_structure_id, school=school)
        students = Student.objects.filter(school=school, class_id_id=class_id)
        
        count = 0
        with transaction.atomic():
            for student in students:
                # Prevent duplicate assignments
                if not StudentFeeInvoice.objects.filter(student=student, fee_structure=fee_structure).exists():
                    StudentFeeInvoice.objects.create(
                        school=school, student=student, fee_structure=fee_structure,
                        due_amount=fee_structure.amount, assigned_by=request.user
                    )
                    count += 1
                    
        return Response({"success": True, "message": f"Generated fees for {count} students."})

class AccountantStudentsLookupView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        students = Student.objects.filter(school=request.user.school).select_related('user', 'class_id')
        data = [{
            "id": s.id, "name": s.user.get_full_name() or s.user.username,
            "admission_no": s.admission_no, "class_name": s.class_id.name if s.class_id else ""
        } for s in students]
        return Response({"success": True, "data": data})

from apps.academics.models import Class
class AccountantClassesLookupView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        classes = Class.objects.filter(school=request.user.school)
        data = [{"id": c.id, "name": c.name, "section": c.section} for c in classes]
        return Response({"success": True, "data": data})
