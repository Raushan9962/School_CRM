import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from './components/DashboardOverview';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import ClassManagement from './components/ClassManagement';
import AttendanceManagement from './components/AttendanceManagement';
import ExaminationManagement from './components/ExaminationManagement';
import FeeManagement from './components/FeeManagement';
import AdmissionManagement from './components/AdmissionManagement';
import StaffManagement from './components/StaffManagement';
import CommunicationCenter from './components/CommunicationCenter';
import EventsManagement from './components/EventsManagement';
import PlaceholderView from './components/PlaceholderView';

const PrincipalDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [schoolName, setSchoolName] = useState('VidyaSetu School');

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = localStorage.getItem('isAuthenticated');
            const userStr = localStorage.getItem('user');
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

    const [openMenus, setOpenMenus] = useState({ student_management: true });

    const toggleMenu = (id, e) => {
        if(e) e.stopPropagation();
        setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const navItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
        { id: 'student_management', label: '👨‍🎓 Student Management', subItems: [
            { id: 'sm_list', label: 'Student List', subItems: [
                { id: 'sm_list_all', label: 'All Students' },
                { id: 'sm_list_admission', label: 'Admission Details' },
                { id: 'sm_list_parent', label: 'Parent Details' },
                { id: 'sm_list_docs', label: 'Documents' },
                { id: 'sm_list_id', label: 'Student ID Card' }
            ]},
            { id: 'sm_attendance', label: 'Attendance', subItems: [
                { id: 'sm_att_daily', label: 'Daily Attendance' },
                { id: 'sm_att_monthly', label: 'Monthly Attendance' },
                { id: 'sm_att_history', label: 'Attendance History' },
                { id: 'sm_att_absent', label: 'Absent Students' },
                { id: 'sm_att_late', label: 'Late Arrivals' },
                { id: 'sm_att_reports', label: 'Attendance Reports' }
            ]},
            { id: 'sm_performance', label: 'Performance', subItems: [
                { id: 'sm_perf_academic', label: 'Academic Performance' },
                { id: 'sm_perf_subject', label: 'Subject-wise Performance' },
                { id: 'sm_perf_exam', label: 'Exam History' },
                { id: 'sm_perf_progress', label: 'Progress Report' },
                { id: 'sm_perf_ranking', label: 'Ranking' }
            ]},
            { id: 'sm_promotions', label: 'Promotions', subItems: [
                { id: 'sm_prom_class', label: 'Class Promotion' },
                { id: 'sm_prom_section', label: 'Section Transfer' },
                { id: 'sm_prom_passfail', label: 'Pass/Fail Management' }
            ]},
            { id: 'sm_alumni', label: 'Alumni Students' },
            { id: 'sm_discipline', label: 'Discipline', subItems: [
                { id: 'sm_disc_complaints', label: 'Complaints' },
                { id: 'sm_disc_warnings', label: 'Warnings' },
                { id: 'sm_disc_behavior', label: 'Behaviour Records' }
            ]}
        ]},
        { id: 'academic_management', label: '📚 Academic Management', subItems: [
            { id: 'ac_classes', label: 'Classes', subItems: [
                { id: 'ac_class_list', label: 'Class List' },
                { id: 'ac_class_sections', label: 'Sections' },
                { id: 'ac_class_teacher', label: 'Class Teacher Assignment' }
            ]},
            { id: 'ac_subjects', label: 'Subjects', subItems: [
                { id: 'ac_subj_list', label: 'Subject List' },
                { id: 'ac_subj_assign', label: 'Subject Assignment' },
                { id: 'ac_subj_map', label: 'Subject Teacher Mapping' }
            ]},
            { id: 'ac_timetable', label: 'Timetable', subItems: [
                { id: 'ac_time_class', label: 'Class Timetable' },
                { id: 'ac_time_teacher', label: 'Teacher Timetable' },
                { id: 'ac_time_exam', label: 'Exam Timetable' }
            ]},
            { id: 'ac_homework', label: 'Homework & Assignments', subItems: [
                { id: 'ac_hw_create', label: 'Create Assignment' },
                { id: 'ac_hw_status', label: 'Submission Status' },
                { id: 'ac_hw_pending', label: 'Pending Assignments' }
            ]},
            { id: 'ac_study', label: 'Study Materials', subItems: [
                { id: 'ac_study_notes', label: 'Notes' },
                { id: 'ac_study_pdf', label: 'PDF Upload' },
                { id: 'ac_study_video', label: 'Video Resources' }
            ]}
        ]},
        { id: 'exam_management', label: '📝 Examination & Results', subItems: [
            { id: 'ex_setup', label: 'Exam Setup', subItems: [
                { id: 'ex_setup_types', label: 'Exam Types' },
                { id: 'ex_setup_unit', label: 'Unit Test' },
                { id: 'ex_setup_half', label: 'Half Yearly' },
                { id: 'ex_setup_annual', label: 'Annual' },
                { id: 'ex_setup_schedule', label: 'Exam Schedule' },
                { id: 'ex_setup_alloc', label: 'Subject Allocation' }
            ]},
            { id: 'ex_marks', label: 'Marks Entry', subItems: [
                { id: 'ex_marks_teacher', label: 'Teacher Marks Entry' },
                { id: 'ex_marks_bulk', label: 'Bulk Upload' },
                { id: 'ex_marks_verify', label: 'Marks Verification' }
            ]},
            { id: 'ex_analysis', label: 'Result Analysis', subItems: [
                { id: 'ex_anal_class', label: 'Class Wise Results' },
                { id: 'ex_anal_subj', label: 'Subject Wise Results' },
                { id: 'ex_anal_school', label: 'School Wise Results' },
                { id: 'ex_anal_pass', label: 'Pass Percentage' }
            ]},
            { id: 'ex_top', label: 'Top Performers', subItems: [
                { id: 'ex_top_school', label: 'School Toppers' },
                { id: 'ex_top_class', label: 'Class Toppers' },
                { id: 'ex_top_subj', label: 'Subject Toppers' }
            ]},
            { id: 'ex_weak', label: 'Weak Students', subItems: [
                { id: 'ex_weak_below', label: 'Below Passing Marks' },
                { id: 'ex_weak_improve', label: 'Improvement Required' },
                { id: 'ex_weak_remedial', label: 'Remedial Classes' }
            ]},
            { id: 'ex_report', label: 'Report Cards', subItems: [
                { id: 'ex_rep_gen', label: 'Generate Report Card' },
                { id: 'ex_rep_pdf', label: 'Download PDF' },
                { id: 'ex_rep_pub', label: 'Publish Results' }
            ]}
        ]},
        { id: 'staff_management', label: '👩‍🏫 Staff Management', subItems: [
            { id: 'stf_teachers', label: 'Teachers', subItems: [
                { id: 'stf_teach_list', label: 'Teacher List' },
                { id: 'stf_teach_prof', label: 'Teacher Profiles' },
                { id: 'stf_teach_qual', label: 'Qualification' },
                { id: 'stf_teach_exp', label: 'Experience' }
            ]},
            { id: 'stf_attendance', label: 'Attendance', subItems: [
                { id: 'stf_att_daily', label: 'Daily Attendance' },
                { id: 'stf_att_monthly', label: 'Monthly Attendance' },
                { id: 'stf_att_leave', label: 'Leave Records' }
            ]},
            { id: 'stf_performance', label: 'Performance', subItems: [
                { id: 'stf_perf_class', label: 'Class Performance' },
                { id: 'stf_perf_feed', label: 'Student Feedback' },
                { id: 'stf_perf_rep', label: 'Performance Reports' }
            ]},
            { id: 'stf_leave', label: 'Leave Management', subItems: [
                { id: 'stf_lv_req', label: 'Leave Requests' },
                { id: 'stf_lv_app', label: 'Leave Approval' },
                { id: 'stf_lv_hist', label: 'Leave History' }
            ]},
            { id: 'stf_payroll', label: 'Payroll', subItems: [
                { id: 'stf_pay_sal', label: 'Salary Records' },
                { id: 'stf_pay_slip', label: 'Payslips' },
                { id: 'stf_pay_rep', label: 'Salary Reports' }
            ]}
        ]},
        { id: 'finance_management', label: '💰 Finance Management', subItems: [
            { id: 'fin_fees', label: 'Fees Collection', subItems: [
                { id: 'fin_fee_coll', label: 'Fee Collection' },
                { id: 'fin_fee_on', label: 'Online Payments' },
                { id: 'fin_fee_off', label: 'Offline Payments' },
                { id: 'fin_fee_rec', label: 'Receipt Generation' }
            ]},
            { id: 'fin_pending', label: 'Pending Fees', subItems: [
                { id: 'fin_pend_def', label: 'Defaulters List' },
                { id: 'fin_pend_due', label: 'Due Amount' },
                { id: 'fin_pend_fine', label: 'Fine Management' }
            ]},
            { id: 'fin_expense', label: 'Expense Management', subItems: [
                { id: 'fin_exp_school', label: 'School Expenses' },
                { id: 'fin_exp_ven', label: 'Vendor Payments' },
                { id: 'fin_exp_util', label: 'Utility Bills' }
            ]},
            { id: 'fin_income', label: 'Income Reports', subItems: [
                { id: 'fin_inc_fee', label: 'Fee Income' },
                { id: 'fin_inc_other', label: 'Other Income Sources' }
            ]}
        ]},
        { id: 'reports_analytics', label: '📈 Reports & Analytics', subItems: [
            { id: 'rep_attendance', label: 'Attendance Reports', subItems: [
                { id: 'rep_att_daily', label: 'Daily Report' },
                { id: 'rep_att_monthly', label: 'Monthly Report' },
                { id: 'rep_att_yearly', label: 'Yearly Report' },
                { id: 'rep_att_class', label: 'Class Wise Report' }
            ]},
            { id: 'rep_results', label: 'Result Reports', subItems: [
                { id: 'rep_res_pass', label: 'Pass Percentage' },
                { id: 'rep_res_subj', label: 'Subject Analysis' },
                { id: 'rep_res_top', label: 'Topper Report' }
            ]},
            { id: 'rep_fees', label: 'Fee Reports', subItems: [
                { id: 'rep_fee_coll', label: 'Collection Report' },
                { id: 'rep_fee_due', label: 'Due Report' },
                { id: 'rep_fee_def', label: 'Defaulter Report' }
            ]},
            { id: 'rep_staff', label: 'Staff Reports', subItems: [
                { id: 'rep_stf_att', label: 'Teacher Attendance' },
                { id: 'rep_stf_lv', label: 'Leave Reports' }
            ]},
            { id: 'rep_custom', label: 'Custom Reports', subItems: [
                { id: 'rep_cus_excel', label: 'Export Excel' },
                { id: 'rep_cus_pdf', label: 'Export PDF' }
            ]}
        ]},
        { id: 'communication', label: '📢 Communication', subItems: [
            { id: 'com_notices', label: 'Notices', subItems: [
                { id: 'com_not_school', label: 'School Notices' },
                { id: 'com_not_emer', label: 'Emergency Notices' }
            ]},
            { id: 'com_announce', label: 'Announcements', subItems: [
                { id: 'com_ann_stu', label: 'Students' },
                { id: 'com_ann_par', label: 'Parents' },
                { id: 'com_ann_teach', label: 'Teachers' }
            ]},
            { id: 'com_sms', label: 'SMS / WhatsApp', subItems: [
                { id: 'com_sms_bulk', label: 'Send Bulk SMS' },
                { id: 'com_sms_wa', label: 'Send WhatsApp Messages' }
            ]},
            { id: 'com_email', label: 'Email', subItems: [
                { id: 'com_em_par', label: 'Parents Email' },
                { id: 'com_em_teach', label: 'Teachers Email' }
            ]}
        ]},
        { id: 'settings', label: '⚙️ Settings', subItems: [
            { id: 'set_session', label: 'Academic Session', subItems: [
                { id: 'set_ses_create', label: 'Session Creation' },
                { id: 'set_ses_switch', label: 'Session Switch' }
            ]},
            { id: 'set_classes', label: 'Classes', subItems: [
                { id: 'set_cls_create', label: 'Create Class' },
                { id: 'set_cls_sec', label: 'Create Section' }
            ]},
            { id: 'set_roles', label: 'Roles & Permissions', subItems: [
                { id: 'set_rol_prin', label: 'Principal' },
                { id: 'set_rol_vp', label: 'Vice Principal' },
                { id: 'set_rol_teach', label: 'Teacher' },
                { id: 'set_rol_acc', label: 'Accountant' },
                { id: 'set_rol_rec', label: 'Receptionist' }
            ]},
            { id: 'set_school', label: 'School Settings', subItems: [
                { id: 'set_sch_info', label: 'School Information' },
                { id: 'set_sch_logo', label: 'Logo' },
                { id: 'set_sch_contact', label: 'Contact Details' }
            ]},
            { id: 'set_sys', label: 'System Settings', subItems: [
                { id: 'set_sys_backup', label: 'Backup' },
                { id: 'set_sys_sec', label: 'Security' },
                { id: 'set_sys_audit', label: 'Audit Logs' }
            ]}
        ]}
    ];

    const getActiveTitle = () => {
        let currentTitle = 'Dashboard Overview';
        const searchItems = (items) => {
            for (const item of items) {
                if (item.id === activeTab) {
                    currentTitle = item.label;
                    return true;
                }
                if (item.subItems) {
                    if (searchItems(item.subItems)) {
                        currentTitle = `${item.label} / ${currentTitle}`;
                        return true;
                    }
                }
            }
            return false;
        };
        searchItems(navItems);
        return currentTitle;
    };

    const renderContent = () => {
        if (activeTab === 'overview') return <DashboardOverview />;
        
        // Handle mapped functional modules
        if (activeTab === 'sm_list_all' || activeTab === 'sm_list') return <StudentManagement />;
        if (activeTab === 'sm_list_admission') return <AdmissionManagement />;
        if (activeTab === 'sm_att_daily' || activeTab === 'sm_attendance') return <AttendanceManagement />;
        
        if (activeTab === 'ac_class_list' || activeTab === 'ac_classes') return <ClassManagement />;
        if (activeTab === 'ex_marks_teacher' || activeTab === 'exam_management') return <ExaminationManagement />;
        if (activeTab === 'fin_fee_coll' || activeTab === 'fin_fees') return <FeeManagement />;
        if (activeTab === 'stf_teach_list' || activeTab === 'staff_management') return <StaffManagement />;
        if (activeTab === 'com_not_school' || activeTab === 'communication') return <CommunicationCenter />;
        
        // Any other unmatched tab falls back to PlaceholderView
        const title = getActiveTitle().split(' / ').pop();
        return <PlaceholderView title={title} />;
    };

    // Recursive component to render sidebar items
    const renderNavItems = (items, depth = 0) => {
        return items.map(item => {
            const hasSub = item.subItems && item.subItems.length > 0;
            const isOpen = openMenus[item.id];
            const isSelected = activeTab === item.id;
            
            return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                        onClick={(e) => {
                            if (hasSub) {
                                toggleMenu(item.id, e);
                            } else {
                                setActiveTab(item.id);
                            }
                        }}
                        style={{
                            width: '100%', textAlign: 'left', 
                            padding: depth === 0 ? '12px 14px' : depth === 1 ? '8px 12px 8px 24px' : '6px 12px 6px 36px',
                            borderRadius: '8px', border: 'none', cursor: 'pointer',
                            fontSize: depth === 0 ? 14 : 13, 
                            fontWeight: depth === 0 ? 600 : 500,
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                            color: isSelected ? '#38bdf8' : (depth === 0 ? '#cbd5e1' : '#94a3b8'),
                            transition: 'all 0.2s ease',
                            marginTop: depth === 0 ? '4px' : '2px'
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.color = '#e2e8f0' }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.color = depth === 0 ? '#cbd5e1' : '#94a3b8' }}
                    >
                        {item.icon && <span style={{ fontSize: '16px' }}>{item.icon}</span>}
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {hasSub && (
                            <span style={{ fontSize: '12px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                        )}
                    </button>
                    {hasSub && isOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {renderNavItems(item.subItems, depth + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? 300 : 0, overflow: 'hidden', background: '#0f172a',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.1)', zIndex: 10
            }}>
                <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>👑</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h2 style={{ color: 'white', margin: 0, fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{schoolName}</h2>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Principal Portal</p>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {renderNavItems(navItems)}
                    </div>
                </nav>

                <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>P</div>
                        <div>
                            <p style={{ color: 'white', margin: 0, fontSize: 14, fontWeight: 600 }}>Principal User</p>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: 11 }}>Administrator</p>
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
                <header style={{ 
                    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', 
                    padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    borderBottom: '1px solid rgba(255,255,255,0.5)', zIndex: 5 
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

                {/* Content Area */}
                <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrincipalDashboard;
