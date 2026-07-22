from django.urls import path
from . import views

urlpatterns = [
    # Fee Structures
    path('fee-structures/', views.FeeStructureListCreateView.as_view(), name='fee-structures-list'),
    path('fee-structures/<int:pk>/', views.FeeStructureRetrieveUpdateDestroyView.as_view(), name='fee-structures-detail'),
    
    # Invoices and Receipts
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
