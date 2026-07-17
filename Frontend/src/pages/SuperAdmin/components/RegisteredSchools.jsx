import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Settings, Building2, Users, GraduationCap, DollarSign, UserCog, Bus, Eye, X, BookOpen, PhoneCall, Home, Briefcase, Calculator } from 'lucide-react';
import apiFetch from '../../../services/api';

const RegisteredSchools = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolUsers, setSchoolUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  // Subscriptions Modal State
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedSubSchool, setSelectedSubSchool] = useState(null);
  const [subFormData, setSubFormData] = useState({
    subscription_start_date: '',
    subscription_end_date: '',
    subscription_status: 'Active',
    is_active: true
  });
  const [submittingSub, setSubmittingSub] = useState(false);

  const fetchSchools = async () => {
    try {
      const response = await apiFetch('/super-admin/schools');
      const data = await response.json();
      if (data.success) {
        setSchools(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSubSelectChange = (e) => {
    const schoolId = e.target.value;
    const school = schools.find(s => s.school_id === parseInt(schoolId));
    setSelectedSubSchool(school || null);
    if (school) {
      setSubFormData({
        subscription_start_date: school.subscription_start_date ? new Date(school.subscription_start_date).toISOString().split('T')[0] : '',
        subscription_end_date: school.subscription_end_date ? new Date(school.subscription_end_date).toISOString().split('T')[0] : '',
        subscription_status: school.subscription_status || 'Active',
        is_active: school.is_active !== undefined ? school.is_active : true
      });
    }
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubSchool) return;
    setSubmittingSub(true);
    try {
      const res = await apiFetch(`/super-admin/schools/${selectedSubSchool.school_id}/subscription`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subFormData)
      });
      const data = await res.json();
      if(data.success) {
        setShowSubModal(false);
        fetchSchools(); // Refresh the list
      } else {
        alert(data.message || 'Failed to update subscription');
      }
    } catch(err) {
      console.error(err);
      alert('Error updating subscription');
    } finally {
      setSubmittingSub(false);
    }
  };

  const openUsersModal = async (school, role = 'All') => {
    setSelectedSchool(school);
    setSelectedRoleFilter(role);
    setLoadingUsers(true);
    try {
      const res = await apiFetch(`/super-admin/users?school_id=${school.school_id}`);
      const data = await res.json();
      if (data.success) {
        setSchoolUsers(data.data);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-indigo-950 m-0">Registered Schools</h2>
        <p className="text-slate-500 text-sm mt-1">Manage onboarded schools and their subscriptions.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <ActionBtn text="Add New School" icon={<PlusCircle size={16} />} variant="primary" onClick={() => navigate('/register-school')} />
        <ActionBtn text="Manage Subscriptions" icon={<Settings size={16} />} variant="secondary" onClick={() => setShowSubModal(true)} />
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '8px', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
        border: '1px solid #e2e8f0' 
      }}>
        <h3 className="m-0 mb-4 text-sm font-bold text-slate-800">Schools Directory ({schools.length})</h3>
        
        {loading ? (
           <p className="text-slate-500 text-sm text-center py-4">Loading schools data...</p>
        ) : schools.length === 0 ? (
           <p className="text-slate-500 text-sm text-center py-4">No schools registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-3 whitespace-nowrap rounded-tl-lg">School Info</th>
                  <th className="p-3 whitespace-nowrap">Plan</th>
                  <th className="p-3 min-w-[100px] text-center whitespace-nowrap">Students</th>
                  <th className="p-3 min-w-[100px] text-center whitespace-nowrap">Teachers</th>
                  <th className="p-3 min-w-[80px] text-center whitespace-nowrap">Accts</th>
                  <th className="p-3 min-w-[80px] text-center whitespace-nowrap">Libs</th>
                  <th className="p-3 min-w-[90px] text-center whitespace-nowrap">Recept</th>
                  <th className="p-3 min-w-[90px] text-center whitespace-nowrap">Transp</th>
                  <th className="p-3 min-w-[90px] text-center whitespace-nowrap">Warden</th>
                  <th className="p-3 min-w-[80px] text-center whitespace-nowrap">HR</th>
                  <th className="p-3 min-w-[80px] text-center whitespace-nowrap">View All</th>
                  <th className="p-3 whitespace-nowrap rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {schools.map(school => (
                  <tr key={school.school_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{school.school_name}</p>
                          <p className="text-xs text-slate-500">{school.admin_name} ({school.school_phone})</p>
                          <p className="text-xs text-slate-400">{school.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-md">
                        {school.plan_name || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'Student')} title="View Students">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                        <GraduationCap size={15} className="text-slate-400 group-hover:text-indigo-500 mb-1" />
                        <span className="font-semibold text-slate-700 group-hover:text-indigo-700">{school.student_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'Teacher')} title="View Teachers">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                        <Users size={15} className="text-slate-400 group-hover:text-emerald-500 mb-1" />
                        <span className="font-semibold text-slate-700 group-hover:text-emerald-700">{school.teacher_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'Accountant')} title="View Accountants">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                         <Calculator size={15} className="text-slate-400 group-hover:text-amber-500 mb-1" />
                         <span className="font-semibold text-slate-700 group-hover:text-amber-600">{school.accountant_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'Librarian')} title="View Librarians">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                         <BookOpen size={15} className="text-slate-400 group-hover:text-blue-400 mb-1" />
                         <span className="font-semibold text-slate-700 group-hover:text-blue-600">{school.librarian_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'Receptionist')} title="View Receptionists">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                         <PhoneCall size={15} className="text-slate-400 group-hover:text-pink-500 mb-1" />
                         <span className="font-semibold text-slate-700 group-hover:text-pink-600">{school.receptionist_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'Transport Manager')} title="View Transport Managers">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                         <Bus size={15} className="text-slate-400 group-hover:text-sky-500 mb-1" />
                         <span className="font-semibold text-slate-700 group-hover:text-sky-600">{school.transport_manager_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'Hostel Warden')} title="View Hostel Wardens">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                         <Home size={15} className="text-slate-400 group-hover:text-teal-500 mb-1" />
                         <span className="font-semibold text-slate-700 group-hover:text-teal-600">{school.hostel_warden_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => openUsersModal(school, 'HR Manager')} title="View HR Managers">
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                         <Briefcase size={15} className="text-slate-400 group-hover:text-purple-500 mb-1" />
                         <span className="font-semibold text-slate-700 group-hover:text-purple-600">{school.hr_manager_count}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                        <div className="inline-flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 p-1 rounded transition-colors" title="View All Users" onClick={() => openUsersModal(school, 'All')}>
                            <Eye size={16} className="text-indigo-600 mb-1" />
                            <span className="text-xs font-semibold text-indigo-700 block leading-none">View</span>
                        </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${school.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {school.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 m-0">
                {selectedRoleFilter === 'All' ? 'All Users' : `${selectedRoleFilter}s`} of {selectedSchool.school_name}
              </h3>
              <button onClick={() => setSelectedSchool(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-4 overflow-y-auto">
               {loadingUsers ? <p className="text-center text-slate-500 py-4">Loading users...</p> : 
                schoolUsers.length === 0 ? <p className="text-center text-slate-500 py-4">No users found for this school.</p> : (
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="p-2 border-b border-slate-200 font-semibold">Emp/Student ID</th>
                        <th className="p-2 border-b border-slate-200 font-semibold">Name</th>
                        <th className="p-2 border-b border-slate-200 font-semibold">Email</th>
                        <th className="p-2 border-b border-slate-200 font-semibold">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolUsers
                        .filter(u => selectedRoleFilter === 'All' || u.role_name === selectedRoleFilter)
                        .map(u => (
                        <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-2 text-slate-500 font-mono">#{u.id}</td>
                          <td className="p-2 font-medium text-slate-800">{u.name}</td>
                          <td className="p-2 text-slate-600">{u.email}</td>
                          <td className="p-2"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{u.role_name}</span></td>
                        </tr>
                      ))}
                      {schoolUsers.filter(u => selectedRoleFilter === 'All' || u.role_name === selectedRoleFilter).length === 0 && (
                        <tr><td colSpan="4" className="text-center text-slate-500 py-4">No {selectedRoleFilter}s found.</td></tr>
                      )}
                    </tbody>
                  </table>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Subscriptions Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 m-0">Manage Subscriptions</h3>
              <button onClick={() => {setShowSubModal(false); setSelectedSubSchool(null);}} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            
            <div className="p-5">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select School</label>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={handleSubSelectChange}
                  value={selectedSubSchool?.school_id || ''}
                >
                  <option value="">-- Choose a School --</option>
                  {schools.map(s => <option key={s.school_id} value={s.school_id}>{s.school_name}</option>)}
                </select>
              </div>

              {selectedSubSchool && (
                <form onSubmit={handleSubSubmit} className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                      <input type="date" required value={subFormData.subscription_start_date} onChange={e => setSubFormData({...subFormData, subscription_start_date: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                      <input type="date" required value={subFormData.subscription_end_date} onChange={e => setSubFormData({...subFormData, subscription_end_date: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                      <select required value={subFormData.subscription_status} onChange={e => setSubFormData({...subFormData, subscription_status: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Active">Active</option>
                        <option value="Grace Period">Grace Period</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={subFormData.is_active} onChange={e => setSubFormData({...subFormData, is_active: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm font-semibold text-slate-700">Account Active</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowSubModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border-none">Cancel</button>
                    <button type="submit" disabled={submittingSub} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer border-none disabled:opacity-50">
                      {submittingSub ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({ text, icon, variant = 'primary', onClick }) => {
  const base = "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-[13px] transition-all duration-200 border shadow-sm cursor-pointer";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border-slate-300",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600",
  };
  
  return (
    <button 
      onClick={onClick || (() => alert(`${text} functionality coming soon!`))}
      className={`${base} ${variants[variant] || variants.primary} hover:-translate-y-0.5`}
    >
      {icon} {text}
    </button>
  );
};

export default RegisteredSchools;
