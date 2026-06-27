import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { UserCheck, Save, AlertTriangle, CheckCircle2, Calendar, Users } from 'lucide-react';

const STATUSES = ['Present', 'Absent', 'Late', 'Excused'];

const STATUS_STYLE = {
    'Present':  { bg: '#dcfce7', active: '#166534', text: '#166534', label: 'P', border: '#bbf7d0' },
    'Absent':   { bg: '#fee2e2', active: '#991b1b', text: '#991b1b', label: 'A', border: '#fecaca' },
    'Late':     { bg: '#fef3c7', active: '#92400e', text: '#92400e', label: 'L', border: '#fde68a' },
    'Excused':  { bg: '#e0f2fe', active: '#075985', text: '#075985', label: 'E', border: '#bae6fd' },
};

const AttendanceManagement = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/my-classes', { headers })
            .then(r => r.json())
            .then(d => { if (d.success) setClasses(d.data); })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedClassId) return;
        setStudentsLoading(true);
        setAttendance({});
        apiFetch(`/teacher-portal/class-students/${selectedClassId}`, { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setStudents(d.data);
                    const init = {};
                    d.data.forEach(s => {
                        if (s.today_attendance && s.today_attendance !== 'Not Marked') {
                            init[s.id] = s.today_attendance;
                        }
                    });
                    setAttendance(init);
                }
            })
            .catch(console.error)
            .finally(() => setStudentsLoading(false));
    }, [selectedClassId]);

    const markAll = (status) => {
        const all = {};
        students.forEach(s => { all[s.id] = status; });
        setAttendance(all);
    };

    const toggle = (id, status) => {
        setAttendance(prev => ({
            ...prev,
            [id]: prev[id] === status ? null : status
        }));
    };

    const saveAttendance = async () => {
        setSaving(true);
        setSavedMsg('');
        try {
            const records = students.map(s => ({
                student_id: s.id,
                status: attendance[s.id] || 'Not Marked'
            }));
            const res = await apiFetch('/teacher-portal/mark-attendance', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    class_id: selectedClassId,
                    date: selectedDate,
                    records
                })
            });
            const data = await res.json();
            if (data.success) {
                setSavedMsg('Success');
                setTimeout(() => setSavedMsg(''), 3000);
            }
        } catch (e) {
            setSavedMsg('Error');
        } finally {
            setSaving(false);
        }
    };

    const markedCount = Object.values(attendance).filter(v => v).length;
    const presentCount = Object.values(attendance).filter(v => v === 'Present').length;
    const absentCount = Object.values(attendance).filter(v => v === 'Absent').length;
    const lateCount = Object.values(attendance).filter(v => v === 'Late').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>Attendance Management</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Select a class to take daily attendance</p>
                </div>
            </div>

            {/* Controls Bar */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Select Class</label>
                    <select
                        value={selectedClassId}
                        onChange={e => setSelectedClassId(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    >
                        <option value="">-- Choose Class --</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name} {c.section}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                </div>
                
                {selectedClassId && students.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Mark All:</span>
                        {STATUSES.map(s => (
                            <button
                                key={s}
                                onClick={() => markAll(s)}
                                style={{ padding: '4px 10px', background: STATUS_STYLE[s].bg, color: STATUS_STYLE[s].active, border: `1px solid ${STATUS_STYLE[s].border}`, borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {selectedClassId && students.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {[
                        { label: 'Present', value: presentCount, color: '#166534', bg: '#dcfce7', border: '#bbf7d0' },
                        { label: 'Absent', value: absentCount, color: '#991b1b', bg: '#fee2e2', border: '#fecaca' },
                        { label: 'Late', value: lateCount, color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
                        { label: 'Not Marked', value: students.length - markedCount, color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
                    ].map((s, i) => (
                        <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: s.color }}>{s.value}</h3>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontWeight: 'bold', color: s.color, textTransform: 'uppercase' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Area */}
            {!selectedClassId ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <Users size={32} className="text-slate-300 mx-auto mb-2" />
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Select a class above to start marking attendance</p>
                </div>
            ) : studentsLoading ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
                    Loading students...
                </div>
            ) : students.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>No students found in this class.</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserCheck size={16} className="text-blue-600" /> Student List
                        </h3>
                        {savedMsg && (
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: savedMsg === 'Success' ? '#16a34a' : '#dc2626' }}>
                                {savedMsg === 'Success' ? 'Saved Successfully!' : 'Failed to save!'}
                            </span>
                        )}
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', width: '60px' }}>#</th>
                                    <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Student Detail</th>
                                    <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', width: '220px', textAlign: 'right' }}>Status Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, idx) => {
                                    const current = attendance[student.id] || null;
                                    return (
                                        <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50">
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8', fontWeight: 'bold' }}>
                                                {idx + 1}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                                        {student.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{student.name}</p>
                                                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Roll No: {student.roll_number || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                    {STATUSES.map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => toggle(student.id, status)}
                                                            title={status}
                                                            style={{
                                                                width: '32px', height: '32px', border: current === status ? `1px solid ${STATUS_STYLE[status].border}` : '1px solid #cbd5e1', 
                                                                borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                                                                background: current === status ? STATUS_STYLE[status].bg : '#fff',
                                                                color: current === status ? STATUS_STYLE[status].active : '#94a3b8',
                                                                transition: 'all 0.1s'
                                                            }}
                                                        >
                                                            {STATUS_STYLE[status].label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
                        <button
                            onClick={saveAttendance}
                            disabled={saving || students.length === 0}
                            style={{ padding: '8px 20px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Save size={14} /> {saving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceManagement;
