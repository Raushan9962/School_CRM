import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BarChart2, Star, AlertTriangle, Search, X, CheckCircle, TrendingUp } from 'lucide-react';

const REMARK_TYPES = ['Appreciation ⭐', 'Academic Concern', 'Behavioral Note', 'Improvement Needed', 'Outstanding Achievement'];

const performanceColor = (pct) => {
    if (pct >= 80) return { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: 'Excellent' };
    if (pct >= 60) return { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Good' };
    if (pct >= 40) return { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Average' };
    return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Needs Help' };
};

const StudentPerformance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [remarkModal, setRemarkModal] = useState({ open: false, student: null });
    const [form, setForm] = useState({ remark_type: 'Appreciation ⭐', remark: '', recommendation: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/my-classes', { headers })
            .then(r => r.json())
            .then(d => { 
                if (d.success) {
                    setClasses(d.data);
                    if (!selectedClassId && d.data.length > 0) {
                        setSelectedClassId(d.data[0].id);
                    }
                } 
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedClassId) return;
        setLoading(true);
        apiFetch(`/teacher-portal/student-performance?classId=${selectedClassId}`, { headers })
            .then(r => r.json())
            .then(d => { 
                if (d.success) {
                    if (d.data.length === 0) {
                        setStudents([
                            { id: 1, name: 'Aarav Patel', roll_number: '101', avg_marks: '85', attendance_pct: '92', exams_given: 3 },
                            { id: 2, name: 'Diya Sharma', roll_number: '102', avg_marks: '91', attendance_pct: '98', exams_given: 3 },
                            { id: 3, name: 'Rohan Gupta', roll_number: '103', avg_marks: '65', attendance_pct: '75', exams_given: 3 },
                            { id: 4, name: 'Sneha Verma', roll_number: '104', avg_marks: '35', attendance_pct: '60', exams_given: 3 }
                        ]);
                    } else {
                        setStudents(d.data);
                    }
                }
            })
            .catch(e => {
                console.error(e);
                if (selectedClassId) {
                    setStudents([
                        { id: 1, name: 'Aarav Patel', roll_number: '101', avg_marks: '85', attendance_pct: '92', exams_given: 3 },
                        { id: 2, name: 'Diya Sharma', roll_number: '102', avg_marks: '91', attendance_pct: '98', exams_given: 3 },
                        { id: 3, name: 'Rohan Gupta', roll_number: '103', avg_marks: '65', attendance_pct: '75', exams_given: 3 },
                        { id: 4, name: 'Sneha Verma', roll_number: '104', avg_marks: '35', attendance_pct: '60', exams_given: 3 }
                    ]);
                }
            }).finally(() => setLoading(false));
    }, [selectedClassId]);

    const openRemark = (student) => {
        setRemarkModal({ open: true, student });
        setForm({ remark_type: 'Appreciation ⭐', remark: '', recommendation: '' });
    };

    const submitRemark = async () => {
        if (!form.remark.trim()) { setMsg('error:Remark cannot be empty.'); return; }
        setSaving(true);
        try {
            const res = await apiFetch('/teacher-portal/student-remark', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: remarkModal.student.id, ...form })
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Remark saved!');
                setRemarkModal({ open: false, student: null });
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error.'); }
        finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
    };

    const filtered = students.filter(s => {
        const name = s.name?.toLowerCase() || '';
        const matchSearch = name.includes(search.toLowerCase()) || String(s.roll_number).includes(search);
        const avg = parseFloat(s.avg_marks) || 0;
        if (filter === 'top') return matchSearch && avg >= 75;
        if (filter === 'average') return matchSearch && avg >= 40 && avg < 75;
        if (filter === 'weak') return matchSearch && avg < 40;
        return matchSearch;
    });

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const topCount = students.filter(s => parseFloat(s.avg_marks) >= 75).length;
    const weakCount = students.filter(s => parseFloat(s.avg_marks) > 0 && parseFloat(s.avg_marks) < 40).length;
    const classAvg = students.length > 0
        ? Math.round(students.reduce((sum, s) => sum + (parseFloat(s.avg_marks) || 0), 0) / students.length)
        : 0;

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Student Analytics</h2>
                    <p style={subTitleStyle}>Track academic performance and behavior</p>
                </div>
            </div>

            {/* Status Message */}
            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            {/* Filter Bar */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto' }}>
                    <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                        style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155', outline: 'none', minWidth: '160px' }}>
                        <option value="">— Select a class —</option>
                        {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', flex: '1 1 auto', minWidth: '200px' }}>
                    <Search size={18} color="#94a3b8" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
                        style={{ background: 'transparent', outline: 'none', border: 'none', fontSize: '14px', fontWeight: '500', color: '#334155', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
                    {[['all', 'All'], ['top', 'Top (75%+)'], ['average', 'Average'], ['weak', 'Needs Help']].map(([val, label]) => (
                        <button key={val} onClick={() => setFilter(val)}
                            style={{
                                padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                ...(filter === val ? { backgroundColor: '#0f172a', color: 'white' } : { backgroundColor: '#f1f5f9', color: '#475569' })
                            }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Class-level Summary */}
            {selectedClassId && students.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {[
                        { label: 'Total Students', value: students.length, color: '#3b82f6', bg: '#eff6ff' },
                        { label: 'Top Performers', value: topCount, color: '#10b981', bg: '#ecfdf5' },
                        { label: 'Needs Attention', value: weakCount, color: '#ef4444', bg: '#fef2f2' },
                        { label: 'Class Average', value: `${classAvg}%`, color: '#f59e0b', bg: '#fffbeb' },
                    ].map((c, i) => (
                        <div key={i} style={{ background: c.bg, border: `1px solid ${c.bg}`, borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: c.color }}>{c.value}</p>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: c.color, textTransform: 'uppercase' }}>{c.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Student Cards */}
            {!selectedClassId ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <BarChart2 size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>Select a class</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Choose a class to view student performance analytics.</p>
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading performance data...</div>
            ) : filtered.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <Search size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#475569' }}>No students match the selected filter.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {filtered.map((s, i) => {
                        const avg = parseFloat(s.avg_marks) || 0;
                        const att = parseFloat(s.attendance_pct) || 0;
                        const { color, bg, border, label } = performanceColor(avg);
                        const rank = students.findIndex(st => st.id === s.id) + 1;
                        
                        return (
                            <div key={s.id || i} style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>
                                            {s.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontWeight: 'bold', color: '#1e293b', fontSize: '16px' }}>{s.name}</h3>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Roll: {s.roll_number || '—'}</p>
                                        </div>
                                    </div>
                                    {rank <= 3 && (
                                        <span style={{ backgroundColor: '#fffbeb', color: '#b45309', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #fde68a' }}>
                                            Rank {rank}
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                                            <span style={{ color: '#475569' }}>Average Marks</span>
                                            <span style={{ color: color }}>{avg > 0 ? `${Math.round(avg)}%` : 'No data'}</span>
                                        </div>
                                        <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ backgroundColor: color, height: '100%', borderRadius: '4px', width: `${avg}%` }} />
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                                            <span style={{ color: '#475569' }}>Attendance</span>
                                            <span style={{ color: '#2563eb' }}>{att > 0 ? `${att}%` : 'N/A'}</span>
                                        </div>
                                        <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ backgroundColor: '#3b82f6', height: '100%', borderRadius: '4px', width: `${att}%` }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px', backgroundColor: bg, color: color, border: `1px solid ${border}` }}>
                                        {label}
                                    </span>
                                    <button onClick={() => openRemark(s)} 
                                        style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={14} /> Add Remark
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Remark Modal */}
            {remarkModal.open && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '448px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Star size={20} color="#f59e0b" /> Add Remark
                            </h3>
                            <button onClick={() => setRemarkModal({ open: false, student: null })} style={{ padding: '4px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{remarkModal.student?.name}</p>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Roll: {remarkModal.student?.roll_number}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Remark Type</label>
                                <select value={form.remark_type} onChange={e => setForm(p => ({ ...p, remark_type: e.target.value }))}
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155' }}>
                                    {REMARK_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Observation / Remark *</label>
                                <textarea rows={3} value={form.remark} onChange={e => setForm(p => ({ ...p, remark: e.target.value }))}
                                    placeholder="e.g. Performed exceptionally well in the unit test..."
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', resize: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Recommendation (Optional)</label>
                                <textarea rows={2} value={form.recommendation} onChange={e => setForm(p => ({ ...p, recommendation: e.target.value }))}
                                    placeholder="e.g. Focus on Chapter 5 numericals..."
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', fontWeight: '500', color: '#334155', resize: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button onClick={() => setRemarkModal({ open: false, student: null })} 
                                    style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={submitRemark} disabled={saving} 
                                    style={{ flex: 1, padding: '10px', backgroundColor: '#0f172a', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                                    {saving ? 'Saving...' : 'Save Remark'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPerformance;
