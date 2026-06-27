import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, BookOpen, FileText, ClipboardList, Calendar, User, TrendingUp, NotebookPen, BarChart2, ShieldAlert, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import ClassManagement from './components/ClassManagement';
import AttendanceManagement from './components/AttendanceManagement';
import ExamManagement from './components/ExamManagement';
import AssignmentManagement from './components/AssignmentManagement';
import TeacherProfile from './components/TeacherProfile';
import LeaveManagement from './components/LeaveManagement';
import TeacherTimetable from './components/TeacherTimetable';
import SyllabusTracking from './components/SyllabusTracking';
import TeacherDiary from './components/TeacherDiary';
import StudentPerformance from './components/StudentPerformance';
import BehaviorTracking from './components/BehaviorTracking';
import ParentInteraction from './components/ParentInteraction';

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
                    const currentRole = (userObj?.role || userObj?.roleName || "").toLowerCase();
                    if (currentRole !== 'teacher') {
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
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
        { id: 'classes', label: 'My Classes', icon: <Users size={20} strokeWidth={1.5} /> },
        { id: 'timetable', label: 'Timetable', icon: <Calendar size={20} strokeWidth={1.5} /> },
        { id: 'attendance', label: 'Attendance', icon: <UserCheck size={20} strokeWidth={1.5} /> },
        { id: 'assignments', label: 'Assignments', icon: <BookOpen size={20} strokeWidth={1.5} /> },
        { id: 'exams', label: 'Exams & Marks', icon: <FileText size={20} strokeWidth={1.5} /> },
        { id: 'syllabus', label: 'Syllabus Tracking', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
        { id: 'diary', label: 'Lesson Diary', icon: <NotebookPen size={20} strokeWidth={1.5} /> },
        { id: 'performance', label: 'Student Analytics', icon: <BarChart2 size={20} strokeWidth={1.5} /> },
        { id: 'behavior', label: 'Behavior Tracking', icon: <ShieldAlert size={20} strokeWidth={1.5} /> },
        { id: 'parents', label: 'Parent & PTM', icon: <MessageSquare size={20} strokeWidth={1.5} /> },
        { id: 'leaves', label: 'Leave Requests', icon: <ClipboardList size={20} strokeWidth={1.5} /> },
        { id: 'profile', label: 'My Profile', icon: <User size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'classes': return <ClassManagement />;
            case 'timetable': return <TeacherTimetable />;
            case 'attendance': return <AttendanceManagement />;
            case 'assignments': return <AssignmentManagement />;
            case 'exams': return <ExamManagement />;
            case 'syllabus': return <SyllabusTracking />;
            case 'diary': return <TeacherDiary />;
            case 'performance': return <StudentPerformance />;
            case 'behavior': return <BehaviorTracking />;
            case 'parents': return <ParentInteraction />;
            case 'leaves': return <LeaveManagement />;
            case 'profile': return <TeacherProfile />;
            default: return <DashboardOverview />;
        }
    };

    if (!currentUser) return null;

    return (
        <DashboardLayout
            userInfo={{ name: currentUser.name, role: 'Teacher', avatar: currentUser.image }}
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

export default TeacherDashboard;
