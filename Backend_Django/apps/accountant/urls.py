from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('dashboard-stats', views.AccountantDashboardStatsView.as_view(), name='accountant-dashboard'),

    # Fee Collection
    path('fees/collect', views.CollectFeeView.as_view(), name='accountant-fee-collect'),
    path('fees/receipts', views.FeeReceiptListView.as_view(), name='accountant-fee-receipts'),

    # Student Fees
    path('student-fees', views.StudentFeeListView.as_view(), name='accountant-student-fees'),
    path('student-fees/assign', views.AssignStudentFeeView.as_view(), name='accountant-assign-fee'),
    path('student-fees/bulk-generate', views.BulkGenerateStudentFeesView.as_view(), name='accountant-bulk-fee'),

    # Payroll
    path('payroll', views.PayrollListCreateView.as_view(), name='accountant-payroll'),

    # CRM Subscription
    path('crm-subscription', views.CRMSubscriptionListCreateView.as_view(), name='accountant-crm'),

    # Vendors
    path('vendors/<int:pk>/pay', views.PayVendorView.as_view(), name='accountant-pay-vendor'),

    # Lookups
    path('students', views.AccountantStudentsLookupView.as_view(), name='accountant-students'),
    path('classes', views.AccountantClassesLookupView.as_view(), name='accountant-classes'),
]
