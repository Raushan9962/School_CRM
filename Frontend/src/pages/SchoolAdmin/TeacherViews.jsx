import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_TEACHERS = [
    { id: 1, name: 'Sunita Verma', emp_id: 'EMP-001', email: 'sunita@school.in', phone: '9876543210', subject: 'Mathematics', qualification: 'M.Sc Math', experience: 8, class_assigned: 'Class 10-A', joining_date: '2016-07-01', salary: 45000, status: 'Active', attendance_pct: 96, gender: 'Female', dob: '1988-04-12', address: '23, Rohini, Delhi' },
    { id: 2, name: 'Ramesh Tiwari', emp_id: 'EMP-002', email: 'ramesh@school.in', phone: '9123456789', subject: 'Science', qualification: 'M.Sc Physics', experience: 12, class_assigned: 'Class 9-B', joining_date: '2012-06-15', salary: 52000, status: 'Active', attendance_pct: 91, gender: 'Male', dob: '1982-09-20', address: '45, Dwarka, Delhi' },
    { id: 3, name: 'Kavita Sharma', emp_id: 'EMP-003', email: 'kavita@school.in', phone: '9234567890', subject: 'English', qualification: 'M.A English', experience: 6, class_assigned: 'Class 8-C', joining_date: '2018-04-01', salary: 38000, status: 'Active', attendance_pct: 98, gender: 'Female', dob: '1990-12-05', address: '78, Pitampura, Delhi' },
    { id: 4, name: 'Ajay Mehta', emp_id: 'EMP-004', email: 'ajay@school.in', phone: '9345678901', subject: 'Social Studies', qualification: 'M.A History', experience: 5, class_assigned: 'Class 7-A', joining_date: '2019-07-15', salary: 35000, status: 'Active', attendance_pct: 88, gender: 'Male', dob: '1992-03-18', address: '12, Janakpuri, Delhi' },
    { id: 5, name: 'Priya Nair', emp_id: 'EMP-005', email: 'priya@school.in', phone: '9456789012', subject: 'Hindi', qualification: 'M.A Hindi', experience: 10, class_assigned: 'Class 10-B', joining_date: '2014-06-01', salary: 48000, status: 'On Leave', attendance_pct: 82, gender: 'Female', dob: '1985-07-22', address: '56, Laxmi Nagar, Delhi' },
];

const MOCK_CLASSES = [
    { id: 1, name: 'Class 10-A', subject: 'Mathematics', teacher: 'Sunita Verma', students: 38, room: 'Room 101', timings: 'Mon-Fri 9AM-10AM' },
    { id: 2, name: 'Class 9-B', subject: 'Science', teacher: 'Ramesh Tiwari', students: 42, room: 'Lab 1', timings: 'Mon-Fri 10AM-11AM' },
    { id: 3, name: 'Class 8-C', subject: 'English', teacher: 'Kavita Sharma', students: 36, room: 'Room 205', timings: 'Mon-Fri 11AM-12PM' },
    { id: 4, name: 'Class 7-A', subject: 'Social Studies', teacher: 'Ajay Mehta', students: 40, room: 'Room 302', timings: 'Mon-Wed 1PM-2PM' },
    { id: 5, name: 'Class 10-B', subject: 'Hindi', teacher: 'Priya Nair', students: 35, room: 'Room 103', timings: 'Tue-Thu 2PM-3PM' },
];

const TIMETABLE = {
    'Sunita Verma': [
        { day: 'Mon', periods: [{ time: '9-10', class: 'Cls 10A', sub: 'Math' }, { time: '11-12', class: 'Cls 9A', sub: 'Math' }, { time: '2-3', class: 'Cls 8B', sub: 'Math' }] },
        { day: 'Tue', periods: [{ time: '9-10', class: 'Cls 10A', sub: 'Math' }, { time: '10-11', class: 'Cls 7A', sub: 'Math' }] },
        { day: 'Wed', periods: [{ time: '9-10', class: 'Cls 10A', sub: 'Math' }, { time: '11-12', class: 'Cls 9A', sub: 'Math' }, { time: '1-2', class: 'Cls 6A', sub: 'Math' }] },
        { day: 'Thu', periods: [{ time: '9-10', class: 'Cls 10A', sub: 'Math' }, { time: '10-11', class: 'Cls 8B', sub: 'Math' }] },
        { day: 'Fri', periods: [{ time: '9-10', class: 'Cls 10A', sub: 'Math' }, { time: '11-12', class: 'Cls 7A', sub: 'Math' }, { time: '2-3', class: 'Cls 9A', sub: 'Math' }] },
    ],
};

const SALARY_STRUCTURES = [
    { id: 1, grade: 'Grade A (Senior)', basic: 35000, hra: 14000, da: 5250, ta: 2000, medical: 1500, gross: 57750, pf: 4200, tax: 2500, net: 51050 },
    { id: 2, grade: 'Grade B (Mid-Level)', basic: 28000, hra: 11200, da: 4200, ta: 1500, medical: 1200, gross: 46100, pf: 3360, tax: 1800, net: 40940 },
    { id: 3, grade: 'Grade C (Junior)', basic: 22000, hra: 8800, da: 3300, ta: 1000, medical: 1000, gross: 36100, pf: 2640, tax: 1200, net: 32260 },
];

const SALARY_HISTORY = [
    { id: 1, teacher: 'Sunita Verma', month: 'April 2026', gross: 57750, deductions: 6700, net: 51050, status: 'Paid', paid_on: '2026-05-01', mode: 'Bank Transfer' },
    { id: 2, teacher: 'Ramesh Tiwari', month: 'April 2026', gross: 62400, deductions: 7200, net: 55200, status: 'Paid', paid_on: '2026-05-01', mode: 'Bank Transfer' },
    { id: 3, teacher: 'Kavita Sharma', month: 'April 2026', gross: 46100, deductions: 5160, net: 40940, status: 'Paid', paid_on: '2026-05-01', mode: 'Bank Transfer' },
    { id: 4, teacher: 'Ajay Mehta', month: 'April 2026', gross: 41800, deductions: 4800, net: 37000, status: 'Pending', paid_on: null, mode: 'Bank Transfer' },
    { id: 5, teacher: 'Priya Nair', month: 'April 2026', gross: 57600, deductions: 6500, net: 51100, status: 'Paid', paid_on: '2026-05-01', mode: 'Bank Transfer' },
    { id: 6, teacher: 'Sunita Verma', month: 'March 2026', gross: 57750, deductions: 6700, net: 51050, status: 'Paid', paid_on: '2026-04-01', mode: 'Bank Transfer' },
    { id: 7, teacher: 'Ramesh Tiwari', month: 'March 2026', gross: 62400, deductions: 7200, net: 55200, status: 'Paid', paid_on: '2026-04-01', mode: 'Bank Transfer' },
];

