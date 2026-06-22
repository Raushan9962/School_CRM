import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, FileText, UserCheck, IndianRupee, BarChart2, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
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
import DashboardLayout from '../../components/layout/DashboardLayout';
import ModuleContainer from '../../components/layout/ModuleContainer';

const PrincipalDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [schoolName, setSchoolName] = useState('VidyaSetu School');
    const [stats, setStats] = useState({ students: 0, teachers: 0, present: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/principal/dashboard-stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setStats(json.stats);
                }
            } catch (err) {
                console.error("Failed to load global stats", err);
            }
        };
        fetchStats();

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
        { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
        { id: 'student_management', label: 'Student Management', icon: <Users size={20} strokeWidth={1.5} />, subItems: [
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
        { id: 'academic_management', label: 'Academic Management', icon: <BookOpen size={20} strokeWidth={1.5} />, subItems: [
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
        { id: 'exam_management', label: 'Examination & Results', icon: <FileText size={20} strokeWidth={1.5} />, subItems: [
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
        { id: 'staff_management', label: 'Staff Management', icon: <UserCheck size={20} strokeWidth={1.5} />, subItems: [
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
        { id: 'finance_management', label: 'Finance Management', icon: <IndianRupee size={20} strokeWidth={1.5} />, subItems: [
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
        { id: 'reports_analytics', label: 'Reports & Analytics', icon: <BarChart2 size={20} strokeWidth={1.5} />, subItems: [
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
        { id: 'communication', label: 'Communication', icon: <MessageSquare size={20} strokeWidth={1.5} />, subItems: [
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
        { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} strokeWidth={1.5} />, subItems: [
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

        if (activeTab === 'student_management') {
            const tabs = [
                { id: 'sm_list', label: 'Student List', count: stats.students > 0 ? stats.students.toString() : '' },
                { id: 'sm_attendance', label: 'Attendance', count: stats.present > 0 ? stats.present.toString() : '', subtext: 'Present Today' },
                { id: 'sm_performance', label: 'Performance' },
                { id: 'sm_promotions', label: 'Promotions' },
                { id: 'sm_alumni', label: 'Alumni' },
                { id: 'sm_discipline', label: 'Discipline' }
            ];
            const contentMap = {
                'sm_list': <StudentManagement />,
                'sm_attendance': <AttendanceManagement />,
                'sm_performance': <PlaceholderView title="Student Performance" />,
                'sm_promotions': <PlaceholderView title="Promotions" />,
                'sm_alumni': <PlaceholderView title="Alumni" />,
                'sm_discipline': <PlaceholderView title="Discipline" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sm_list" />;
        }

        if (activeTab === 'academic_management') {
            const tabs = [
                { id: 'ac_classes', label: 'Classes' },
                { id: 'ac_subjects', label: 'Subjects' },
                { id: 'ac_timetable', label: 'Timetable' },
                { id: 'ac_homework', label: 'Homework' },
                { id: 'ac_study', label: 'Study Materials' }
            ];
            const contentMap = {
                'ac_classes': <ClassManagement />,
                'ac_subjects': <PlaceholderView title="Subjects" />,
                'ac_timetable': <PlaceholderView title="Timetable" />,
                'ac_homework': <PlaceholderView title="Homework & Assignments" />,
                'ac_study': <PlaceholderView title="Study Materials" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="ac_classes" />;
        }

        if (activeTab === 'exam_management') {
            const tabs = [
                { id: 'ex_setup', label: 'Exam Setup' },
                { id: 'ex_marks', label: 'Marks Entry' },
                { id: 'ex_analysis', label: 'Result Analysis' },
                { id: 'ex_top', label: 'Top Performers' },
                { id: 'ex_weak', label: 'Weak Students' },
                { id: 'ex_report', label: 'Report Cards' }
            ];
            const contentMap = {
                'ex_setup': <PlaceholderView title="Exam Setup" />,
                'ex_marks': <ExaminationManagement />,
                'ex_analysis': <PlaceholderView title="Result Analysis" />,
                'ex_top': <PlaceholderView title="Top Performers" />,
                'ex_weak': <PlaceholderView title="Weak Students" />,
                'ex_report': <PlaceholderView title="Report Cards" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="ex_marks" />;
        }

        if (activeTab === 'staff_management') {
            const tabs = [
                { id: 'stf_teachers', label: 'Teachers', count: stats.teachers > 0 ? stats.teachers.toString() : '' },
                { id: 'stf_attendance', label: 'Attendance' },
                { id: 'stf_performance', label: 'Performance' },
                { id: 'stf_leave', label: 'Leave Management' },
                { id: 'stf_payroll', label: 'Payroll' }
            ];
            const contentMap = {
                'stf_teachers': <StaffManagement />,
                'stf_attendance': <PlaceholderView title="Staff Attendance" />,
                'stf_performance': <PlaceholderView title="Staff Performance" />,
                'stf_leave': <PlaceholderView title="Leave Management" />,
                'stf_payroll': <PlaceholderView title="Payroll" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="stf_teachers" />;
        }

        if (activeTab === 'finance_management') {
            const tabs = [
                { id: 'fin_fees', label: 'Fees Collection' },
                { id: 'fin_pending', label: 'Pending Fees' },
                { id: 'fin_expense', label: 'Expenses' },
                { id: 'fin_income', label: 'Income Reports' }
            ];
            const contentMap = {
                'fin_fees': <FeeManagement />,
                'fin_pending': <PlaceholderView title="Pending Fees" />,
                'fin_expense': <PlaceholderView title="Expense Management" />,
                'fin_income': <PlaceholderView title="Income Reports" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="fin_fees" />;
        }

        if (activeTab === 'reports_analytics') {
            const tabs = [
                { id: 'rep_attendance', label: 'Attendance Reports' },
                { id: 'rep_results', label: 'Result Reports' },
                { id: 'rep_fees', label: 'Fee Reports' },
                { id: 'rep_staff', label: 'Staff Reports' }
            ];
            const contentMap = {
                'rep_attendance': <PlaceholderView title="Attendance Reports" />,
                'rep_results': <PlaceholderView title="Result Reports" />,
                'rep_fees': <PlaceholderView title="Fee Reports" />,
                'rep_staff': <PlaceholderView title="Staff Reports" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="rep_attendance" />;
        }

        if (activeTab === 'communication') {
            const tabs = [
                { id: 'com_notices', label: 'Notices' },
                { id: 'com_announce', label: 'Announcements' },
                { id: 'com_sms', label: 'SMS / WhatsApp' },
                { id: 'com_email', label: 'Email' }
            ];
            const contentMap = {
                'com_notices': <CommunicationCenter />,
                'com_announce': <PlaceholderView title="Announcements" />,
                'com_sms': <PlaceholderView title="SMS / WhatsApp" />,
                'com_email': <PlaceholderView title="Email" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="com_notices" />;
        }

        if (activeTab === 'settings') {
            const tabs = [
                { id: 'set_school', label: 'School Settings' },
                { id: 'set_session', label: 'Academic Session' },
                { id: 'set_roles', label: 'Roles & Permissions' },
                { id: 'set_sys', label: 'System Settings' }
            ];
            const contentMap = {
                'set_school': <PlaceholderView title="School Settings" />,
                'set_session': <PlaceholderView title="Academic Session" />,
                'set_roles': <PlaceholderView title="Roles & Permissions" />,
                'set_sys': <PlaceholderView title="System Settings" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="set_school" />;
        }

        const title = getActiveTitle().split(' / ').pop();
        return <PlaceholderView title={title} />;
    };

    return (
        <DashboardLayout
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userInfo={{ name: 'Principal', schoolName: schoolName, role: 'Administrator' }}
            handleLogout={handleLogout}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default PrincipalDashboard;
