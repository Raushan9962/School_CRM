import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Settings, CreditCard, TrendingDown, IndianRupee, Building, Award, LineChart, Bell, RefreshCw, ClipboardList, MonitorPlay, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FinanceOverview from './components/FinanceOverview';
import StudentFeeManagement from './components/StudentFeeManagement';
import FeeCategories from './components/FeeCategories';
import FeeCollection from './components/FeeCollection';
import ExpenseManagement from './components/ExpenseManagement';
import SalaryManagement from './components/SalaryManagement';
import VendorManagement from './components/VendorManagement';
import ScholarshipsDiscounts from './components/ScholarshipsDiscounts';
import FinancialReports from './components/FinancialReports';
import PaymentReminders from './components/PaymentReminders';
import RefundManagement from './components/RefundManagement';
import AuditLogs from './components/AuditLogs';
import AccountantProfile from './components/AccountantProfile';
import CRMSubscription from './components/CRMSubscription';

const PlaceholderView = ({ title }) => (
    <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>{title}</h2>
        <p className="text-slate-500">This module is currently under development. It will be available soon.</p>
    </div>
);

const AccountantDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const userObj = JSON.parse(userStr);
                    const rawRole = userObj?.role || userObj?.roleName || '';
                    const currentRole = rawRole.toLowerCase().replace(/\s+/g, '');
                    if (currentRole !== 'accountant') {
                        navigate('/login/student');
                        return;
                    }
                    setCurrentUser(userObj);
                } catch (e) {
                    console.error("Error parsing user data:", e);
                    navigate('/login/student');
                }
            } else {
                navigate('/login/student');
            }
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login/student');
    };

    const navItems = [
        { id: 'overview', label: 'Finance Overview', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
        { id: 'student_fee', label: 'Student Fee Management', icon: <GraduationCap size={20} strokeWidth={1.5} /> },
        { id: 'fee_categories', label: 'Fee Categories', icon: <Settings size={20} strokeWidth={1.5} /> },
        { id: 'fee_collection', label: 'Fee Collection', icon: <CreditCard size={20} strokeWidth={1.5} /> },
        { id: 'expenses', label: 'Expense Management', icon: <TrendingDown size={20} strokeWidth={1.5} /> },
        { id: 'salary', label: 'Salary Management', icon: <IndianRupee size={20} strokeWidth={1.5} /> },
        { id: 'vendors', label: 'Vendor Management', icon: <Building size={20} strokeWidth={1.5} /> },
        { id: 'scholarships', label: 'Scholarships & Discounts', icon: <Award size={20} strokeWidth={1.5} /> },
        { id: 'reports', label: 'Financial Reports', icon: <LineChart size={20} strokeWidth={1.5} /> },
        { id: 'reminders', label: 'Defaulters & Reminders', icon: <Bell size={20} strokeWidth={1.5} /> },
        { id: 'refunds', label: 'Refund Management', icon: <RefreshCw size={20} strokeWidth={1.5} /> },
        { id: 'crm_subscription', label: 'CRM Subscription', icon: <MonitorPlay size={20} strokeWidth={1.5} /> },
        { id: 'audit', label: 'Audit Logs', icon: <ClipboardList size={20} strokeWidth={1.5} /> },
        { id: 'profile', label: 'My Profile', icon: <User size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <FinanceOverview />;
            case 'student_fee': return <StudentFeeManagement />;
            case 'fee_categories': return <FeeCategories />;
            case 'fee_collection': return <FeeCollection />;
            case 'expenses': return <ExpenseManagement />;
            case 'salary': return <SalaryManagement />;
            case 'vendors': return <VendorManagement />;
            case 'scholarships': return <ScholarshipsDiscounts />;
            case 'reports': return <FinancialReports />;
            case 'reminders': return <PaymentReminders />;
            case 'refunds': return <RefundManagement />;
            case 'crm_subscription': return <CRMSubscription />;
            case 'audit': return <AuditLogs />;
            case 'profile': return <AccountantProfile />;
            default: return <FinanceOverview />;
        }
    };

    if (!currentUser) return null;

    return (
        <DashboardLayout
            userInfo={{ name: currentUser.name, role: 'Accountant', avatar: currentUser.image }}
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onLogout={handleLogout}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default AccountantDashboard;
