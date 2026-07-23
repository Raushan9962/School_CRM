from django.urls import path
from . import views

urlpatterns = [
    # Fee Structures
    path('fee-structures', views.FeeStructureListCreateView.as_view(), name='fee-structures-list'),
    path('fee-structures/<int:pk>', views.FeeStructureRetrieveUpdateDestroyView.as_view(), name='fee-structures-detail'),
    
    # Invoices, Receipts and Fees
    path('fees', views.LegacyFeeListCreateView.as_view(), name='fees-list'),
    path('fees/<int:pk>', views.LegacyFeeRetrieveDestroyView.as_view(), name='fees-detail'),
    path('fees/student/<int:studentId>', views.UnifiedStudentFeeListView.as_view(), name='unified-student-fees'),
    path('fees/update/<str:fee_id_str>', views.UnifiedFeeUpdateView.as_view(), name='unified-fee-update'),
    
    path('invoices', views.StudentFeeInvoiceListView.as_view(), name='invoices-list'),
    path('receipts', views.FeeReceiptListView.as_view(), name='receipts-list'),
    path('collect-fee', views.CollectFeeView.as_view(), name='collect-fee'),
    
    # Expenses
    path('expenses', views.ExpenseListCreateView.as_view(), name='expenses-list'),
    
    # Payroll
    path('payrolls', views.PayrollListCreateView.as_view(), name='payrolls-list'),
    path('payrolls/my', views.MySalaryView.as_view(), name='my-salary'),
    
    # Vendors
    path('vendors', views.VendorListCreateView.as_view(), name='vendors-list'),
    path('pay-vendor', views.PayVendorView.as_view(), name='pay-vendor'),
    
    # Scholarships
    path('scholarships', views.ScholarshipListCreateView.as_view(), name='scholarships-list'),
    path('scholarships/<int:pk>/status', views.ScholarshipStatusUpdateView.as_view(), name='scholarships-status'),
    
    # --- Accountant Node.js Direct Mappings ---
    path('dashboard-stats', views.AccountantDashboardStatsView.as_view(), name='accountant-dashboard'),
    
    path('fees/collect', views.CollectFeeView.as_view(), name='accountant-fee-collect'),
    path('fees/receipts', views.FeeReceiptListView.as_view(), name='accountant-fee-receipts'),
    
    # fee-structures and expenses are already mostly mapped above but we make sure they match exact node routes:
    # Actually, `fee-structures/` and `expenses/` are already mapped above correctly.
    
    path('student-fees', views.StudentFeeListView.as_view(), name='accountant-student-fees'),
    path('student-fees/assign', views.AssignStudentFeeView.as_view(), name='accountant-assign-fee'),
    path('student-fees/bulk-generate', views.BulkGenerateStudentFeesView.as_view(), name='accountant-bulk-fee'),
    
    path('payroll', views.PayrollListCreateView.as_view(), name='accountant-payroll'), # Singular payroll
    
    path('crm-subscription', views.CRMSubscriptionListCreateView.as_view(), name='accountant-crm'),
    
    path('vendors/<int:pk>/pay', views.PayVendorView.as_view(), name='accountant-pay-vendor'),
    
    path('students', views.AccountantStudentsLookupView.as_view(), name='accountant-students'),
    path('classes', views.AccountantClassesLookupView.as_view(), name='accountant-classes'),
]

