import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, BookOpen, Repeat, IndianRupee } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LibrarianOverview from './components/LibrarianOverview';
import BookManagement from './components/BookManagement';
import BookIssueReturn from './components/BookIssueReturn';
import FineManagement from './components/FineManagement';
import LibrarySettings from './components/LibrarySettings';
import LibrarianAttendance from '../../components/staff/StaffAttendance';
import LibrarianLeave from '../../components/staff/StaffLeave';
import LibrarianSalary from '../../components/staff/StaffSalary';
import { Settings, UserCheck, ClipboardList, Wallet } from 'lucide-react';

const PlaceholderView = ({ title }) => (
    <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '16px' }}>{title}</h2>
        <p className="text-slate-500">This module is currently under development. It will be available soon.</p>
    </div>
);

const LibrarianDashboard = () => {
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
                    if (currentRole !== 'librarian') {
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
        { id: 'overview', label: 'Library Overview', icon: <Library size={20} strokeWidth={1.5} /> },
        { id: 'inventory', label: 'Book Management', icon: <BookOpen size={20} strokeWidth={1.5} /> },
        { id: 'issuereturn', label: 'Issue / Return', icon: <Repeat size={20} strokeWidth={1.5} /> },
        { id: 'fines', label: 'Fine Tracking', icon: <IndianRupee size={20} strokeWidth={1.5} /> },
        { id: 'attendance', label: 'My Attendance & ID', icon: <UserCheck size={20} strokeWidth={1.5} /> },
        { id: 'leaves', label: 'Leave Requests', icon: <ClipboardList size={20} strokeWidth={1.5} /> },
        { id: 'salary', label: 'Salary Details', icon: <Wallet size={20} strokeWidth={1.5} /> },
        { id: 'settings', label: 'Library Settings', icon: <Settings size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <LibrarianOverview />;
            case 'inventory': return <BookManagement />;
            case 'issuereturn': return <BookIssueReturn />;
            case 'fines': return <FineManagement />;
            case 'attendance': return <LibrarianAttendance />;
            case 'leaves': return <LibrarianLeave />;
            case 'salary': return <LibrarianSalary />;
            case 'settings': return <LibrarySettings />;
            default: return <LibrarianOverview />;
        }
    };

    if (!currentUser) return null;

    return (
        <DashboardLayout
            userInfo={{ name: currentUser.name, role: 'Librarian', avatar: currentUser.image }}
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default LibrarianDashboard;
