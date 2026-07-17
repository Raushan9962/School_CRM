import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, UserCircle, CalendarDays, Award, CreditCard, 
    BookOpen, Clock, Bus, MessageSquare, Bell, FileText, Download, 
    Settings, Activity
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChildSwitcher from './components/ChildSwitcher';
import ParentOverview from './components/ParentOverview';
import ChildProfile from './components/ChildProfile';
import AttendanceModule from './components/AttendanceModule';
import FeeManagement from './components/FeeManagement';
import ExaminationResults from './components/ExaminationResults';
import HomeworkModule from './components/HomeworkModule';
import TimetableModule from './components/TimetableModule';
import TransportModule from './components/TransportModule';
import CommunicationCenter from './components/CommunicationCenter';
import CircularAnnouncements from './components/CircularAnnouncements';
import LeaveApplication from './components/LeaveApplication';
import DocumentsDownload from './components/DocumentsDownload';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ParentProfileSettings from './components/ParentProfileSettings';
import SelfServiceRequests from './components/SelfServiceRequests';

// Placeholders for modules to be implemented
const PlaceholderView = ({ title, childId }) => (
    <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>{title}</h2>
        <p className="text-slate-500 mb-4">This module is currently under development.</p>
        <p className="text-sm text-blue-600 font-medium">Viewing data for Child ID: {childId}</p>
    </div>
);

const ParentDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [childrenList, setChildrenList] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const userObj = JSON.parse(userStr);
                    const rawRole = userObj?.role || userObj?.roleName || '';
                    const currentRole = rawRole.toLowerCase().replace(/\s+/g, '');
                    if (currentRole !== 'parent') {
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

    useEffect(() => {
        const fetchChildren = async () => {
            if (!currentUser) return;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`\${import.meta.env.VITE_API_BASE_URL}/parent/children`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data && response.data.length > 0) {
                    setChildrenList(response.data);
                    setSelectedChildId(response.data[0].studentId);
                }
            } catch (error) {
                console.error("Error fetching children:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChildren();
    }, [currentUser]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login/student');
    };

    const navItems = [
        { id: 'overview', label: 'Parent Dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
        { id: 'profile', label: 'Child Profile', icon: <UserCircle size={20} strokeWidth={1.5} /> },
        { id: 'attendance', label: 'Attendance', icon: <CalendarDays size={20} strokeWidth={1.5} /> },
        { id: 'results', label: 'Examination & Results', icon: <Award size={20} strokeWidth={1.5} /> },
        { id: 'fee', label: 'Fee Management', icon: <CreditCard size={20} strokeWidth={1.5} /> },
        { id: 'homework', label: 'Homework', icon: <BookOpen size={20} strokeWidth={1.5} /> },
        { id: 'timetable', label: 'Timetable', icon: <Clock size={20} strokeWidth={1.5} /> },
        { id: 'transport', label: 'Transport', icon: <Bus size={20} strokeWidth={1.5} /> },
        { id: 'communication', label: 'Communication', icon: <MessageSquare size={20} strokeWidth={1.5} /> },
        { id: 'circular', label: 'Circular & Announcements', icon: <Bell size={20} strokeWidth={1.5} /> },
        { id: 'leave', label: 'Leave Application', icon: <FileText size={20} strokeWidth={1.5} /> },
        { id: 'documents', label: 'Documents Download', icon: <Download size={20} strokeWidth={1.5} /> },
        { id: 'analytics', label: 'Analytics Dashboard', icon: <Activity size={20} strokeWidth={1.5} /> },
        { id: 'settings', label: 'Profile & Settings', icon: <Settings size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        if (loading) {
            return <div className="flex items-center justify-center h-full"><p>Loading children data...</p></div>;
        }
        
        if (!selectedChildId) {
            return <div className="flex items-center justify-center h-full"><p>No children linked to this account.</p></div>;
        }

        switch (activeTab) {
            case 'overview': return <ParentOverview childId={selectedChildId} />;
            case 'profile': return <ChildProfile childId={selectedChildId} />;
            case 'attendance': return <AttendanceModule childId={selectedChildId} />;
            case 'results': return <ExaminationResults childId={selectedChildId} />;
            case 'fee': return <FeeManagement childId={selectedChildId} />;
            case 'homework': return <HomeworkModule childId={selectedChildId} />;
            case 'timetable': return <TimetableModule childId={selectedChildId} />;
            case 'transport': return <TransportModule childId={selectedChildId} />;
            case 'communication': return <CommunicationCenter childId={selectedChildId} />;
            case 'circular': return <CircularAnnouncements childId={selectedChildId} />;
            case 'leave': return <LeaveApplication childId={selectedChildId} />;
            case 'documents': return <DocumentsDownload childId={selectedChildId} />;
            case 'analytics': return <AnalyticsDashboard childId={selectedChildId} />;
            case 'settings': return <ParentProfileSettings childId={selectedChildId} />;
            default: return <ParentOverview childId={selectedChildId} />;
        }
    };

    if (!currentUser) return null;

    const sidebarBottomContent = (
        <ChildSwitcher 
            childrenList={childrenList} 
            selectedChildId={selectedChildId} 
            onChildSelect={setSelectedChildId} 
        />
    );

    return (
        <DashboardLayout
            userInfo={{ name: currentUser.name, role: 'Parent', avatar: currentUser.image }}
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
            sidebarBottomContent={sidebarBottomContent}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default ParentDashboard;
