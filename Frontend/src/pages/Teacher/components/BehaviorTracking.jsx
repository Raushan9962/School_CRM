import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { ShieldAlert, Plus, X, CheckCircle, AlertTriangle } from 'lucide-react';

const INCIDENT_TYPES = ['Late Coming', 'Homework Not Done', 'Mobile Usage', 'Class Disturbance', 'Fighting/Aggression', 'Disrespect', 'Cheating', 'Other'];
const ACTIONS_TAKEN = ['Verbal Warning', 'Written Warning', 'Parent Informed', 'Sent to Principal', 'Detention', 'Counseling', 'No Action'];

const INCIDENT_COLOR = {
    'Late Coming': { color: '#f59e0b', bg: '#fffbeb' },
    'Homework Not Done': { color: '#6366f1', bg: '#eef2ff' },
    'Mobile Usage': { color: '#8b5cf6', bg: '#f5f3ff' },
    'Class Disturbance': { color: '#ef4444', bg: '#fef2f2' },
    'Fighting/Aggression': { color: '#dc2626', bg: '#fee2e2' },
    'Disrespect': { color: '#f97316', bg: '#fff7ed' },
    'Cheating': { color: '#b45309', bg: '#fef3c7' },
    'Other': { color: '#64748b', bg: '#f8fafc' },
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
            if (data.success) setLogs(data.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const fetchStudents = async (classId) => {
        try {
            const res = await apiFetch(`/teacher-portal/students-by-class?classId=${classId}`, { headers });
            const data = await res.json();
            if (data.success) setStudents(data.data);
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

    // Stats
    const incidentCounts = logs.reduce((acc, l) => { acc[l.incident_type] = (acc[l.incident_type] || 0) + 1; return acc; }, {});
    const topIncident = Object.entries(incidentCounts).sort((a, b) => b[1] - a[1])[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={22} color="#6366f1" /> Student Behavior Tracking
                </h2>
                <button onClick={() => setIsModalOpen(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                    <Plus size={16} /> Log Incident
                </button>
            </div>

            {/* Status */}
            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', background: isError ? '#fee2e2' : '#dcfce7', color: isError ? '#dc2626' : '#166534', fontWeight: 600, fontSize: '14px' }}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* Filter Bar */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '14px 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                    style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }}>
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                </select>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                    Showing <strong style={{ color: '#1e293b' }}>{logs.length}</strong> incidents
                    {topIncident && <> · Most common: <strong style={{ color: INCIDENT_COLOR[topIncident[0]]?.color || '#ef4444' }}>{topIncident[0]} ({topIncident[1]})</strong></>}
                </p>
            </div>

            {/* Incident Types Summary */}
            {logs.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {Object.entries(incidentCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([type, count]) => {
                        const style = INCIDENT_COLOR[type] || INCIDENT_COLOR['Other'];
                        return (
                            <div key={type} style={{ padding: '8px 16px', borderRadius: '20px', background: style.bg, border: `1px solid ${style.color}30`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: style.color }}>{type}</span>
                                <span style={{ background: style.color, color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Log List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading behavior logs...</div>
            ) : logs.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                    <ShieldAlert size={40} color="#e2e8f0" style={{ marginBottom: '12px' }} />
                    <h3 style={{ color: '#94a3b8', margin: '0 0 8px 0' }}>No incidents logged</h3>
                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px' }}>All students are behaving well! 🎉</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {logs.map((log, i) => {
                        const style = INCIDENT_COLOR[log.incident_type] || INCIDENT_COLOR['Other'];
                        return (
                            <div key={log.id || i} style={{ background: 'white', borderRadius: '14px', border: `1px solid ${style.color}20`, padding: '16px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '16px', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: style.bg, color: style.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                    ⚠️
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: style.bg, color: style.color }}>{log.incident_type}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{log.student_name}</span>
                                        {log.class_name && <span style={{ fontSize: '12px', color: '#94a3b8' }}>Class {log.class_name} {log.section}</span>}
                                    </div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#334155' }}>{log.description}</p>
                                    {log.action_taken && <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Action: <strong>{log.action_taken}</strong></p>}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                                        {log.date ? new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Log Incident Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Log Behavior Incident</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={16} color="#64748b" />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Select Class *</label>
                                    <select value={selectedClassId} onChange={e => { setSelectedClassId(e.target.value); fetchStudents(e.target.value); }}
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                        <option value="">— Class —</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Student *</label>
                                    <select name="student_id" value={form.student_id} onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                        <option value="">— Student —</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.name} (Roll: {s.roll_number})</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Incident Type *</label>
                                    <select name="incident_type" value={form.incident_type} onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                        {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Date</label>
                                    <input type="date" name="date" value={form.date} onChange={handleChange} max={new Date().toISOString().split('T')[0]}
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                                    placeholder="Describe the incident in detail..."
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Action Taken</label>
                                <select name="action_taken" value={form.action_taken} onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                    {ACTIONS_TAKEN.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={submitLog} disabled={submitting} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? 'Saving...' : '⚠️ Log Incident'}
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
