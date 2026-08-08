import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, Plus, Search, FileText, CheckCircle, Clock, AlertTriangle, X, Upload } from 'lucide-react';

const AssignmentManagement = () => {
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const [form, setForm] = useState({ title: '', class_id: '', subject: '', description: '', due_date: '', attachment: null });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        Promise.all([
            apiFetch('/teacher-portal/homeworks', { headers }).then(r => r.json()),
            apiFetch('/teacher-portal/my-classes', { headers }).then(r => r.json())
        ]).then(([hwData, clsData]) => {
            if (hwData.success) {
                if (hwData.data.length === 0) {
                    setAssignments([
                        { id: 1, title: 'Science Project', class_name: '10', section: 'A', subject: 'Science', description: 'Complete the chemistry lab report.', due_date: '2026-08-20', created_at: new Date().toISOString() },
                        { id: 2, title: 'Math Exercises', class_name: '9', section: 'B', subject: 'Mathematics', description: 'Solve chapter 4 exercises.', due_date: '2026-08-10', created_at: new Date(Date.now() - 86400000).toISOString() }
                    ]);
                } else {
                    setAssignments(hwData.data);
                }
            }
            if (clsData.success) setClasses(clsData.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleFileChange = e => setForm(p => ({ ...p, attachment: e.target.files[0] }));

    const submitAssignment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach(k => {
                if (form[k] !== null) formData.append(k, form[k]);
            });
            const res = await apiFetch('/teacher-portal/homeworks', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }, // FormData does not need Content-Type header manually set
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Assignment created successfully!');
                setIsModalOpen(false);
                setForm({ title: '', class_id: '', subject: '', description: '', due_date: '', attachment: null });
                // Optimistic UI update or re-fetch could go here
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error.'); }
        finally { setSubmitting(false); setTimeout(() => setMsg(''), 3000); }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const filtered = assignments.filter(a => {
        const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase()) || a.subject?.toLowerCase().includes(search.toLowerCase());
        const matchesClass = filterClass ? String(a.class_id) === String(filterClass) : true;
        return matchesSearch && matchesClass;
    });

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Assignment Management</h2>
                    <p style={subTitleStyle}>Create and manage student homework and assignments</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} 
                    style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Plus size={16} /> New Assignment
                </button>
            </div>

            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            {/* Filter Bar */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', background: '#f8fafc', padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <Search size={16} color="#94a3b8" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assignments..."
                        style={{ background: 'transparent', outline: 'none', border: 'none', fontSize: '14px', fontWeight: '500', color: '#334155', width: '100%' }} />
                </div>
                <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                    style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155', outline: 'none', minWidth: '160px' }}>
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                </select>
            </div>

            {/* Data Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading assignments...</div>
            ) : filtered.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <FileText size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No assignments found</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Create a new assignment to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                    {filtered.map((a, i) => {
                        const dueDate = new Date(a.due_date);
                        const isPastDue = dueDate < new Date() && a.due_date;
                        
                        return (
                            <div key={a.id || i} style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{a.title}</h3>
                                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: `1px solid ${isPastDue ? '#fecaca' : '#bfdbfe'}`, backgroundColor: isPastDue ? '#fef2f2' : '#eff6ff', color: isPastDue ? '#b91c1c' : '#2563eb', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {isPastDue ? 'Past Due' : 'Active'}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{a.description}</p>
                                    
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                            <BookOpen size={14} color="#94a3b8" /> {a.subject}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                            <FileText size={14} color="#94a3b8" /> Class {a.class_name} {a.section}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '16px 20px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                        <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px', textTransform: 'uppercase', fontSize: '10px' }}>Due Date</span>
                                        <span style={{ fontWeight: 'bold', color: isPastDue ? '#ef4444' : '#1e293b', fontSize: '13px' }}>{a.due_date ? new Date(a.due_date).toLocaleDateString('en-IN') : 'No due date'}</span>
                                    </div>
                                    <button style={{ backgroundColor: 'white', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        View Submissions
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={20} color="#3b82f6" /> Create Assignment
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ padding: '4px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitAssignment} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Assignment Title *</label>
                                <input required type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Science Fair Project"
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }} />
                            </div>

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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Due Date *</label>
                                <input required type="date" name="due_date" value={form.due_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]}
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Description *</label>
                                <textarea required name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Instructions for the students..."
                                    style={{ padding: '10px 12px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#334155', resize: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Attachment (Optional)</label>
                                <div style={{ border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '16px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                    <input type="file" id="file_upload" onChange={handleFileChange} style={{ display: 'none' }} />
                                    <label htmlFor="file_upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#64748b' }}>
                                        <Upload size={24} color="#94a3b8" />
                                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#3b82f6' }}>Click to upload file</span>
                                        {form.attachment && <span style={{ fontSize: '12px', color: '#10b981' }}>{form.attachment.name}</span>}
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} 
                                    style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} 
                                    style={{ flex: 2, padding: '10px', backgroundColor: '#0f172a', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                                    {submitting ? 'Creating...' : 'Create Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentManagement;
