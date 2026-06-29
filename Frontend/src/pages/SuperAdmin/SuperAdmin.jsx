import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, CreditCard, Settings, PlusCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ModuleContainer from '../../components/layout/ModuleContainer';
import PlaceholderView from '../Principal/components/PlaceholderView';
import DashboardOverview from './components/DashboardOverview';
import RegisteredSchools from './components/RegisteredSchools';
import RevenueBilling from './components/RevenueBilling';
import ExpiringSoon from './components/ExpiringSoon';
import Transactions from './components/Transactions';
import PlatformSettings from './components/PlatformSettings';
import apiFetch from '../../services/api';

const SuperAdmin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [currentUser, setCurrentUser] = useState(null);
    const [schoolsCount, setSchoolsCount] = useState(0);
    const [expiringCount, setExpiringCount] = useState(0);

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (!token || !userStr) {
                navigate('/login/student');
                return;
            }
            try {
                const userObj = JSON.parse(userStr);
                setCurrentUser(userObj);
            } catch (e) {
                navigate('/login/student');
            }
        };
        checkAuth();
        fetchCounts();
    }, [navigate]);

    const fetchCounts = async () => {
        try {
            const dashRes = await apiFetch('/super-admin/dashboard');
            const dashData = await dashRes.json();
            if (dashData.success) {
                setSchoolsCount(dashData.stats.totalSchools);
            }
            const expRes = await apiFetch('/super-admin/expiring-soon');
            const expData = await expRes.json();
            if (expData.success) {
                setExpiringCount(expData.count || 0);
            }
        } catch (err) {
            console.error('Failed to fetch counts:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login/student');
    };

    const navItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
        { id: 'schools', label: 'Schools Management', icon: <Building2 size={20} strokeWidth={1.5} /> },
        { id: 'finance', label: 'Finance & Billing', icon: <CreditCard size={20} strokeWidth={1.5} /> },
        { id: 'system', label: 'System & Settings', icon: <Settings size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        if (activeTab === 'overview') return <DashboardOverview />;

        if (activeTab === 'schools') {
            const tabs = [
                { id: 'sa_sch_list', label: 'Registered Schools', count: schoolsCount },
                { id: 'sa_sch_expiring', label: 'Expiring Soon', count: expiringCount }
            ];
            const contentMap = {
                'sa_sch_list': <RegisteredSchools />,
                'sa_sch_expiring': <ExpiringSoon />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_sch_list" />;
        }

        if (activeTab === 'finance') {
            const tabs = [
                { id: 'sa_fin_rev', label: 'Revenue & Billing' },
                { id: 'sa_fin_txn', label: 'Transactions' }
            ];
            const contentMap = {
                'sa_fin_rev': <RevenueBilling />,
                'sa_fin_txn': <Transactions />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_fin_rev" />;
        }

        if (activeTab === 'system') {
            const tabs = [
                { id: 'sa_sys_set', label: 'Platform Settings' },
                { id: 'sa_sys_logs', label: 'Audit Logs' }
            ];
            const contentMap = {
                'sa_sys_set': <PlatformSettings />,
                'sa_sys_logs': <PlaceholderView title="Audit Logs" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_sys_set" />;
        }

        return <DashboardOverview />;
    };

    const getActiveTitle = () => {
        const item = navItems.find(n => n.id === activeTab);
        return item ? item.label : 'Dashboard Overview';
    };

    const registerSchoolContent = (
        <div style={{ marginTop: '20px', padding: '0 12px' }}>
             <Link to="/register-school" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: '#fbbf24', color: 'white',
                textDecoration: 'none', padding: '12px', borderRadius: '10px',
                fontWeight: '600', fontSize: '14px',
                transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <PlusCircle size={18} /> Register School
            </Link>
        </div>
    );

    if (!currentUser) return null;

    return (
        <DashboardLayout
            userInfo={{ name: currentUser.name || 'System Admin', schoolName: 'VidyaSetu CRM', role: currentUser.role || 'Platform Owner', avatar: currentUser.image }}
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
            sidebarBottomContent={registerSchoolContent}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default SuperAdmin;
