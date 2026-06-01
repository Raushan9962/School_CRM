import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PrincipalOverview, TimetableManagement, LeaveApprovals,
    TeacherDirectoryView, StudentDirectoryView, ExamsAndResults,
    TeacherPerformanceView, AttendanceTrendsView, AdmissionsReportView,
    SchoolAnnouncementsView
} from './PrincipalViews';

const PrincipalDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [schoolName, setSchoolName] = useState('VidyaSetu School');

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = localStorage.getItem('isAuthenticated');
            const userStr = localStorage.getItem('user');
            
            // If we have a user object with a schoolName, use it
            if (userStr) {
                try {
                    const userObj = JSON.parse(userStr);
                    if (userObj.schoolName) {
                        setSchoolName(userObj.schoolName);
                    }
                } catch (e) {
                    console.error("Error parsing user data:", e);
                }
            }
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login/student');
    };

    const pageTitle = () => {
        const map = {
            dashboard: 'Principal Overview',
            timetable: 'Timetable Management',
            exams: 'Exams & Results',
            leaves: 'Leave Approvals',
            'teacher-directory': 'Teacher Directory',
            performance: 'Performance Reports',
            'student-directory': 'Student Directory',
            attendance: 'Attendance Trends',
            admissions: 'Admissions & Promotions',
            announcements: 'School Announcements',
        };
        return map[activeTab] || 'Management';
    };

    const NavItem = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            style={{
                width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === tab ? 'white' : 'rgba(199,210,254,0.85)',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab ? 'inset 4px 0 0 white' : 'none'
            }}
            onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.background = 'transparent' }}
        >
            {label}
        </button>
    );

    const SideSection = ({ icon, label, children }) => (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 14px', marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(165,180,252,0.8)' }}>
                    {label}
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {children}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? 280 : 0, overflow: 'hidden', background: '#1e1b4b',
                transition: 'width 0.3s ease', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.1)', zIndex: 10
            }}>
                <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>🏫</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h2 style={{ color: 'white', margin: 0, fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{schoolName}</h2>
                        <p style={{ color: '#a5b4fc', margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Principal Portal</p>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
                    <NavItem tab="dashboard" label="📊 Overview" />
                    <div style={{ height: 20 }} />

                    <SideSection icon="🎓" label="Academics">
                        <NavItem tab="timetable" label="🕐 Timetable Management" />
                        <NavItem tab="exams" label="📝 Exams & Results" />
                        <NavItem tab="performance" label="📈 Performance Reports" />
                    </SideSection>

                    <SideSection icon="👨‍🏫" label="Staff Management">
                        <NavItem tab="leaves" label="🏖️ Leave Approvals" />
                        <NavItem tab="teacher-directory" label="👨‍🏫 Teacher Directory" />
                    </SideSection>

                    <SideSection icon="👩‍🎓" label="Students & Operations">
                        <NavItem tab="student-directory" label="👩‍🎓 Student Directory" />
                        <NavItem tab="attendance" label="📅 Attendance Trends" />
                        <NavItem tab="admissions" label="🎓 Admissions & Promotions" />
                        <NavItem tab="announcements" label="📢 School Announcements" />
                    </SideSection>
                </nav>

                <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>P</div>
                        <div>
                            <p style={{ color: 'white', margin: 0, fontSize: 14, fontWeight: 600 }}>Principal</p>
                            <p style={{ color: '#a5b4fc', margin: 0, fontSize: 11 }}>Academic Head</p>
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
                {/* Header */}
                <header style={{ background: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', zIndex: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b', padding: 4 }}>☰</button>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{pageTitle()}</h1>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 18, position: 'relative' }}>
                            🔔<span style={{ position: 'absolute', top: 8, right: 10, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        {activeTab === 'dashboard' && <PrincipalOverview />}
                        {activeTab === 'timetable' && <TimetableManagement />}
                        {activeTab === 'exams' && <ExamsAndResults />}
                        {activeTab === 'leaves' && <LeaveApprovals />}
                        {activeTab === 'teacher-directory' && <TeacherDirectoryView />}
                        {activeTab === 'performance' && <TeacherPerformanceView />}
                        {activeTab === 'student-directory' && <StudentDirectoryView />}
                        {activeTab === 'attendance' && <AttendanceTrendsView />}
                        {activeTab === 'admissions' && <AdmissionsReportView />}
                        {activeTab === 'announcements' && <SchoolAnnouncementsView />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrincipalDashboard;
