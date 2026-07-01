import React, { useState, useEffect } from 'react';
import { Users, Filter, ArrowRight, UserCheck, UserX, Bus } from 'lucide-react';
import apiFetch from '../../../services/api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');
    const [activeStudent, setActiveStudent] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            let url = '/users/school-students';
            const res = await apiFetch(url);
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    let filteredStudents = students.filter(s => 
        s.name?.toLowerCase().includes(search.toLowerCase()) || 
        s.admission_no?.toLowerCase().includes(search.toLowerCase()) ||
        s.parent_phone?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Active') filteredStudents = filteredStudents.filter(s => s.is_active);
    if (activeKpi === 'Inactive') filteredStudents = filteredStudents.filter(s => !s.is_active);
    if (activeKpi === 'Transport') filteredStudents = filteredStudents.filter(s => s.transport_required);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>All Students</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{students.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Active')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Active' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Active' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCheck size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Active</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{students.filter(s => s.is_active).length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Inactive')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Inactive' ? '1px solid #ef4444' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Inactive' ? '0 0 0 1px #ef4444' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef2f2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserX size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Inactive</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{students.filter(s => !s.is_active).length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Transport')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Transport' ? '1px solid #f59e0b' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Transport' ? '0 0 0 1px #f59e0b' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bus size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Transport Users</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{students.filter(s => s.transport_required).length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} className="text-slate-500" /> Student Directory
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search name, phone, adm no..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '12px', width: '200px' }}
                        />
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Student Detail</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Class & Sec</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Parent Contact</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading records...</td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No records found.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.name}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>Adm No: {row.admission_no}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.class_name || 'N/A'} - {row.class_section || row.section || 'A'}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>Roll: {row.roll_number || 'N/A'}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.father_name || row.guardian_name || 'N/A'}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{row.parent_phone}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', background: row.is_active ? '#dcfce7' : '#f1f5f9', color: row.is_active ? '#166534' : '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: row.is_active ? '1px solid #bbf7d0' : '1px solid #cbd5e1', textTransform: 'uppercase' }}>
                                                {row.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <button 
                                                onClick={() => setActiveStudent(row)} 
                                                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} 
                                                className="hover:underline"
                                            >
                                                Profile <ArrowRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Profile Modal */}
            {activeStudent && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10 rounded-t-2xl">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={activeStudent.image || `https://api.dicebear.com/5.x/initials/svg?seed=${activeStudent.name}`} 
                                    alt={activeStudent.name} 
                                    className="w-16 h-16 rounded-full border-2 border-blue-100 shadow-sm"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 m-0">{activeStudent.name}</h2>
                                    <p className="text-sm text-slate-500 m-0 mt-1">Admission No: {activeStudent.admission_no} | Roll No: {activeStudent.roll_number || 'N/A'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveStudent(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50">
                            
                            {/* Academic & Status */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Users size={16} className="text-blue-600"/> Academic Profile</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Class:</span> <span className="font-semibold text-slate-800">{activeStudent.class_name} - {activeStudent.class_section || activeStudent.section || 'A'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Board:</span> <span className="font-semibold text-slate-800">{activeStudent.board || 'Default'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Admission Date:</span> <span className="font-semibold text-slate-800">{activeStudent.admission_date ? new Date(activeStudent.admission_date).toLocaleDateString() : 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Account Status:</span> <span className={`font-bold ${activeStudent.is_active ? 'text-emerald-600' : 'text-red-600'}`}>{activeStudent.is_active ? 'Active' : 'Inactive'}</span></div>
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><UserCheck size={16} className="text-blue-600"/> Personal Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Gender:</span> <span className="font-semibold text-slate-800">{activeStudent.gender || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Date of Birth:</span> <span className="font-semibold text-slate-800">{activeStudent.dob ? new Date(activeStudent.dob).toLocaleDateString() : 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span> <span className="font-semibold text-slate-800">{activeStudent.blood_group || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Religion/Category:</span> <span className="font-semibold text-slate-800">{activeStudent.religion || 'N/A'} / {activeStudent.category || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Aadhaar:</span> <span className="font-semibold text-slate-800">{activeStudent.aadhaar_number || 'N/A'}</span></div>
                                </div>
                            </div>

                            {/* Contact & Parent Info */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><UserCheck size={16} className="text-blue-600"/> Contact & Parent Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="space-y-3">
                                        <div className="flex justify-between"><span className="text-slate-500">Student Phone:</span> <span className="font-semibold text-slate-800">{activeStudent.phone || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Student Email:</span> <span className="font-semibold text-slate-800">{activeStudent.email || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Emergency Contact:</span> <span className="font-semibold text-slate-800">{activeStudent.emergency_contact || 'N/A'}</span></div>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <span className="text-slate-500">Address:</span> 
                                            <span className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100">{activeStudent.address || 'N/A'} {activeStudent.city ? `, ${activeStudent.city}` : ''} {activeStudent.state ? `, ${activeStudent.state}` : ''} {activeStudent.pincode}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between"><span className="text-slate-500">Father's Name:</span> <span className="font-semibold text-slate-800">{activeStudent.father_name || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Mother's Name:</span> <span className="font-semibold text-slate-800">{activeStudent.mother_name || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Parent Phone:</span> <span className="font-semibold text-slate-800">{activeStudent.parent_phone || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Parent Email:</span> <span className="font-semibold text-slate-800">{activeStudent.parent_email || 'N/A'}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Transport / Hostel / Fees */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Bus size={16} className="text-blue-600"/> Additional Services & Finance</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                        <span className="block text-orange-800 font-bold mb-1">Transport</span>
                                        {activeStudent.transport_required ? (
                                            <span className="text-orange-600 font-medium">Route: {activeStudent.transport_route_id || 'N/A'}</span>
                                        ) : (
                                            <span className="text-orange-600/70">Not Opted</span>
                                        )}
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                        <span className="block text-purple-800 font-bold mb-1">Hostel</span>
                                        {activeStudent.hostel_room ? (
                                            <span className="text-purple-600 font-medium">Room: {activeStudent.hostel_room}</span>
                                        ) : (
                                            <span className="text-purple-600/70">Day Scholar</span>
                                        )}
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                        <span className="block text-emerald-800 font-bold mb-1">Total Fees Due</span>
                                        <span className="text-emerald-600 font-bold text-lg">₹{Number(activeStudent.total_fees_due || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
