import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, Plus, CheckCircle, X, AlertTriangle, TrendingUp } from 'lucide-react';

const SyllabusTracking = () => {
    const [progress, setProgress] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ class_id: '', subject_id: '', chapter_name: '', topic_name: '', notes: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [progRes, clsRes] = await Promise.all([
                apiFetch('/teacher-portal/syllabus', { headers }).then(r => r.json()),
                apiFetch('/teacher-portal/my-classes', { headers }).then(r => r.json())
            ]);
            if (progRes.success) setProgress(progRes.data);
            if (clsRes.success) setClasses(clsRes.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const toggleComplete = async (item) => {
        try {
            await apiFetch('/teacher-portal/syllabus', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject_id: item.subject_id, class_id: item.class_id,
                    chapter_name: item.chapter_name, topic_name: item.topic_name,
                    is_completed: !item.is_completed, notes: item.notes
                })
            });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const addTopic = async () => {
        if (!form.class_id || !form.chapter_name || !form.topic_name) {
            setMsg('error:Class, Chapter, and Topic are required.');
            return;
        }
        setSubmitting(true);
        try {
            const cls = classes.find(c => String(c.id) === String(form.class_id));
            const res = await apiFetch('/teacher-portal/syllabus', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, is_completed: false })
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Topic added!');
                setIsModalOpen(false);
                setForm({ class_id: '', subject_id: '', chapter_name: '', topic_name: '', notes: '' });
                fetchData();
            } else {
                setMsg('error:' + (data.message || 'Failed.'));
            }
        } catch (e) {
            setMsg('error:Network error.');
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg(''), 3000);
        }
    };

    // Group by subject/class
    const grouped = progress.reduce((acc, item) => {
        const key = `${item.subject_name || 'General'} – Class ${item.class_name} ${item.section || ''}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    // Group further by chapter
    const groupByChapter = (items) => items.reduce((acc, item) => {
        const ch = item.chapter_name || 'Uncategorized';
        if (!acc[ch]) acc[ch] = [];
        acc[ch].push(item);
        return acc;
    }, {});

    const totalTopics = progress.length;
    const completedTopics = progress.filter(p => p.is_completed).length;
    const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={22} color="#6366f1" /> Syllabus Progress Tracking
                </h2>
                <button onClick={() => setIsModalOpen(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                    <Plus size={16} /> Add Topic
                </button>
            </div>

            {/* Status */}
            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', background: isError ? '#fee2e2' : '#dcfce7', color: isError ? '#dc2626' : '#166534', fontWeight: 600, fontSize: '14px' }}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* Overall Progress Banner */}
            {totalTopics > 0 && (
                <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '16px', padding: '24px 28px', color: 'white', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', opacity: 0.85, fontWeight: 600 }}>Overall Syllabus Completion</p>
                            <p style={{ margin: 0, fontSize: '36px', fontWeight: 900, lineHeight: 1 }}>{overallPct}%</p>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '14px', opacity: 0.85 }}>
                            <p style={{ margin: '0 0 4px 0' }}>{completedTopics} topics completed</p>
                            <p style={{ margin: 0 }}>{totalTopics - completedTopics} remaining</p>
                        </div>
                    </div>
                    <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '10px', background: 'white', width: `${overallPct}%`, transition: 'width 0.6s ease' }} />
                    </div>
                </div>
            )}

            {/* Progress by Subject */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>Loading syllabus...</div>
            ) : Object.keys(grouped).length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                    <BookOpen size={40} color="#e2e8f0" style={{ marginBottom: '12px' }} />
                    <h3 style={{ color: '#94a3b8', margin: '0 0 8px 0' }}>No syllabus topics added yet</h3>
                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px' }}>Click "Add Topic" to start tracking your syllabus progress.</p>
                </div>
            ) : (
                Object.entries(grouped).map(([subjectKey, items]) => {
                    const chapters = groupByChapter(items);
                    const completed = items.filter(i => i.is_completed).length;
                    const pct = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
                    const pctColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
                    return (
                        <div key={subjectKey} style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            {/* Subject Header */}
                            <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{subjectKey}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{completed}/{items.length} topics</span>
                                    <span style={{ fontWeight: 800, fontSize: '15px', color: pctColor }}>{pct}%</span>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div style={{ height: '6px', background: '#f1f5f9' }}>
                                <div style={{ height: '100%', background: pctColor, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                            </div>
                            {/* Chapters */}
                            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {Object.entries(chapters).map(([chapter, topics]) => (
                                    <div key={chapter}>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            📖 {chapter}
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {topics.map((topic, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: topic.is_completed ? '#f0fdf4' : '#f8fafc', border: `1px solid ${topic.is_completed ? '#86efac' : '#f1f5f9'}`, cursor: 'pointer', transition: 'all 0.15s' }}
                                                    onClick={() => toggleComplete(topic)}>
                                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${topic.is_completed ? '#10b981' : '#cbd5e1'}`, background: topic.is_completed ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                                                        {topic.is_completed && <span style={{ color: 'white', fontSize: '12px', fontWeight: 900 }}>✓</span>}
                                                    </div>
                                                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: topic.is_completed ? '#166534' : '#334155', textDecoration: topic.is_completed ? 'line-through' : 'none' }}>
                                                        {topic.topic_name}
                                                    </span>
                                                    {topic.is_completed && topic.completion_date && (
                                                        <span style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: 600 }}>
                                                            Completed {new Date(topic.completion_date).toLocaleDateString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}

            {/* Add Topic Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Add Syllabus Topic</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={16} color="#64748b" />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Class *</label>
                                <select name="class_id" value={form.class_id} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                    <option value="">— Select Class —</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Chapter Name *</label>
                                <input type="text" name="chapter_name" value={form.chapter_name} onChange={handleChange} placeholder="e.g. Chapter 4 – Linear Equations" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Topic Name *</label>
                                <input type="text" name="topic_name" value={form.topic_name} onChange={handleChange} placeholder="e.g. Solving equations in one variable" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Notes (Optional)</label>
                                <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Any notes for this topic..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={addTopic} disabled={submitting} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? 'Adding...' : '+ Add Topic'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyllabusTracking;
