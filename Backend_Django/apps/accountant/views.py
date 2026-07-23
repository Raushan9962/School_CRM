from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Sum
from django.shortcuts import get_object_or_404

from apps.finance.models import (
    FeeStructure, StudentFeeInvoice, FeeReceipt,
    Expense, Payroll, Vendor, VendorPayment,
    ScholarshipDiscount, LegacyFee, CRMSubscriptionRecord
)
from apps.finance.serializers import (
    FeeStructureSerializer, StudentFeeInvoiceSerializer, FeeReceiptSerializer,
    PayrollSerializer, CRMSubscriptionRecordSerializer
)
from apps.schools.models import Student
from apps.authentication.permissions import HasRole


class AccountantDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        school = request.user.school

        # Calculate stats
        total_collected = FeeReceipt.objects.filter(
            school=school, status='Paid'
        ).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0

        total_pending = StudentFeeInvoice.objects.filter(
            school=school, status__in=['Pending', 'Partial']
        ).aggregate(total=Sum('due_amount') - Sum('paid_amount'))['total'] or 0

        total_expenses = Expense.objects.filter(
            school=school
        ).aggregate(Sum('amount'))['amount__sum'] or 0

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


class CollectFeeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        school = request.user.school
        data = request.data
        student_id = data.get('student_id')
        invoice_id = data.get('invoice_id')
        amount_paid = data.get('amount_paid')
        payment_method = data.get('payment_method', 'Cash')

        if not all([student_id, invoice_id, amount_paid]):
            return Response({
                "success": False,
                "message": "student_id, invoice_id and amount_paid are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        invoice = get_object_or_404(StudentFeeInvoice, id=invoice_id, school=school)

        with transaction.atomic():
            import uuid
            receipt = FeeReceipt.objects.create(
                school=school,
                student=invoice.student,
                invoice=invoice,
                amount_paid=amount_paid,
                payment_method=payment_method,
                receipt_number=f"REC-{uuid.uuid4().hex[:8].upper()}",
                status='Paid',
                collected_by=request.user
            )
            invoice.paid_amount = (invoice.paid_amount or 0) + float(amount_paid)
            if invoice.paid_amount >= invoice.due_amount:
                invoice.status = 'Paid'
            else:
                invoice.status = 'Partial'
            invoice.save()

        return Response({
            "success": True,
            "message": "Fee collected successfully",
            "data": {"receipt_id": receipt.id, "receipt_number": receipt.receipt_number}
        }, status=status.HTTP_201_CREATED)


class FeeReceiptListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        school = request.user.school
        receipts = FeeReceipt.objects.filter(school=school).order_by('-created_at')
        serializer = FeeReceiptSerializer(receipts, many=True)
        return Response({"success": True, "data": serializer.data})


class StudentFeeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        school = request.user.school
        invoices = StudentFeeInvoice.objects.filter(school=school).select_related(
            'student__user', 'fee_structure'
        )

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
                if not StudentFeeInvoice.objects.filter(student=student, fee_structure=fee_structure).exists():
                    StudentFeeInvoice.objects.create(
                        school=school, student=student, fee_structure=fee_structure,
                        due_amount=fee_structure.amount, assigned_by=request.user
                    )
                    count += 1

        return Response({"success": True, "message": f"Generated fees for {count} students."})


class PayrollListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payrolls = Payroll.objects.filter(school=request.user.school).order_by('-created_at')
        serializer = PayrollSerializer(payrolls, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        serializer = PayrollSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(school=request.user.school)
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CRMSubscriptionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = CRMSubscriptionRecord.objects.filter(school=request.user.school)
        serializer = CRMSubscriptionRecordSerializer(records, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        serializer = CRMSubscriptionRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(school=request.user.school, created_by=request.user)
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class PayVendorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        school = request.user.school
        vendor = get_object_or_404(Vendor, pk=pk, school=school)
        amount = request.data.get('amount')
        notes = request.data.get('notes', '')

        if not amount:
            return Response({"success": False, "message": "Amount is required"}, status=400)

        payment = VendorPayment.objects.create(
            school=school, vendor=vendor,
            amount=amount, notes=notes, paid_by=request.user
        )
        return Response({"success": True, "message": "Payment recorded", "data": {"id": payment.id}}, status=201)


class AccountantStudentsLookupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        students = Student.objects.filter(school=request.user.school).select_related('user', 'class_id')
        data = [{
            "id": s.id,
            "name": s.user.get_full_name() or s.user.username,
            "admission_no": s.admission_no,
            "class_name": s.class_id.name if s.class_id else ""
        } for s in students]
        return Response({"success": True, "data": data})


class AccountantClassesLookupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.academics.models import Class
        classes = Class.objects.filter(school=request.user.school)
        data = [{"id": c.id, "name": c.name, "section": c.section} for c in classes]
        return Response({"success": True, "data": data})