const LEAVE_REQUESTS = [
    { id: 1, teacher: 'Sunita Verma', type: 'Casual Leave', from: '2026-06-05', to: '2026-06-07', days: 3, reason: 'Family function', status: 'Pending', applied: '2026-06-01' },
    { id: 2, teacher: 'Ramesh Tiwari', type: 'Medical Leave', from: '2026-05-20', to: '2026-05-22', days: 3, reason: 'Surgery follow-up', status: 'Approved', applied: '2026-05-18' },
    { id: 3, teacher: 'Priya Nair', type: 'Earned Leave', from: '2026-06-10', to: '2026-06-15', days: 6, reason: 'Vacation', status: 'Pending', applied: '2026-06-02' },
    { id: 4, teacher: 'Kavita Sharma', type: 'Casual Leave', from: '2026-05-28', to: '2026-05-28', days: 1, reason: 'Personal work', status: 'Approved', applied: '2026-05-26' },
    { id: 5, teacher: 'Ajay Mehta', type: 'Medical Leave', from: '2026-05-15', to: '2026-05-17', days: 3, reason: 'Fever', status: 'Rejected', applied: '2026-05-14' },
];

const FEEDBACK = [
    { id: 1, teacher: 'Sunita Verma', subject: 'Mathematics', class: 'Class 10-A', rating: 4.8, responses: 36, teaching: 4.9, clarity: 4.7, punctuality: 5.0, behaviour: 4.8, comments: ['Excellent teacher!', 'Makes maths fun', 'Very patient and helpful'] },
    { id: 2, teacher: 'Ramesh Tiwari', subject: 'Science', class: 'Class 9-B', rating: 4.5, responses: 40, teaching: 4.6, clarity: 4.4, punctuality: 4.5, behaviour: 4.6, comments: ['Good explanations', 'Lab sessions are great', 'Could be more interactive'] },
    { id: 3, teacher: 'Kavita Sharma', subject: 'English', class: 'Class 8-C', rating: 4.9, responses: 34, teaching: 5.0, clarity: 4.8, punctuality: 4.9, behaviour: 5.0, comments: ['Best English teacher!', 'Very encouraging', 'Loves teaching'] },
    { id: 4, teacher: 'Ajay Mehta', subject: 'Social Studies', class: 'Class 7-A', rating: 3.8, responses: 38, teaching: 3.9, clarity: 3.7, punctuality: 3.6, behaviour: 4.0, comments: ['Could improve teaching style', 'Sometimes late to class', 'Needs more engagement'] },
    { id: 5, teacher: 'Priya Nair', subject: 'Hindi', class: 'Class 10-B', rating: 4.6, responses: 33, teaching: 4.7, clarity: 4.5, punctuality: 4.6, behaviour: 4.7, comments: ['Great Hindi teacher', 'Makes grammar easy', 'Very supportive'] },
];

const today = new Date().toISOString().split('T')[0];

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI helpers
// ─────────────────────────────────────────────────────────────────────────────
const SubTabBar = ({ tabs, active, onChange }) => (
    <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 5, borderRadius: 12, flexWrap: 'wrap' }}>
        {tabs.map(t => (
            <button key={t.key} onClick={() => onChange(t.key)}
                style={{ padding: '9px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', background: active === t.key ? 'white' : 'transparent', color: active === t.key ? '#4f46e5' : '#6b7280', boxShadow: active === t.key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}>
                {t.label}
            </button>
        ))}
    </div>
);

const StatCard = ({ icon, value, label, color = '#4f46e5', bg = '#eef2ff', border = '#c7d2fe' }) => (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 16px' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color, opacity: 0.75, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
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
        Paid: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
        Present: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
        Absent: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
        Late: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    };
    const c = map[status] || map.Active;
    return (
        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.text, border: `1px solid ${c.border}`, whiteSpace: 'nowrap' }}>
            {status}
        </span>
    );
};

const StarRating = ({ rating, max = 5 }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <span key={i} style={{ fontSize: 14, color: i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb' }}>★</span>
        ))}
        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. Teacher Management Overview
