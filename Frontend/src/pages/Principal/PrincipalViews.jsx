import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI Components
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, color = '#4f46e5', bg = '#eef2ff', border = '#c7d2fe' }) => (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color, opacity: 0.75, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    </div>
);

const SubTabBar = ({ tabs, active, onChange }) => (
    <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 5, borderRadius: 12, flexWrap: 'wrap', width: 'fit-content' }}>
        {tabs.map(t => (
            <button key={t.key} onClick={() => onChange(t.key)}
                style={{ padding: '9px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', background: active === t.key ? 'white' : 'transparent', color: active === t.key ? '#4f46e5' : '#6b7280', boxShadow: active === t.key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}>
                {t.label}
            </button>
        ))}
    </div>
);

const Modal = ({ title, subtitle, onClose, children, maxWidth = 560 }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1e1b4b', margin: 0 }}>{title}</h3>
                    {subtitle && <p style={{ fontSize: 12, color: '#6b7280', margin: '3px 0 0' }}>{subtitle}</p>}
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af' }}>×</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        Active: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
        'On Leave': { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
        Inactive: { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' },
        Approved: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
        Pending: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
        Rejected: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
        Promoted: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
    };
    const c = map[status] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    return (
        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.text, border: `1px solid ${c.border}`, whiteSpace: 'nowrap' }}>
            {status}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock Databases
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_TEACHERS = [
    { id: 1, name: 'Sunita Verma', emp_id: 'EMP-001', email: 'sunita@school.in', phone: '9876543210', subject: 'Mathematics', qualification: 'M.Sc Math', experience: 8, class_assigned: 'Class 10-A', joining_date: '2016-07-01', status: 'Active', attendance_pct: 96, gender: 'Female', dob: '1988-04-12', address: '23, Rohini, Delhi' },
    { id: 2, name: 'Ramesh Tiwari', emp_id: 'EMP-002', email: 'ramesh@school.in', phone: '9123456789', subject: 'Science', qualification: 'M.Sc Physics', experience: 12, class_assigned: 'Class 9-B', joining_date: '2012-06-15', status: 'Active', attendance_pct: 91, gender: 'Male', dob: '1982-09-20', address: '45, Dwarka, Delhi' },
    { id: 3, name: 'Kavita Sharma', emp_id: 'EMP-003', email: 'kavita@school.in', phone: '9234567890', subject: 'English', qualification: 'M.A English', experience: 6, class_assigned: 'Class 8-C', joining_date: '2018-04-01', status: 'Active', attendance_pct: 98, gender: 'Female', dob: '1990-12-05', address: '78, Pitampura, Delhi' },
    { id: 4, name: 'Ajay Mehta', emp_id: 'EMP-004', email: 'ajay@school.in', phone: '9345678901', subject: 'Social Studies', qualification: 'M.A History', experience: 5, class_assigned: 'Class 7-A', joining_date: '2019-07-15', status: 'Active', attendance_pct: 88, gender: 'Male', dob: '1992-03-18', address: '12, Janakpuri, Delhi' },
    { id: 5, name: 'Priya Nair', emp_id: 'EMP-005', email: 'priya@school.in', phone: '9456789012', subject: 'Hindi', qualification: 'M.A Hindi', experience: 10, class_assigned: 'Class 10-B', joining_date: '2014-06-01', status: 'On Leave', attendance_pct: 82, gender: 'Female', dob: '1985-07-22', address: '56, Laxmi Nagar, Delhi' },
];

const MOCK_CLASSES = [
    { id: 1, name: 'Class 10-A', subject: 'Mathematics', teacher: 'Sunita Verma', students: 38, room: 'Room 101' },
    { id: 2, name: 'Class 9-B', subject: 'Science', teacher: 'Ramesh Tiwari', students: 42, room: 'Lab 1' },
    { id: 3, name: 'Class 8-C', subject: 'English', teacher: 'Kavita Sharma', students: 36, room: 'Room 205' },
    { id: 4, name: 'Class 7-A', subject: 'Social Studies', teacher: 'Ajay Mehta', students: 40, room: 'Room 302' },
];

const MOCK_STUDENTS = [
    { id: 1, name: 'Aarav Sharma', admission_no: 'ADM-2024-001', class_name: 'Class 10', section: 'A', roll_number: '01', email: 'aarav@school.in', phone: '9876543210', gender: 'Male', dob: '2010-03-15', father_name: 'Rajesh Sharma', mother_name: 'Priya Sharma', parent_phone: '9811223344', present_days: 120, absent_days: 8, attendance_percentage: 93.8, marks_math: 88, marks_science: 92, marks_english: 79, marks_hindi: 85, marks_sst: 78, score: 84 },
    { id: 2, name: 'Priya Gupta', admission_no: 'ADM-2024-002', class_name: 'Class 10', section: 'B', roll_number: '02', email: 'priya@school.in', phone: '9123456789', gender: 'Female', dob: '2010-07-20', father_name: 'Suresh Gupta', mother_name: 'Anita Gupta', parent_phone: '9822334455', present_days: 128, absent_days: 0, attendance_percentage: 100, marks_math: 95, marks_science: 97, marks_english: 91, marks_hindi: 89, marks_sst: 93, score: 94 },
    { id: 3, name: 'Rohan Singh', admission_no: 'ADM-2024-003', class_name: 'Class 9', section: 'A', roll_number: '03', email: 'rohan@school.in', phone: '9234567890', gender: 'Male', dob: '2011-01-10', father_name: 'Vikram Singh', mother_name: 'Sunita Singh', parent_phone: '9833445566', present_days: 100, absent_days: 28, attendance_percentage: 78.1, marks_math: 72, marks_science: 68, marks_english: 75, marks_hindi: 80, marks_sst: 65, score: 71 },
    { id: 4, name: 'Sneha Patel', admission_no: 'ADM-2024-004', class_name: 'Class 8', section: 'C', roll_number: '04', email: 'sneha@school.in', phone: '9345678901', gender: 'Female', dob: '2012-05-25', father_name: 'Manish Patel', mother_name: 'Kavita Patel', parent_phone: '9844556677', present_days: 115, absent_days: 13, attendance_percentage: 89.8, marks_math: 83, marks_science: 87, marks_english: 90, marks_hindi: 76, marks_sst: 82, score: 83 },
    { id: 5, name: 'Arjun Kumar', admission_no: 'ADM-2024-005', class_name: 'Class 7', section: 'A', roll_number: '05', email: 'arjun@school.in', phone: '9456789012', gender: 'Male', dob: '2013-09-12', father_name: 'Deepak Kumar', mother_name: 'Rekha Kumar', parent_phone: '9855667788', present_days: 126, absent_days: 2, attendance_percentage: 98.4, marks_math: 91, marks_science: 89, marks_english: 86, marks_hindi: 92, marks_sst: 88, score: 89 },
];

const MOCK_EXAMS = [
    { id: 1, name: 'Unit Test 1', class_name: 'Class 10-A', date: '2026-06-10', time: '09:00 AM', subject: 'Mathematics', max_marks: 50, hall: 'Hall A' },
    { id: 2, name: 'Unit Test 1', class_name: 'Class 10-A', date: '2026-06-12', time: '09:00 AM', subject: 'Science', max_marks: 50, hall: 'Lab A' },
    { id: 3, name: 'Mid Term', class_name: 'Class 9-B', date: '2026-06-15', time: '10:00 AM', subject: 'Social Studies', max_marks: 100, hall: 'Hall C' },
];

const MOCK_ANNOUNCEMENTS = [
    { id: 1, title: 'Summer Vacation Notice', content: 'School will remain closed for summer vacation from June 1st to July 5th. Classes will resume on July 6th.', target: 'All', category: 'General', date: '2026-05-28' },
    { id: 2, title: 'Staff Meeting on Curriculum', content: 'A mandatory meeting for all teachers will be held on Friday in the conference hall to finalize the curriculum.', target: 'Teachers', category: 'Academic', date: '2026-05-29' },
];

const MOCK_FEEDBACK = [
    { id: 1, teacher: 'Sunita Verma', subject: 'Mathematics', rating: 4.8, responses: 36, punctuality: 5.0, clarity: 4.7, comments: ['Patience is wonderful.', 'Makes geometry easy to understand.'] },
    { id: 2, teacher: 'Ramesh Tiwari', subject: 'Science', rating: 4.5, responses: 40, punctuality: 4.5, clarity: 4.4, comments: ['Very good practical experiments.', 'Could give more written assignments.'] },
    { id: 3, teacher: 'Kavita Sharma', subject: 'English', rating: 4.9, responses: 34, punctuality: 4.9, clarity: 4.8, comments: ['Amazing teaching method.', 'Best English literature sessions.'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. Principal Overview Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const PrincipalOverview = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>🏫 Principal's Dashboard</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Academic & operational overview for today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                <StatCard icon="👩‍🎓" value="1,245" label="Total Students" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
                <StatCard icon="👨‍🏫" value="84" label="Total Teachers" color="#0284c7" bg="#f0f9ff" border="#bae6fd" />
                <StatCard icon="✅" value="96%" label="Student Attendance Today" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                <StatCard icon="🏖️" value="3" label="Teachers On Leave" color="#dc2626" bg="#fef2f2" border="#fecaca" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                {/* Academic Alerts */}
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: '0 0 16px' }}>⚠️ Academic Alerts & Tasks</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { title: 'Approve Teacher Leaves', desc: '3 pending leave requests require your approval.', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                            { title: 'Finalize Timetable', desc: 'Timetable for Class 8-C has conflicts in Period 4.', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
                            { title: 'Upcoming Term Exams', desc: 'Schedules need final review by Friday.', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
                        ].map((a, i) => (
                            <div key={i} style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: a.color, fontSize: 14, fontWeight: 800 }}>{a.title}</h4>
                                    <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>{a.desc}</p>
                                </div>
                                <button style={{ padding: '8px 16px', background: 'white', border: `1px solid ${a.color}`, borderRadius: 8, color: a.color, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Review</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Staff View */}
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: '0 0 16px' }}>📅 Absent Staff Today</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['Priya Nair', 'Ajay Mehta'].map(t => (
                            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: '#f9fafb', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#111827' }}>{t}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Medical Leave</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Timetable Management (Assigning Teachers to Lectures)
// ─────────────────────────────────────────────────────────────────────────────
export const TimetableManagement = () => {
    const [subTab, setSubTab] = useState('periods');
    const [selectedClass, setSelectedClass] = useState('Class 10-A');
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const PERIODS = ['1', '2', '3', '4', 'Break', '5', '6', '7', '8'];

    const [classes, setClasses] = useState(MOCK_CLASSES);
    const [showClassModal, setShowClassModal] = useState(false);
    const [classForm, setClassForm] = useState({ name: '', teacher: '', room: '' });

    const [schedule, setSchedule] = useState({
        'Monday': { '1': { teacher: 'Sunita Verma', subject: 'Math' }, '2': { teacher: 'Ramesh Tiwari', subject: 'Science' } },
        'Tuesday': { '3': { teacher: 'Kavita Sharma', subject: 'English' } }
    });

    const [editingCell, setEditingCell] = useState(null);
    const [editForm, setEditForm] = useState({ teacher: '', subject: '' });

    const openEdit = (day, period) => {
        const existing = schedule[day]?.[period] || { teacher: '', subject: '' };
        setEditForm(existing);
        setEditingCell({ day, period });
    };

    const saveCell = () => {
        if (!editingCell) return;
        setSchedule(prev => ({
            ...prev,
            [editingCell.day]: {
                ...(prev[editingCell.day] || {}),
                [editingCell.period]: { ...editForm }
            }
        }));
        setEditingCell(null);
    };

    const handleSaveClassTeacher = (e) => {
        e.preventDefault();
        setClasses(prev => prev.map(c => c.name === classForm.name ? { ...c, teacher: classForm.teacher, room: classForm.room } : c));
        setShowClassModal(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>🕐 Timetables & Classes</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Manage school lectures and Class Teacher assignments.</p>
            </div>

            <SubTabBar
                tabs={[
                    { key: 'periods', label: '🕐 Lecture Timetable' },
                    { key: 'classteacher', label: '🏫 Class Teacher Assignment' }
                ]}
                active={subTab}
                onChange={setSubTab}
            />

            {subTab === 'periods' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ background: 'white', padding: '10px 16px', borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Select Class:</label>
                            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', fontSize: 14 }}>
                                {classes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#111827' }}>Weekly Schedule: {selectedClass}</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ background: '#1e1b4b', color: 'white', padding: '12px', fontSize: 12, fontWeight: 700, textAlign: 'left' }}>Day ↓ / Period →</th>
                                        {PERIODS.map(p => (
                                            <th key={p} style={{ background: p === 'Break' ? '#4b5563' : '#1e1b4b', color: 'white', padding: '12px', fontSize: 12, fontWeight: 700, textAlign: 'center', minWidth: 100 }}>
                                                {p === 'Break' ? 'LUNCH BREAK' : `Period ${p}`}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {DAYS.map(day => (
                                        <tr key={day} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 800, color: '#4f46e5', fontSize: 13, background: '#f8f9ff', borderRight: '1px solid #e5e7eb' }}>
                                                {day}
                                            </td>
                                            {PERIODS.map(period => {
                                                if (period === 'Break') {
                                                    return <td key={period} style={{ background: '#f9fafb', borderRight: '1px solid #e5e7eb' }} />;
                                                }

                                                const cell = schedule[day]?.[period];
                                                const isEditing = editingCell?.day === day && editingCell?.period === period;

                                                return (
                                                    <td key={period} style={{ padding: '8px', borderRight: '1px solid #f3f4f6', verticalAlign: 'top', position: 'relative' }}>
                                                        {isEditing ? (
                                                            <div style={{ background: 'white', padding: 8, borderRadius: 8, border: '2px solid #6366f1', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                                                <select value={editForm.teacher} onChange={e => {
                                                                    const t = MOCK_TEACHERS.find(x => x.name === e.target.value);
                                                                    setEditForm({ teacher: t?.name || '', subject: t?.subject || '' });
                                                                }} style={{ width: '100%', marginBottom: 6, padding: '4px', fontSize: 11, borderRadius: 4, border: '1px solid #d1d5db' }}>
                                                                    <option value="">- Select Teacher -</option>
                                                                    {MOCK_TEACHERS.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                                                                </select>
                                                                <div style={{ display: 'flex', gap: 4 }}>
                                                                    <button onClick={saveCell} style={{ flex: 1, padding: 4, background: '#059669', color: 'white', border: 'none', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>Save</button>
                                                                    <button onClick={() => setEditingCell(null)} style={{ flex: 1, padding: 4, background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>Cancel</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                onClick={() => openEdit(day, period)}
                                                                style={{ height: 60, padding: '6px', borderRadius: 8, background: cell?.teacher ? '#eef2ff' : '#f9fafb', border: `1px dashed ${cell?.teacher ? '#c7d2fe' : '#d1d5db'}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s' }}
                                                                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                                                                onMouseLeave={e => e.currentTarget.style.borderColor = cell?.teacher ? '#c7d2fe' : '#d1d5db'}
                                                            >
                                                                {cell?.teacher ? (
                                                                    <>
                                                                        <p style={{ margin: 0, fontWeight: 800, fontSize: 11, color: '#4f46e5', textAlign: 'center' }}>{cell.teacher}</p>
                                                                        <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: 10, color: '#6b7280', textAlign: 'center' }}>{cell.subject}</p>
                                                                    </>
                                                                ) : (
                                                                    <span style={{ fontSize: 11, color: '#9ca3af' }}>+ Assign</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {subTab === 'classteacher' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {classes.map(c => (
                        <div key={c.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h4 style={{ fontWeight: 900, fontSize: 16, color: '#1e1b4b', margin: 0 }}>{c.name}</h4>
                            </div>
                            <div style={{ padding: '14px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${c.teacher}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{c.teacher}</p>
                                        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Class Teacher</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 12 }}>
                                    <span style={{ color: '#9ca3af' }}>Room:</span>
                                    <span style={{ fontWeight: 600, color: '#374151' }}>{c.room}</span>
                                </div>
                                <button onClick={() => { setClassForm({ name: c.name, teacher: c.teacher, room: c.room }); setShowClassModal(true); }}
                                    style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #c7d2fe', background: '#eef2ff', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#4f46e5' }}>
                                    ✏️ Assign Teacher & Room
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showClassModal && (
                <Modal title={`🏫 Edit Assignment: ${classForm.name}`} onClose={() => setShowClassModal(false)}>
                    <form onSubmit={handleSaveClassTeacher} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Select Class Teacher *</label>
                            <select value={classForm.teacher} onChange={e => setClassForm(f => ({ ...f, teacher: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} required>
                                <option value="">Select Teacher</option>
                                {MOCK_TEACHERS.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Room Number</label>
                            <input value={classForm.room} onChange={e => setClassForm(f => ({ ...f, room: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} placeholder="e.g. Room 102" />
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <button type="button" onClick={() => setShowClassModal(false)} style={{ flex: 1, padding: 11, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: 11, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Save Assignment</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Teacher Leave Approvals
// ─────────────────────────────────────────────────────────────────────────────
export const LeaveApprovals = () => {
    const MOCK_LEAVES = [
        { id: 1, teacher: 'Sunita Verma', type: 'Casual Leave', from: '2026-06-05', to: '2026-06-07', days: 3, reason: 'Family function', status: 'Pending', applied: '2026-06-01' },
        { id: 3, teacher: 'Priya Nair', type: 'Earned Leave', from: '2026-06-10', to: '2026-06-15', days: 6, reason: 'Vacation', status: 'Pending', applied: '2026-06-02' },
    ];

    const [leaves, setLeaves] = useState(MOCK_LEAVES);

    const handleAction = (id, status) => {
        setLeaves(prev => prev.filter(l => l.id !== id));
        alert(`Leave marked as ${status}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>🏖️ Leave Approvals</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Review and approve staff leave requests.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {leaves.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: 40 }}>🎉</span>
                        <h3 style={{ margin: '10px 0 4px', color: '#111827' }}>All Caught Up!</h3>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: 14 }}>No pending leave requests require your attention.</p>
                    </div>
                ) : (
                    leaves.map(l => (
                        <div key={l.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${l.teacher}`} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 16, color: '#111827' }}>{l.teacher}</h4>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                                        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{l.type}</span>
                                        <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 600 }}>{new Date(l.from).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — {new Date(l.to).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        <span style={{ background: '#f3f4f6', color: '#374151', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{l.days} Days</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}><strong>Reason:</strong> {l.reason}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => handleAction(l.id, 'Rejected')} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>✗ Reject</button>
                                <button onClick={() => handleAction(l.id, 'Approved')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>✓ Approve</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Teacher Directory View (NO SALARY DATA)
// ─────────────────────────────────────────────────────────────────────────────
export const TeacherDirectoryView = () => {
    const [search, setSearch] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const subjects = [...new Set(MOCK_TEACHERS.map(t => t.subject))];
    const filtered = MOCK_TEACHERS.filter(t =>
        (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.emp_id.toLowerCase().includes(search.toLowerCase())) &&
        (!filterSubject || t.subject === filterSubject)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search teachers by name or ID..."
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', minWidth: 240 }} />
                <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
                <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{filtered.length} Teachers found</span>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Teacher', 'Employee ID', 'Subject', 'Class Assigned', 'Experience', 'Attendance', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <td style={{ padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                        <div>
                                            <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{t.name}</p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{t.qualification}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 14px', fontSize: 12, color: '#4f46e5', fontWeight: 700 }}>{t.emp_id}</td>
                                <td style={{ padding: '12px 14px' }}>
                                    <span style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', padding: '3px 9px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{t.subject}</span>
                                </td>
                                <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{t.class_assigned}</td>
                                <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{t.experience} yrs</td>
                                <td style={{ padding: '12px 14px' }}>{t.attendance_pct}%</td>
                                <td style={{ padding: '12px 14px' }}><StatusBadge status={t.status} /></td>
                                <td style={{ padding: '12px 14px' }}>
                                    <button onClick={() => setSelectedTeacher(t)}
                                        style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                        👁 View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedTeacher && (
                <Modal title={`👤 ${selectedTeacher.name}`} subtitle={`${selectedTeacher.emp_id} • Academic Info`} onClose={() => setSelectedTeacher(null)}>
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                ['📧 Email', selectedTeacher.email],
                                ['📱 Phone', selectedTeacher.phone],
                                ['🎓 Qualification', selectedTeacher.qualification],
                                ['🏫 Class Assigned', selectedTeacher.class_assigned],
                                ['📅 Joining Date', selectedTeacher.joining_date],
                                ['🎂 DOB', selectedTeacher.dob],
                                ['📍 Address', selectedTeacher.address],
                                ['📊 Attendance Average', `${selectedTeacher.attendance_pct}%`],
                            ].map(([label, value]) => (
                                <div key={label} style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                                    <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
                                    <p style={{ margin: '3px 0 0', fontWeight: 600, color: '#111827', fontSize: 13 }}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Student Directory View (NO FEES DATA)
// ─────────────────────────────────────────────────────────────────────────────
export const StudentDirectoryView = () => {
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const classes = [...new Set(MOCK_STUDENTS.map(s => s.class_name).filter(Boolean))];
    const filtered = MOCK_STUDENTS.filter(s => {
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admission_no.toLowerCase().includes(search.toLowerCase());
        const matchClass = !filterClass || s.class_name === filterClass;
        return matchSearch && matchClass;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search students by name or Adm. No..."
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', minWidth: 240 }} />
                <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{filtered.length} Students found</span>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Student', 'Admission No', 'Class / Sec', 'Roll No', 'Attendance', 'Contact', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <td style={{ padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                        <div>
                                            <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{s.name}</p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.gender}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 14px', fontSize: 12, color: '#4f46e5', fontWeight: 700 }}>{s.admission_no}</td>
                                <td style={{ padding: '12px 14px', fontWeight: 700 }}>{s.class_name} - {s.section}</td>
                                <td style={{ padding: '12px 14px' }}>{s.roll_number}</td>
                                <td style={{ padding: '12px 14px' }}>{s.attendance_percentage}%</td>
                                <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280' }}>{s.phone}</td>
                                <td style={{ padding: '12px 14px' }}>
                                    <button onClick={() => setSelectedStudent(s)}
                                        style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                        👁 View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedStudent && (
                <Modal title={`👤 Student: ${selectedStudent.name}`} subtitle={`Admission: ${selectedStudent.admission_no}`} onClose={() => setSelectedStudent(null)}>
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                ['📧 Email', selectedStudent.email],
                                ['📱 Parent Phone', selectedStudent.parent_phone],
                                ['👨 Father', selectedStudent.father_name],
                                ['👩 Mother', selectedStudent.mother_name],
                                ['🎂 DOB', selectedStudent.dob],
                                ['📅 Present Days', `${selectedStudent.present_days} Days`],
                                ['❌ Absent Days', `${selectedStudent.absent_days} Days`],
                                ['📊 Attendance Pct', `${selectedStudent.attendance_percentage}%`],
                            ].map(([label, value]) => (
                                <div key={label} style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                                    <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
                                    <p style={{ margin: '3px 0 0', fontWeight: 600, color: '#111827', fontSize: 13 }}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Exams & Results (Academics view)
// ─────────────────────────────────────────────────────────────────────────────
export const ExamsAndResults = () => {
    const [subTab, setSubTab] = useState('schedules');
    const [exams, setExams] = useState(MOCK_EXAMS);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', class_name: 'Class 10-A', date: '', time: '', subject: '', max_marks: 50, hall: '' });

    const handleCreateExam = (e) => {
        e.preventDefault();
        setExams(prev => [...prev, { ...form, id: Date.now() }]);
        setShowModal(false);
        setForm({ name: '', class_name: 'Class 10-A', date: '', time: '', subject: '', max_marks: 50, hall: '' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SubTabBar
                tabs={[
                    { key: 'schedules', label: '📅 Exam Schedules' },
                    { key: 'performance', label: '📈 Student Academic Progress' }
                ]}
                active={subTab}
                onChange={setSubTab}
            />

            {subTab === 'schedules' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowModal(true)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                            ＋ Create Exam Schedule
                        </button>
                    </div>

                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    {['Exam Name', 'Class', 'Subject', 'Date', 'Time', 'Max Marks', 'Hall / Room'].map(h => (
                                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map(e => (
                                    <tr key={e.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#111827' }}>{e.name}</td>
                                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#4f46e5' }}>{e.class_name}</td>
                                        <td style={{ padding: '12px 14px' }}>{e.subject}</td>
                                        <td style={{ padding: '12px 14px' }}>{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td style={{ padding: '12px 14px' }}>{e.time}</td>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{e.max_marks}</td>
                                        <td style={{ padding: '12px 14px' }}>{e.hall}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {subTab === 'performance' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                        <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: 16 }}>🏆 Top Performing Students</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {MOCK_STUDENTS.sort((a, b) => b.score - a.score).map((s, i) => (
                                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontWeight: 900, color: i === 0 ? '#d97706' : '#6b7280', fontSize: 14 }}>#{i + 1}</span>
                                        <span style={{ fontWeight: 700 }}>{s.name}</span>
                                    </div>
                                    <span style={{ color: '#059669', fontWeight: 800 }}>{s.score}% (Avg)</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                        <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: 16 }}>📉 Subjects Requiring Attention</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { subject: 'Hindi', avg: '68%', alert: 'Below average benchmark', color: '#dc2626' },
                                { subject: 'Social Studies', avg: '72%', alert: 'Marginally average', color: '#d97706' }
                            ].map(sub => (
                                <div key={sub.subject} style={{ padding: '12px 14px', background: '#fef2f2', borderRadius: 10, border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 800, color: '#111827' }}>{sub.subject}</h4>
                                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#dc2626' }}>{sub.alert}</p>
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: 16, color: sub.color }}>{sub.avg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <Modal title="📝 Create Exam Schedule" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleCreateExam} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Exam Title</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} placeholder="e.g. Unit Test 2" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Class</label>
                                <select value={form.class_name} onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                                    <option>Class 10-A</option>
                                    <option>Class 9-B</option>
                                    <option>Class 8-C</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Subject</label>
                                <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} placeholder="e.g. Mathematics" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Max Marks</label>
                                <input type="number" value={form.max_marks} onChange={e => setForm(f => ({ ...f, max_marks: Number(e.target.value) }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Date</label>
                                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Time</label>
                                <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} placeholder="e.g. 09:30 AM" required />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Exam Hall / Room</label>
                            <input value={form.hall} onChange={e => setForm(f => ({ ...f, hall: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} placeholder="e.g. Hall A" required />
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: 11, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Save Schedule</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Teacher Performance View
// ─────────────────────────────────────────────────────────────────────────────
export const TeacherPerformanceView = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: 16 }}>📈 Performance Metrics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {MOCK_TEACHERS.map(t => {
                        const score = t.attendance_pct * 0.4 + t.experience * 3 + (MOCK_FEEDBACK.find(f => f.teacher === t.name)?.rating || 4.0) * 10;
                        const scorePercent = Math.min(score, 100).toFixed(0);
                        return (
                            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f9fafb', borderRadius: 12, border: '1px solid #f3f4f6', flexWrap: 'wrap', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                    <div>
                                        <p style={{ fontWeight: 800, margin: 0, fontSize: 14 }}>{t.name}</p>
                                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{t.subject} Teacher</p>
                                    </div>
                                </div>
                                <div style={{ width: 200 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                                        <span style={{ color: '#9ca3af' }}>Overall Performance</span>
                                        <span style={{ fontWeight: 800, color: '#4f46e5' }}>{scorePercent}%</span>
                                    </div>
                                    <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ width: `${scorePercent}%`, height: '100%', background: '#6366f1' }} />
                                    </div>
                                </div>
                                <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: 14 }}>⭐ {MOCK_FEEDBACK.find(f => f.teacher === t.name)?.rating || '4.2'}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: 16 }}>💬 Student Review Extracts</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {MOCK_FEEDBACK.map(f => (
                        <div key={f.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
                            <h4 style={{ margin: '0 0 4px', fontWeight: 800 }}>{f.teacher}</h4>
                            <p style={{ color: '#4f46e5', fontSize: 12, fontWeight: 700, margin: '0 0 12px' }}>{f.subject}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {f.comments.map((c, i) => (
                                    <p key={i} style={{ margin: 0, fontSize: 12, color: '#374151', fontStyle: 'italic', paddingLeft: 10, borderLeft: '2px solid #cbd5e1' }}>
                                        "{c}"
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. Attendance Trends View
// ─────────────────────────────────────────────────────────────────────────────
export const AttendanceTrendsView = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontWeight: 800, fontSize: 15, color: '#111827' }}>📅 Today's Attendance Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                            { label: 'Total Student Attendance', val: '96.2%', color: '#059669' },
                            { label: 'Total Teacher Attendance', val: '94.0%', color: '#4f46e5' },
                            { label: 'Flagged Absentees (Student)', val: '8 Students', color: '#dc2626' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9fafb', borderRadius: 10 }}>
                                <span style={{ fontSize: 13, color: '#6b7280' }}>{item.label}</span>
                                <span style={{ fontWeight: 800, color: item.color }}>{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontWeight: 800, fontSize: 15, color: '#111827' }}>⚠️ Flagged Low Attendance</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {MOCK_STUDENTS.filter(s => s.attendance_percentage < 85).map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fef2f2', borderRadius: 10, border: '1px solid #fecaca' }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{s.name}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>{s.class_name} - {s.section}</p>
                                </div>
                                <span style={{ fontWeight: 800, color: '#dc2626' }}>{s.attendance_percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. Admissions & Promotions
// ─────────────────────────────────────────────────────────────────────────────
export const AdmissionsReportView = () => {
    const [subTab, setSubTab] = useState('admissions');
    const [students, setStudents] = useState(MOCK_STUDENTS);

    const handlePromote = (id) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, class_name: `Class ${parseInt(s.class_name.replace('Class ', '')) + 1}`, status: 'Promoted' } : s));
        alert('Student promoted successfully!');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SubTabBar
                tabs={[
                    { key: 'admissions', label: '📈 Admissions Report' },
                    { key: 'promotions', label: '🎓 Student Promotions' }
                ]}
                active={subTab}
                onChange={setSubTab}
            />

            {subTab === 'admissions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                        <StatCard icon="📝" value="48" label="Total New Registrations" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
                        <StatCard icon="⏳" value="12" label="Pending Verification" color="#d97706" bg="#fffbeb" border="#fde68a" />
                        <StatCard icon="✅" value="32" label="Approved Admissions" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                    </div>

                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 16, margin: '0 0 16px' }}>Registration Breakdown by Class</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                            {[
                                { class: 'Class 11 (Sci)', count: 18, color: '#4f46e5' },
                                { class: 'Class 11 (Com)', count: 14, color: '#0284c7' },
                                { class: 'Class 9', count: 10, color: '#059669' },
                                { class: 'Class 6', count: 6, color: '#7c3aed' }
                            ].map(item => (
                                <div key={item.class} style={{ padding: 14, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: 12, fontWeight: 700 }}>{item.class}</p>
                                    <p style={{ margin: '4px 0 0', fontWeight: 900, fontSize: 22, color: item.color }}>{item.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'promotions' && (
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                        <h3 style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#111827' }}>Promotion Approval Console</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                {['Student', 'Current Class', 'Academic Avg', 'Attendance', 'Status', 'Action'].map(h => (
                                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>{s.name}</td>
                                    <td style={{ padding: '12px 14px' }}>{s.class_name}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#059669' }}>{s.score}%</td>
                                    <td style={{ padding: '12px 14px' }}>{s.attendance_percentage}%</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <StatusBadge status={s.status || 'Active'} />
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        {s.status === 'Promoted' ? (
                                            <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>✓ Done</span>
                                        ) : (
                                            <button onClick={() => handlePromote(s.id)}
                                                style={{ padding: '6px 12px', background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                                Approve Promotion
                                            </button>
                                        )}
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

// ─────────────────────────────────────────────────────────────────────────────
// 10. School Announcements
// ─────────────────────────────────────────────────────────────────────────────
export const SchoolAnnouncementsView = () => {
    const [notices, setNotices] = useState(MOCK_ANNOUNCEMENTS);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', target: 'All', category: 'General' });

    const handleCreateAnnouncement = (e) => {
        e.preventDefault();
        setNotices(prev => [{ ...form, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...prev]);
        setShowModal(false);
        setForm({ title: '', content: '', target: 'All', category: 'General' });
    };

    const handleDelete = (id) => {
        setNotices(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowModal(true)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    📢 Add Announcement
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {notices.map(n => (
                    <div key={n.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{n.category}</span>
                                <span style={{ background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Target: {n.target}</span>
                                <span style={{ color: '#9ca3af', fontSize: 12 }}>{n.date}</span>
                            </div>
                            <h3 style={{ margin: '0 0 8px', fontWeight: 800, fontSize: 16, color: '#1e1b4b' }}>{n.title}</h3>
                            <p style={{ margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.5 }}>{n.content}</p>
                        </div>
                        <button onClick={() => handleDelete(n.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 4 }}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal title="📢 New Announcement" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleCreateAnnouncement} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Notice Title</label>
                            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }} placeholder="e.g. Sports Day Schedule" required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                                    <option>General</option>
                                    <option>Academic</option>
                                    <option>Event</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Target Audience</label>
                                <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                                    <option>All</option>
                                    <option>Teachers</option>
                                    <option>Students</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Notice Details</label>
                            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} style={{ width: '100%', minHeight: 120, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', resize: 'vertical' }} placeholder="Type the announcement message details here..." required />
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: 11, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Publish Notice</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};
