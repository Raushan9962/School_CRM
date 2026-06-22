import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, UserCheck, School, Users, IndianRupee, Library, Bus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ModuleContainer from '../../components/layout/ModuleContainer';
import PlaceholderView from '../Principal/components/PlaceholderView';
import DashboardOverview from './components/DashboardOverview';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import PrincipalDetails from './components/PrincipalDetails';
import ParentManagement from './components/ParentManagement';
import FinanceManagement from './components/FinanceManagement';
import LibraryManagement from './components/LibraryManagement';
import TransportManagement from './components/TransportManagement';

const SchoolAdminDashboard = () => {
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
                    const currentRole = userObj?.role || userObj?.roleName;
                    if (currentRole !== 'School Admin') {
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
        { id: 'student', label: 'Student Management', icon: <GraduationCap size={20} strokeWidth={1.5} /> },
        { id: 'teacher', label: 'Teacher Management', icon: <UserCheck size={20} strokeWidth={1.5} /> },
        { id: 'principal', label: 'Principal Details', icon: <School size={20} strokeWidth={1.5} /> },
        { id: 'parent', label: 'Parent Management', icon: <Users size={20} strokeWidth={1.5} /> },
        { id: 'finance', label: 'Finance & Accounts', icon: <IndianRupee size={20} strokeWidth={1.5} /> },
        { id: 'library', label: 'Library Management', icon: <Library size={20} strokeWidth={1.5} /> },
        { id: 'transport', label: 'Transport Management', icon: <Bus size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        if (activeTab === 'overview') return <DashboardOverview />;

        if (activeTab === 'student') {
            const tabs = [
                { id: 'sa_stu_list', label: 'Student Records', count: '850' },
                { id: 'sa_stu_att', label: 'Attendance' },
                { id: 'sa_stu_acad', label: 'Academics' },
                { id: 'sa_stu_trans', label: 'Transport Info' }
            ];
            const contentMap = {
                'sa_stu_list': <StudentManagement />,
                'sa_stu_att': <PlaceholderView title="Attendance" />,
                'sa_stu_acad': <PlaceholderView title="Academics" />,
                'sa_stu_trans': <PlaceholderView title="Transport Info" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_stu_list" />;
        }

        if (activeTab === 'teacher') {
            const tabs = [
                { id: 'sa_tea_list', label: 'Teacher Directory', count: '45' },
                { id: 'sa_tea_perf', label: 'Performance' },
                { id: 'sa_tea_leave', label: 'Leave Requests' }
            ];
            const contentMap = {
                'sa_tea_list': <TeacherManagement />,
                'sa_tea_perf': <PlaceholderView title="Performance" />,
                'sa_tea_leave': <PlaceholderView title="Leave Requests" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_tea_list" />;
        }

        if (activeTab === 'principal') {
            const tabs = [
                { id: 'sa_prin_det', label: 'Principal Profile' },
                { id: 'sa_prin_comm', label: 'Communications' }
            ];
            const contentMap = {
                'sa_prin_det': <PrincipalDetails />,
                'sa_prin_comm': <PlaceholderView title="Communications" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_prin_det" />;
        }

        if (activeTab === 'parent') {
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
                { id: 'sa_fin_over', label: 'Finance Overview' },
                { id: 'sa_fin_fee', label: 'Fee Collection' },
                { id: 'sa_fin_exp', label: 'Expenses' }
            ];
            const contentMap = {
                'sa_fin_over': <FinanceManagement />,
                'sa_fin_fee': <PlaceholderView title="Fee Collection" />,
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
            userInfo={{ name: currentUser?.name || 'Admin User', schoolName: currentUser?.schoolName || 'VidyaSetu', role: 'School Administrator' }}
            handleLogout={handleLogout}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default SchoolAdminDashboard;
