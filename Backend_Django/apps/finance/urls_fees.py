from django.urls import path
from . import views

urlpatterns = [
    path('fee-structures', views.FeeStructureListCreateView.as_view(), name='fee-structures-list'),
    path('fee-structures/<int:pk>', views.FeeStructureRetrieveUpdateDestroyView.as_view(), name='fee-structures-detail'),
    path('', views.LegacyFeeListCreateView.as_view(), name='fees-list'),
    path('<int:pk>', views.LegacyFeeRetrieveDestroyView.as_view(), name='fees-detail'),
    path('student/<int:studentId>', views.UnifiedStudentFeeListView.as_view(), name='unified-student-fees'),
    path('update/<str:fee_id_str>', views.UnifiedFeeUpdateView.as_view(), name='unified-fee-update'),
    path('invoices', views.StudentFeeInvoiceListView.as_view(), name='invoices-list'),
    path('receipts', views.FeeReceiptListView.as_view(), name='receipts-list'),
    path('collect-fee', views.CollectFeeView.as_view(), name='collect-fee'),
]

