import React, { useState, useEffect } from 'react';
import { Users, Filter, ArrowRight, UserCheck, UserX, Bus } from 'lucide-react';
import apiFetch from '../../../services/api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

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
                                            <button style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} className="hover:underline">
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
        </div>
    );
};

export default StudentList;
