from django.urls import path
from . import views

urlpatterns = [
    # Fee Structures
    path('fee-structures/', views.FeeStructureListCreateView.as_view(), name='fee-structures-list'),
    path('fee-structures/<int:pk>/', views.FeeStructureRetrieveUpdateDestroyView.as_view(), name='fee-structures-detail'),
    
    # Invoices, Receipts and Fees
    path('fees/', views.LegacyFeeListCreateView.as_view(), name='fees-list'),
    path('fees/<int:pk>/', views.LegacyFeeRetrieveDestroyView.as_view(), name='fees-detail'),
    path('fees/student/<int:studentId>/', views.UnifiedStudentFeeListView.as_view(), name='unified-student-fees'),
    path('fees/update/<str:fee_id_str>/', views.UnifiedFeeUpdateView.as_view(), name='unified-fee-update'),
    
    path('invoices/', views.StudentFeeInvoiceListView.as_view(), name='invoices-list'),
    path('receipts/', views.FeeReceiptListView.as_view(), name='receipts-list'),
    path('collect-fee/', views.CollectFeeView.as_view(), name='collect-fee'),
    
    # Expenses
    path('expenses/', views.ExpenseListCreateView.as_view(), name='expenses-list'),
    
    # Payroll
    path('payrolls/', views.PayrollListCreateView.as_view(), name='payrolls-list'),
    
    # Vendors
    path('vendors/', views.VendorListCreateView.as_view(), name='vendors-list'),
    path('pay-vendor/', views.PayVendorView.as_view(), name='pay-vendor'),
    
    # Scholarships
    path('scholarships/', views.ScholarshipListCreateView.as_view(), name='scholarships-list'),
    path('scholarships/<int:pk>/status/', views.ScholarshipStatusUpdateView.as_view(), name='scholarships-status'),
]
