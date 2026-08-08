import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Calendar, Plus, X, CheckCircle, AlertTriangle, Clock, CalendarDays } from 'lucide-react';

const STATUS_COLOR = {
    'Approved': { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    'Pending': { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    'Rejected': { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Other'];

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    
    const [form, setForm] = useState({
        leave_type: 'Sick Leave',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/teacher-portal/leaves', { headers });
            const data = await res.json();
            if (data.success) {
                if (data.data.length === 0) {
                    setLeaves([
                        { id: 1, leave_type: 'Casual Leave', start_date: '2026-08-25', end_date: '2026-08-26', total_days: 2, status: 'Pending', reason: 'Personal work', applied_on: new Date().toISOString() },
                        { id: 2, leave_type: 'Sick Leave', start_date: '2026-07-10', end_date: '2026-07-11', total_days: 2, status: 'Approved', reason: 'Fever', applied_on: '2026-07-08T10:00:00Z' },
                    ]);
                } else {
                    setLeaves(data.data);
                }
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submitLeave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiFetch('/teacher-portal/leaves', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Leave application submitted!');
                setIsModalOpen(false);
                setForm({ leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
                fetchLeaves();
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error.'); }
        finally { setSubmitting(false); setTimeout(() => setMsg(''), 3000); }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const balance = { taken: 12, total: 24, remaining: 12 }; // Hardcoded for demo if not provided by backend

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Leave Management</h2>
                    <p style={subTitleStyle}>Apply for leave and view history</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} 
                    style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Plus size={16} /> Apply Leave
                </button>
            </div>

            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            {/* Leave Balance Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Total Leave Balance</p>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>{balance.total}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Days / Year</p>
                </div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#047857', textTransform: 'uppercase' }}>Leaves Taken</p>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#047857' }}>{balance.taken}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#059669' }}>Days used</p>
                </div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8', textTransform: 'uppercase' }}>Remaining Balance</p>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#1d4ed8' }}>{balance.remaining}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#2563eb' }}>Days available</p>
                </div>
            </div>

            {/* History Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading leave history...</div>
            ) : leaves.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <CalendarDays size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No leaves found</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>You haven't applied for any leaves yet.</p>
                </div>
            ) : (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Leave Type & Reason</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Dates</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>Total Days</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Applied On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((l, i) => {
                                const status = STATUS_COLOR[l.status] || STATUS_COLOR['Pending'];
                                return (
                                    <tr key={l.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b', fontSize: '14px' }}>{l.leave_type}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason}</p>
                                        </td>
                                        <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>
                                            {l.start_date ? new Date(l.start_date).toLocaleDateString('en-IN') : '—'} 
                                            <span style={{ color: '#94a3b8', margin: '0 6px' }}>to</span> 
                                            {l.end_date ? new Date(l.end_date).toLocaleDateString('en-IN') : '—'}
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                                            {l.total_days}
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: `1px solid ${status.border}`, backgroundColor: status.bg, color: status.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                {l.status === 'Pending' && <Clock size={12} />}
                                                {l.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                                            {l.applied_on ? new Date(l.applied_on).toLocaleDateString('en-IN') : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Apply Leave Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '100%', maxWidth: '448px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={20} color="#3b82f6" /> Apply for Leave
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: '4px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitLeave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Leave Type *</label>
                                <select required name="leave_type" value={form.leave_type} onChange={handleChange}
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }}>
                                    {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Start Date *</label>
                                    <input required type="date" name="start_date" value={form.start_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>End Date *</label>
                                    <input required type="date" name="end_date" value={form.end_date} onChange={handleChange} min={form.start_date || new Date().toISOString().split('T')[0]}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Reason *</label>
                                <textarea required name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Please provide a valid reason..."
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155', resize: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} 
                                    style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} 
                                    style={{ flex: 2, padding: '10px', backgroundColor: '#0f172a', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                                    {submitting ? 'Submitting...' : 'Submit Leave Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
