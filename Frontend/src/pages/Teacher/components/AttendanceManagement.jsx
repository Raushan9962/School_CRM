import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Calendar, Users, CheckCircle2, AlertTriangle, UserX, UserCheck, Clock, Search } from 'lucide-react';

const AttendanceManagement = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [search, setSearch] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/my-classes', { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) setClasses(d.data);
            })
            .catch(console.error);
    }, []);

    const fetchStudents = (classId) => {
        if (!classId) return;
        setLoading(true);
        apiFetch(`/teacher-portal/attendance-list?classId=${classId}&date=${date}`, { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    if (d.data.length === 0) {
                        setStudents([
                            { id: 1, name: 'Aarav Patel', roll_number: '101', status: 'Present' },
                            { id: 2, name: 'Diya Sharma', roll_number: '102', status: 'Absent' },
                            { id: 3, name: 'Rohan Gupta', roll_number: '103', status: 'Late' },
                            { id: 4, name: 'Sneha Verma', roll_number: '104', status: null }
                        ]);
                    } else {
                        setStudents(d.data);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (selectedClassId) fetchStudents(selectedClassId);
    }, [selectedClassId, date]);

    const markAttendance = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const markAll = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const submitAttendance = async () => {
        if (!selectedClassId) return;
        setSubmitting(true);
        try {
            const records = students.map(s => ({ student_id: s.id, status: s.status || 'Present' }));
            const res = await apiFetch('/teacher-portal/attendance', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ class_id: selectedClassId, date, records })
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Attendance saved successfully!');
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error.'); }
        finally { setSubmitting(false); setTimeout(() => setMsg(''), 3000); }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const filtered = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || String(s.roll_number).includes(search));

    const stats = {
        present: students.filter(s => s.status === 'Present').length,
        absent: students.filter(s => s.status === 'Absent').length,
        late: students.filter(s => s.status === 'Late').length,
        excused: students.filter(s => s.status === 'Excused').length,
    };
    const total = students.length;
    const pct = total > 0 ? Math.round((stats.present / total) * 100) : 0;

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Attendance Management</h2>
                    <p style={subTitleStyle}>Mark and track daily student attendance</p>
                </div>
                {students.length > 0 && (
                    <button onClick={submitAttendance} disabled={submitting}
                        style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', opacity: submitting ? 0.5 : 1 }}>
                        <CheckCircle2 size={16} /> {submitting ? 'Saving...' : 'Save Attendance'}
                    </button>
                )}
            </div>

            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />} {msgText}
                </div>
            )}

            {/* Filter Bar */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Class</label>
                    <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                        style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155', outline: 'none' }}>
                        <option value="">— Select a class —</option>
                        {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} max={new Date().toISOString().split('T')[0]}
                        style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 2 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Search</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <Search size={16} color="#94a3b8" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Student name or roll no..."
                            style={{ background: 'transparent', outline: 'none', border: 'none', fontSize: '14px', fontWeight: '500', color: '#334155', width: '100%' }} />
                    </div>
                </div>
            </div>

            {/* Summary */}
            {selectedClassId && students.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Present</p><h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{stats.present}</h3></div>
                    </div>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserX size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Absent</p><h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{stats.absent}</h3></div>
                    </div>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Late</p><h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{stats.late}</h3></div>
                    </div>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Attendance %</p><h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{pct}%</h3></div>
                    </div>
                </div>
            )}

            {/* List */}
            {!selectedClassId ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <Users size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>Select a class</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Choose a class to view and mark attendance.</p>
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading students...</div>
            ) : (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '12px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Bulk Actions:</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => markAll('Present')} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'white', border: '1px solid #a7f3d0', color: '#047857', borderRadius: '6px', cursor: 'pointer' }}>Mark All Present</button>
                            <button onClick={() => markAll('Absent')} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'white', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', cursor: 'pointer' }}>Mark All Absent</button>
                        </div>
                    </div>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '64px' }}>#</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Student Name</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '128px' }}>Roll No.</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>{i + 1}</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                                                {s.name?.[0]?.toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{s.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>{s.roll_number || '—'}</td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {['Present', 'Absent', 'Late', 'Excused'].map(stat => {
                                                const isActive = s.status === stat;
                                                let colors = { bg: 'white', border: '#e2e8f0', color: '#64748b' };
                                                if (isActive) {
                                                    if (stat === 'Present') colors = { bg: '#ecfdf5', border: '#10b981', color: '#047857' };
                                                    if (stat === 'Absent') colors = { bg: '#fef2f2', border: '#ef4444', color: '#b91c1c' };
                                                    if (stat === 'Late') colors = { bg: '#fffbeb', border: '#f59e0b', color: '#b45309' };
                                                    if (stat === 'Excused') colors = { bg: '#eff6ff', border: '#3b82f6', color: '#1d4ed8' };
                                                }
                                                return (
                                                    <button key={stat} onClick={() => markAttendance(s.id, stat)}
                                                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.color, cursor: 'pointer', transition: 'all 0.1s' }}>
                                                        {stat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendanceManagement;
