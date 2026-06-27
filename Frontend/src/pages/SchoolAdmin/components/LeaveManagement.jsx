import React, { useState, useEffect } from 'react';
import { CalendarDays, Filter, CheckCircle2, XCircle, Clock, FileText, Check, X } from 'lucide-react';
import apiFetch from '../../../services/api';

const LeaveManagement = ({ roleFilter }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/school-admin/leaves');
            const data = await res.json();
            if (data.success) {
                let filtered = data.data;
                if (roleFilter) {
                    if (roleFilter === 'Transport Staff') {
                        filtered = filtered.filter(l => l.role === 'Transport Manager' || l.role === 'Driver' || l.role === 'Transport Staff');
                    } else {
                        filtered = filtered.filter(l => l.role === roleFilter);
                    }
                }
                setLeaves(filtered);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [roleFilter]);

    const updateStatus = async (id, status) => {
        try {
            const res = await apiFetch(`/school-admin/leaves/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
            } else {
                alert(data.message || 'Failed to update leave status');
            }
        } catch (error) {
            console.error('Error updating leave:', error);
        }
    };

    let filteredLeaves = leaves.filter(l => 
        l.applicant_name?.toLowerCase().includes(search.toLowerCase()) || 
        l.applicant_role?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Pending') filteredLeaves = filteredLeaves.filter(l => l.status === 'Pending');
    if (activeKpi === 'Approved') filteredLeaves = filteredLeaves.filter(l => l.status === 'Approved');
    if (activeKpi === 'Rejected') filteredLeaves = filteredLeaves.filter(l => l.status === 'Rejected');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Requests</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{leaves.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Pending')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Pending' ? '1px solid #f59e0b' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Pending' ? '0 0 0 1px #f59e0b' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{leaves.filter(l => l.status === 'Pending').length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Approved')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Approved' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Approved' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Approved</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{leaves.filter(l => l.status === 'Approved').length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Rejected')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Rejected' ? '1px solid #ef4444' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Rejected' ? '0 0 0 1px #ef4444' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef2f2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <XCircle size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Rejected</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{leaves.filter(l => l.status === 'Rejected').length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarDays size={16} className="text-slate-500" /> Leave Requests
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search name, role..." 
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
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Applicant</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Leave Type & Days</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Dates</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading requests...</td>
                                </tr>
                            ) : filteredLeaves.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No leave requests found.</td>
                                </tr>
                            ) : (
                                filteredLeaves.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={row.applicant_image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.applicant_name}`} alt={row.applicant_name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.applicant_name}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>{row.applicant_role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.type}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{row.days} Day(s)</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>{row.start_date}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>to {row.end_date}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ 
                                                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                                                background: row.status === 'Approved' ? '#dcfce7' : (row.status === 'Rejected' ? '#fef2f2' : '#fef3c7'),
                                                color: row.status === 'Approved' ? '#166534' : (row.status === 'Rejected' ? '#991b1b' : '#92400e'),
                                                border: `1px solid ${row.status === 'Approved' ? '#bbf7d0' : (row.status === 'Rejected' ? '#fecaca' : '#fde68a')}`
                                            }}>
                                                {row.status === 'Approved' ? <CheckCircle2 size={12} /> : (row.status === 'Rejected' ? <XCircle size={12} /> : <Clock size={12} />)}
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            {row.status === 'Pending' ? (
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => updateStatus(row.id, 'Approved')} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button onClick={() => updateStatus(row.id, 'Rejected')} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <X size={14} /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Processed</span>
                                            )}
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

export default LeaveManagement;
