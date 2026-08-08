import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, Plus, Search, Calendar, CheckCircle, AlertTriangle, X, AlignLeft } from 'lucide-react';

const TeacherDiary = () => {
    const [entries, setEntries] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const [form, setForm] = useState({ class_id: '', subject: '', date: new Date().toISOString().split('T')[0], topic: '', activities: '', homework: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        Promise.all([
            apiFetch('/teacher-portal/diary', { headers }).then(r => r.json()),
            apiFetch('/teacher-portal/my-classes', { headers }).then(r => r.json())
        ]).then(([diaryData, clsData]) => {
            if (diaryData.success) {
                if (diaryData.data.length === 0) {
                    setEntries([
                        { id: 1, class_name: '10', section: 'A', subject: 'Science', topic: 'Photosynthesis', activities: 'Explained process, drew diagram', homework: 'Read pg 45', date: new Date().toISOString().split('T')[0] },
                        { id: 2, class_name: '9', section: 'B', subject: 'Mathematics', topic: 'Quadratic Equations', activities: 'Solved 5 problems on board', homework: 'Ex 4.1 Q1-5', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] }
                    ]);
                } else {
                    setEntries(diaryData.data);
                }
            }
            if (clsData.success) setClasses(clsData.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const submitEntry = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiFetch('/teacher-portal/diary', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Diary entry saved!');
                setIsModalOpen(false);
                setForm({ class_id: '', subject: '', date: new Date().toISOString().split('T')[0], topic: '', activities: '', homework: '' });
                // Optimistic UI update could go here
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error.'); }
        finally { setSubmitting(false); setTimeout(() => setMsg(''), 3000); }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const filtered = entries.filter(a => a.topic?.toLowerCase().includes(search.toLowerCase()) || a.subject?.toLowerCase().includes(search.toLowerCase()));

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Lesson Diary</h2>
                    <p style={subTitleStyle}>Maintain daily records of topics taught and activities</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} 
                    style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Plus size={16} /> New Entry
                </button>
            </div>

            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            {/* Filter Bar */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, background: '#f8fafc', padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <Search size={16} color="#94a3b8" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entries by topic or subject..."
                        style={{ background: 'transparent', outline: 'none', border: 'none', fontSize: '14px', fontWeight: '500', color: '#334155', width: '100%' }} />
                </div>
            </div>

            {/* Data Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading diary entries...</div>
            ) : filtered.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <AlignLeft size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No diary entries</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Write your first lesson log to keep track of your classes.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filtered.map((a, i) => (
                        <div key={a.id || i} style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{a.topic}</h3>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                                            {a.date ? new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                    <span style={{ padding: '4px 10px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <BookOpen size={14} color="#94a3b8" /> {a.subject}
                                    </span>
                                    <span style={{ padding: '4px 10px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        Class {a.class_name} {a.section}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Activities / Notes</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{a.activities || 'No activities recorded.'}</p>
                                </div>
                                {a.homework && (
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Homework Assigned</h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5', padding: '12px', backgroundColor: '#f8fafc', borderLeft: '3px solid #3b82f6', borderRadius: '4px' }}>{a.homework}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlignLeft size={20} color="#3b82f6" /> New Diary Entry
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: '4px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitEntry} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Class *</label>
                                    <select required name="class_id" value={form.class_id} onChange={handleChange}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }}>
                                        <option value="">— Select Class —</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Subject *</label>
                                    <input required type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Science"
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 2 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Topic Taught *</label>
                                    <input required type="text" name="topic" value={form.topic} onChange={handleChange} placeholder="e.g. Photosynthesis"
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Date *</label>
                                    <input required type="date" name="date" value={form.date} onChange={handleChange} max={new Date().toISOString().split('T')[0]}
                                        style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Class Activities / Notes *</label>
                                <textarea required name="activities" value={form.activities} onChange={handleChange} rows={3} placeholder="What was covered in class..."
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155', resize: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Homework / Assignment (Optional)</label>
                                <textarea name="homework" value={form.homework} onChange={handleChange} rows={2} placeholder="Any homework assigned..."
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155', resize: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} 
                                    style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} 
                                    style={{ flex: 2, padding: '10px', backgroundColor: '#0f172a', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                                    {submitting ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDiary;
