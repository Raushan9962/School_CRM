from rest_framework import serializers
from .models import FeeStructure, StudentFeeInvoice, FeeReceipt, Expense, LegacyFee

class LegacyFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegacyFee
        fields = '__all__'
        read_only_fields = ('school',)

class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = '__all__'
        read_only_fields = ('school',) # school is set automatically

class StudentFeeInvoiceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    fee_type = serializers.CharField(source='fee_structure.fee_type', read_only=True)
    
    class Meta:
        model = StudentFeeInvoice
        fields = '__all__'
        read_only_fields = ('school', 'assigned_by')

class FeeReceiptSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    
    class Meta:
        model = FeeReceipt
        fields = '__all__'
        read_only_fields = ('school', 'created_by')

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('school', 'created_by')

from .models import Payroll, Vendor, VendorPayment

class PayrollSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.username', read_only=True)
    
    class Meta:
        model = Payroll
        fields = '__all__'
        read_only_fields = ('school',)

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'
        read_only_fields = ('school',)

class VendorPaymentSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    
    class Meta:
        model = VendorPayment
        fields = '__all__'
        read_only_fields = ('school', 'created_by')

from .models import ScholarshipDiscount

class ScholarshipDiscountSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    
    class Meta:
        model = ScholarshipDiscount
        fields = '__all__'
        read_only_fields = ('school', 'created_by')
