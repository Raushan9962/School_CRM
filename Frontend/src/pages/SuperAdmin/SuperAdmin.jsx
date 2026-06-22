import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ModuleContainer from '../../components/layout/ModuleContainer';
import PlaceholderView from '../Principal/components/PlaceholderView';
import DashboardOverview from './components/DashboardOverview';
import RegisteredSchools from './components/RegisteredSchools';
import RevenueBilling from './components/RevenueBilling';
import ExpiringSoon from './components/ExpiringSoon';
import Transactions from './components/Transactions';
import PlatformSettings from './components/PlatformSettings';

const SuperAdmin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login/student');
            }
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login/student');
    };

    const navItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
        { id: 'schools', label: 'Schools Management', icon: '🏫' },
        { id: 'finance', label: 'Finance & Billing', icon: '💰' },
        { id: 'system', label: 'System & Settings', icon: '⚙️' }
    ];

    const renderContent = () => {
        if (activeTab === 'overview') return <DashboardOverview />;

        if (activeTab === 'schools') {
            const tabs = [
                { id: 'sa_sch_list', label: 'Registered Schools', count: '48' },
                { id: 'sa_sch_expiring', label: 'Expiring Soon', count: '3' }
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
                <span>➕</span> Register School
            </Link>
        </div>
    );

    return (
        <DashboardLayout
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userInfo={{ name: 'System Admin', schoolName: 'VidyaSetu CRM', role: 'Platform Owner' }}
            handleLogout={handleLogout}
            sidebarBottomContent={registerSchoolContent}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default SuperAdmin;
