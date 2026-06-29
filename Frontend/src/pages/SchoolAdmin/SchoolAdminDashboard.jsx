import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, UserCheck, School, Users, IndianRupee, Library, Bus, CalendarCheck, Calculator, BookOpen, PhoneCall, Home, UserCog, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ModuleContainer from '../../components/layout/ModuleContainer';
import PlaceholderView from '../Principal/components/PlaceholderView';
import DashboardOverview from './components/DashboardOverview';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import StaffAttendance from './components/StaffAttendance';
import LeaveManagement from './components/LeaveManagement';
import PrincipalDetails from './components/PrincipalDetails';
import ParentManagement from './components/ParentManagement';
import FinanceManagement from './components/FinanceManagement';
import LibraryManagement from './components/LibraryManagement';
import TransportManagement from './components/TransportManagement';
import ProfileUpdatesManagement from './components/ProfileUpdatesManagement';
import PayrollManagement from './components/PayrollManagement';
import GenericRoleManagement from './components/GenericRoleManagement';
import AdmissionRequests from './components/AdmissionRequests';
import FeeSettings from './components/FeeSettings';
import { Briefcase, Building2, UserPlus } from "lucide-react";

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
        { id: 'admissions', label: 'Admission Requests', icon: <FileText size={20} strokeWidth={1.5} /> },
        { id: 'fees', label: 'Fee Settings', icon: <IndianRupee size={20} strokeWidth={1.5} /> },
        { id: 'student', label: 'Student Management', icon: <GraduationCap size={20} strokeWidth={1.5} /> },
        { id: 'teacher', label: 'Teacher Mgmt', icon: <UserCheck size={20} strokeWidth={1.5} /> },
        { id: 'accountant', label: 'Accountant Mgmt', icon: <Calculator size={20} strokeWidth={1.5} /> },
        { id: 'librarian', label: 'Librarian Mgmt', icon: <BookOpen size={20} strokeWidth={1.5} /> },
        { id: 'receptionist', label: 'Receptionist Mgmt', icon: <PhoneCall size={20} strokeWidth={1.5} /> },
        { id: 'transport_staff', label: 'Transport Staff', icon: <Bus size={20} strokeWidth={1.5} /> },
        { id: 'warden', label: 'Hostel Warden', icon: <Home size={20} strokeWidth={1.5} /> },
        { id: 'hr', label: 'HR Management', icon: <UserCog size={20} strokeWidth={1.5} /> },
        { id: 'parent', label: 'Parent Management', icon: <Users size={20} strokeWidth={1.5} /> },
        { id: 'finance', label: 'Finance & Accounts', icon: <IndianRupee size={20} strokeWidth={1.5} /> },
        { id: 'library', label: 'Library Management', icon: <Library size={20} strokeWidth={1.5} /> },
        { id: 'transport', label: 'Transport Management', icon: <Bus size={20} strokeWidth={1.5} /> }
    ];

    const renderContent = () => {
        if (activeTab === 'overview') return <DashboardOverview setActiveTab={setActiveTab} />;
        if (activeTab === 'admissions') return <AdmissionRequests />;
        if (activeTab === 'fees') return <FeeSettings />;

        if (activeTab === 'student') {
            const tabs = [
                { id: 'sa_stu_list', label: 'Student Records', count: '850' },
                { id: 'sa_stu_att', label: 'Attendance' },
                { id: 'sa_stu_acad', label: 'Academics' },
                { id: 'sa_stu_trans', label: 'Transport Info' },
                { id: 'sa_stu_updates', label: 'Profile Updates' }
            ];
            const contentMap = {
                'sa_stu_list': <StudentManagement />,
                'sa_stu_att': <PlaceholderView title="Attendance" />,
                'sa_stu_acad': <PlaceholderView title="Academics" />,
                'sa_stu_trans': <PlaceholderView title="Transport Info" />,
                'sa_stu_updates': <ProfileUpdatesManagement />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_stu_list" />;
        }

        if (activeTab === 'teacher') {
            const tabs = [
                { id: 'sa_tea_list', label: 'Teacher Directory', count: '45' },
                { id: 'sa_tea_perf', label: 'Performance' },
                { id: 'sa_tea_att', label: 'Attendance' },
                { id: 'sa_tea_leave', label: 'Leave Requests' },
                { id: 'sa_tea_payroll', label: 'Salary & Payroll' }
            ];
            const contentMap = {
                'sa_tea_list': <TeacherManagement />,
                'sa_tea_perf': <PlaceholderView title="Performance" />,
                'sa_tea_att': <StaffAttendance roleFilter="Teacher" />,
                'sa_tea_leave': <LeaveManagement roleFilter="Teacher" />,
                'sa_tea_payroll': <PayrollManagement roleFilter="Teacher" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="sa_tea_list" />;
        }

        if (activeTab === 'accountant') {
            const tabs = [
                { id: 'acc_list', label: 'Accountant Directory' },
                { id: 'acc_att', label: 'Attendance' },
                { id: 'acc_leave', label: 'Leave Requests' },
                { id: 'acc_payroll', label: 'Salary & Payroll' }
            ];
            const contentMap = { 
                acc_list: <GenericRoleManagement roleName="Accountant" title="Accountant Management" description="Manage accountants and financial staff." />,
                acc_att: <StaffAttendance roleFilter="Accountant" />,
                acc_leave: <LeaveManagement roleFilter="Accountant" />,
                acc_payroll: <PayrollManagement roleFilter="Accountant" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="acc_list" />;
        }

        if (activeTab === 'librarian') {
            const tabs = [
                { id: 'lib_list', label: 'Librarian Directory' },
                { id: 'lib_att', label: 'Attendance' },
                { id: 'lib_leave', label: 'Leave Requests' },
                { id: 'lib_payroll', label: 'Salary & Payroll' }
            ];
            const contentMap = { 
                lib_list: <GenericRoleManagement roleName="Librarian" title="Librarian Management" description="Manage library staff and records." />,
                lib_att: <StaffAttendance roleFilter="Librarian" />,
                lib_leave: <LeaveManagement roleFilter="Librarian" />,
                lib_payroll: <PayrollManagement roleFilter="Librarian" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="lib_list" />;
        }

        if (activeTab === 'receptionist') {
            const tabs = [
                { id: 'rec_list', label: 'Receptionist Directory' },
                { id: 'rec_att', label: 'Attendance' },
                { id: 'rec_leave', label: 'Leave Requests' },
                { id: 'rec_payroll', label: 'Salary & Payroll' }
            ];
            const contentMap = { 
                rec_list: <GenericRoleManagement roleName="Receptionist" title="Receptionist Management" description="Manage front desk and reception staff." />,
                rec_att: <StaffAttendance roleFilter="Receptionist" />,
                rec_leave: <LeaveManagement roleFilter="Receptionist" />,
                rec_payroll: <PayrollManagement roleFilter="Receptionist" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="rec_list" />;
        }

        if (activeTab === 'transport_staff') {
            const tabs = [
                { id: 'ts_list', label: 'Transport Staff Directory' },
                { id: 'ts_att', label: 'Attendance' },
                { id: 'ts_leave', label: 'Leave Requests' },
                { id: 'ts_payroll', label: 'Salary & Payroll' }
            ];
            const contentMap = { 
                ts_list: <GenericRoleManagement roleName="Transport Staff" title="Transport Staff Management" description="Manage drivers and transport managers." />,
                ts_att: <StaffAttendance roleFilter="Transport Staff" />,
                ts_leave: <LeaveManagement roleFilter="Transport Staff" />,
                ts_payroll: <PayrollManagement roleFilter="Transport Staff" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="ts_list" />;
        }

        if (activeTab === 'warden') {
            const tabs = [
                { id: 'hw_list', label: 'Warden Directory' },
                { id: 'hw_att', label: 'Attendance' },
                { id: 'hw_leave', label: 'Leave Requests' },
                { id: 'hw_payroll', label: 'Salary & Payroll' }
            ];
            const contentMap = { 
                hw_list: <GenericRoleManagement roleName="Hostel Warden" title="Hostel Warden Management" description="Manage hostel wardens and caretakers." />,
                hw_att: <StaffAttendance roleFilter="Hostel Warden" />,
                hw_leave: <LeaveManagement roleFilter="Hostel Warden" />,
                hw_payroll: <PayrollManagement roleFilter="Hostel Warden" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="hw_list" />;
        }

        if (activeTab === 'hr') {
            const tabs = [
                { id: 'hr_list', label: 'HR Directory' },
                { id: 'hr_att', label: 'Attendance' },
                { id: 'hr_leave', label: 'Leave Requests' },
                { id: 'hr_payroll', label: 'Salary & Payroll' }
            ];
            const contentMap = { 
                hr_list: <GenericRoleManagement roleName="HR" title="HR Management" description="Manage HR personnel." />,
                hr_att: <StaffAttendance roleFilter="HR" />,
                hr_leave: <LeaveManagement roleFilter="HR" />,
                hr_payroll: <PayrollManagement roleFilter="HR" />
            };
            return <ModuleContainer tabs={tabs} contentMap={contentMap} defaultTab="hr_list" />;
        }

        if (activeTab === 'principal') {
            const tabs = [
                { id: 'sa_prin_det', label: 'Principal Profile' },
                { id: 'sa_prin_att', label: 'Attendance' },
                { id: 'sa_prin_leave', label: 'Leave Requests' },
                { id: 'sa_prin_payroll', label: 'Salary & Payroll' },
                { id: 'sa_prin_comm', label: 'Communications' }
            ];
            const contentMap = {
                'sa_prin_det': <PrincipalDetails />,
                'sa_prin_att': <StaffAttendance roleFilter="Principal" />,
                'sa_prin_leave': <LeaveManagement roleFilter="Principal" />,
                'sa_prin_payroll': <PayrollManagement roleFilter="Principal" />,
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

        return <DashboardOverview setActiveTab={setActiveTab} />;
    };

    const getActiveTitle = () => {
        const item = navItems.find(n => n.id === activeTab);
        return item ? item.label : 'Dashboard Overview';
    };

    if (!currentUser) return null;

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
