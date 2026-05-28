import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SchoolAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Retrieve user info
  const currentUser = JSON.parse(localStorage.getItem('user')) || null;

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
        
        <div className="flex-1 px-4 py-6 space-y-2">
          <Link to="/SchoolAdminDashboard" className="flex items-center gap-3 bg-indigo-800/80 px-4 py-3 rounded-xl text-white font-semibold transition-all">
            <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </Link>
          <Link to="/register-school" className="flex items-center gap-3 hover:bg-indigo-800/50 px-4 py-3 rounded-xl text-indigo-200 font-medium transition-all">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create New User
          </Link>
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
            <h1 className="text-xl font-bold text-gray-800">School Users Directory</h1>
            {currentUser?.schoolName && (
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {currentUser.schoolName} (ID: #{currentUser.school_id})
              </p>
            )}
          </div>
          <Link to="/register-school" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New User
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Registered Users</h3>
                <p className="text-sm text-gray-500 mt-1">Manage all students, teachers, and staff members.</p>
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
                  <p className="text-lg font-semibold text-gray-700">No users found</p>
                  <p className="text-sm mt-1">Start by adding teachers or students to your school.</p>
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
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${
                            u.role === 'Student' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            u.role === 'Teacher' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
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
        </div>
      </main>
    </div>
  );
};

export default SchoolAdminDashboard;
