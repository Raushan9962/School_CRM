import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StudentManagementView, TeacherManagementView, ParentManagementView, AccountantManagementView, LibrarianManagementView, TransportManagementView, StudentAttendanceView, StudentFeesHistoryView } from './DetailedViews';

const ROLES = ['Principal', 'Teacher', 'Student', 'Parent', 'Accountant', 'Librarian', 'Transport Manager', 'Receptionist'];

const SchoolAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedSection, setExpandedSection] = useState('people');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', roleName: 'Student',
    employeeId: '', classId: '', admissionNo: '', occupation: '', relation: '', studentId: ''
  });
  const navigate = useNavigate();

  // Retrieve user info
  const currentUserStr = localStorage.getItem('user');
  const currentUser = React.useMemo(() => (currentUserStr ? JSON.parse(currentUserStr) : null), [currentUserStr]);

  useEffect(() => {
    const currentRole = currentUser?.role || currentUser?.roleName;
    
    if (!currentUser || currentRole !== 'School Admin') {
      navigate('/login/student');
      return;
    }

    const fetchSchoolUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/users/school-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (res.ok) {
          setUsers(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        console.error(err);
        setError('Network error: Unable to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolUsers();
  }, [currentUser, navigate]);

  const fetchSchoolUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/school-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ ...formData, name: '', email: '', phone: '', password: '', roleName: 'Student' });
        fetchSchoolUsers(); // refresh list
      } else {
        alert(data.message || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login/student');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex shadow-xl">
        <div className="p-6 text-center border-b border-indigo-800">
          <h2 className="text-xl font-black tracking-widest text-orange-400 drop-shadow-sm leading-tight">
            {currentUser?.schoolName || 'VidyaSetu'}
          </h2>
          <p className="text-indigo-200 text-xs mt-2 font-medium tracking-wide">School Admin Portal</p>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          
          <div className="mt-4">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'students' ? '' : 'students')} 
              className="w-full flex items-center justify-between px-4 py-2 text-indigo-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span className="font-medium">Students</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'students' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {expandedSection === 'students' && (
              <div className="mt-1 space-y-1 pl-2 border-l border-indigo-800/50 ml-6">
                <button onClick={() => setActiveTab('students')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'students' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>All Students</button>
                <button onClick={() => { setActiveTab('students'); setShowAddModal(true); setFormData({...formData, roleName: 'Student'}) }} className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm transition-all">Add New Student</button>
                <button onClick={() => setActiveTab('attendance')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'attendance' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>Attendance</button>
                <button onClick={() => setActiveTab('fees-history')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'fees-history' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>Fees History</button>
              </div>
            )}
          </div>

          <div className="mt-2">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'teachers' ? '' : 'teachers')} 
              className="w-full flex items-center justify-between px-4 py-2 text-indigo-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="font-medium">Teachers</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'teachers' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {expandedSection === 'teachers' && (
              <div className="mt-1 space-y-1 pl-2 border-l border-indigo-800/50 ml-6">
                <button onClick={() => setActiveTab('teachers')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'teachers' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>All Teachers</button>
                <button onClick={() => { setActiveTab('teachers'); setShowAddModal(true); setFormData({...formData, roleName: 'Teacher'}) }} className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm transition-all">Add Teacher</button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-400 opacity-50 cursor-not-allowed text-sm">Class Assignment</button>
              </div>
            )}
          </div>

          <div className="mt-2">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'parents' ? '' : 'parents')} 
              className="w-full flex items-center justify-between px-4 py-2 text-indigo-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="font-medium">Parents</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'parents' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {expandedSection === 'parents' && (
              <div className="mt-1 space-y-1 pl-2 border-l border-indigo-800/50 ml-6">
                <button onClick={() => setActiveTab('parents')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'parents' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>All Parents</button>
                <button onClick={() => { setActiveTab('parents'); setShowAddModal(true); setFormData({...formData, roleName: 'Parent'}) }} className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm transition-all">Add Parent</button>
              </div>
            )}
          </div>

          {/* Phase 2: Finance Section */}
          <div className="mt-2">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'finance' ? '' : 'finance')} 
              className="w-full flex items-center justify-between px-4 py-2 text-indigo-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-medium">Finance</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'finance' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {expandedSection === 'finance' && (
              <div className="mt-1 space-y-1 pl-2 border-l border-indigo-800/50 ml-6">
                <button onClick={() => setActiveTab('accountants')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'accountants' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>All Accountants</button>
                <button onClick={() => { setActiveTab('accountants'); setShowAddModal(true); setFormData({...formData, roleName: 'Accountant'}) }} className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm transition-all">Add Accountant</button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-400 opacity-50 cursor-not-allowed text-sm">Fee Collection</button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-400 opacity-50 cursor-not-allowed text-sm">Expenses</button>
              </div>
            )}
          </div>

          {/* Phase 2: Library Section */}
          <div className="mt-2">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'library' ? '' : 'library')} 
              className="w-full flex items-center justify-between px-4 py-2 text-indigo-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <span className="font-medium">Library</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'library' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {expandedSection === 'library' && (
              <div className="mt-1 space-y-1 pl-2 border-l border-indigo-800/50 ml-6">
                <button onClick={() => setActiveTab('librarians')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'librarians' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>All Librarians</button>
                <button onClick={() => { setActiveTab('librarians'); setShowAddModal(true); setFormData({...formData, roleName: 'Librarian'}) }} className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm transition-all">Add Librarian</button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-400 opacity-50 cursor-not-allowed text-sm">Book Inventory</button>
              </div>
            )}
          </div>

          {/* Phase 2: Transport Section */}
          <div className="mt-2">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'transport' ? '' : 'transport')} 
              className="w-full flex items-center justify-between px-4 py-2 text-indigo-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                <span className="font-medium">Transport</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'transport' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {expandedSection === 'transport' && (
              <div className="mt-1 space-y-1 pl-2 border-l border-indigo-800/50 ml-6">
                <button onClick={() => setActiveTab('transport')} className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${activeTab === 'transport' ? 'bg-indigo-800/80 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm'}`}>All Managers</button>
                <button onClick={() => { setActiveTab('transport'); setShowAddModal(true); setFormData({...formData, roleName: 'Transport Manager'}) }} className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-200 hover:bg-indigo-800/50 hover:text-white text-sm transition-all">Add Manager</button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-indigo-400 opacity-50 cursor-not-allowed text-sm">Vehicle Routes</button>
              </div>
            )}
          </div>
          <div className="mt-6 border-t border-indigo-800/50 pt-4">
            <button onClick={() => setShowAddModal(true)} className="w-full flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl text-white font-bold transition-all shadow-lg shadow-indigo-900/20">
              <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Quick Add User
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-indigo-800">
          <div className="bg-indigo-800/50 rounded-xl p-4 mb-4 text-sm">
            <p className="text-indigo-200 text-xs">Logged in as</p>
            <p className="font-bold text-white truncate">{currentUser?.name}</p>
            {currentUser?.schoolName && (
              <p className="text-indigo-300 text-xs mt-1 font-medium truncate bg-indigo-900/50 px-2 py-1 rounded-md border border-indigo-700/50">
                🏫 {currentUser.schoolName}
              </p>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2.5 rounded-xl transition-all font-bold text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? 'General Staff Directory' : activeTab === 'attendance' ? 'Student Attendance' : activeTab === 'fees-history' ? 'Fees History' : `${activeTab} Management`}
            </h1>
            {currentUser?.schoolName && (
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                {currentUser.schoolName}
              </p>
            )}
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New User
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">General Staff Directory</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage all administrative and general users.</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100">
                  Total: {users.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-12 text-center text-gray-500 font-medium flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    Loading users securely...
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    <p className="text-lg font-semibold text-gray-700">No general staff found</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                        <th className="p-4 pl-6">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right pr-6">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <img src={u.image || `https://api.dicebear.com/5.x/initials/svg?seed=${u.name}`} alt="" className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200" />
                              <div>
                                <p className="font-bold text-gray-800">{u.name}</p>
                                <p className="text-xs text-gray-500">ID: #{u.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-gray-100 text-gray-700 border-gray-200">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-medium text-gray-700">{u.email}</p>
                            <p className="text-xs text-gray-500">{u.phone || 'No phone'}</p>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6 text-sm text-gray-500 font-medium">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && <StudentManagementView />}
          {activeTab === 'teachers' && <TeacherManagementView />}
          {activeTab === 'parents' && <ParentManagementView />}
          {activeTab === 'accountants' && <AccountantManagementView />}
          {activeTab === 'librarians' && <LibrarianManagementView />}
          {activeTab === 'transport' && <TransportManagementView />}
          {activeTab === 'attendance' && <StudentAttendanceView />}
          {activeTab === 'fees-history' && <StudentFeesHistoryView />}
        </div>
      </main>

      {/* Create User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-800">Create New {formData.roleName}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">User Role</label>
                  <select 
                    value={formData.roleName} 
                    onChange={e => setFormData({...formData, roleName: e.target.value})}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="+1234567890" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••" />
                </div>

                {/* Conditional Fields based on Role */}
                {formData.roleName === 'Student' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Class ID</label>
                      <input required type="number" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. 1" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Admission Number</label>
                      <input required type="text" value={formData.admissionNo} onChange={e => setFormData({...formData, admissionNo: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="ADM-2023-001" />
                    </div>
                  </>
                )}

                {['Principal', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'Receptionist'].includes(formData.roleName) && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
                    <input type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="EMP-001 (Optional)" />
                  </div>
                )}
                
                {formData.roleName === 'Parent' && (
                  <div className="col-span-2 grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Relation</label>
                      <input type="text" value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Father/Mother" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Student ID (Optional)</label>
                      <input type="number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full border-gray-300 rounded-lg border py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Linked Student ID" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 shadow-sm">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SchoolAdminDashboard;
