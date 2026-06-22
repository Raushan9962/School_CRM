import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bus, Users, Map, MapPin, CheckCircle, Bell, Navigation, Wrench, IndianRupee, Mail, BarChart3 } from 'lucide-react';

import TransportOverview from './components/TransportOverview';
import VehicleManagement from './components/VehicleManagement';
import DriverManagement from './components/DriverManagement';
import RouteManagement from './components/RouteManagement';
import StopManagement from './components/StopManagement';
import StudentAllocation from './components/StudentAllocation';
import TransportRequests from './components/TransportRequests';
import GPSTracking from './components/GPSTracking';
import MaintenanceManagement from './components/MaintenanceManagement';
import TransportFees from './components/TransportFees';
import TransportReports from './components/TransportReports';
import Notifications from './components/Notifications';

const PlaceholderView = ({ title }) => (
    <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>{title}</h2>
        <p style={{ color: '#64748b' }}>This module is currently under development. It will be available soon.</p>
    </div>
);

const TransportDashboard = () => {
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
                    if (currentRole !== 'transport') {
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
        { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
        { id: 'vehicles', label: 'Vehicle Management', icon: <Bus size={20} strokeWidth={1.5} /> },
        { id: 'drivers', label: 'Driver Management', icon: <Users size={20} strokeWidth={1.5} /> },
        { id: 'routes', label: 'Route Management', icon: <Map size={20} strokeWidth={1.5} /> },
        { id: 'stops', label: 'Stop Management', icon: <MapPin size={20} strokeWidth={1.5} /> },
        { id: 'allocation', label: 'Student Allocation', icon: <CheckCircle size={20} strokeWidth={1.5} /> },
        { id: 'requests', label: 'Transport Requests', icon: <Mail size={20} strokeWidth={1.5} /> },
        { id: 'gps', label: 'GPS Tracking', icon: <Navigation size={20} strokeWidth={1.5} /> },
        { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={20} strokeWidth={1.5} /> },
        { id: 'fees', label: 'Transport Fees', icon: <IndianRupee size={20} strokeWidth={1.5} /> },
        { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} strokeWidth={1.5} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <TransportOverview />;
            case 'vehicles': return <VehicleManagement />;
            case 'drivers': return <DriverManagement />;
            case 'routes': return <RouteManagement />;
            case 'stops': return <StopManagement />;
            case 'allocation': return <StudentAllocation />;
            case 'requests': return <TransportRequests />;
            case 'gps': return <GPSTracking />;
            case 'maintenance': return <MaintenanceManagement />;
            case 'fees': return <TransportFees />;
            case 'reports': return <TransportReports />;
            case 'notifications': return <Notifications />;
            default: return <TransportOverview />;
        }
    };

    const getActiveTitle = () => {
        const item = navItems.find(n => n.id === activeTab);
        return item ? item.label : 'Dashboard Overview';
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? 280 : 0, overflow: 'hidden', background: '#0f172a',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.1)', zIndex: 10
            }}>
                <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>🚌</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h2 style={{ color: 'white', margin: 0, fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            VidyaSetu
                        </h2>
                        <p style={{ color: '#fbbf24', margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transport Portal</p>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: '12px',
                                    border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    background: activeTab === item.id ? 'linear-gradient(90deg, rgba(245,158,11,0.15), transparent)' : 'transparent',
                                    color: activeTab === item.id ? '#fbbf24' : '#94a3b8',
                                    transition: 'all 0.2s ease',
                                    boxShadow: activeTab === item.id ? 'inset 3px 0 0 #f59e0b' : 'none'
                                }}
                                onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent' }}
                            >
                                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ color: 'white', margin: 0, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentUser?.name || 'Transport Mgr'}</p>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: 11 }}>Transport Dept.</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <header style={{ 
                    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', 
                    padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 5 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b', padding: 4, transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>☰</button>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{getActiveTitle()}</h1>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 18, position: 'relative' }}>
                            🔔<span style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
                        </button>
                    </div>
                </header>

                <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TransportDashboard;
