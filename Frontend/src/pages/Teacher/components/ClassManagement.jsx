import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Users, Book, ChevronRight, Search, ArrowLeft } from 'lucide-react';

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
        'Present': { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
        'Absent': { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
        'Late': { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
        'Excused': { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
        'Not Marked': { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
    };

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const sectionTitleStyle = { fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    if (selectedClass) {
        return (
            <div style={containerStyle} className="animate-fade-in">
                {/* Header */}
                <div style={headerStyle}>
                    <div>
                        <button onClick={() => { setSelectedClass(null); setSearch(''); }} 
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', backgroundColor: 'transparent', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: 0, marginBottom: '12px' }}>
                            <ArrowLeft size={16} /> Back to Classes
                        </button>
                        <h2 style={titleStyle}>Class {selectedClass.name} {selectedClass.section}</h2>
                        <p style={subTitleStyle}>{selectedClass.subjects_taught || 'General Subject'} • {selectedClass.student_count || students.length} Students</p>
                    </div>
                </div>

                {/* Search */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Search size={18} color="#94a3b8" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search student by name or roll no..."
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', fontWeight: '500', color: '#334155', background: 'transparent' }}
                    />
                </div>

                {/* Students Table */}
                {studentsLoading ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: 'bold' }}>Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '8px', padding: '48px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                        <Users size={40} color="#cbd5e1" style={{ margin: '0 auto 16px auto' }} />
                        <h3 style={{ margin: '0 0 4px 0', color: '#334155', fontWeight: 'bold' }}>No students found</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '64px' }}>#</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Student Name</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '128px' }}>Roll No.</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '160px', textAlign: 'right' }}>Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((s, i) => {
                                    const att = s.today_attendance || 'Not Marked';
                                    const attStyle = attendanceColors[att] || attendanceColors['Not Marked'];
                                    return (
                                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>{i + 1}</td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                                                        {s.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{s.name}</p>
                                                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>{s.email || 'No email'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>{s.roll_number || '—'}</td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', border: `1px solid ${attStyle.border}`, backgroundColor: attStyle.bg, color: attStyle.color }}>
                                                    {att}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>My Classes</h2>
                    <p style={subTitleStyle}>Manage students and view attendance for your assigned classes</p>
                </div>
            </div>

            {/* Summary Cards for Classes */}
            {classes.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <Book size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No classes assigned</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Classes will appear here once configured by the admin.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {classes.map((cls) => (
                        <div key={cls.id} onClick={() => openClass(cls)}
                             style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                             className="hover:border-slate-300 hover:shadow-md transition-all">
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Book size={24} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Students</p>
                                    <p style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>{cls.student_count || 0}</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>Class {cls.name} {cls.section}</h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>{cls.subjects_taught || 'General Subjects'}</p>
                                </div>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
