import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Users, Book, ChevronRight, Search, X } from 'lucide-react';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [search, setSearch] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await apiFetch('/teacher-portal/my-classes', { headers });
                const data = await res.json();
                if (data.success) setClasses(data.data);
            } catch (e) {
                console.error('Failed to fetch my classes', e);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const openClass = async (cls) => {
        setSelectedClass(cls);
        setStudentsLoading(true);
        try {
            const res = await apiFetch(`/teacher-portal/class-students/${cls.id}`, { headers });
            const data = await res.json();
            if (data.success) setStudents(data.data);
        } catch (e) {
            console.error('Failed to fetch students', e);
        } finally {
            setStudentsLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(s.roll_number).includes(search)
    );

    const attendanceColors = {
        'Present': { bg: '#dcfce7', color: '#166534' },
        'Absent': { bg: '#fee2e2', color: '#dc2626' },
        'Late': { bg: '#fef3c7', color: '#d97706' },
        'Excused': { bg: '#e0f2fe', color: '#0369a1' },
        'Not Marked': { bg: '#f1f5f9', color: '#64748b' },
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p>Loading your classes...</p>
            </div>
        );
    }

    if (selectedClass) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => { setSelectedClass(null); setSearch(''); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ← Back
                        </button>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                                Class {selectedClass.name} {selectedClass.section}
                            </h2>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{selectedClass.subjects_taught}</p>
                        </div>
                    </div>
                    <div style={{ background: '#6366f1', color: 'white', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>
                        {selectedClass.student_count} Students
                    </div>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '360px' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search student by name or roll no..."
                        style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Students Table */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    {studentsLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading students...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                            <Users size={40} color="#e2e8f0" />
                            <p style={{ marginTop: '12px' }}>No students found.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student</th>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Roll No.</th>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((s, i) => {
                                    const att = s.today_attendance || 'Not Marked';
                                    const attStyle = attendanceColors[att] || attendanceColors['Not Marked'];
                                    return (
                                        <tr key={s.id} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                        >
                                            <td style={{ padding: '14px 20px', fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>{i + 1}</td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                                        {s.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{s.name}</p>
                                                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{s.email || 'No email'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: '14px', color: '#334155', fontWeight: 600 }}>{s.roll_number || '—'}</td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: attStyle.bg, color: attStyle.color }}>
                                                    {att}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>My Classes</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>{classes.length} class(es) assigned</p>
            </div>

            {classes.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                    <Book size={40} color="#cbd5e1" />
                    <h3 style={{ color: '#94a3b8', marginTop: '16px' }}>No classes assigned yet</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>Classes will appear here once the timetable is configured by the admin.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => openClass(cls)}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '24px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px' }}>
                                    {cls.name?.[0] || 'C'}
                                </div>
                                <ChevronRight size={18} color="#94a3b8" />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                                    Class {cls.name} <span style={{ color: '#6366f1' }}>{cls.section}</span>
                                </h3>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>{cls.subjects_taught || 'Multiple Subjects'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#6366f1' }}>{cls.student_count || 0}</p>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Students</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
