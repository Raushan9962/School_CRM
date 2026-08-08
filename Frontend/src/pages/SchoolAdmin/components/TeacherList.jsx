import React, { useState, useEffect } from 'react';
import { BookOpen, Filter, ArrowRight, UserCheck, UserX, Clock } from 'lucide-react';
import apiFetch from '../../../services/api';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-teachers');
            if (res.ok) {
                const data = await res.json();
                if (data.success) setTeachers(data.data);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    let filteredTeachers = teachers.filter(t => 
        t.name?.toLowerCase().includes(search.toLowerCase()) || 
        t.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
        t.subject?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Active') filteredTeachers = filteredTeachers.filter(t => t.is_active);
    if (activeKpi === 'Inactive') filteredTeachers = filteredTeachers.filter(t => !t.is_active);
    if (activeKpi === 'New') filteredTeachers = filteredTeachers.filter(t => t.created_at && new Date(t.created_at) > new Date(Date.now() - 30*24*60*60*1000));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>All Teachers</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{teachers.length}</h3>
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
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{teachers.filter(t => t.is_active).length}</h3>
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
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{teachers.filter(t => !t.is_active).length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('New')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'New' ? '1px solid #8b5cf6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'New' ? '0 0 0 1px #8b5cf6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#5b21b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>New This Month</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{teachers.filter(t => t.created_at && new Date(t.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={16} className="text-slate-500" /> Teacher Directory
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search name, id, subject..." 
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
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Teacher Detail</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Emp ID & Role</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Contact</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading records...</td>
                                </tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No records found.</td>
                                </tr>
                            ) : (
                                filteredTeachers.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.name}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{row.subject || 'No Subject'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.employee_id}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{row.qualification || 'N/A'}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.phone || 'N/A'}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{row.email || 'N/A'}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', background: row.is_active ? '#dcfce7' : '#f1f5f9', color: row.is_active ? '#166534' : '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: row.is_active ? '1px solid #bbf7d0' : '1px solid #cbd5e1', textTransform: 'uppercase' }}>
                                                {row.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <button onClick={() => setSelectedTeacher(row)} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} className="hover:underline">
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

            {selectedTeacher && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
                    <div className="animate-fade-in" style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                            <h2 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: 'bold' }}>Teacher Profile</h2>
                            <button onClick={() => setSelectedTeacher(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover:text-slate-700">&times;</button>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                            <img src={selectedTeacher.image || `https://api.dicebear.com/5.x/initials/svg?seed=${selectedTeacher.name}`} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #e2e8f0' }} alt="" />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>{selectedTeacher.name}</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{selectedTeacher.employee_id} • {selectedTeacher.subject || 'No Subject'}</p>
                                <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 8px', background: selectedTeacher.is_active ? '#dcfce7' : '#f1f5f9', color: selectedTeacher.is_active ? '#166534' : '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {selectedTeacher.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Email</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{selectedTeacher.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Phone</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{selectedTeacher.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Qualification</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{selectedTeacher.qualification || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Experience</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{selectedTeacher.experience || 'N/A'} {selectedTeacher.experience ? 'Years' : ''}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Joining Date</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{selectedTeacher.joining_date ? new Date(selectedTeacher.joining_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Class Assigned</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{selectedTeacher.class_assigned || 'N/A'}</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setSelectedTeacher(null)} style={{ padding: '8px 16px', background: '#e2e8f0', color: '#475569', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} className="hover:bg-slate-300">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherList;
