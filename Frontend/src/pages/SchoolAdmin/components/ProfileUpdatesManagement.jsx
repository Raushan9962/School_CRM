import React, { useState, useEffect } from 'react';
import { Check, X, Clock, FileText, CheckCircle2, UserCog, Filter } from 'lucide-react';
import apiFetch from '../../../services/api';

const ProfileUpdatesManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/profile-updates/requests');
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const res = await apiFetch(`/profile-updates/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Request ${action}d successfully`);
                fetchRequests();
            } else {
                alert(data.message || `Error processing request`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    let filteredRequests = requests.filter(r => 
        r.name?.toLowerCase().includes(search.toLowerCase()) || 
        r.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Reviewed') {
        filteredRequests = []; // Mock logic since no status for reviewed in basic endpoint
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>Profile Update Requests</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Review and approve student profile modification requests</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Pending</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{requests.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Reviewed')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Reviewed' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Reviewed' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Reviewed Today</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>0</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Time')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Time' ? '1px solid #8b5cf6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Time' ? '0 0 0 1px #8b5cf6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Avg Wait Time</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>2 hrs</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCog size={16} className="text-slate-500" /> Pending Requests
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search requests..." 
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
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Student Info</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Requested Changes</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Submitted</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading requests...</td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No pending requests.</td>
                                </tr>
                            ) : (
                                filteredRequests.map((row, idx) => {
                                    const changes = typeof row.requested_changes === 'string' ? JSON.parse(row.requested_changes || '{}') : row.requested_changes || {};
                                    const keys = Object.keys(changes);
                                    
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                        {row.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.name}</p>
                                                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{row.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                {keys.length > 0 ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                        {keys.map((k, i) => (
                                                            <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>
                                                                {k}: {changes[k]}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No specific changes</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>
                                                    <Clock size={12} color="#94a3b8" /> {new Date(row.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleAction(row.id, 'approve')} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button onClick={() => handleAction(row.id, 'reject')} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <X size={14} /> Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdatesManagement;
