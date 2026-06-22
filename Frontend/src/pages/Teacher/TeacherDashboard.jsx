import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, MessageSquare, UserCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ModuleContainer from '../../components/layout/ModuleContainer';
import PlaceholderView from '../Principal/components/PlaceholderView';
import DashboardOverview from './components/DashboardOverview';
import TeacherProfile from './components/TeacherProfile';
import ClassManagement from './components/ClassManagement';
import AttendanceManagement from './components/AttendanceManagement';
import AssignmentManagement from './components/AssignmentManagement';
import StudyMaterials from './components/StudyMaterials';
import ExamManagement from './components/ExamManagement';
import StudentPerformance from './components/StudentPerformance';
import LeaveManagement from './components/LeaveManagement';
import TeacherCommunication from './components/TeacherCommunication';
import ParentInteraction from './components/ParentInteraction';
import TeacherTimetable from './components/TeacherTimetable';
import Recommendations from './components/Recommendations';
import TeacherReports from './components/TeacherReports';

const TeacherDashboard = () => {
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
                    if (currentRole !== 'teacher') {
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
        { id: 'academics', label: 'Academics & Performance', icon: <GraduationCap size={20} strokeWidth={1.5} /> },
        { id: 'communication', label: 'Communication', icon: <MessageSquare size={20} strokeWidth={1.5} /> },
        { id: 'profile', label: 'My Profile & HR', icon: <UserCircle size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        if (activeTab === 'overview') return <DashboardOverview />;

        if (activeTab === 'academics') {
            const tabs = [
                { id: 't_classes', label: 'Class Management' },
                { id: 't_attendance', label: 'Attendance' },
                { id: 't_timetable', label: 'Timetable' },
                { id: 't_assignments', label: 'Assignments' },
                { id: 't_materials', label: 'Study Materials' },
                { id: 't_exams', label: 'Exams' },
                { id: 't_performance', label: 'Student Performance' },
                { id: 't_certificates', label: 'Certificates & Recs' }
            ];
            const contentMap = {
                't_classes': <ClassManagement />,
                't_attendance': <AttendanceManagement />,
                't_timetable': <TeacherTimetable />,
                't_assignments': <AssignmentManagement />,
                't_materials': <StudyMaterials />,
                't_exams': <ExamManagement />,
                't_performance': <StudentPerformance />,
                't_certificates': <Recommendations />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="t_classes" />;
        }

        if (activeTab === 'communication') {
            const tabs = [
                { id: 't_comm_general', label: 'Teacher Communication' },
                { id: 't_comm_parents', label: 'Parent Interaction' }
            ];
            const contentMap = {
                't_comm_general': <TeacherCommunication />,
                't_comm_parents': <ParentInteraction />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="t_comm_general" />;
        }

        if (activeTab === 'profile') {
            const tabs = [
                { id: 't_prof_details', label: 'My Profile' },
                { id: 't_prof_leave', label: 'Leave Management' },
                { id: 't_prof_reports', label: 'Reports' }
            ];
            const contentMap = {
                't_prof_details': <TeacherProfile />,
                't_prof_leave': <LeaveManagement />,
                't_prof_reports': <TeacherReports />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="t_prof_details" />;
        }

        return <DashboardOverview />;
    };

    const getActiveTitle = () => {
        const item = navItems.find(n => n.id === activeTab);
        return item ? item.label : 'Dashboard Overview';
    };

    return (
        <DashboardLayout
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userInfo={{ name: currentUser?.name || 'Teacher Name', schoolName: 'VidyaSetu', role: 'Staff Member' }}
            handleLogout={handleLogout}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default TeacherDashboard;
