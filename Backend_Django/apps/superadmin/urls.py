from django.urls import path
from . import views

urlpatterns = [
    # Dashboard & Analytics
    path('stats', views.AdminStatsView.as_view(), name='superadmin-stats'),
    path('dashboard', views.SuperAdminDashboardView.as_view(), name='superadmin-dashboard'),
    path('revenue/monthly', views.MonthlyRevenueView.as_view(), name='revenue-monthly'),
    path('revenue/report', views.RevenueReportView.as_view(), name='revenue-report'),
    
    # Transactions
    path('transactions', views.TransactionListView.as_view(), name='transactions-list'),
    path('transactions/<int:pk>', views.TransactionDetailView.as_view(), name='transactions-detail'),
    
    # Schools & Users
    path('schools', views.AllSchoolsView.as_view(), name='schools-list'),
    path('schools/<int:pk>/subscription', views.UpdateSchoolSubscriptionView.as_view(), name='schools-subscription'),
    path('expiring-soon', views.ExpiringSoonSchoolsView.as_view(), name='expiring-soon'),
    path('users', views.AllUsersView.as_view(), name='users-list'),
    path('all-school-admins', views.AllSchoolAdminsListView.as_view(), name='all-school-admins'),
    path('seed-roles', views.SeedRolesView.as_view(), name='seed-roles'),
    
    
    # Settings & Actions
    path('settings', views.PlatformSettingsView.as_view(), name='settings'),
    path('reminders/send', views.SendRemindersView.as_view(), name='reminders-send'),
]
