import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap, CalendarCheck, CalendarDays, BarChart3, Settings, Bell, FileText, Bus, CheckSquare, AlertTriangle, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ModuleContainer from '../../components/layout/ModuleContainer';
import PlaceholderView from './components/PlaceholderView';
import DashboardOverview from './components/DashboardOverview';

// Components
import TeacherManagement from './components/TeacherManagement';
import TeacherPerformance from './components/TeacherPerformance';
import LeaveApproval from './components/LeaveApproval';
import ClassManagement from './components/ClassManagement';
import SubjectManagement from './components/SubjectManagement';
import TimetableManagement from './components/TimetableManagement';
import SyllabusTracking from './components/SyllabusTracking';
import ExamScheduleManagement from './components/ExamScheduleManagement';
import ExaminationManagement from './components/ExaminationManagement';
import StudentManagement from './components/StudentManagement';
import AttendanceManagement from './components/AttendanceManagement';
import DisciplineManagement from './components/DisciplineManagement';
import CommunicationCenter from './components/CommunicationCenter';
import TaskDelegation from './components/TaskDelegation';
import GrievanceSystem from './components/GrievanceSystem';

// Reusing some School Admin components for Principal's view
import ParentManagement from '../SchoolAdmin/components/ParentManagement';
import FinanceManagement from '../SchoolAdmin/components/FinanceManagement';
import LibraryManagement from '../SchoolAdmin/components/LibraryManagement';
import TransportManagement from '../SchoolAdmin/components/TransportManagement';

const PrincipalDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const userObj = JSON.parse(userStr);
                    const currentRole = userObj?.role || userObj?.roleName;
                    if (currentRole !== 'Principal') {
                        navigate('/login/student');
                        return;
                    }
                    setCurrentUser(userObj);
                } catch (e) {
                    console.error("Error parsing user data:", e);
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
        { id: 'students', label: 'Student Management', icon: <GraduationCap size={20} strokeWidth={1.5} /> },
        { id: 'teachers', label: 'Teacher Mgmt', icon: <Users size={20} strokeWidth={1.5} /> },
        { id: 'academics', label: 'Academic Management', icon: <BookOpen size={20} strokeWidth={1.5} /> },
        { id: 'exams', label: 'Examinations', icon: <FileText size={20} strokeWidth={1.5} /> },
        { id: 'parents', label: 'Parent Management', icon: <Users size={20} strokeWidth={1.5} /> },
        { id: 'finance', label: 'Finance Summary', icon: <BarChart3 size={20} strokeWidth={1.5} /> },
        { id: 'library', label: 'Library Management', icon: <BookOpen size={20} strokeWidth={1.5} /> },
        { id: 'transport', label: 'Transport Management', icon: <Bus size={20} /> },
        { id: 'tasks', label: 'Task Delegation', icon: <CheckSquare size={20} /> },
        { id: 'grievances', label: 'Grievances & Complaints', icon: <AlertTriangle size={20} /> },
        { id: 'leave', label: 'Leave Management', icon: <CalendarDays size={20} strokeWidth={1.5} /> },
        { id: 'communication', label: 'Communication Center', icon: <MessageSquare size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        if (activeTab === 'overview') return <DashboardOverview setActiveTab={setActiveTab} />;

        if (activeTab === 'teachers') {
            const tabs = [
                { id: 't_list', label: 'Teacher List' },
                { id: 't_att', label: 'Attendance' },
                { id: 't_leave', label: 'Leave Requests' },
                { id: 't_perf', label: 'Performance' },
                { id: 't_subj', label: 'Subject Allocation' }
            ];
            const contentMap = {
                't_list': <TeacherManagement />,
                't_att': <PlaceholderView title="Teacher Attendance" />,
                't_leave': <LeaveApproval />,
                't_perf': <TeacherPerformance />,
                't_subj': <PlaceholderView title="Subject Allocation" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="t_list" />;
        }

        if (activeTab === 'academics') {
            const tabs = [
                { id: 'ac_classes', label: 'Classes' },
                { id: 'ac_subjects', label: 'Subjects' },
                { id: 'ac_timetable', label: 'Timetable' },
                { id: 'ac_calendar', label: 'Academic Calendar' },
                { id: 'ac_syllabus', label: 'Syllabus Tracking' }
            ];
            const contentMap = {
                'ac_classes': <ClassManagement />,
                'ac_subjects': <SubjectManagement />,
                'ac_timetable': <TimetableManagement />,
                'ac_calendar': <PlaceholderView title="Academic Calendar" />,
                'ac_syllabus': <SyllabusTracking />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="ac_classes" />;
        }

        if (activeTab === 'exams') {
            const tabs = [
                { id: 'ex_schedule', label: 'Exam Schedule' },
                { id: 'ex_marks', label: 'Marks Status' },
                { id: 'ex_results', label: 'Results' },
                { id: 'ex_top', label: 'Top Performers' },
                { id: 'ex_weak', label: 'Weak Students' }
            ];
            const contentMap = {
                'ex_schedule': <ExamScheduleManagement />,
                'ex_marks': <ExaminationManagement />,
                'ex_results': <PlaceholderView title="Exam Results" />,
                'ex_top': <PlaceholderView title="Top Performers" />,
                'ex_weak': <PlaceholderView title="Weak Students" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="ex_schedule" />;
        }

        if (activeTab === 'students') {
            const tabs = [
                { id: 'st_list', label: 'Student Records' },
                { id: 'st_att', label: 'Attendance' },
                { id: 'st_perf', label: 'Performance' },
                { id: 'st_disc', label: 'Discipline' },
                { id: 'st_couns', label: 'Counselling' }
            ];
            const contentMap = {
                'st_list': <StudentManagement />,
                'st_att': <AttendanceManagement />,
                'st_perf': <PlaceholderView title="Student Performance" />,
                'st_disc': <DisciplineManagement />,
                'st_couns': <PlaceholderView title="Student Counselling" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="st_list" />;
        }

        if (activeTab === 'parents') {
            const tabs = [
                { id: 'sa_par_dir', label: 'Parent Directory' },
                { id: 'sa_par_meet', label: 'Meetings' },
                { id: 'sa_par_feed', label: 'Feedback' }
            ];
            const contentMap = {
                'sa_par_dir': <ParentManagement />,
                'sa_par_meet': <PlaceholderView title="Meetings" />,
                'sa_par_feed': <PlaceholderView title="Feedback" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_par_dir" />;
        }

        if (activeTab === 'finance') {
            const tabs = [
                { id: 'sa_fin_over', label: 'Finance Summary' },
                { id: 'sa_fin_fee', label: 'Fee Collection Overview' },
                { id: 'sa_fin_exp', label: 'Expenses' }
            ];
            const contentMap = {
                'sa_fin_over': <FinanceManagement />,
                'sa_fin_fee': <PlaceholderView title="Fee Collection Overview" />,
                'sa_fin_exp': <PlaceholderView title="Expenses" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_fin_over" />;
        }

        if (activeTab === 'library') {
            const tabs = [
                { id: 'sa_lib_cat', label: 'Catalog' },
                { id: 'sa_lib_issue', label: 'Issued Books' },
                { id: 'sa_lib_req', label: 'Requests' }
            ];
            const contentMap = {
                'sa_lib_cat': <LibraryManagement />,
                'sa_lib_issue': <PlaceholderView title="Issued Books" />,
                'sa_lib_req': <PlaceholderView title="Requests" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_lib_cat" />;
        }

        if (activeTab === 'transport') {
            const tabs = [
                { id: 'sa_tr_routes', label: 'Routes' },
                { id: 'sa_tr_veh', label: 'Vehicles' },
                { id: 'sa_tr_stu', label: 'Student Mapping' }
            ];
            const contentMap = {
                'sa_tr_routes': <TransportManagement />,
                'sa_tr_veh': <PlaceholderView title="Vehicles" />,
                'sa_tr_stu': <PlaceholderView title="Student Mapping" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_tr_routes" />;
        }

        if (activeTab === 'leave') {
            if (!currentUser) return null;

    return (
                <ModuleContainer 
                    tabs={[{ id: 'leave_all', label: 'All Leave Requests' }]} 
                    contentMap={{ 'leave_all': <LeaveApproval /> }} 
                    defaultTab="leave_all" 
                />
            );
        }

        if (activeTab === 'tasks') {
            return <TaskDelegation />;
        }

        if (activeTab === 'grievances') {
            return <GrievanceSystem />;
        }

        if (activeTab === 'communication') {
            return <CommunicationCenter />;
        }

        if (activeTab === 'reports') return <PlaceholderView title="Reports & Analytics" />;
        if (activeTab === 'settings') return <PlaceholderView title="Settings" />;

        return <DashboardOverview setActiveTab={setActiveTab} />;
    };

    if (!currentUser) return null;

    return (
        <DashboardLayout
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userInfo={{ name: currentUser?.name || 'Admin User', schoolName: currentUser?.schoolName || 'VidyaSetu', role: 'Principal' }}
            handleLogout={handleLogout}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default PrincipalDashboard;
