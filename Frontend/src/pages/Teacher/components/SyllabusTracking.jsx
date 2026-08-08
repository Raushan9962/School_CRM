import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, CheckCircle, Clock, AlertTriangle, Play, CheckCircle2, ChevronRight, BookOpenCheck } from 'lucide-react';

const STATUS_COLORS = {
    'Completed': { bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0', icon: <CheckCircle2 size={16} /> },
    'In Progress': { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe', icon: <Play size={16} /> },
    'Not Started': { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0', icon: <Clock size={16} /> },
    'Delayed': { bg: '#fef2f2', color: '#ef4444', border: '#fecaca', icon: <AlertTriangle size={16} /> }
};

const SyllabusTracking = () => {
    const [syllabus, setSyllabus] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/syllabus', { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    if (d.data.length === 0) {
                        setSyllabus([
                            { id: 1, class_name: '10', section: 'A', subject_name: 'Science', chapter_name: 'Chemical Reactions and Equations', status: 'Completed', completion_date: '2026-04-15' },
                            { id: 2, class_name: '10', section: 'A', subject_name: 'Science', chapter_name: 'Acids, Bases and Salts', status: 'In Progress', completion_date: null },
                            { id: 3, class_name: '9', section: 'B', subject_name: 'Mathematics', chapter_name: 'Number Systems', status: 'Completed', completion_date: '2026-04-10' },
                            { id: 4, class_name: '9', section: 'B', subject_name: 'Mathematics', chapter_name: 'Polynomials', status: 'Not Started', completion_date: null }
                        ]);
                    } else {
                        setSyllabus(d.data);
                    }
                }
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const grouped = syllabus.reduce((acc, item) => {
        const sub = item.subject_name || 'General';
        const cls = item.class_name;
        const sec = item.section || '';
        const key = `${sub} - Class ${cls} ${sec}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Syllabus Tracking</h2>
                    <p style={subTitleStyle}>Track course coverage across your classes</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading syllabus...</div>
            ) : Object.keys(grouped).length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <BookOpenCheck size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No syllabus assigned</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Your course structure will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {Object.entries(grouped).map(([groupName, items]) => {
                        const total = items.length;
                        const completed = items.filter(i => i.status === 'Completed').length;
                        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                        
                        return (
                            <div key={groupName} style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{groupName}</h3>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>{completed} of {total} chapters completed</p>
                                        </div>
                                    </div>
                                    <div style={{ width: '120px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                                            <span style={{ color: '#475569' }}>Progress</span>
                                            <span style={{ color: '#3b82f6' }}>{pct}%</span>
                                        </div>
                                        <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ backgroundColor: '#3b82f6', height: '100%', width: `${pct}%`, borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {items.map(item => {
                                            const status = STATUS_COLORS[item.status] || STATUS_COLORS['Not Started'];
                                            return (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                                                        {item.chapter_name}
                                                    </td>
                                                    <td style={{ padding: '16px 20px', width: '200px' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', border: `1px solid ${status.border}`, backgroundColor: status.bg, color: status.color }}>
                                                            {status.icon} {item.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '16px 20px', width: '150px', textAlign: 'right', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                                                        {item.completion_date ? new Date(item.completion_date).toLocaleDateString('en-IN') : '—'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SyllabusTracking;
