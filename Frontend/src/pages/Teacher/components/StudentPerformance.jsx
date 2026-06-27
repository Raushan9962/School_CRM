import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BarChart2, Star, AlertTriangle, Search, TrendingUp, TrendingDown, Minus, X, CheckCircle } from 'lucide-react';

const REMARK_TYPES = ['Appreciation ⭐', 'Academic Concern', 'Behavioral Note', 'Improvement Needed', 'Outstanding Achievement'];

const performanceColor = (pct) => {
    if (pct >= 80) return { color: '#059669', bg: '#f0fdf4', label: 'Excellent' };
    if (pct >= 60) return { color: '#3b82f6', bg: '#eff6ff', label: 'Good' };
    if (pct >= 40) return { color: '#f59e0b', bg: '#fffbeb', label: 'Average' };
    return { color: '#ef4444', bg: '#fef2f2', label: 'Needs Help' };
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
            .then(d => { if (d.success) setClasses(d.data); })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedClassId) return;
        setLoading(true);
        apiFetch(`/teacher-portal/student-performance?classId=${selectedClassId}`, { headers })
            .then(r => r.json())
            .then(d => { if (d.success) setStudents(d.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
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

    // Summary stats
    const topCount = students.filter(s => parseFloat(s.avg_marks) >= 75).length;
    const weakCount = students.filter(s => parseFloat(s.avg_marks) > 0 && parseFloat(s.avg_marks) < 40).length;
    const classAvg = students.length > 0
        ? Math.round(students.reduce((sum, s) => sum + (parseFloat(s.avg_marks) || 0), 0) / students.length)
        : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart2 size={22} color="#6366f1" /> Student Performance Analytics
                </h2>
            </div>

            {/* Status Message */}
            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', background: isError ? '#fee2e2' : '#dcfce7', color: isError ? '#dc2626' : '#166534', fontWeight: 600, fontSize: '14px' }}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* Class Selector + Filters */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '16px 20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                    style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', minWidth: '220px' }}>
                    <option value="">— Select a class —</option>
                    {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                </select>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
                        style={{ width: '100%', padding: '10px 12px 10px 34px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[['all', 'All'], ['top', 'Top (75%+)'], ['average', 'Average'], ['weak', 'Needs Help']].map(([val, label]) => (
                        <button key={val} onClick={() => setFilter(val)}
                            style={{ padding: '8px 14px', background: filter === val ? '#6366f1' : 'white', color: filter === val ? 'white' : '#64748b', border: filter === val ? 'none' : '1px solid #e2e8f0', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Class-level Summary */}
            {selectedClassId && students.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                        { label: 'Total Students', value: students.length, color: '#6366f1', bg: '#eef2ff', icon: '👨‍🎓' },
                        { label: 'Top Performers', value: topCount, color: '#10b981', bg: '#ecfdf5', icon: '🏆' },
                        { label: 'Needs Attention', value: weakCount, color: '#ef4444', bg: '#fef2f2', icon: '⚠️' },
                        { label: 'Class Average', value: `${classAvg}%`, color: '#f59e0b', bg: '#fffbeb', icon: '📊' },
                    ].map((c, i) => (
                        <div key={i} style={{ background: c.bg, borderRadius: '14px', padding: '16px 18px', textAlign: 'center', border: `1px solid ${c.color}20` }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '22px' }}>{c.icon}</p>
                            <p style={{ margin: '0 0 2px 0', fontSize: '24px', fontWeight: 800, color: c.color }}>{c.value}</p>
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: c.color, opacity: 0.8 }}>{c.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Student Cards */}
            {!selectedClassId ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                    <BarChart2 size={40} color="#e2e8f0" style={{ marginBottom: '12px' }} />
                    <p style={{ color: '#94a3b8', margin: 0 }}>Select a class above to see student performance</p>
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading performance data...</div>
            ) : filtered.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                    <p style={{ color: '#94a3b8', margin: 0 }}>No students match the selected filter.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                    {filtered.map((s, i) => {
                        const avg = parseFloat(s.avg_marks) || 0;
                        const att = parseFloat(s.attendance_pct) || 0;
                        const { color, bg, label } = performanceColor(avg);
                        const rank = students.findIndex(st => st.id === s.id) + 1;
                        return (
                            <div key={s.id || i} style={{ background: 'white', borderRadius: '16px', border: `1px solid ${color}30`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}>
                                {/* Card Header */}
                                <div style={{ padding: '16px 18px', background: bg, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>
                                            {s.name?.[0]?.toUpperCase()}
                                        </div>
                                        {rank <= 3 && (
                                            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', background: rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : '#b45309', color: 'white', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                                                {rank}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 2px 0', fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{s.name}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Roll: {s.roll_number || '—'}</p>
                                    </div>
                                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: color, color: 'white' }}>{label}</span>
                                </div>

                                {/* Stats */}
                                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Average Marks</span>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: color }}>{avg > 0 ? `${Math.round(avg)}%` : 'No data'}</span>
                                        </div>
                                        {avg > 0 && (
                                            <div style={{ height: '6px', borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', borderRadius: '6px', background: color, width: `${avg}%`, transition: 'width 0.5s ease' }} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Attendance</span>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: att >= 75 ? '#10b981' : '#ef4444' }}>{att > 0 ? `${att}%` : 'N/A'}</span>
                                        </div>
                                        {att > 0 && (
                                            <div style={{ height: '6px', borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', borderRadius: '6px', background: att >= 75 ? '#10b981' : '#ef4444', width: `${att}%`, transition: 'width 0.5s ease' }} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', paddingTop: '2px' }}>
                                        <span>Exams Given: <strong style={{ color: '#334155' }}>{s.exams_given || 0}</strong></span>
                                        <span>Rank: <strong style={{ color: '#6366f1' }}>#{rank}</strong></span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ padding: '10px 18px 14px', display: 'flex', gap: '8px' }}>
                                    <button onClick={() => openRemark(s)} style={{ flex: 1, padding: '8px', background: '#eef2ff', color: '#6366f1', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                        <Star size={13} /> Add Remark
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Remark Modal */}
            {remarkModal.open && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Add Remark</h3>
                            <button onClick={() => setRemarkModal({ open: false, student: null })} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={14} color="#64748b" />
                            </button>
                        </div>
                        <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                            <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>{remarkModal.student?.name}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Roll: {remarkModal.student?.roll_number}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Remark Type</label>
                                <select value={form.remark_type} onChange={e => setForm(p => ({ ...p, remark_type: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                    {REMARK_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Observation / Remark *</label>
                                <textarea rows={3} value={form.remark} onChange={e => setForm(p => ({ ...p, remark: e.target.value }))}
                                    placeholder="e.g. Performed exceptionally well in the unit test..."
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Recommendation (Optional)</label>
                                <textarea rows={2} value={form.recommendation} onChange={e => setForm(p => ({ ...p, recommendation: e.target.value }))}
                                    placeholder="e.g. Focus on Chapter 5 numericals..."
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setRemarkModal({ open: false, student: null })} style={{ flex: 1, padding: '11px', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={submitRemark} disabled={saving} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saving...' : '⭐ Save Remark'}
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
