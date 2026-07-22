from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404
import uuid

from .models import FeeStructure, StudentFeeInvoice, FeeReceipt, Expense, Payroll, Vendor, VendorPayment, ScholarshipDiscount
from apps.schools.models import Student
from .serializers import (
    FeeStructureSerializer,
    StudentFeeInvoiceSerializer,
    FeeReceiptSerializer,
    ExpenseSerializer,
    PayrollSerializer,
    VendorSerializer,
    VendorPaymentSerializer,
    ScholarshipDiscountSerializer
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
            from apps.schools.models import Class
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
