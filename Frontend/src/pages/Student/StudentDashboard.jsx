import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Calendar, BookOpen, FileText, Clock, ClipboardList, IndianRupee, Library, MessageSquare, Palmtree, Award, Palette, Bus, Ticket, Bell, Menu } from 'lucide-react';

import DashboardOverview from './components/DashboardOverview';
import StudentProfile from './components/StudentProfile';
import AttendanceView from './components/AttendanceView';
import ExamsView from './components/ExamsView';
import AssignmentsView from './components/AssignmentsView';
import FeeView from './components/FeeView';
import AcademicsView from './components/AcademicsView';
import TimetableView from './components/TimetableView';
import LibraryView from './components/LibraryView';
import CommunicationView from './components/CommunicationView';
import LeaveView from './components/LeaveView';
import CertificatesView from './components/CertificatesView';
import ActivitiesView from './components/ActivitiesView';
import TransportView from './components/TransportView';
import ComplaintView from './components/ComplaintView';

const StudentDashboard = () => {
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
                    if (currentRole !== 'student') {
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
        { id: 'profile', label: 'My Profile', icon: <UserCircle size={20} strokeWidth={1.5} /> },
        { id: 'attendance', label: 'Attendance', icon: <Calendar size={20} strokeWidth={1.5} /> },
        { id: 'academics', label: 'Academics', icon: <BookOpen size={20} strokeWidth={1.5} /> },
        { id: 'exams', label: 'Exams & Results', icon: <FileText size={20} strokeWidth={1.5} /> },
        { id: 'timetable', label: 'Timetable', icon: <Clock size={20} strokeWidth={1.5} /> },
        { id: 'assignments', label: 'Assignments', icon: <ClipboardList size={20} strokeWidth={1.5} /> },
        { id: 'fees', label: 'Fees Management', icon: <IndianRupee size={20} strokeWidth={1.5} /> },
        { id: 'library', label: 'Library', icon: <Library size={20} strokeWidth={1.5} /> },
        { id: 'communication', label: 'Communication', icon: <MessageSquare size={20} strokeWidth={1.5} /> },
        { id: 'leave', label: 'Leave Management', icon: <Palmtree size={20} strokeWidth={1.5} /> },
        { id: 'certificates', label: 'Certificates', icon: <Award size={20} strokeWidth={1.5} /> },
        { id: 'activities', label: 'Activities & Events', icon: <Palette size={20} strokeWidth={1.5} /> },
        { id: 'transport', label: 'Transport', icon: <Bus size={20} strokeWidth={1.5} /> },
        { id: 'complaint', label: 'Complaint / Help Desk', icon: <Ticket size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview onNavigate={setActiveTab} />;
            case 'profile': return <StudentProfile />;
            case 'attendance': return <AttendanceView />;
            case 'academics': return <AcademicsView />;
            case 'exams': return <ExamsView />;
            case 'timetable': return <TimetableView />;
            case 'assignments': return <AssignmentsView />;
            case 'fees': return <FeeView />;
            case 'library': return <LibraryView />;
            case 'communication': return <CommunicationView />;
            case 'leave': return <LeaveView />;
            case 'certificates': return <CertificatesView />;
            case 'activities': return <ActivitiesView />;
            case 'transport': return <TransportView />;
            case 'complaint': return <ComplaintView />;
            default: return <DashboardOverview onNavigate={setActiveTab} />;
        }
    };

    const getActiveTitle = () => {
        const item = navItems.find(n => n.id === activeTab);
        return item ? item.label : 'Dashboard Overview';
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className={`overflow-hidden bg-white transition-[width] duration-300 flex flex-col border-r border-slate-200 z-10 ${isSidebarOpen ? 'w-[260px]' : 'w-0'}`}>
                {/* Profile Header */}
                <div className="p-6 pb-2 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'ST'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-slate-800 m-0 text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{currentUser?.name || 'Student'}</p>
                    </div>
                </div>
                
                {/* Brand Selector */}
                <div className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors mb-2">
                    <span className="text-slate-600 font-semibold tracking-wide text-sm uppercase">VIDYASETU</span>
                    <span className="text-slate-400 text-[10px]">▶</span>
                </div>

                <nav className="flex-1 px-3 overflow-y-auto">
                    <div className="flex flex-col gap-1.5">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg border-none cursor-pointer text-[15px] font-medium flex items-center gap-4 transition-colors ${activeTab === item.id ? 'bg-sky-50 text-sky-600' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className={activeTab === item.id ? 'text-sky-600' : 'text-slate-400'}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button onClick={handleLogout} className="w-full p-2.5 bg-transparent text-slate-500 border-none rounded-lg cursor-pointer font-medium transition-colors flex justify-center items-center hover:bg-slate-100 hover:text-red-500">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
                {/* Header */}
                <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200 z-[5]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-transparent border-none text-xl cursor-pointer text-slate-500 p-1 flex items-center hover:text-slate-800 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="m-0 text-xl font-semibold text-gray-900">{getActiveTitle()}</h1>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center relative p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <Bell size={20} strokeWidth={2} className="text-sky-500" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 px-8 py-6 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
