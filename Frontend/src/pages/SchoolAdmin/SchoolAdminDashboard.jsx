import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    StudentManagementView, TeacherManagementView, ParentManagementView,
    AccountantManagementView, LibrarianManagementView, TransportManagementView,
    StudentAttendanceView, StudentFeesHistoryView,
    PrincipalProfileView, PrincipalDocumentsView, PrincipalAttendanceView,
    PrincipalSalaryView, PrincipalAcademicsView, PrincipalLogsView
} from './DetailedViews';
import {
    StudentManagementOverview, AddNewStudentView,
    AttendanceSection, AcademicsSection, TransportSection, FeesSection
} from './StudentViews';
import {
    TeacherManagementOverview, TeacherAttendanceSection,
    SalaryPayrollSection, ClassManagementSection, TeacherPerformanceSection
} from './TeacherViews';

const ROLES = ['Principal', 'Teacher', 'Student', 'Parent', 'Accountant', 'Librarian', 'Transport Manager', 'Receptionist'];

const SchoolAdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [expandedSection, setExpandedSection] = useState('students');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', roleName: 'Student',
        employeeId: '', classId: '', admissionNo: '', occupation: '', relation: '', studentId: ''
    });
    const navigate = useNavigate();

    const currentUserStr = localStorage.getItem('user');
    const currentUser = React.useMemo(() => (currentUserStr ? JSON.parse(currentUserStr) : null), [currentUserStr]);

    useEffect(() => {
        const currentRole = currentUser?.role || currentUser?.roleName;
        if (!currentUser || currentRole !== 'School Admin') {
            navigate('/login/student');
            return;
        }
        const fetchSchoolUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setUsers(data.data || []);
                else setError(data.message || 'Failed to fetch users');
            } catch (err) {
                console.error(err);
                setError('Network error: Unable to connect to server');
            } finally {
                setLoading(false);
            }
        };
        fetchSchoolUsers();
    }, [currentUser, navigate]);

    const fetchSchoolUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/school-users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddModal(false);
                setFormData({ ...formData, name: '', email: '', phone: '', roleName: 'Student' });
                fetchSchoolUsers();
            } else {
                alert(data.message || 'Failed to create user');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating user');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login/student');
    };

    // Page title resolver
    const pageTitle = () => {
        const map = {
            dashboard: 'General Staff Directory',
            'student-overview': 'Student Management',
            'add-student': 'Add New Student',
            attendance: 'Attendance Management',
            academics: 'Academics',
            transport: 'Transport Management',
            fees: 'Fees Management',
            'teacher-overview': 'Teacher Management',
            'teacher-attendance': 'Teacher Attendance',
            'salary-payroll': 'Salary & Payroll',
            'class-management': 'Class Management',
            'teacher-performance': 'Teacher Performance',
            parents: 'Parent Management',
            accountants: 'Finance Management',
            librarians: 'Library Management',
            'fees-history': 'Fees History',
            'principal-profile': 'Principal — Profile & Info',
            'principal-documents': 'Principal — Documents',
            'principal-attendance': 'Principal — Attendance & Leaves',
            'principal-salary': 'Principal — Salary & Payroll',
            'principal-academics': 'Principal — Academic Reports',
            'principal-logs': 'Principal — CRM Access & Logs',
        };
        return map[activeTab] || `${activeTab} Management`;
    };

    // Sidebar nav item
    const NavItem = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            style={{
                width: '100%', textAlign: 'left', padding: '7px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
                fontWeight: activeTab === tab ? 700 : 500,
                background: activeTab === tab ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'rgba(199,210,254,0.85)',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.background = 'transparent'; }}
        >
            {activeTab === tab && <span style={{ width: 4, height: 14, borderRadius: 2, background: '#f97316', display: 'inline-block', flexShrink: 0 }} />}
            {label}
        </button>
    );

    // Collapsible section
    const SideSection = ({ key: k, sectionKey, icon, label, children }) => {
        const isOpen = expandedSection === sectionKey;
        return (
            <div style={{ marginBottom: 4 }}>
                <button
                    onClick={() => setExpandedSection(isOpen ? '' : sectionKey)}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 14px', border: 'none', background: 'transparent',
                        color: 'rgba(199,210,254,0.9)', cursor: 'pointer', borderRadius: 10,
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16 }}>{icon}</span>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                {isOpen && (
                    <div style={{ marginLeft: 16, paddingLeft: 10, borderLeft: '2px solid rgba(99,102,241,0.4)', marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

            {/* ─── Sidebar ─── */}
            <aside style={{
                width: 248, background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh',
                position: 'sticky', top: 0, overflowY: 'auto', boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
            }}>
                {/* Logo */}
                <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(99,102,241,0.3)', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>🏫</div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#fb923c', letterSpacing: '0.05em' }}>
                        {currentUser?.schoolName || 'VidyaSetu'}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(199,210,254,0.7)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        School Admin Portal
                    </p>
                </div>

                {/* Navigation */}
                <div style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>

                    {/* Dashboard */}
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontWeight: 700, fontSize: 14, transition: 'all 0.15s',
                            background: activeTab === 'dashboard' ? 'rgba(99,102,241,0.35)' : 'transparent',
                            color: activeTab === 'dashboard' ? 'white' : 'rgba(199,210,254,0.85)',
                        }}
                        onMouseEnter={e => { if (activeTab !== 'dashboard') e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { if (activeTab !== 'dashboard') e.currentTarget.style.background = 'transparent'; }}
                    >
                        <span>🏠</span> Dashboard
                    </button>

                    {/* ── Students ── */}
                    <SideSection sectionKey="students" icon="👩‍🎓" label="Students">
                        <NavItem tab="student-overview" label="📊 Student Management" />
                        <NavItem tab="add-student" label="➕ Add New Student" />
                        <NavItem tab="attendance" label="📅 Attendance" />
                        <NavItem tab="academics" label="🎓 Academics" />
                        <NavItem tab="transport" label="🚌 Transport" />
                        <NavItem tab="fees" label="💳 Fees" />
                        <NavItem tab="fees-history" label="💰 Fees History" />
                    </SideSection>

                    {/* ── Teachers ── */}
                    <SideSection sectionKey="teachers" icon="👨‍🏫" label="Teachers">
                        <NavItem tab="teacher-overview" label="👨‍🏫 Teacher Management" />
                        <NavItem tab="teacher-attendance" label="📅 Attendance" />
                        <NavItem tab="salary-payroll" label="💼 Salary & Payroll" />
                        <NavItem tab="class-management" label="🏫 Class Management" />
                        <NavItem tab="teacher-performance" label="📈 Performance" />
                        <button
                            onClick={() => { setActiveTab('teacher-overview'); setShowAddModal(true); setFormData({ ...formData, roleName: 'Teacher' }); }}
                            style={{ width: '100%', textAlign: 'left', padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: 'transparent', color: 'rgba(199,210,254,0.85)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >Add Teacher</button>
                    </SideSection>

                    {/* ── Principal ── */}
                    <SideSection sectionKey="principal" icon="🏫" label="Principal">
                        <NavItem tab="principal-profile"     label="👤 Profile & Info" />
                        <NavItem tab="principal-documents"   label="📄 Documents" />
                        <NavItem tab="principal-attendance"  label="📅 Attendance & Leaves" />
                        <NavItem tab="principal-salary"      label="💰 Salary & Payroll" />
                        <NavItem tab="principal-academics"   label="📈 Academic Reports" />
                        <NavItem tab="principal-logs"        label="🔑 CRM Access & Logs" />
                    </SideSection>

                    {/* ── Parents ── */}
                    <SideSection sectionKey="parents" icon="👨‍👩‍👧" label="Parents">
                        <NavItem tab="parents" label="All Parents" />
                        <button
                            onClick={() => { setActiveTab('parents'); setShowAddModal(true); setFormData({ ...formData, roleName: 'Parent' }); }}
                            style={{ width: '100%', textAlign: 'left', padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: 'transparent', color: 'rgba(199,210,254,0.85)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >Add Parent</button>
                    </SideSection>

                    {/* ── Finance ── */}
                    <SideSection sectionKey="finance" icon="💼" label="Finance">
                        <NavItem tab="accountants" label="All Accountants" />
                        <button
                            onClick={() => { setActiveTab('accountants'); setShowAddModal(true); setFormData({ ...formData, roleName: 'Accountant' }); }}
                            style={{ width: '100%', textAlign: 'left', padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: 'transparent', color: 'rgba(199,210,254,0.85)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >Add Accountant</button>
                    </SideSection>

                    {/* ── Library ── */}
                    <SideSection sectionKey="library" icon="📚" label="Library">
                        <NavItem tab="librarians" label="All Librarians" />
                    </SideSection>

                    {/* Quick Add */}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(99,102,241,0.3)' }}>
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                                border: 'none', padding: '11px 16px', borderRadius: 10, fontWeight: 700,
                                fontSize: 13, cursor: 'pointer', transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <span style={{ fontSize: 18 }}>⚡</span> Quick Add User
                        </button>
                    </div>
                </div>

                {/* User Info */}
                <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(99,102,241,0.3)' }}>
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                        <p style={{ margin: 0, fontSize: 11, color: 'rgba(199,210,254,0.6)', fontWeight: 600 }}>Logged in as</p>
                        <p style={{ margin: '3px 0 0', fontWeight: 700, color: 'white', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name}</p>
                        {currentUser?.schoolName && (
                            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(199,210,254,0.7)', background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '3px 8px' }}>
                                🏫 {currentUser.schoolName}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)',
                            padding: '9px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                    >
                        🚪 Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Top Header */}
                <header style={{
                    background: 'white', borderBottom: '1px solid #e5e7eb', height: 64,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 28px', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e1b4b' }}>{pageTitle()}</h1>
                        {currentUser?.schoolName && (
                            <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {currentUser.schoolName}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none',
                            padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                        }}
                    >
                        ＋ Add New User
                    </button>
                </header>

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#f1f5f9' }}>
                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    {/* ── DASHBOARD ── */}
                    {activeTab === 'dashboard' && (
                        <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', margin: 0 }}>General Staff Directory</h3>
                                    <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 3, margin: '3px 0 0' }}>Manage all administrative and general users.</p>
                                </div>
                                <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                                    Total: {users.length}
                                </span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                {loading ? (
                                    <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                                        <div style={{ width: 36, height: 36, border: '4px solid #e0e7ff', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                        Loading users securely...
                                    </div>
                                ) : users.length === 0 ? (
                                    <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                                        <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                                        <p style={{ fontWeight: 600, fontSize: 16, color: '#374151' }}>No general staff found</p>
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                {['User', 'Role', 'Contact', 'Status', 'Joined Date'].map(h => (
                                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <img src={u.image || `https://api.dicebear.com/5.x/initials/svg?seed=${u.name}`} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #e5e7eb' }} />
                                                            <div>
                                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{u.name}</p>
                                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>ID: #{u.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>{u.role}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', margin: 0 }}>{u.email}</p>
                                                        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{u.phone || 'No phone'}</p>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STUDENT SECTIONS ── */}
                    {activeTab === 'student-overview' && <StudentManagementOverview />}
                    {activeTab === 'add-student' && <AddNewStudentView />}
                    {activeTab === 'attendance' && <AttendanceSection />}
                    {activeTab === 'academics' && <AcademicsSection />}
                    {activeTab === 'transport' && <TransportSection />}
                    {activeTab === 'fees' && <FeesSection />}

                    {/* ── TEACHER SECTIONS ── */}
                    {activeTab === 'teacher-overview' && <TeacherManagementOverview />}
                    {activeTab === 'teacher-attendance' && <TeacherAttendanceSection />}
                    {activeTab === 'salary-payroll' && <SalaryPayrollSection />}
                    {activeTab === 'class-management' && <ClassManagementSection />}
                    {activeTab === 'teacher-performance' && <TeacherPerformanceSection />}

                    {/* ── EXISTING VIEWS ── */}
                    {activeTab === 'principal-profile'    && <PrincipalProfileView />}
                    {activeTab === 'principal-documents'  && <PrincipalDocumentsView />}
                    {activeTab === 'principal-attendance' && <PrincipalAttendanceView />}
                    {activeTab === 'principal-salary'     && <PrincipalSalaryView />}
                    {activeTab === 'principal-academics'  && <PrincipalAcademicsView />}
                    {activeTab === 'principal-logs'       && <PrincipalLogsView />}
                    {activeTab === 'students' && <StudentManagementView />}
                    {activeTab === 'parents' && <ParentManagementView />}
                    {activeTab === 'accountants' && <AccountantManagementView />}
                    {activeTab === 'librarians' && <LibrarianManagementView />}
                    {activeTab === 'fees-history' && <StudentFeesHistoryView />}
                </div>
            </main>

            {/* ─── Add User Modal ─── */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', padding: 20 }}>
                    <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 540, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                            <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', margin: 0 }}>Create New {formData.roleName}</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>×</button>
                        </div>
                        <form onSubmit={handleCreateUser} style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>User Role</label>
                                    <select value={formData.roleName} onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                                        style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                {[['Full Name', 'name', 'text', 'John Doe'], ['Email Address', 'email', 'email', 'john@example.com'], ['Phone Number', 'phone', 'tel', '+91 9876543210']].map(([label, field, type, ph]) => (
                                    <div key={field}>
                                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                                        <input required={field !== 'phone'} type={type} value={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder={ph} />
                                    </div>
                                ))}

                                {formData.roleName === 'Student' && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Class ID</label>
                                            <input required type="number" value={formData.classId} onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="e.g. 1" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Admission Number</label>
                                            <input required value={formData.admissionNo} onChange={e => setFormData({ ...formData, admissionNo: e.target.value })}
                                                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="ADM-2024-001" />
                                        </div>
                                    </>
                                )}
                                {['Principal', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'Receptionist'].includes(formData.roleName) && (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Employee ID</label>
                                        <input value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="EMP-001 (Optional)" />
                                    </div>
                                )}
                                {formData.roleName === 'Parent' && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Relation</label>
                                            <input value={formData.relation} onChange={e => setFormData({ ...formData, relation: e.target.value })}
                                                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="Father/Mother" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Student ID (Optional)</label>
                                            <input type="number" value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="Linked Student ID" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div style={{ paddingTop: 14, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
                                    Cancel
                                </button>
                                <button type="submit"
                                    style={{ padding: '10px 20px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
            `}</style>
        </div>
    );
};

export default SchoolAdminDashboard;