// ─────────────────────────────────────────────────────────────────────────────
export const TeacherManagementOverview = () => {
    const [teachers] = useState(MOCK_TEACHERS);
    const [search, setSearch] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const subjects = [...new Set(teachers.map(t => t.subject))];
    const filtered = teachers.filter(t =>
        (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.emp_id.toLowerCase().includes(search.toLowerCase())) &&
        (!filterSubject || t.subject === filterSubject)
    );

    const activeCount = teachers.filter(t => t.status === 'Active').length;
    const onLeave = teachers.filter(t => t.status === 'On Leave').length;
    const avgExp = (teachers.reduce((s, t) => s + t.experience, 0) / teachers.length).toFixed(1);
    const avgAtt = (teachers.reduce((s, t) => s + t.attendance_pct, 0) / teachers.length).toFixed(1);

    const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
    const lbl = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>👨‍🏫 Teacher Management</h2>
                    <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Complete directory of all teachers and staff</p>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                <StatCard icon="👨‍🏫" value={teachers.length} label="Total Teachers" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
                <StatCard icon="✅" value={activeCount} label="Active" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                <StatCard icon="🏖️" value={onLeave} label="On Leave" color="#d97706" bg="#fffbeb" border="#fde68a" />
                <StatCard icon="📅" value={`${avgAtt}%`} label="Avg. Attendance" color="#7c3aed" bg="#f5f3ff" border="#ddd6fe" />
                <StatCard icon="⭐" value={`${avgExp}y`} label="Avg. Experience" color="#0284c7" bg="#f0f9ff" border="#bae6fd" />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or Employee ID..."
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', minWidth: 240 }} />
                <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
                <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{filtered.length} teachers</span>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Teacher', 'Employee ID', 'Subject', 'Class Assigned', 'Experience', 'Attendance', 'Salary', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
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
                                <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{t.class_assigned}</td>
                                <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{t.experience} yrs</td>
                                <td style={{ padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 50, height: 5, background: '#e5e7eb', borderRadius: 3 }}>
                                            <div style={{ width: `${t.attendance_pct}%`, height: '100%', background: t.attendance_pct >= 90 ? '#10b981' : t.attendance_pct >= 75 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{t.attendance_pct}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#059669', fontSize: 13 }}>₹{t.salary.toLocaleString()}</td>
                                <td style={{ padding: '12px 14px' }}><StatusBadge status={t.status} /></td>
                                <td style={{ padding: '12px 14px' }}>
                                    <button onClick={() => setSelectedTeacher(t)}
                                        style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                        👁 View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Teacher Detail Modal */}
            {selectedTeacher && (
                <Modal title={`👤 ${selectedTeacher.name}`} subtitle={`${selectedTeacher.emp_id} • ${selectedTeacher.subject}`} onClose={() => setSelectedTeacher(null)} maxWidth={620}>
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', borderRadius: 14 }}>
                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${selectedTeacher.name}`} alt="" style={{ width: 70, height: 70, borderRadius: '50%', border: '3px solid white', boxShadow: '0 2px 12px rgba(99,102,241,0.2)' }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 900, fontSize: 20, color: '#1e1b4b', margin: 0 }}>{selectedTeacher.name}</h3>
                                <p style={{ color: '#4f46e5', fontWeight: 700, margin: '4px 0 0', fontSize: 14 }}>{selectedTeacher.subject} Teacher</p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                    <StatusBadge status={selectedTeacher.status} />
                                    <span style={{ fontSize: 11, background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '3px 9px', borderRadius: 20, fontWeight: 700 }}>{selectedTeacher.emp_id}</span>
                                    <span style={{ fontSize: 11, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: 20, fontWeight: 700 }}>{selectedTeacher.experience} yrs exp</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: 900, color: '#059669', fontSize: 20, margin: 0 }}>₹{selectedTeacher.salary.toLocaleString()}</p>
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Monthly Salary</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                ['📧 Email', selectedTeacher.email],
                                ['📱 Phone', selectedTeacher.phone],
                                ['🎓 Qualification', selectedTeacher.qualification],
                                ['🏫 Class Assigned', selectedTeacher.class_assigned],
                                ['📅 Joining Date', new Date(selectedTeacher.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
                                ['🎂 Date of Birth', new Date(selectedTeacher.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
                                ['📍 Address', selectedTeacher.address],
                                ['📊 Attendance', `${selectedTeacher.attendance_pct}%`],
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
// 2. Teacher Attendance Section
// ─────────────────────────────────────────────────────────────────────────────
export const TeacherAttendanceSection = () => {
    const [subTab, setSubTab] = useState('daily');
    const tabs = [
        { key: 'daily', label: '📅 Daily Attendance' },
        { key: 'leave', label: '🏖️ Leave Management' },
        { key: 'reports', label: '📊 Attendance Reports' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>📅 Teacher Attendance</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Track teacher attendance, leaves and generate reports</p>
            </div>
            <SubTabBar tabs={tabs} active={subTab} onChange={setSubTab} />
            {subTab === 'daily' && <TeacherDailyAttendance />}
            {subTab === 'leave' && <TeacherLeaveManagement />}
            {subTab === 'reports' && <TeacherAttendanceReports />}
        </div>
    );
};

const TeacherDailyAttendance = () => {
    const [date, setDate] = useState(today);
    const [attendance, setAttendance] = useState(() => Object.fromEntries(MOCK_TEACHERS.map(t => [t.id, 'Present'])));
    const [saved, setSaved] = useState(false);

    const counts = { Present: 0, Absent: 0, Late: 0 };
    Object.values(attendance).forEach(v => counts[v]++);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Top summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                <StatCard icon="📅" value={MOCK_TEACHERS.length} label="Total Teachers" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
                <StatCard icon="✅" value={counts.Present} label="Present" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                <StatCard icon="❌" value={counts.Absent} label="Absent" color="#dc2626" bg="#fef2f2" border="#fecaca" />
                <StatCard icon="⏰" value={counts.Late} label="Late" color="#d97706" bg="#fffbeb" border="#fde68a" />
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, background: '#f9fafb' }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>Mark Daily Attendance</h3>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13 }} />
                        <div style={{ display: 'flex', gap: 6 }}>
                            {['Present', 'Absent', 'Late'].map(s => (
                                <button key={s} onClick={() => setAttendance(Object.fromEntries(MOCK_TEACHERS.map(t => [t.id, s])))}
                                    style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: s === 'Present' ? '#059669' : s === 'Absent' ? '#dc2626' : '#d97706' }}>
                                    All {s}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                            style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                            {saved ? '✅ Saved!' : '💾 Save'}
                        </button>
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['#', 'Teacher', 'Subject', 'Class', 'Status', 'Remarks'].map(h => (
                                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_TEACHERS.map((t, i) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '11px 14px', color: '#9ca3af', fontSize: 12 }}>{i + 1}</td>
                                <td style={{ padding: '11px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                        <div>
                                            <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{t.name}</p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{t.emp_id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '11px 14px' }}><span style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', padding: '3px 9px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{t.subject}</span></td>
                                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{t.class_assigned}</td>
                                <td style={{ padding: '11px 14px' }}>
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        {['Present', 'Absent', 'Late'].map(s => (
                                            <button key={s} onClick={() => setAttendance(a => ({ ...a, [t.id]: s }))}
                                                style={{ padding: '4px 10px', borderRadius: 6, border: `2px solid ${attendance[t.id] === s ? (s === 'Present' ? '#10b981' : s === 'Absent' ? '#ef4444' : '#f59e0b') : '#e5e7eb'}`, background: attendance[t.id] === s ? (s === 'Present' ? '#10b981' : s === 'Absent' ? '#ef4444' : '#f59e0b') : 'white', color: attendance[t.id] === s ? 'white' : '#9ca3af', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                {s[0]}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '11px 14px' }}>
                                    <input style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', fontSize: 12, width: 150, outline: 'none' }} placeholder="Optional note..." />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TeacherLeaveManagement = () => {
    const [leaves, setLeaves] = useState(LEAVE_REQUESTS);
    const [filterStatus, setFilterStatus] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [form, setForm] = useState({ teacher: '', type: 'Casual Leave', from: '', to: '', reason: '' });

    const filtered = filterStatus ? leaves.filter(l => l.status === filterStatus) : leaves;

    const handleAction = (id, action) => {
        setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    };

    const handleApply = e => {
        e.preventDefault();
        const newLeave = { ...form, id: Date.now(), days: 1, status: 'Pending', applied: today };
        setLeaves(prev => [...prev, newLeave]);
        setShowApplyModal(false);
        setForm({ teacher: '', type: 'Casual Leave', from: '', to: '', reason: '' });
    };

    const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
    const lbl = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase' };

    const leaveBalance = { Casual: { total: 12, used: 3 }, Medical: { total: 15, used: 5 }, Earned: { total: 20, used: 8 } };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Leave balance cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {Object.entries(leaveBalance).map(([type, bal]) => (
                    <div key={type} style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontWeight: 700, color: '#374151', fontSize: 14, margin: 0 }}>{type} Leave</p>
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>Annual allocation</p>
                            </div>
                            <span style={{ fontWeight: 900, fontSize: 22, color: '#4f46e5' }}>{bal.total - bal.used}</span>
                        </div>
                        <div style={{ marginTop: 12, height: 6, background: '#e5e7eb', borderRadius: 3 }}>
                            <div style={{ width: `${((bal.total - bal.used) / bal.total) * 100}%`, height: '100%', background: '#6366f1', borderRadius: 3 }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                            <span style={{ fontSize: 11, color: '#9ca3af' }}>Used: {bal.used}</span>
                            <span style={{ fontSize: 11, color: '#9ca3af' }}>Total: {bal.total}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['', 'Pending', 'Approved', 'Rejected'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filterStatus === s ? '#6366f1' : '#e5e7eb'}`, background: filterStatus === s ? '#eef2ff' : 'white', color: filterStatus === s ? '#4f46e5' : '#6b7280', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
                <button onClick={() => setShowApplyModal(true)}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    ＋ Apply Leave
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(l => (
                    <div key={l.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${l.teacher}`} alt="" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                            <div>
                                <p style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: 14 }}>{l.teacher}</p>
                                <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>
                                    <span style={{ fontWeight: 700, color: '#4f46e5' }}>{l.type}</span> &nbsp;•&nbsp;
                                    {new Date(l.from).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} → {new Date(l.to).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    &nbsp;({l.days} day{l.days > 1 ? 's' : ''})
                                </p>
                                <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>Reason: {l.reason}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <StatusBadge status={l.status} />
                            {l.status === 'Pending' && (
                                <>
                                    <button onClick={() => handleAction(l.id, 'Approved')}
                                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✓ Approve</button>
                                    <button onClick={() => handleAction(l.id, 'Rejected')}
                                        style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✗ Reject</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', background: 'white', borderRadius: 14, border: '1px solid #e5e7eb' }}>No leave requests found.</div>}
            </div>

            {showApplyModal && (
                <Modal title="🏖️ Apply Leave" subtitle="Submit a leave request" onClose={() => setShowApplyModal(false)}>
                    <form onSubmit={handleApply} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div><label style={lbl}>Teacher *</label>
                            <select required value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} style={inp}>
                                <option value="">Select Teacher</option>
                                {MOCK_TEACHERS.map(t => <option key={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div><label style={lbl}>Leave Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>
                                {['Casual Leave', 'Medical Leave', 'Earned Leave', 'Maternity Leave', 'Emergency Leave'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div><label style={lbl}>From Date *</label><input required type="date" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} style={inp} /></div>
                            <div><label style={lbl}>To Date *</label><input required type="date" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} style={inp} /></div>
                        </div>
                        <div><label style={lbl}>Reason</label><textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder="Reason for leave..." /></div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="button" onClick={() => setShowApplyModal(false)} style={{ flex: 1, padding: 11, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: 11, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>✅ Submit Leave Request</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const TeacherAttendanceReports = () => {
    const [selected, setSelected] = useState('');
    const teachers = MOCK_TEACHERS;
    const shown = selected ? teachers.filter(t => t.name === selected) : teachers;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                <StatCard icon="📊" value={`${(teachers.reduce((s, t) => s + t.attendance_pct, 0) / teachers.length).toFixed(1)}%`} label="Overall Avg" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
                <StatCard icon="🏆" value={teachers.filter(t => t.attendance_pct >= 95).length} label="Above 95%" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                <StatCard icon="⚠️" value={teachers.filter(t => t.attendance_pct < 85).length} label="Below 85%" color="#dc2626" bg="#fef2f2" border="#fecaca" />
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <select value={selected} onChange={e => setSelected(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Teachers</option>
                    {teachers.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {shown.map(t => {
                    const color = t.attendance_pct >= 95 ? '#059669' : t.attendance_pct >= 85 ? '#d97706' : '#dc2626';
                    const grade = t.attendance_pct >= 95 ? 'Excellent' : t.attendance_pct >= 85 ? 'Good' : 'Needs Attention';
                    return (
                        <div key={t.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                    <div>
                                        <p style={{ fontWeight: 800, color: '#111827', margin: 0 }}>{t.name}</p>
                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{t.subject} • {t.emp_id}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontWeight: 900, fontSize: 22, color, margin: 0 }}>{t.attendance_pct}%</p>
                                        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Attendance</p>
                                    </div>
                                    <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: t.attendance_pct >= 95 ? '#f0fdf4' : t.attendance_pct >= 85 ? '#fffbeb' : '#fef2f2', color, border: `1px solid ${t.attendance_pct >= 95 ? '#bbf7d0' : t.attendance_pct >= 85 ? '#fde68a' : '#fecaca'}` }}>
                                        {grade}
                                    </span>
                                </div>
                            </div>
                            <div style={{ marginTop: 12, height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                                <div style={{ width: `${t.attendance_pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#9ca3af' }}>
                                <span>0%</span><span>75%</span><span>100%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Salary & Payroll Section
// ─────────────────────────────────────────────────────────────────────────────
export const SalaryPayrollSection = () => {
    const [subTab, setSubTab] = useState('structure');
    const tabs = [
        { key: 'structure', label: '🏗️ Salary Structure' },
        { key: 'payslip', label: '📄 Payslip Generation' },
        { key: 'history', label: '📜 Salary History' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>💼 Salary & Payroll</h2>
                    <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Manage teacher salaries, generate payslips and track history</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {[
                        { label: 'Monthly Budget', val: `₹${MOCK_TEACHERS.reduce((s, t) => s + t.salary, 0).toLocaleString()}`, color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
                        { label: 'Paid This Month', val: `₹${SALARY_HISTORY.filter(s => s.month === 'April 2026' && s.status === 'Paid').reduce((s, x) => s + x.net, 0).toLocaleString()}`, color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
                    ].map((p, i) => (
                        <div key={i} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
                            <span style={{ fontSize: 15, fontWeight: 900, color: p.color, display: 'block' }}>{p.val}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, color: p.color, opacity: 0.8 }}>{p.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <SubTabBar tabs={tabs} active={subTab} onChange={setSubTab} />
            {subTab === 'structure' && <SalaryStructureTab />}
            {subTab === 'payslip' && <PayslipGenerationTab />}
            {subTab === 'history' && <SalaryHistoryTab />}
        </div>
    );
};

const SalaryStructureTab = () => {
    const [structures, setStructures] = useState(SALARY_STRUCTURES);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ grade: '', basic: '', hra: '', da: '', ta: '', medical: '', pf: '', tax: '' });

    const handleCreate = e => {
        e.preventDefault();
        const n = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, k === 'grade' ? v : Number(v)]));
        n.gross = n.basic + n.hra + n.da + n.ta + n.medical;
        n.net = n.gross - n.pf - n.tax;
        n.id = Date.now();
        setStructures(prev => [...prev, n]);
        setShowModal(false);
        setForm({ grade: '', basic: '', hra: '', da: '', ta: '', medical: '', pf: '', tax: '' });
    };

    const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
    const lbl = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', margin: 0 }}>Pay Grade Structures</h3>
                <button onClick={() => setShowModal(true)}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    ＋ Add Grade
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {structures.map(s => (
                    <div key={s.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', padding: '18px 20px', color: 'white' }}>
                            <h4 style={{ fontWeight: 900, fontSize: 15, margin: 0 }}>{s.grade}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                                <div><p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>Gross Salary</p><p style={{ margin: 0, fontWeight: 900, fontSize: 20 }}>₹{s.gross.toLocaleString()}</p></div>
                                <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>Net Take Home</p><p style={{ margin: 0, fontWeight: 900, fontSize: 20, color: '#86efac' }}>₹{s.net.toLocaleString()}</p></div>
                            </div>
                        </div>
                        <div style={{ padding: '14px 20px' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 10px' }}>Earnings</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[['Basic Salary', s.basic], ['HRA', s.hra], ['DA', s.da], ['Travel Allowance', s.ta], ['Medical Allowance', s.medical]].map(([label, amt]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                        <span style={{ color: '#6b7280' }}>{label}</span>
                                        <span style={{ fontWeight: 700, color: '#059669' }}>+₹{amt.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ margin: '10px 0', borderTop: '1px dashed #e5e7eb' }} />
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 8px' }}>Deductions</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[['PF (12%)', s.pf], ['Income Tax', s.tax]].map(([label, amt]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                        <span style={{ color: '#6b7280' }}>{label}</span>
                                        <span style={{ fontWeight: 700, color: '#dc2626' }}>-₹{amt.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 800, color: '#15803d' }}>Net Salary</span>
                                <span style={{ fontWeight: 900, color: '#15803d', fontSize: 16 }}>₹{s.net.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal title="🏗️ Create Salary Structure" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleCreate} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div><label style={lbl}>Grade Name *</label><input required value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} style={inp} placeholder="e.g. Grade A (Senior)" /></div>
                        <p style={{ margin: '4px 0', fontWeight: 700, color: '#6b7280', fontSize: 12, textTransform: 'uppercase' }}>Earnings (₹/month)</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[['Basic Salary', 'basic'], ['HRA', 'hra'], ['Dearness Allowance', 'da'], ['Travel Allowance', 'ta'], ['Medical Allowance', 'medical']].map(([label, key]) => (
                                <div key={key}><label style={lbl}>{label} *</label><input required type="number" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inp} placeholder="₹0" /></div>
                            ))}
                        </div>
                        <p style={{ margin: '4px 0', fontWeight: 700, color: '#6b7280', fontSize: 12, textTransform: 'uppercase' }}>Deductions (₹/month)</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[['PF Contribution', 'pf'], ['Income Tax', 'tax']].map(([label, key]) => (
                                <div key={key}><label style={lbl}>{label} *</label><input required type="number" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inp} placeholder="₹0" /></div>
                            ))}
                        </div>
                        {form.basic && (
                            <div style={{ padding: '10px 14px', background: '#eef2ff', borderRadius: 10, border: '1px solid #c7d2fe' }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>
                                    Net Salary Preview: ₹{(Number(form.basic) + Number(form.hra || 0) + Number(form.da || 0) + Number(form.ta || 0) + Number(form.medical || 0) - Number(form.pf || 0) - Number(form.tax || 0)).toLocaleString()}
                                </p>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: 11, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>✅ Create Structure</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const PayslipGenerationTab = () => {
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('April 2026');
    const [generated, setGenerated] = useState(false);

    const teacher = MOCK_TEACHERS.find(t => t.name === selectedTeacher);
    const schoolName = (() => { try { return JSON.parse(localStorage.getItem('user'))?.schoolName || 'VidyaSetu School'; } catch { return 'VidyaSetu School'; } })();

    const payData = teacher ? {
        basic: Math.round(teacher.salary * 0.6),
        hra: Math.round(teacher.salary * 0.24),
        da: Math.round(teacher.salary * 0.09),
        ta: Math.round(teacher.salary * 0.035),
        medical: Math.round(teacher.salary * 0.026),
        pf: Math.round(teacher.salary * 0.072),
        tax: Math.round(teacher.salary * 0.043),
        gross: teacher.salary,
        net: Math.round(teacher.salary * 0.885),
    } : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: '0 0 16px' }}>Generate Payslip</h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 2, minWidth: 200 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase' }}>Select Teacher</label>
                        <select value={selectedTeacher} onChange={e => { setSelectedTeacher(e.target.value); setGenerated(false); }}
                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none' }}>
                            <option value="">-- Select Teacher --</option>
                            {MOCK_TEACHERS.map(t => <option key={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase' }}>Month</label>
                        <select value={selectedMonth} onChange={e => { setSelectedMonth(e.target.value); setGenerated(false); }}
                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none' }}>
                            {['April 2026', 'March 2026', 'February 2026', 'January 2026'].map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <button disabled={!selectedTeacher} onClick={() => setGenerated(true)}
                        style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: selectedTeacher ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#d1d5db', color: 'white', fontWeight: 700, fontSize: 14, cursor: selectedTeacher ? 'pointer' : 'not-allowed' }}>
                        📄 Generate
                    </button>
                </div>
            </div>

            {generated && teacher && payData && (
                <div style={{ background: 'white', borderRadius: 20, border: '2px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
                    {/* Payslip Header */}
                    <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', padding: '24px 32px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 28, marginBottom: 4 }}>🏫</div>
                            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{schoolName}</h2>
                            <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Teacher Payslip — {selectedMonth}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>Payslip ID</p>
                            <p style={{ margin: '2px 0 0', fontWeight: 900, fontSize: 16 }}>PAY-{teacher.emp_id}-{selectedMonth.replace(' ', '-')}</p>
                        </div>
                    </div>

                    {/* Employee Info */}
                    <div style={{ padding: '20px 32px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                        {[['Employee Name', teacher.name], ['Employee ID', teacher.emp_id], ['Designation', `${teacher.subject} Teacher`], ['Department', 'Teaching Staff'], ['Class Assigned', teacher.class_assigned], ['Joining Date', new Date(teacher.joining_date).toLocaleDateString('en-IN')]].map(([label, value]) => (
                            <div key={label}>
                                <p style={{ margin: 0, fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
                                <p style={{ margin: '3px 0 0', fontWeight: 700, color: '#111827', fontSize: 13 }}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Earnings */}
                        <div>
                            <h4 style={{ fontWeight: 800, color: '#059669', fontSize: 14, margin: '0 0 12px', textTransform: 'uppercase' }}>💰 Earnings</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <tbody>
                                    {[['Basic Salary', payData.basic], ['HRA', payData.hra], ['Dearness Allowance', payData.da], ['Travel Allowance', payData.ta], ['Medical Allowance', payData.medical]].map(([l, v]) => (
                                        <tr key={l} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '7px 0', color: '#6b7280' }}>{l}</td>
                                            <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 700, color: '#059669' }}>₹{v.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr style={{ background: '#f0fdf4' }}>
                                        <td style={{ padding: '10px 8px', fontWeight: 800, color: '#15803d', fontSize: 14 }}>Gross Earnings</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#15803d', fontSize: 15 }}>₹{payData.gross.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Deductions */}
                        <div>
                            <h4 style={{ fontWeight: 800, color: '#dc2626', fontSize: 14, margin: '0 0 12px', textTransform: 'uppercase' }}>✂️ Deductions</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <tbody>
                                    {[['Provident Fund (12%)', payData.pf], ['Income Tax (TDS)', payData.tax]].map(([l, v]) => (
                                        <tr key={l} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '7px 0', color: '#6b7280' }}>{l}</td>
                                            <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>₹{v.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr style={{ background: '#fef2f2' }}>
                                        <td style={{ padding: '10px 8px', fontWeight: 800, color: '#dc2626', fontSize: 14 }}>Total Deductions</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#dc2626', fontSize: 15 }}>₹{(payData.pf + payData.tax).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div style={{ margin: '0 32px 24px', padding: '18px 24px', background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', borderRadius: 14, border: '2px solid #c7d2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, color: '#4f46e5', fontSize: 14 }}>Net Salary (Take Home)</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af' }}>After all deductions for {selectedMonth}</p>
                        </div>
                        <p style={{ margin: 0, fontWeight: 900, color: '#4f46e5', fontSize: 28 }}>₹{payData.net.toLocaleString()}</p>
                    </div>

                    {/* Actions */}
                    <div style={{ padding: '0 32px 24px', display: 'flex', gap: 10 }}>
                        <button onClick={() => window.print()} style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>🖨️ Print Payslip</button>
                        <button style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>📧 Send to Teacher</button>
                        <button style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>⬇️ Download PDF</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SalaryHistoryTab = () => {
    const [history] = useState(SALARY_HISTORY);
    const [filterTeacher, setFilterTeacher] = useState('');
    const [filterMonth, setFilterMonth] = useState('');

    const teachers = [...new Set(history.map(h => h.teacher))];
    const months = [...new Set(history.map(h => h.month))];
    const filtered = history.filter(h =>
        (!filterTeacher || h.teacher === filterTeacher) &&
        (!filterMonth || h.month === filterMonth)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                <StatCard icon="💰" value={`₹${history.filter(h => h.status === 'Paid').reduce((s, h) => s + h.net, 0).toLocaleString()}`} label="Total Disbursed" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                <StatCard icon="⏳" value={history.filter(h => h.status === 'Pending').length} label="Pending" color="#d97706" bg="#fffbeb" border="#fde68a" />
                <StatCard icon="🧾" value={history.length} label="Total Records" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Teachers</option>
                    {teachers.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Months</option>
                    {months.map(m => <option key={m}>{m}</option>)}
                </select>
                <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center' }}>{filtered.length} records</span>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Teacher', 'Month', 'Gross', 'Deductions', 'Net Pay', 'Status', 'Paid On', 'Mode', 'Action'].map(h => (
                                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(h => (
                            <tr key={h.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <td style={{ padding: '11px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${h.teacher}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                        <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>{h.teacher}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{h.month}</td>
                                <td style={{ padding: '11px 14px', fontWeight: 700, color: '#374151' }}>₹{h.gross.toLocaleString()}</td>
                                <td style={{ padding: '11px 14px', color: '#dc2626', fontWeight: 600 }}>-₹{h.deductions.toLocaleString()}</td>
                                <td style={{ padding: '11px 14px', fontWeight: 900, color: '#059669', fontSize: 14 }}>₹{h.net.toLocaleString()}</td>
                                <td style={{ padding: '11px 14px' }}><StatusBadge status={h.status} /></td>
                                <td style={{ padding: '11px 14px', fontSize: 12, color: '#6b7280' }}>{h.paid_on ? new Date(h.paid_on).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                <td style={{ padding: '11px 14px', fontSize: 12, color: '#374151' }}>{h.mode}</td>
                                <td style={{ padding: '11px 14px' }}>
                                    <button style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                        📄 Slip
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No salary records found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Class Management Section
// ─────────────────────────────────────────────────────────────────────────────
export const ClassManagementSection = () => {
    const [subTab, setSubTab] = useState('assignment');
    const tabs = [
        { key: 'assignment', label: '👨‍🏫 Class Teacher Assignment' },
        { key: 'students', label: '👩‍🎓 Student Assignment' },
        { key: 'timetable', label: '🕐 Timetable' },
        { key: 'access', label: '🔑 Class Access' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>🏫 Class Management</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Assign teachers to classes, manage timetables and access permissions</p>
            </div>
            <SubTabBar tabs={tabs} active={subTab} onChange={setSubTab} />
            {subTab === 'assignment' && <ClassTeacherAssignment />}
            {subTab === 'students' && <StudentAssignment />}
            {subTab === 'timetable' && <TimetableAssignment />}
            {subTab === 'access' && <ClassAccessManagement />}
        </div>
    );
};

const ClassTeacherAssignment = () => {
    const [classes, setClasses] = useState(MOCK_CLASSES);
    const [showModal, setShowModal] = useState(false);
    const [editClass, setEditClass] = useState(null);
    const [form, setForm] = useState({ name: '', subject: '', teacher: '', room: '', timings: '' });

    const handleSave = e => {
        e.preventDefault();
        if (editClass) {
            setClasses(prev => prev.map(c => c.id === editClass.id ? { ...c, ...form } : c));
        } else {
            setClasses(prev => [...prev, { ...form, id: Date.now(), students: 0 }]);
        }
        setShowModal(false); setEditClass(null);
        setForm({ name: '', subject: '', teacher: '', room: '', timings: '' });
    };

    const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
    const lbl = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 12 }}>
                    <StatCard icon="🏫" value={classes.length} label="Total Classes" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
                    <StatCard icon="👩‍🎓" value={classes.reduce((s, c) => s + c.students, 0)} label="Total Students" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                    <StatCard icon="👨‍🏫" value={[...new Set(classes.map(c => c.teacher))].length} label="Teachers Assigned" color="#d97706" bg="#fffbeb" border="#fde68a" />
                </div>
                <button onClick={() => { setEditClass(null); setForm({ name: '', subject: '', teacher: '', room: '', timings: '' }); setShowModal(true); }}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    ＋ Assign New Class
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
                {classes.map(c => (
                    <div key={c.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontWeight: 900, fontSize: 16, color: '#1e1b4b', margin: 0 }}>{c.name}</h4>
                                <span style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '3px 9px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.subject}</span>
                            </div>
                        </div>
                        <div style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${c.teacher}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                <div>
                                    <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{c.teacher}</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Class Teacher</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[['👩‍🎓 Students', c.students], ['🚪 Room', c.room], ['🕐 Timings', c.timings]].map(([label, val]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                        <span style={{ color: '#9ca3af' }}>{label}</span>
                                        <span style={{ fontWeight: 600, color: '#374151' }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                                <button onClick={() => { setEditClass(c); setForm({ name: c.name, subject: c.subject, teacher: c.teacher, room: c.room, timings: c.timings }); setShowModal(true); }}
                                    style={{ flex: 1, padding: '7px', borderRadius: 8, border: '1px solid #c7d2fe', background: '#eef2ff', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#4f46e5' }}>
                                    ✏️ Edit
                                </button>
                                <button onClick={() => setClasses(prev => prev.filter(x => x.id !== c.id))}
                                    style={{ flex: 1, padding: '7px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#dc2626' }}>
                                    🗑 Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal title={editClass ? '✏️ Edit Class Assignment' : '➕ Assign New Class'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSave} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div><label style={lbl}>Class Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} placeholder="e.g. Class 10-A" /></div>
                            <div><label style={lbl}>Subject *</label><input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={inp} placeholder="e.g. Mathematics" /></div>
                        </div>
                        <div><label style={lbl}>Assign Teacher *</label>
                            <select required value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} style={inp}>
                                <option value="">Select Teacher</option>
                                {MOCK_TEACHERS.map(t => <option key={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div><label style={lbl}>Room / Lab</label><input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} style={inp} placeholder="e.g. Room 101" /></div>
                            <div><label style={lbl}>Timings</label><input value={form.timings} onChange={e => setForm(f => ({ ...f, timings: e.target.value }))} style={inp} placeholder="e.g. Mon-Fri 9AM-10AM" /></div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 2, padding: 11, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>✅ {editClass ? 'Update' : 'Assign'} Class</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const StudentAssignment = () => {
    const STUDENTS_LIST = ['Aarav Sharma', 'Priya Gupta', 'Rohan Singh', 'Sneha Patel', 'Arjun Kumar'];
    const [assignments, setAssignments] = useState({ 'Class 10-A': ['Aarav Sharma', 'Priya Gupta'], 'Class 9-B': ['Rohan Singh'] });
    const [selectedClass, setSelectedClass] = useState('Class 10-A');
    const [search, setSearch] = useState('');

    const assigned = assignments[selectedClass] || [];
    const unassigned = STUDENTS_LIST.filter(s => !Object.values(assignments).flat().includes(s));
    const filtered = unassigned.filter(s => !search || s.toLowerCase().includes(search.toLowerCase()));

    const assign = name => setAssignments(prev => ({ ...prev, [selectedClass]: [...(prev[selectedClass] || []), name] }));
    const unassign = name => setAssignments(prev => ({ ...prev, [selectedClass]: prev[selectedClass].filter(s => s !== name) }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '16px 20px' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>Select Class to Manage</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {MOCK_CLASSES.map(c => (
                        <button key={c.id} onClick={() => setSelectedClass(c.name)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: `2px solid ${selectedClass === c.name ? '#6366f1' : '#e5e7eb'}`, background: selectedClass === c.name ? '#eef2ff' : 'white', color: selectedClass === c.name ? '#4f46e5' : '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Currently Assigned */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111827' }}>✅ Assigned to {selectedClass}</h4>
                        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{assigned.length}</span>
                    </div>
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180 }}>
                        {assigned.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginTop: 40 }}>No students assigned yet.</p>}
                        {assigned.map(s => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s}`} alt="" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                                    <span style={{ fontWeight: 700, fontSize: 13, color: '#15803d' }}>{s}</span>
                                </div>
                                <button onClick={() => unassign(s)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available Students */}
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111827' }}>🔵 Available Students</h4>
                        <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{filtered.length}</span>
                    </div>
                    <div style={{ padding: 14 }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search students..." style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                            {filtered.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginTop: 30 }}>All students assigned.</p>}
                            {filtered.map(s => (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s}`} alt="" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                                        <span style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>{s}</span>
                                    </div>
                                    <button onClick={() => assign(s)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#4f46e5', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Assign</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimetableAssignment = () => {
    const [selectedTeacher, setSelectedTeacher] = useState('Sunita Verma');
    const tt = TIMETABLE[selectedTeacher] || [];
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const TIMES = ['8-9', '9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '16px 20px' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>Select Teacher</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {MOCK_TEACHERS.map(t => (
                        <button key={t.id} onClick={() => setSelectedTeacher(t.name)}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 10, border: `2px solid ${selectedTeacher === t.name ? '#6366f1' : '#e5e7eb'}`, background: selectedTeacher === t.name ? '#eef2ff' : 'white', color: selectedTeacher === t.name ? '#4f46e5' : '#6b7280', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
                            {t.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timetable Grid */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'auto' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: 0 }}>
                        📅 Weekly Timetable — {selectedTeacher}
                    </h3>
                </div>
                <div style={{ overflowX: 'auto', padding: 20 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px 12px', background: '#1e1b4b', color: 'white', borderRadius: '8px 0 0 0', fontSize: 11, fontWeight: 700, textAlign: 'left', width: 80 }}>Time ↓ Day →</th>
                                {DAYS.map(d => (
                                    <th key={d} style={{ padding: '10px 12px', background: '#1e1b4b', color: 'white', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIMES.map((time, ti) => (
                                <tr key={time} style={{ background: ti % 2 === 0 ? 'white' : '#fafafa' }}>
                                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#4f46e5', fontSize: 12, borderRight: '2px solid #e5e7eb', whiteSpace: 'nowrap' }}>{time}</td>
                                    {DAYS.map((day, di) => {
                                        const dayData = tt.find(d => d.day === day);
                                        const period = dayData?.periods?.find(p => p.time === time);
                                        return (
                                            <td key={day} style={{ padding: '8px', textAlign: 'center', border: '1px solid #f3f4f6' }}>
                                                {period ? (
                                                    <div style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', borderRadius: 8, padding: '6px 8px', border: '1px solid #c7d2fe' }}>
                                                        <p style={{ margin: 0, fontWeight: 800, color: '#4f46e5', fontSize: 11 }}>{period.class}</p>
                                                        <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6b7280' }}>{period.sub}</p>
                                                    </div>
                                                ) : (
                                                    <div style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e5e7eb', fontSize: 11 }}>—</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', background: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: '#374151' }}>🖨️ Print</button>
                    <button style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>✏️ Edit Timetable</button>
                </div>
            </div>
        </div>
    );
};

const ClassAccessManagement = () => {
    const [permissions, setPermissions] = useState(() =>
        MOCK_TEACHERS.map(t => ({
            ...t,
            canMark: true, canViewReports: true, canAddContent: false, canManageFees: false, canMessageParents: true
        }))
    );

    const toggle = (id, key) => setPermissions(prev => prev.map(p => p.id === id ? { ...p, [key]: !p[key] } : p));

    const PERMS = [
        { key: 'canMark', label: 'Mark Attendance', icon: '📅' },
        { key: 'canViewReports', label: 'View Reports', icon: '📊' },
        { key: 'canAddContent', label: 'Add Study Content', icon: '📚' },
        { key: 'canManageFees', label: 'View Fees', icon: '💰' },
        { key: 'canMessageParents', label: 'Message Parents', icon: '💬' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff7ed', borderRadius: 14, padding: '14px 18px', border: '1px solid #fed7aa', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>🔑</span>
                <p style={{ margin: 0, fontSize: 13, color: '#c2410c', fontWeight: 600 }}>
                    Control what each teacher can access and perform within the school portal. Changes apply immediately.
                </p>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Teacher</th>
                            {PERMS.map(p => (
                                <th key={p.key} style={{ padding: '12px 10px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', minWidth: 110 }}>
                                    {p.icon} {p.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                        <div>
                                            <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{t.name}</p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{t.subject}</p>
                                        </div>
                                    </div>
                                </td>
                                {PERMS.map(p => (
                                    <td key={p.key} style={{ padding: '12px 10px', textAlign: 'center' }}>
                                        <button onClick={() => toggle(t.id, p.key)}
                                            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: t[p.key] ? '#4f46e5' : '#e5e7eb', position: 'relative', transition: 'background 0.2s' }}>
                                            <span style={{ position: 'absolute', top: 2, left: t[p.key] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Performance Section
// ─────────────────────────────────────────────────────────────────────────────
export const TeacherPerformanceSection = () => {
    const [subTab, setSubTab] = useState('performance');
    const tabs = [
        { key: 'performance', label: '📈 Performance Reports' },
        { key: 'feedback', label: '💬 Student Feedback' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>📈 Teacher Performance</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Evaluate teacher performance and student feedback ratings</p>
            </div>
            <SubTabBar tabs={tabs} active={subTab} onChange={setSubTab} />
            {subTab === 'performance' && <PerformanceReports />}
            {subTab === 'feedback' && <StudentFeedbackReports />}
        </div>
    );
};

const PerformanceReports = () => {
    const teachers = MOCK_TEACHERS;
    const feedbacks = FEEDBACK;

    const combined = teachers.map(t => {
        const fb = feedbacks.find(f => f.teacher === t.name) || {};
        const score = ((fb.rating || 3) / 5 * 40) + (t.attendance_pct / 100 * 35) + (Math.min(t.experience / 15, 1) * 25);
        return { ...t, ...fb, score: Math.min(score, 100).toFixed(1) };
    }).sort((a, b) => b.score - a.score);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                <StatCard icon="🏆" value={combined.filter(t => t.score >= 80).length} label="Excellent" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
                <StatCard icon="👍" value={combined.filter(t => t.score >= 65 && t.score < 80).length} label="Good" color="#d97706" bg="#fffbeb" border="#fde68a" />
                <StatCard icon="⚠️" value={combined.filter(t => t.score < 65).length} label="Needs Improvement" color="#dc2626" bg="#fef2f2" border="#fecaca" />
                <StatCard icon="⭐" value={(combined.reduce((s, t) => s + Number(t.score), 0) / combined.length).toFixed(1)} label="Avg Score" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: 0 }}>Performance Rankings</h3>
                </div>
                <div style={{ padding: '10px 0' }}>
                    {combined.map((t, i) => {
                        const grade = t.score >= 80 ? { label: 'Excellent', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' } : t.score >= 65 ? { label: 'Good', color: '#d97706', bg: '#fffbeb', border: '#fde68a' } : { label: 'Needs Improvement', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
                        return (
                            <div key={t.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                {/* Rank */}
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: i < 3 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: i < 3 ? 'white' : '#6b7280', flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                {/* Teacher info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 2, minWidth: 160 }}>
                                    <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                    <div>
                                        <p style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: 14 }}>{t.name}</p>
                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{t.subject} • {t.class_assigned}</p>
                                    </div>
                                </div>
                                {/* Metrics */}
                                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', flex: 3 }}>
                                    {[['Attendance', `${t.attendance_pct}%`], ['Rating', t.rating ? `${t.rating}/5` : 'N/A'], ['Exp.', `${t.experience}y`]].map(([label, val]) => (
                                        <div key={label} style={{ textAlign: 'center' }}>
                                            <p style={{ fontWeight: 800, fontSize: 16, color: '#374151', margin: 0 }}>{val}</p>
                                            <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>{label}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Score */}
                                <div style={{ flex: 2, minWidth: 160 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, color: '#9ca3af' }}>Performance Score</span>
                                        <span style={{ fontWeight: 900, fontSize: 16, color: grade.color }}>{t.score}</span>
                                    </div>
                                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                                        <div style={{ width: `${t.score}%`, height: '100%', background: t.score >= 80 ? '#10b981' : t.score >= 65 ? '#f59e0b' : '#ef4444', borderRadius: 4, transition: 'width 0.6s ease' }} />
                                    </div>
                                </div>
                                <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: grade.bg, color: grade.color, border: `1px solid ${grade.border}`, whiteSpace: 'nowrap' }}>
                                    {grade.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const StudentFeedbackReports = () => {
    const [selected, setSelected] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                <StatCard icon="💬" value={FEEDBACK.reduce((s, f) => s + f.responses, 0)} label="Total Responses" color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />
                <StatCard icon="⭐" value={(FEEDBACK.reduce((s, f) => s + f.rating, 0) / FEEDBACK.length).toFixed(1)} label="Overall Rating" color="#d97706" bg="#fffbeb" border="#fde68a" />
                <StatCard icon="🏆" value={FEEDBACK.sort((a, b) => b.rating - a.rating)[0]?.teacher?.split(' ')[0]} label="Top Rated" color="#059669" bg="#f0fdf4" border="#bbf7d0" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
                {FEEDBACK.map(f => (
                    <div key={f.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                        onClick={() => setSelected(f === selected ? null : f)}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}>
                        <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${f.teacher}`} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: 15 }}>{f.teacher}</p>
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{f.subject} • {f.class}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 900, fontSize: 22, color: '#f59e0b', margin: 0 }}>{f.rating}</p>
                                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>/ 5.0</p>
                                </div>
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <StarRating rating={f.rating} />
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>{f.responses} student responses</p>
                            </div>
                        </div>
                        <div style={{ padding: '14px 20px' }}>
                            {[['Teaching Quality', f.teaching], ['Clarity', f.clarity], ['Punctuality', f.punctuality], ['Behaviour', f.behaviour]].map(([label, val]) => (
                                <div key={label} style={{ marginBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                                        <span style={{ color: '#6b7280' }}>{label}</span>
                                        <span style={{ fontWeight: 700, color: '#374151' }}>{val}/5</span>
                                    </div>
                                    <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3 }}>
                                        <div style={{ width: `${(val / 5) * 100}%`, height: '100%', background: val >= 4.5 ? '#10b981' : val >= 3.5 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                                    </div>
                                </div>
                            ))}
                            {selected === f && (
                                <div style={{ marginTop: 14 }}>
                                    <p style={{ fontWeight: 700, fontSize: 12, color: '#374151', margin: '0 0 8px', textTransform: 'uppercase' }}>💬 Student Comments</p>
                                    {f.comments.map((c, i) => (
                                        <div key={i} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6', marginBottom: 6, fontSize: 13, color: '#374151', fontStyle: 'italic' }}>
                                            "{c}"
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button style={{ marginTop: 10, width: '100%', padding: '7px', borderRadius: 8, border: '1px solid #c7d2fe', background: selected === f ? '#eef2ff' : 'white', color: '#4f46e5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                {selected === f ? '▲ Hide Comments' : '▼ View Comments'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
