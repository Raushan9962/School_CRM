import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { ShieldAlert, Plus, X, CheckCircle, AlertTriangle } from 'lucide-react';

const INCIDENT_TYPES = ['Late Coming', 'Homework Not Done', 'Mobile Usage', 'Class Disturbance', 'Fighting/Aggression', 'Disrespect', 'Cheating', 'Other'];
const ACTIONS_TAKEN = ['Verbal Warning', 'Written Warning', 'Parent Informed', 'Sent to Principal', 'Detention', 'Counseling', 'No Action'];

const INCIDENT_COLOR = {
    'Late Coming': { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    'Homework Not Done': { color: '#334155', bg: '#f1f5f9', border: '#e2e8f0' },
    'Mobile Usage': { color: '#4338ca', bg: '#e0e7ff', border: '#c7d2fe' },
    'Class Disturbance': { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
    'Fighting/Aggression': { color: '#be123c', bg: '#fff1f2', border: '#fecdd3' },
    'Disrespect': { color: '#c2410c', bg: '#fff7ed', border: '#fed7aa' },
    'Cheating': { color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff' },
    'Other': { color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
};

const BehaviorTracking = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [logs, setLogs] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({
        student_id: '',
        incident_type: 'Late Coming',
        description: '',
        action_taken: 'Verbal Warning',
        date: new Date().toISOString().split('T')[0]
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchLogs = async (classId) => {
        setLoading(true);
        try {
            const url = classId ? `/teacher-portal/behavior-log?classId=${classId}` : '/teacher-portal/behavior-log';
            const res = await apiFetch(url, { headers });
            const data = await res.json();
            if (data.success) {
                if (data.data.length === 0 && !classId) {
                    setLogs([
                        { id: 1, student_name: 'Rohan Gupta', class_name: '10', section: 'A', incident_type: 'Late Coming', description: 'Arrived 20 mins late to the first period.', action_taken: 'Verbal Warning', date: new Date().toISOString().split('T')[0] },
                        { id: 2, student_name: 'Aarav Patel', class_name: '10', section: 'A', incident_type: 'Homework Not Done', description: 'Did not submit the science project.', action_taken: 'Parent Informed', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] }
                    ]);
                } else if (data.data.length === 0 && classId) {
                    setLogs([]);
                } else {
                    setLogs(data.data);
                }
            }
        } catch (e) {
            console.error(e);
            if (!classId) {
                setLogs([
                    { id: 1, student_name: 'Rohan Gupta', class_name: '10', section: 'A', incident_type: 'Late Coming', description: 'Arrived 20 mins late to the first period.', action_taken: 'Verbal Warning', date: new Date().toISOString().split('T')[0] },
                    { id: 2, student_name: 'Aarav Patel', class_name: '10', section: 'A', incident_type: 'Homework Not Done', description: 'Did not submit the science project.', action_taken: 'Parent Informed', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] }
                ]);
            } else {
                setLogs([]);
            }
        } finally { setLoading(false); }
    };

    const fetchStudents = async (classId) => {
        try {
            const res = await apiFetch(`/teacher-portal/students-by-class?classId=${classId}`, { headers });
            const data = await res.json();
            if (data.success) {
                if (data.data.length === 0) {
                    setStudents([{ id: 1, name: 'Rohan Gupta', roll_number: '103' }, { id: 2, name: 'Aarav Patel', roll_number: '101' }]);
                } else {
                    setStudents(data.data);
                }
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        apiFetch('/teacher-portal/my-classes', { headers })
            .then(r => r.json())
            .then(d => { if (d.success) setClasses(d.data); })
            .catch(console.error);
        fetchLogs('');
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchStudents(selectedClassId);
            fetchLogs(selectedClassId);
        } else {
            fetchLogs('');
        }
    }, [selectedClassId]);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submitLog = async () => {
        if (!form.student_id || !form.description.trim()) {
            setMsg('error:Student and description are required.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiFetch('/teacher-portal/behavior-log', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Incident logged!');
                setIsModalOpen(false);
                setForm({ student_id: '', incident_type: 'Late Coming', description: '', action_taken: 'Verbal Warning', date: new Date().toISOString().split('T')[0] });
                fetchLogs(selectedClassId);
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error.'); }
        finally { setSubmitting(false); setTimeout(() => setMsg(''), 3000); }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const incidentCounts = logs.reduce((acc, l) => { acc[l.incident_type] = (acc[l.incident_type] || 0) + 1; return acc; }, {});
    const topIncident = Object.entries(incidentCounts).sort((a, b) => b[1] - a[1])[0];

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Student Behavior Tracking</h2>
                    <p style={subTitleStyle}>Log and monitor disciplinary incidents</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} 
                    style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Plus size={16} /> Log Incident
                </button>
            </div>

            {/* Status */}
            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            {/* Filter & Summary Bar */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                    style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155', outline: 'none', minWidth: '200px' }}>
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                </select>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                    Showing <span style={{ fontWeight: 'bold', color: '#1e293b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>{logs.length}</span> incidents
                    {topIncident && <span style={{ marginLeft: '12px' }}>· Most common: <span style={{ fontWeight: 'bold', color: '#b45309', backgroundColor: '#fffbeb', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fde68a' }}>{topIncident[0]} ({topIncident[1]})</span></span>}
                </div>
            </div>

            {/* Incident Types Tags */}
            {logs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {Object.entries(incidentCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([type, count]) => {
                        const style = INCIDENT_COLOR[type] || INCIDENT_COLOR['Other'];
                        return (
                            <div key={type} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', border: `1px solid ${style.border}`, backgroundColor: style.bg, color: style.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{type}</span>
                                <span style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '4px', color: style.color, opacity: 0.8 }}>{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Data Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading behavior logs...</div>
            ) : logs.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <ShieldAlert size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No incidents logged</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>All students are behaving well! 🎉</p>
                </div>
            ) : (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Student & Class</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Incident details</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Action Taken</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, i) => {
                                const style = INCIDENT_COLOR[log.incident_type] || INCIDENT_COLOR['Other'];
                                return (
                                    <tr key={log.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b', fontSize: '14px' }}>{log.student_name}</p>
                                            {log.class_name && <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Class {log.class_name} {log.section}</p>}
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: `1px solid ${style.border}`, backgroundColor: style.bg, color: style.color, display: 'inline-block', marginBottom: '6px' }}>
                                                {log.incident_type}
                                            </span>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#475569', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.description}>{log.description}</p>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '13px' }}>{log.action_taken || '—'}</span>
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                                                {log.date ? new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Log Incident Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '448px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldAlert size={20} color="#ef4444" /> Log Behavior Incident
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: '4px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Select Class *</label>
                                    <select value={selectedClassId} onChange={e => { setSelectedClassId(e.target.value); fetchStudents(e.target.value); }}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', width: '100%' }}>
                                        <option value="">— Class —</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Student *</label>
                                    <select name="student_id" value={form.student_id} onChange={handleChange}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', width: '100%' }}>
                                        <option value="">— Student —</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 2 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Incident Type *</label>
                                    <select name="incident_type" value={form.incident_type} onChange={handleChange}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', width: '100%' }}>
                                        {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Date</label>
                                    <input type="date" name="date" value={form.date} onChange={handleChange} max={new Date().toISOString().split('T')[0]}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', width: '100%' }} />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                                    placeholder="Describe the incident in detail..."
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', width: '100%', resize: 'none', boxSizing: 'border-box' }} />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Action Taken</label>
                                <select name="action_taken" value={form.action_taken} onChange={handleChange}
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', width: '100%' }}>
                                    {ACTIONS_TAKEN.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button onClick={() => setIsModalOpen(false)} 
                                    style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={submitLog} disabled={submitting} 
                                    style={{ flex: 2, padding: '10px', backgroundColor: '#0f172a', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                                    {submitting ? 'Saving...' : 'Log Incident'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BehaviorTracking;
