import React, { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data Helpers (replace with real API calls as backend is ready)
// ─────────────────────────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];

const MOCK_STUDENTS = [
    { id: 1, name: 'Aarav Sharma', admission_no: 'ADM-2024-001', class_name: 'Class 10', section: 'A', roll_number: '01', email: 'aarav@school.in', phone: '9876543210', gender: 'Male', dob: '2010-03-15', blood_group: 'O+', address: '12, MG Road, Delhi', father_name: 'Rajesh Sharma', mother_name: 'Priya Sharma', parent_phone: '9811223344', total_fees_due: 4500, present_days: 120, absent_days: 8, attendance_percentage: 93.8, marks_math: 88, marks_science: 92, marks_english: 79, marks_hindi: 85, marks_sst: 78 },
    { id: 2, name: 'Priya Gupta', admission_no: 'ADM-2024-002', class_name: 'Class 10', section: 'B', roll_number: '02', email: 'priya@school.in', phone: '9123456789', gender: 'Female', dob: '2010-07-20', blood_group: 'A+', address: '45, Lajpat Nagar, Delhi', father_name: 'Suresh Gupta', mother_name: 'Anita Gupta', parent_phone: '9822334455', total_fees_due: 0, present_days: 128, absent_days: 0, attendance_percentage: 100, marks_math: 95, marks_science: 97, marks_english: 91, marks_hindi: 89, marks_sst: 93 },
    { id: 3, name: 'Rohan Singh', admission_no: 'ADM-2024-003', class_name: 'Class 9', section: 'A', roll_number: '03', email: 'rohan@school.in', phone: '9234567890', gender: 'Male', dob: '2011-01-10', blood_group: 'B+', address: '78, Rohini, Delhi', father_name: 'Vikram Singh', mother_name: 'Sunita Singh', parent_phone: '9833445566', total_fees_due: 9000, present_days: 100, absent_days: 28, attendance_percentage: 78.1, marks_math: 72, marks_science: 68, marks_english: 75, marks_hindi: 80, marks_sst: 65 },
    { id: 4, name: 'Sneha Patel', admission_no: 'ADM-2024-004', class_name: 'Class 8', section: 'C', roll_number: '04', email: 'sneha@school.in', phone: '9345678901', gender: 'Female', dob: '2012-05-25', blood_group: 'AB-', address: '23, Dwarka, Delhi', father_name: 'Manish Patel', mother_name: 'Kavita Patel', parent_phone: '9844556677', total_fees_due: 2000, present_days: 115, absent_days: 13, attendance_percentage: 89.8, marks_math: 83, marks_science: 87, marks_english: 90, marks_hindi: 76, marks_sst: 82 },
    { id: 5, name: 'Arjun Kumar', admission_no: 'ADM-2024-005', class_name: 'Class 7', section: 'A', roll_number: '05', email: 'arjun@school.in', phone: '9456789012', gender: 'Male', dob: '2013-09-12', blood_group: 'O-', address: '56, Janakpuri, Delhi', father_name: 'Deepak Kumar', mother_name: 'Rekha Kumar', parent_phone: '9855667788', total_fees_due: 0, present_days: 126, absent_days: 2, attendance_percentage: 98.4, marks_math: 91, marks_science: 89, marks_english: 86, marks_hindi: 92, marks_sst: 88 },
];

const MOCK_EXAM_SCHEDULES = [
    { id: 1, exam_name: 'Unit Test 1', subject: 'Mathematics', class_name: 'Class 10', date: '2026-06-10', time: '09:00 AM', duration: '2 Hours', max_marks: 50, exam_hall: 'Hall A' },
    { id: 2, exam_name: 'Unit Test 1', subject: 'Science', class_name: 'Class 10', date: '2026-06-12', time: '10:00 AM', duration: '2 Hours', max_marks: 50, exam_hall: 'Hall B' },
    { id: 3, exam_name: 'Mid Term', subject: 'English', class_name: 'Class 9', date: '2026-06-15', time: '09:00 AM', duration: '3 Hours', max_marks: 100, exam_hall: 'Hall A' },
    { id: 4, exam_name: 'Mid Term', subject: 'Mathematics', class_name: 'Class 9', date: '2026-06-17', time: '09:00 AM', duration: '3 Hours', max_marks: 100, exam_hall: 'Hall C' },
    { id: 5, exam_name: 'Final Exam', subject: 'Social Studies', class_name: 'Class 8', date: '2026-06-20', time: '11:00 AM', duration: '3 Hours', max_marks: 100, exam_hall: 'Hall D' },
];

const MOCK_LEAVE_REQUESTS = [
    { id: 1, student_name: 'Aarav Sharma', admission_no: 'ADM-2024-001', class_name: 'Class 10', section: 'A', from_date: '2026-06-05', to_date: '2026-06-07', reason: 'Family function', status: 'Pending', applied_on: '2026-06-01' },
    { id: 2, student_name: 'Rohan Singh', admission_no: 'ADM-2024-003', class_name: 'Class 9', section: 'A', from_date: '2026-06-08', to_date: '2026-06-08', reason: 'Medical appointment', status: 'Approved', applied_on: '2026-06-03' },
    { id: 3, student_name: 'Sneha Patel', admission_no: 'ADM-2024-004', class_name: 'Class 8', section: 'C', from_date: '2026-06-03', to_date: '2026-06-04', reason: 'Fever', status: 'Rejected', applied_on: '2026-06-02' },
    { id: 4, student_name: 'Priya Gupta', admission_no: 'ADM-2024-002', class_name: 'Class 10', section: 'B', from_date: '2026-06-12', to_date: '2026-06-13', reason: 'Out of station', status: 'Pending', applied_on: '2026-06-04' },
];

const MOCK_BUS_ROUTES = [
    { id: 1, route_name: 'Route A - North', stops: 'Rohini → Pitampura → Model Town → School', driver: 'Ram Chaudhary', vehicle_no: 'DL-1C-1234', capacity: 40, students: 32, departure_time: '07:00 AM', return_time: '02:30 PM', fee_monthly: 1500 },
    { id: 2, route_name: 'Route B - South', stops: 'Dwarka → Janakpuri → Rajouri Garden → School', driver: 'Shyam Verma', vehicle_no: 'DL-2B-5678', capacity: 45, students: 41, departure_time: '06:45 AM', return_time: '02:45 PM', fee_monthly: 1800 },
    { id: 3, route_name: 'Route C - East', stops: 'Laxmi Nagar → Preet Vihar → Mayur Vihar → School', driver: 'Ravi Sharma', vehicle_no: 'DL-3A-9101', capacity: 50, students: 38, departure_time: '07:15 AM', return_time: '02:20 PM', fee_monthly: 2000 },
];

const MOCK_VEHICLES = [
    { id: 1, vehicle_no: 'DL-1C-1234', vehicle_type: 'Bus', make: 'TATA', model: 'Starbus', year: 2020, capacity: 40, fuel_type: 'Diesel', last_service: '2026-04-15', next_service: '2026-07-15', insurance_expiry: '2027-01-20', fitness_expiry: '2026-12-31', status: 'Active', route: 'Route A' },
    { id: 2, vehicle_no: 'DL-2B-5678', vehicle_type: 'Bus', make: 'Ashok Leyland', model: 'Circuit', year: 2021, capacity: 45, fuel_type: 'Diesel', last_service: '2026-03-20', next_service: '2026-06-20', insurance_expiry: '2026-11-15', fitness_expiry: '2027-03-10', status: 'Active', route: 'Route B' },
    { id: 3, vehicle_no: 'DL-3A-9101', vehicle_type: 'Bus', make: 'TATA', model: 'LP 913', year: 2019, capacity: 50, fuel_type: 'Diesel', last_service: '2026-05-01', next_service: '2026-08-01', insurance_expiry: '2026-09-30', fitness_expiry: '2026-11-20', status: 'Maintenance', route: 'Route C' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. Student Management Overview
// ─────────────────────────────────────────────────────────────────────────────
export const StudentManagementOverview = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-students', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setStudents(data.data || MOCK_STUDENTS);
                else setStudents(MOCK_STUDENTS);
            } catch {
                setStudents(MOCK_STUDENTS);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const totalStudents = students.length;
    const presentToday = Math.round(totalStudents * 0.92);
    const absentToday = totalStudents - presentToday;
    const pendingFees = students.filter(s => (s.total_fees_due || 0) > 0).length;
    const totalRevenue = students.reduce((sum, s) => sum + (s.total_fees_due || 0), 0);
    const avgAttendance = students.length > 0 ? (students.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0) / students.length).toFixed(1) : 0;

    const classes = [...new Set(students.map(s => s.class_name).filter(Boolean))];
    const filtered = students.filter(s => {
        const matchSearch = !searchTerm || s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.admission_no?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchClass = !filterClass || s.class_name === filterClass;
        return matchSearch && matchClass;
    });

    const statCards = [
        { label: 'Total Students', value: totalStudents, icon: '👩‍🎓', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
        { label: 'Present Today', value: presentToday, icon: '✅', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        { label: 'Absent Today', value: absentToday, icon: '❌', color: 'from-red-500 to-red-600', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        { label: 'Pending Fees (Students)', value: pendingFees, icon: '⏳', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        { label: 'Total Due Amount', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
        { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: '📊', color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-16">
            <div style={{ width: 40, height: 40, border: '4px solid #e0e7ff', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: 16, color: '#6b7280', fontWeight: 600 }}>Loading student data...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Student Management</h2>
                    <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Overview of all student statistics and records</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                {statCards.map((card, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 16, border: `1px solid #e5e7eb`, padding: '20px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 8, transition: 'box-shadow 0.2s', cursor: 'default' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)'}
                    >
                        <div style={{ fontSize: 28 }}>{card.icon}</div>
                        <div style={{ fontSize: 26, fontWeight: 900, color: '#111827' }}>{card.value}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Student Table */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>Student Directory</h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <input
                            type="text" placeholder="🔍 Search by name or Adm. No..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none', minWidth: 220 }}
                        />
                        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none' }}>
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                            {filtered.length} students
                        </span>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                {['Student', 'Class / Section', 'Contact', 'Attendance', 'Fee Dues', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                            <div>
                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{s.name}</p>
                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.admission_no}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ fontWeight: 700, color: '#4f46e5' }}>{s.class_name}</span>
                                        <span style={{ color: '#9ca3af', marginLeft: 4, fontSize: 12 }}>Sec {s.section}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <p style={{ color: '#374151', fontSize: 13, margin: 0 }}>{s.phone || '—'}</p>
                                        <p style={{ color: '#9ca3af', fontSize: 11, margin: 0 }}>{s.email}</p>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 60, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ width: `${s.attendance_percentage || 0}%`, height: '100%', background: (s.attendance_percentage || 0) >= 90 ? '#10b981' : (s.attendance_percentage || 0) >= 75 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{s.attendance_percentage || 0}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: (s.total_fees_due || 0) > 0 ? '#fef2f2' : '#f0fdf4', color: (s.total_fees_due || 0) > 0 ? '#dc2626' : '#16a34a', border: `1px solid ${(s.total_fees_due || 0) > 0 ? '#fecaca' : '#bbf7d0'}` }}>
                                            ₹{(s.total_fees_due || 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No students found matching your search.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Add New Student
// ─────────────────────────────────────────────────────────────────────────────
export const AddNewStudentView = () => {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', admissionNo: '', classId: '', section: '', rollNumber: '',
        dob: '', gender: '', bloodGroup: '', address: '',
        fatherName: '', motherName: '', parentPhone: '', parentEmail: '', parentOccupation: '',
        transportRoute: '', healthNotes: '', previousSchool: '', category: 'General'
    });

    const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...formData, roleName: 'Student' })
            });
            setSubmitted(true);
        } catch {
            setSubmitted(true); // demo mode
        }
    };

    const inputStyle = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };
    const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 };
    const sectionTitle = (icon, title) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #eef2ff' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1e1b4b', margin: 0 }}>{title}</h3>
        </div>
    );

    if (submitted) return (
        <div style={{ background: 'white', borderRadius: 20, padding: 60, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#059669', marginBottom: 8 }}>Student Added Successfully!</h2>
            <p style={{ color: '#6b7280', marginBottom: 30 }}>The student record has been created and saved to the system.</p>
            <button onClick={() => { setSubmitted(false); setStep(1); setFormData({ name: '', email: '', phone: '', password: '', admissionNo: '', classId: '', section: '', rollNumber: '', dob: '', gender: '', bloodGroup: '', address: '', fatherName: '', motherName: '', parentPhone: '', parentEmail: '', parentOccupation: '', transportRoute: '', healthNotes: '', previousSchool: '', category: 'General' }); }}
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Add Another Student
            </button>
        </div>
    );

    return (
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {/* Step Progress */}
            <div style={{ background: 'white', borderRadius: 16, padding: '20px 30px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 0 }}>
                {[{ n: 1, label: 'Basic Info' }, { n: 2, label: 'Academic' }, { n: 3, label: 'Parent Info' }, { n: 4, label: 'Other Details' }].map((s, i, arr) => (
                    <React.Fragment key={s.n}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: step >= s.n ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f3f4f6', color: step >= s.n ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, transition: 'all 0.3s' }}>
                                {step > s.n ? '✓' : s.n}
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: step >= s.n ? '#4f46e5' : '#9ca3af', whiteSpace: 'nowrap' }}>{s.label}</span>
                        </div>
                        {i < arr.length - 1 && <div style={{ flex: 1, height: 3, background: step > s.n ? '#6366f1' : '#e5e7eb', margin: '0 8px', marginTop: -18, transition: 'background 0.3s' }} />}
                    </React.Fragment>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                    {step === 1 && (
                        <>
                            {sectionTitle('👤', 'Basic Information')}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                <div><label style={labelStyle}>Full Name *</label><input required value={formData.name} onChange={e => update('name', e.target.value)} style={inputStyle} placeholder="e.g. Aarav Sharma" /></div>
                                <div><label style={labelStyle}>Email Address *</label><input required type="email" value={formData.email} onChange={e => update('email', e.target.value)} style={inputStyle} placeholder="student@school.in" /></div>
                                <div><label style={labelStyle}>Phone Number</label><input type="tel" value={formData.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} placeholder="+91 9876543210" /></div>
                                <div><label style={labelStyle}>Password *</label><input required type="password" value={formData.password} onChange={e => update('password', e.target.value)} style={inputStyle} placeholder="Set login password" /></div>
                                <div><label style={labelStyle}>Date of Birth</label><input type="date" value={formData.dob} onChange={e => update('dob', e.target.value)} style={inputStyle} /></div>
                                <div><label style={labelStyle}>Gender</label>
                                    <select value={formData.gender} onChange={e => update('gender', e.target.value)} style={inputStyle}>
                                        <option value="">Select Gender</option>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div><label style={labelStyle}>Blood Group</label>
                                    <select value={formData.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} style={inputStyle}>
                                        <option value="">Select Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div><label style={labelStyle}>Category</label>
                                    <select value={formData.category} onChange={e => update('category', e.target.value)} style={inputStyle}>
                                        {['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Address</label><textarea value={formData.address} onChange={e => update('address', e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Full residential address" /></div>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            {sectionTitle('📚', 'Academic Information')}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                <div><label style={labelStyle}>Admission Number *</label><input required value={formData.admissionNo} onChange={e => update('admissionNo', e.target.value)} style={inputStyle} placeholder="ADM-2024-001" /></div>
                                <div><label style={labelStyle}>Class ID *</label><input required type="number" value={formData.classId} onChange={e => update('classId', e.target.value)} style={inputStyle} placeholder="e.g. 10" /></div>
                                <div><label style={labelStyle}>Section</label>
                                    <select value={formData.section} onChange={e => update('section', e.target.value)} style={inputStyle}>
                                        <option value="">Select Section</option>
                                        {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div><label style={labelStyle}>Roll Number</label><input value={formData.rollNumber} onChange={e => update('rollNumber', e.target.value)} style={inputStyle} placeholder="e.g. 01" /></div>
                                <div><label style={labelStyle}>Previous School</label><input value={formData.previousSchool} onChange={e => update('previousSchool', e.target.value)} style={inputStyle} placeholder="Name of previous school" /></div>
                                <div><label style={labelStyle}>Transport Route</label>
                                    <select value={formData.transportRoute} onChange={e => update('transportRoute', e.target.value)} style={inputStyle}>
                                        <option value="">No Transport</option>
                                        {MOCK_BUS_ROUTES.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            {sectionTitle('👨‍👩‍👧', 'Parent / Guardian Information')}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                <div><label style={labelStyle}>Father's Name</label><input value={formData.fatherName} onChange={e => update('fatherName', e.target.value)} style={inputStyle} placeholder="Full Name" /></div>
                                <div><label style={labelStyle}>Mother's Name</label><input value={formData.motherName} onChange={e => update('motherName', e.target.value)} style={inputStyle} placeholder="Full Name" /></div>
                                <div><label style={labelStyle}>Parent Phone *</label><input required value={formData.parentPhone} onChange={e => update('parentPhone', e.target.value)} style={inputStyle} placeholder="+91 9876543210" /></div>
                                <div><label style={labelStyle}>Parent Email</label><input type="email" value={formData.parentEmail} onChange={e => update('parentEmail', e.target.value)} style={inputStyle} placeholder="parent@email.com" /></div>
                                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Parent's Occupation</label><input value={formData.parentOccupation} onChange={e => update('parentOccupation', e.target.value)} style={inputStyle} placeholder="e.g. Engineer, Businessman" /></div>
                            </div>
                        </>
                    )}
                    {step === 4 && (
                        <>
                            {sectionTitle('📋', 'Other Details')}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
                                <div><label style={labelStyle}>Health / Medical Notes</label><textarea value={formData.healthNotes} onChange={e => update('healthNotes', e.target.value)} style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="Any allergies, medical conditions, or special needs..." /></div>
                            </div>
                            <div style={{ marginTop: 20, padding: 20, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                                <h4 style={{ fontWeight: 700, color: '#15803d', marginBottom: 12 }}>📋 Review Summary</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                                    {[['Name', formData.name], ['Email', formData.email], ['Class', formData.classId], ['Admission No', formData.admissionNo], ['Father', formData.fatherName], ['Parent Phone', formData.parentPhone]].map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', gap: 6 }}>
                                            <span style={{ color: '#6b7280', minWidth: 90 }}>{k}:</span>
                                            <span style={{ fontWeight: 600, color: '#111827' }}>{v || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                    <button type="button" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                        style={{ padding: '11px 28px', borderRadius: 10, border: '1px solid #d1d5db', background: 'white', fontWeight: 700, fontSize: 14, cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.5 : 1 }}>
                        ← Previous
                    </button>
                    {step < 4 ? (
                        <button type="button" onClick={() => setStep(s => Math.min(4, s + 1))}
                            style={{ padding: '11px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                            Next →
                        </button>
                    ) : (
                        <button type="submit"
                            style={{ padding: '11px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                            ✅ Submit Student
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Attendance Section  (with sub-tabs)
// ─────────────────────────────────────────────────────────────────────────────
export const AttendanceSection = () => {
    const [subTab, setSubTab] = useState('daily');
    const tabs = [
        { key: 'daily', label: '📅 Daily Attendance' },
        { key: 'reports', label: '📊 Attendance Reports' },
        { key: 'monthly', label: '📆 Monthly Reports' },
        { key: 'leaves', label: '🏖️ Leave Requests' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Attendance Management</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Track, manage and report student attendance</p>
            </div>
            {/* Sub-tab bar */}
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 5, borderRadius: 12, flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setSubTab(t.key)}
                        style={{ padding: '9px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', background: subTab === t.key ? 'white' : 'transparent', color: subTab === t.key ? '#4f46e5' : '#6b7280', boxShadow: subTab === t.key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}>
                        {t.label}
                    </button>
                ))}
            </div>
            {subTab === 'daily' && <DailyAttendanceTab />}
            {subTab === 'reports' && <AttendanceReportsTab />}
            {subTab === 'monthly' && <MonthlyAttendanceTab />}
            {subTab === 'leaves' && <LeaveRequestsTab />}
        </div>
    );
};

const DailyAttendanceTab = () => {
    const [date, setDate] = useState(today);
    const [students] = useState(MOCK_STUDENTS);
    const [attendance, setAttendance] = useState(() => Object.fromEntries(MOCK_STUDENTS.map(s => [s.id, 'Present'])));
    const [saved, setSaved] = useState(false);

    const presentCount = Object.values(attendance).filter(v => v === 'Present').length;
    const absentCount = Object.values(attendance).filter(v => v === 'Absent').length;
    const lateCount = Object.values(attendance).filter(v => v === 'Late').length;

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

    return (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            {/* Top Bar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: '#f9fafb' }}>
                <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>Daily Attendance</h3>
                    <p style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Mark attendance for all students</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                        style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13 }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[['Present', '#10b981', '#f0fdf4', presentCount], ['Absent', '#ef4444', '#fef2f2', absentCount], ['Late', '#f59e0b', '#fffbeb', lateCount]].map(([s, c, bg, count]) => (
                            <div key={s} style={{ background: bg, border: `1px solid ${c}30`, borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: c }}>{s}: {count}</div>
                        ))}
                    </div>
                    <button onClick={handleSave}
                        style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        {saved ? '✅ Saved!' : '💾 Save Attendance'}
                    </button>
                </div>
            </div>
            {/* Mark all buttons */}
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center' }}>Mark all as:</span>
                {['Present', 'Absent', 'Late'].map(status => (
                    <button key={status} onClick={() => setAttendance(Object.fromEntries(students.map(s => [s.id, status])))}
                        style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #d1d5db', background: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: status === 'Present' ? '#059669' : status === 'Absent' ? '#dc2626' : '#d97706' }}>
                        {status}
                    </button>
                ))}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        {['#', 'Student', 'Class', 'Roll No', 'Status', 'Remarks'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, i) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '10px 14px', color: '#9ca3af', fontSize: 12 }}>{i + 1}</td>
                            <td style={{ padding: '10px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{s.name}</p>
                                        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.admission_no}</p>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '10px 14px', color: '#4f46e5', fontWeight: 600, fontSize: 13 }}>{s.class_name} - {s.section}</td>
                            <td style={{ padding: '10px 14px', color: '#374151', fontSize: 13 }}>{s.roll_number}</td>
                            <td style={{ padding: '10px 14px' }}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {['Present', 'Absent', 'Late'].map(status => (
                                        <button key={status} onClick={() => setAttendance(a => ({ ...a, [s.id]: status }))}
                                            style={{ padding: '4px 10px', borderRadius: 6, border: `2px solid ${attendance[s.id] === status ? (status === 'Present' ? '#10b981' : status === 'Absent' ? '#ef4444' : '#f59e0b') : '#e5e7eb'}`, background: attendance[s.id] === status ? (status === 'Present' ? '#10b981' : status === 'Absent' ? '#ef4444' : '#f59e0b') : 'white', color: attendance[s.id] === status ? 'white' : '#9ca3af', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                                            {status === 'Present' ? 'P' : status === 'Absent' ? 'A' : 'L'}
                                        </button>
                                    ))}
                                </div>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                                <input style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', fontSize: 12, width: 140, outline: 'none' }} placeholder="Optional note..." />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AttendanceReportsTab = () => {
    const [students] = useState(MOCK_STUDENTS);
    const [filterClass, setFilterClass] = useState('');
    const classes = [...new Set(students.map(s => s.class_name).filter(Boolean))];
    const filtered = filterClass ? students.filter(s => s.class_name === filterClass) : students;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                {[
                    { label: 'Overall Avg. Attendance', value: '90.4%', icon: '📊', color: '#4f46e5' },
                    { label: 'Perfect Attendance', value: '1', icon: '🏆', color: '#059669' },
                    { label: 'Below 75%', value: '1', icon: '⚠️', color: '#dc2626' },
                    { label: 'Leave Requests', value: '4', icon: '📝', color: '#d97706' },
                ].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Filter by Class:</span>
                <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13 }}>
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            {/* Table */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Student', 'Class', 'Present', 'Absent', 'Late', 'Attendance %', 'Grade'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(s => {
                            const pct = s.attendance_percentage || 0;
                            const grade = pct >= 95 ? 'A+' : pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 75 ? 'C' : 'F';
                            const gradeColor = pct >= 90 ? '#059669' : pct >= 75 ? '#d97706' : '#dc2626';
                            return (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                            <div>
                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{s.name}</p>
                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.admission_no}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#4f46e5', fontWeight: 600 }}>{s.class_name} {s.section}</td>
                                    <td style={{ padding: '12px 16px' }}><span style={{ color: '#059669', fontWeight: 700 }}>{s.present_days}</span></td>
                                    <td style={{ padding: '12px 16px' }}><span style={{ color: '#dc2626', fontWeight: 700 }}>{s.absent_days}</span></td>
                                    <td style={{ padding: '12px 16px' }}><span style={{ color: '#d97706', fontWeight: 700 }}>0</span></td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 70, height: 6, background: '#e5e7eb', borderRadius: 3 }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: pct >= 90 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{pct}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: 6, fontWeight: 800, fontSize: 13, color: gradeColor, background: `${gradeColor}15` }}>{grade}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MonthlyAttendanceTab = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [selMonth, setSelMonth] = useState(4); // May (0-indexed)
    const [selYear, setSelYear] = useState(2026);

    const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
    const firstDay = new Date(selYear, selMonth, 1).getDay();

    const calDays = [];
    for (let i = 0; i < firstDay; i++) calDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calDays.push(i);

    // Demo: randomly mark some days
    const presentDays = new Set([1,2,3,5,6,7,8,9,12,13,14,15,16,19,20,21,22,23,26,27,28,29,30]);
    const absentDays = new Set([4,11,18,25]);
    const holidayDays = new Set([10,17,24]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Month Selector */}
            <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => { if (selMonth === 0) { setSelMonth(11); setSelYear(y => y - 1); } else setSelMonth(m => m - 1); }}
                        style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>‹</button>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#1e1b4b', minWidth: 180, textAlign: 'center' }}>{months[selMonth]} {selYear}</h3>
                    <button onClick={() => { if (selMonth === 11) { setSelMonth(0); setSelYear(y => y + 1); } else setSelMonth(m => m + 1); }}
                        style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>›</button>
                </div>
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                    {[['🟢', 'Present', '#10b981'], ['🔴', 'Absent', '#ef4444'], ['🟡', 'Holiday', '#f59e0b'], ['⬜', 'Weekend', '#e5e7eb']].map(([icon, label, color]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                            <span style={{ width: 14, height: 14, borderRadius: 3, background: color, display: 'inline-block' }} />{label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Calendar Grid */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#9ca3af', padding: '6px 0' }}>{d}</div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {calDays.map((day, i) => {
                        if (!day) return <div key={i} />;
                        const isWeekend = (i % 7 === 0 || i % 7 === 6);
                        const isPresent = presentDays.has(day) && !isWeekend;
                        const isAbsent = absentDays.has(day) && !isWeekend;
                        const isHoliday = holidayDays.has(day);
                        const bg = isHoliday ? '#fffbeb' : isPresent ? '#f0fdf4' : isAbsent ? '#fef2f2' : isWeekend ? '#f9fafb' : '#f9fafb';
                        const color = isHoliday ? '#d97706' : isPresent ? '#059669' : isAbsent ? '#dc2626' : '#9ca3af';
                        const border = isHoliday ? '#fde68a' : isPresent ? '#bbf7d0' : isAbsent ? '#fecaca' : '#f3f4f6';
                        return (
                            <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '10px 6px', textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, color, fontSize: 14 }}>{day}</div>
                                {isPresent && <div style={{ fontSize: 9, color: '#059669', fontWeight: 700, marginTop: 2 }}>P</div>}
                                {isAbsent && <div style={{ fontSize: 9, color: '#dc2626', fontWeight: 700, marginTop: 2 }}>A</div>}
                                {isHoliday && <div style={{ fontSize: 9, color: '#d97706', fontWeight: 700, marginTop: 2 }}>HOL</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Monthly Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
                {[
                    { label: 'Working Days', value: 22, color: '#4f46e5' },
                    { label: 'Present Days', value: 21, color: '#059669' },
                    { label: 'Absent Days', value: 1, color: '#dc2626' },
                    { label: 'Holidays', value: 3, color: '#d97706' },
                    { label: 'Avg Attendance', value: '90.4%', color: '#06b6d4' },
                ].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LeaveRequestsTab = () => {
    const [requests, setRequests] = useState(MOCK_LEAVE_REQUESTS);
    const [filterStatus, setFilterStatus] = useState('');

    const handleAction = (id, action) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    };

    const filtered = filterStatus ? requests.filter(r => r.status === filterStatus) : requests;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
                {[
                    { label: 'Total Requests', value: requests.length, color: '#4f46e5' },
                    { label: 'Pending', value: requests.filter(r => r.status === 'Pending').length, color: '#d97706' },
                    { label: 'Approved', value: requests.filter(r => r.status === 'Approved').length, color: '#059669' },
                    { label: 'Rejected', value: requests.filter(r => r.status === 'Rejected').length, color: '#dc2626' },
                ].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Filter:</span>
                {['', 'Pending', 'Approved', 'Rejected'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        style={{ padding: '6px 14px', borderRadius: 8, border: `2px solid ${filterStatus === s ? '#6366f1' : '#e5e7eb'}`, background: filterStatus === s ? '#eef2ff' : 'white', color: filterStatus === s ? '#4f46e5' : '#6b7280', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                        {s || 'All'}
                    </button>
                ))}
            </div>
            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(r => {
                    const statusColor = r.status === 'Approved' ? '#059669' : r.status === 'Rejected' ? '#dc2626' : '#d97706';
                    const statusBg = r.status === 'Approved' ? '#f0fdf4' : r.status === 'Rejected' ? '#fef2f2' : '#fffbeb';
                    return (
                        <div key={r.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${r.student_name}`} alt="" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #e0e7ff', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                                    <span style={{ fontWeight: 800, color: '#111827', fontSize: 15 }}>{r.student_name}</span>
                                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{r.admission_no} • {r.class_name} - {r.section}</span>
                                    <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: statusBg, color: statusColor }}>{r.status}</span>
                                </div>
                                <p style={{ margin: '0 0 6px', color: '#374151', fontSize: 13 }}>
                                    <strong>📅 Leave Period:</strong> {new Date(r.from_date).toLocaleDateString()} → {new Date(r.to_date).toLocaleDateString()}
                                    &nbsp;&nbsp;<strong>Reason:</strong> {r.reason}
                                </p>
                                <p style={{ margin: 0, color: '#9ca3af', fontSize: 11 }}>Applied on: {new Date(r.applied_on).toLocaleDateString()}</p>
                            </div>
                            {r.status === 'Pending' && (
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button onClick={() => handleAction(r.id, 'Approved')}
                                        style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✓ Approve</button>
                                    <button onClick={() => handleAction(r.id, 'Rejected')}
                                        style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#dc2626', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✗ Reject</button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div style={{ background: 'white', borderRadius: 14, padding: 40, textAlign: 'center', color: '#9ca3af', border: '1px solid #e5e7eb' }}>
                        No leave requests found.
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Academics Section (with sub-tabs)
// ─────────────────────────────────────────────────────────────────────────────
export const AcademicsSection = () => {
    const [subTab, setSubTab] = useState('exams');
    const tabs = [
        { key: 'exams', label: '📋 Exam Schedules' },
        { key: 'results', label: '🏅 Results' },
        { key: 'reportcards', label: '📄 Report Cards' },
        { key: 'marks', label: '📝 Marks Reports' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Academics Management</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Manage exam schedules, results, report cards and marks</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 5, borderRadius: 12, flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setSubTab(t.key)}
                        style={{ padding: '9px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', background: subTab === t.key ? 'white' : 'transparent', color: subTab === t.key ? '#4f46e5' : '#6b7280', boxShadow: subTab === t.key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}>
                        {t.label}
                    </button>
                ))}
            </div>
            {subTab === 'exams' && <ExamSchedulesTab />}
            {subTab === 'results' && <ResultsTab />}
            {subTab === 'reportcards' && <ReportCardsTab />}
            {subTab === 'marks' && <MarksReportsTab />}
        </div>
    );
};

const ExamSchedulesTab = () => {
    const [schedules, setSchedules] = useState(MOCK_EXAM_SCHEDULES);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ exam_name: '', subject: '', class_name: '', date: '', time: '', duration: '3 Hours', max_marks: 100, exam_hall: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        setSchedules(prev => [...prev, { ...form, id: Date.now() }]);
        setShowModal(false);
        setForm({ exam_name: '', subject: '', class_name: '', date: '', time: '', duration: '3 Hours', max_marks: 100, exam_hall: '' });
    };

    const subjectColors = { Mathematics: '#4f46e5', Science: '#059669', English: '#dc2626', Hindi: '#d97706', 'Social Studies': '#7c3aed' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>Upcoming Exams ({schedules.length})</h3>
                <button onClick={() => setShowModal(true)}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ＋ Add Exam
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {schedules.map(s => {
                    const color = subjectColors[s.subject] || '#6b7280';
                    const examDate = new Date(s.date);
                    const isPast = examDate < new Date();
                    return (
                        <div key={s.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            <div style={{ background: `${color}15`, borderBottom: `2px solid ${color}30`, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.subject}</span>
                                    <h4 style={{ margin: '2px 0 0', fontWeight: 800, color: '#111827', fontSize: 15 }}>{s.exam_name}</h4>
                                </div>
                                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: isPast ? '#f9fafb' : '#eef2ff', color: isPast ? '#9ca3af' : '#4f46e5' }}>
                                    {isPast ? 'Completed' : 'Upcoming'}
                                </span>
                            </div>
                            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    ['🏫', 'Class', s.class_name],
                                    ['📅', 'Date', new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                                    ['⏰', 'Time', `${s.time} • ${s.duration}`],
                                    ['🏛️', 'Hall', s.exam_hall],
                                    ['📊', 'Max Marks', s.max_marks],
                                ].map(([icon, label, value]) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                                        <span>{icon}</span>
                                        <span style={{ color: '#9ca3af', minWidth: 70 }}>{label}:</span>
                                        <span style={{ fontWeight: 600, color: '#374151' }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
                    <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 520, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#111827' }}>📋 Add Exam Schedule</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                        </div>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[['Exam Name', 'exam_name', 'text', 'e.g. Unit Test 1'], ['Subject', 'subject', 'text', 'e.g. Mathematics'], ['Class', 'class_name', 'text', 'e.g. Class 10'], ['Date', 'date', 'date', ''], ['Time', 'time', 'time', ''], ['Exam Hall', 'exam_hall', 'text', 'e.g. Hall A']].map(([label, field, type, placeholder]) => (
                                <div key={field}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                                    <input required type={type} placeholder={placeholder} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                        style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, boxSizing: 'border-box' }} />
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: 11, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Add Exam</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ResultsTab = () => {
    const [students] = useState(MOCK_STUDENTS);
    const [filterClass, setFilterClass] = useState('');
    const classes = [...new Set(students.map(s => s.class_name).filter(Boolean))];
    const filtered = filterClass ? students.filter(s => s.class_name === filterClass) : students;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                    style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
                    <option value="">All Classes</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span style={{ padding: '6px 14px', borderRadius: 8, background: '#eef2ff', color: '#4f46e5', fontSize: 13, fontWeight: 700 }}>{filtered.length} students</span>
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Student', 'Class', 'Math', 'Science', 'English', 'Hindi', 'SST', 'Total', 'Percentage', 'Grade'].map(h => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(s => {
                            const subjects = [s.marks_math, s.marks_science, s.marks_english, s.marks_hindi, s.marks_sst];
                            const total = subjects.reduce((a, b) => a + (b || 0), 0);
                            const maxTotal = 500;
                            const pct = ((total / maxTotal) * 100).toFixed(1);
                            const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'F';
                            const gradeColor = pct >= 80 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626';
                            const markCell = (m) => (
                                <td style={{ padding: '12px 14px' }}>
                                    <span style={{ fontWeight: 700, color: (m || 0) >= 80 ? '#059669' : (m || 0) >= 60 ? '#d97706' : '#dc2626' }}>{m || '—'}</span>
                                </td>
                            );
                            return (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                            <div>
                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{s.name}</p>
                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.admission_no}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#4f46e5', fontWeight: 600 }}>{s.class_name}</td>
                                    {subjects.map((m, i) => markCell(m))}
                                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#111827' }}>{total}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#374151' }}>{pct}%</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: 6, fontWeight: 800, fontSize: 13, color: gradeColor, background: `${gradeColor}15` }}>{grade}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ReportCardsTab = () => {
    const [students] = useState(MOCK_STUDENTS);
    const [selected, setSelected] = useState(null);

    if (selected) {
        const s = students.find(st => st.id === selected);
        const subjects = [
            { name: 'Mathematics', marks: s.marks_math, max: 100 },
            { name: 'Science', marks: s.marks_science, max: 100 },
            { name: 'English', marks: s.marks_english, max: 100 },
            { name: 'Hindi', marks: s.marks_hindi, max: 100 },
            { name: 'Social Studies', marks: s.marks_sst, max: 100 },
        ];
        const total = subjects.reduce((a, b) => a + (b.marks || 0), 0);
        const pct = ((total / 500) * 100).toFixed(1);
        const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : 'C';

        return (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer', marginBottom: 16, fontSize: 14 }}>← Back to list</button>
                <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #e5e7eb' }}>
                    {/* Header */}
                    <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '30px 32px', color: 'white', textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.8, marginBottom: 4, letterSpacing: '0.1em' }}>ACADEMIC REPORT CARD • 2025–26</div>
                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.4)', margin: '12px auto' }} />
                        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{s.name}</h2>
                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 13, opacity: 0.9 }}>
                            <span>Adm: {s.admission_no}</span>
                            <span>{s.class_name} - Sec {s.section}</span>
                            <span>Roll: {s.roll_number}</span>
                        </div>
                    </div>
                    {/* Body */}
                    <div style={{ padding: 32 }}>
                        {/* Subject Marks */}
                        <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16, fontSize: 15 }}>Subject-wise Performance</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                            {subjects.map((subj) => {
                                const pctS = ((subj.marks || 0) / subj.max * 100);
                                const col = pctS >= 80 ? '#059669' : pctS >= 60 ? '#d97706' : '#dc2626';
                                return (
                                    <div key={subj.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ minWidth: 130, fontSize: 13, fontWeight: 600, color: '#374151' }}>{subj.name}</span>
                                        <div style={{ flex: 1, height: 10, background: '#f3f4f6', borderRadius: 5 }}>
                                            <div style={{ width: `${pctS}%`, height: '100%', background: col, borderRadius: 5, transition: 'width 0.5s' }} />
                                        </div>
                                        <span style={{ minWidth: 50, textAlign: 'right', fontWeight: 700, color: col, fontSize: 14 }}>{subj.marks || 0}/{subj.max}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            {[['Total Marks', `${total}/500`, '#4f46e5'], ['Percentage', `${pct}%`, '#059669'], ['Grade', grade, '#7c3aed'],
                                ['Attendance', `${s.attendance_percentage}%`, '#d97706'], ['Present Days', s.present_days, '#06b6d4'], ['Absent Days', s.absent_days, '#ef4444']
                            ].map(([label, value, color]) => (
                                <div key={label} style={{ background: '#f9fafb', borderRadius: 12, padding: 16, textAlign: 'center', border: '1px solid #f3f4f6' }}>
                                    <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
                                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, fontWeight: 600 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 24, padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                            <p style={{ margin: 0, color: '#15803d', fontWeight: 600, fontSize: 13 }}>
                                🎓 Class Teacher's Remark: {pct >= 90 ? 'Excellent performance! Keep up the great work.' : pct >= 75 ? 'Good performance. Can improve with more effort.' : 'Needs improvement. Please focus more on studies.'}
                            </p>
                        </div>
                        <button onClick={() => window.print()} style={{ marginTop: 20, width: '100%', padding: 14, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                            🖨️ Print / Download Report Card
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>Select a student to view report card</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {students.map(s => {
                    const total = (s.marks_math || 0) + (s.marks_science || 0) + (s.marks_english || 0) + (s.marks_hindi || 0) + (s.marks_sst || 0);
                    const pct = ((total / 500) * 100).toFixed(1);
                    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : 'C';
                    return (
                        <button key={s.id} onClick={() => setSelected(s.id)}
                            style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: 20, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.12)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 42, height: 42, borderRadius: '50%' }} />
                                <div>
                                    <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 14 }}>{s.name}</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.class_name}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13, color: '#6b7280' }}>Score: <strong style={{ color: '#111827' }}>{pct}%</strong></span>
                                <span style={{ padding: '3px 10px', borderRadius: 6, fontWeight: 800, fontSize: 13, color: '#4f46e5', background: '#eef2ff' }}>Grade {grade}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const MarksReportsTab = () => {
    const [students] = useState(MOCK_STUDENTS);
    const subjectList = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'];
    const markKeys = ['marks_math', 'marks_science', 'marks_english', 'marks_hindi', 'marks_sst'];

    const subjectAvg = subjectList.map((subj, i) => {
        const avg = students.reduce((sum, s) => sum + (s[markKeys[i]] || 0), 0) / students.length;
        return { subject: subj, avg: avg.toFixed(1), key: markKeys[i] };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Class Average Cards */}
            <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 14 }}>Class Average by Subject</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                    {subjectAvg.map((sa, i) => {
                        const colors = ['#4f46e5', '#059669', '#dc2626', '#d97706', '#7c3aed'];
                        return (
                            <div key={sa.subject} style={{ background: 'white', borderRadius: 14, padding: '20px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                                <div style={{ fontSize: 32, fontWeight: 900, color: colors[i] }}>{sa.avg}</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginTop: 4 }}>{sa.subject}</div>
                                <div style={{ marginTop: 8, height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                                    <div style={{ width: `${sa.avg}%`, height: '100%', background: colors[i], borderRadius: 3 }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Performers */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>🏆 Top Performers</h3>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[...students].sort((a, b) => {
                        const totalA = (a.marks_math || 0) + (a.marks_science || 0) + (a.marks_english || 0) + (a.marks_hindi || 0) + (a.marks_sst || 0);
                        const totalB = (b.marks_math || 0) + (b.marks_science || 0) + (b.marks_english || 0) + (b.marks_hindi || 0) + (b.marks_sst || 0);
                        return totalB - totalA;
                    }).map((s, rank) => {
                        const total = (s.marks_math || 0) + (s.marks_science || 0) + (s.marks_english || 0) + (s.marks_hindi || 0) + (s.marks_sst || 0);
                        const pct = ((total / 500) * 100).toFixed(1);
                        const medals = ['🥇', '🥈', '🥉'];
                        return (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', borderRadius: 10, background: rank < 3 ? `rgba(79,70,229,${0.06 - rank * 0.01})` : '#fafafa', border: '1px solid #f3f4f6' }}>
                                <span style={{ fontSize: rank < 3 ? 24 : 16, minWidth: 30, textAlign: 'center' }}>{rank < 3 ? medals[rank] : `#${rank + 1}`}</span>
                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 14 }}>{s.name}</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.class_name} • {s.admission_no}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 800, color: '#4f46e5', margin: 0, fontSize: 15 }}>{total}/500</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{pct}%</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Transport Section (with sub-tabs)
// ─────────────────────────────────────────────────────────────────────────────
export const TransportSection = () => {
    const [subTab, setSubTab] = useState('routes');
    const tabs = [
        { key: 'routes', label: '🗺️ Bus Route Assignment' },
        { key: 'vehicles', label: '🚌 Vehicle Details' },
        { key: 'fees', label: '💳 Transport Fees' },
        { key: 'tracking', label: '📍 Live Tracking' },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Transport Management</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Manage bus routes, vehicles, transport fees and tracking</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 5, borderRadius: 12, flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setSubTab(t.key)}
                        style={{ padding: '9px 18px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', background: subTab === t.key ? 'white' : 'transparent', color: subTab === t.key ? '#4f46e5' : '#6b7280', boxShadow: subTab === t.key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}>
                        {t.label}
                    </button>
                ))}
            </div>
            {subTab === 'routes' && <BusRoutesTab />}
            {subTab === 'vehicles' && <VehicleDetailsTab />}
            {subTab === 'fees' && <TransportFeesTab />}
            {subTab === 'tracking' && <LiveTrackingTab />}
        </div>
    );
};

const BusRoutesTab = () => {
    const [routes] = useState(MOCK_BUS_ROUTES);
    const [selected, setSelected] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                {[
                    { label: 'Total Routes', value: routes.length, icon: '🗺️', color: '#4f46e5' },
                    { label: 'Total Students', value: routes.reduce((s, r) => s + r.students, 0), icon: '👩‍🎓', color: '#059669' },
                    { label: 'Total Capacity', value: routes.reduce((s, r) => s + r.capacity, 0), icon: '🚌', color: '#d97706' },
                    { label: 'Utilization', value: `${Math.round(routes.reduce((s, r) => s + r.students, 0) / routes.reduce((s, r) => s + r.capacity, 0) * 100)}%`, icon: '📊', color: '#7c3aed' },
                ].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '20px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                        <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>

            {/* Route Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {routes.map(r => {
                    const utilPct = Math.round((r.students / r.capacity) * 100);
                    const isExpanded = selected === r.id;
                    return (
                        <div key={r.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setSelected(isExpanded ? null : r.id)}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🚌</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: 15 }}>{r.route_name}</h4>
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>{r.stops}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, fontSize: 18, color: '#4f46e5' }}>{r.students}/{r.capacity}</div>
                                        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>Students</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, fontSize: 18, color: utilPct > 90 ? '#dc2626' : '#059669' }}>{utilPct}%</div>
                                        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>Capacity</div>
                                    </div>
                                    <span style={{ fontSize: 20, color: '#9ca3af', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▾</span>
                                </div>
                            </div>
                            {isExpanded && (
                                <div style={{ borderTop: '1px solid #f3f4f6', padding: '16px 22px', background: '#f9fafb' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                                        {[
                                            ['🧑‍✈️ Driver', r.driver],
                                            ['🚌 Vehicle No', r.vehicle_no],
                                            ['🕐 Departure', r.departure_time],
                                            ['🕑 Return', r.return_time],
                                            ['💰 Monthly Fee', `₹${r.fee_monthly}`],
                                        ].map(([label, value]) => (
                                            <div key={label} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
                                                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>{label}</div>
                                                <div style={{ fontWeight: 700, color: '#111827', marginTop: 4 }}>{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 5 }}>
                                            <span>Capacity utilization</span><span style={{ fontWeight: 700 }}>{utilPct}%</span>
                                        </div>
                                        <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4 }}>
                                            <div style={{ width: `${utilPct}%`, height: '100%', background: utilPct > 90 ? '#ef4444' : utilPct > 75 ? '#f59e0b' : '#10b981', borderRadius: 4, transition: 'width 0.5s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const VehicleDetailsTab = () => {
    const [vehicles] = useState(MOCK_VEHICLES);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                {[
                    { label: 'Total Vehicles', value: vehicles.length, color: '#4f46e5' },
                    { label: 'Active', value: vehicles.filter(v => v.status === 'Active').length, color: '#059669' },
                    { label: 'Maintenance', value: vehicles.filter(v => v.status === 'Maintenance').length, color: '#dc2626' },
                    { label: 'Total Capacity', value: vehicles.reduce((s, v) => s + v.capacity, 0), color: '#d97706' },
                ].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Vehicle', 'Make / Model', 'Capacity', 'Route', 'Last Service', 'Insurance Expiry', 'Status'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(v => {
                            const insurExpiry = new Date(v.insurance_expiry);
                            const daysToInsurExp = Math.ceil((insurExpiry - new Date()) / (1000 * 60 * 60 * 24));
                            const insColor = daysToInsurExp < 60 ? '#dc2626' : daysToInsurExp < 120 ? '#d97706' : '#059669';
                            return (
                                <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚌</div>
                                            <div>
                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{v.vehicle_no}</p>
                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{v.vehicle_type} • {v.year}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <p style={{ fontWeight: 600, color: '#374151', margin: 0 }}>{v.make} {v.model}</p>
                                        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{v.fuel_type}</p>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4f46e5' }}>{v.capacity}</td>
                                    <td style={{ padding: '14px 16px', color: '#374151', fontSize: 13 }}>{v.route}</td>
                                    <td style={{ padding: '14px 16px', color: '#374151', fontSize: 13 }}>{new Date(v.last_service).toLocaleDateString()}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontWeight: 700, color: insColor, fontSize: 13 }}>{new Date(v.insurance_expiry).toLocaleDateString()}</span>
                                        {daysToInsurExp < 60 && <p style={{ fontSize: 10, color: '#dc2626', margin: 0, fontWeight: 600 }}>⚠️ Expiring soon</p>}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: v.status === 'Active' ? '#f0fdf4' : '#fef2f2', color: v.status === 'Active' ? '#15803d' : '#dc2626', border: `1px solid ${v.status === 'Active' ? '#bbf7d0' : '#fecaca'}` }}>
                                            {v.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TransportFeesTab = () => {
    const [routes] = useState(MOCK_BUS_ROUTES);
    const [students] = useState(MOCK_STUDENTS);

    const transportStudents = students.map((s, i) => ({
        ...s,
        route: routes[i % routes.length],
        fee_status: i % 3 === 0 ? 'Paid' : i % 3 === 1 ? 'Pending' : 'Overdue',
        month: 'May 2026'
    }));

    const totalCollected = transportStudents.filter(s => s.fee_status === 'Paid').reduce((sum, s) => sum + (s.route?.fee_monthly || 0), 0);
    const totalPending = transportStudents.filter(s => s.fee_status !== 'Paid').reduce((sum, s) => sum + (s.route?.fee_monthly || 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                {[
                    { label: 'Paid Students', value: transportStudents.filter(s => s.fee_status === 'Paid').length, color: '#059669', icon: '✅' },
                    { label: 'Pending Students', value: transportStudents.filter(s => s.fee_status === 'Pending').length, color: '#d97706', icon: '⏳' },
                    { label: 'Overdue Students', value: transportStudents.filter(s => s.fee_status === 'Overdue').length, color: '#dc2626', icon: '🔴' },
                    { label: 'Collected (May)', value: `₹${totalCollected.toLocaleString()}`, color: '#4f46e5', icon: '💰' },
                    { label: 'Pending Amount', value: `₹${totalPending.toLocaleString()}`, color: '#ef4444', icon: '⚠️' },
                ].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{c.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>Transport Fee Records — May 2026</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Student', 'Class', 'Route', 'Monthly Fee', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transportStudents.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                        <div>
                                            <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{s.name}</p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.admission_no}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#4f46e5', fontWeight: 600 }}>{s.class_name}</td>
                                <td style={{ padding: '12px 16px', color: '#374151', fontSize: 13 }}>{s.route?.route_name}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111827' }}>₹{s.route?.fee_monthly?.toLocaleString()}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.fee_status === 'Paid' ? '#f0fdf4' : s.fee_status === 'Overdue' ? '#fef2f2' : '#fffbeb', color: s.fee_status === 'Paid' ? '#15803d' : s.fee_status === 'Overdue' ? '#dc2626' : '#d97706', border: `1px solid ${s.fee_status === 'Paid' ? '#bbf7d0' : s.fee_status === 'Overdue' ? '#fecaca' : '#fde68a'}` }}>
                                        {s.fee_status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    {s.fee_status !== 'Paid' && (
                                        <button style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: '#4f46e5', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                            Collect Fee
                                        </button>
                                    )}
                                    {s.fee_status === 'Paid' && <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const LiveTrackingTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {[
                { label: 'Buses En Route', value: 2, icon: '🚌', color: '#059669' },
                { label: 'At School', value: 1, icon: '🏫', color: '#4f46e5' },
                { label: 'Maintenance', value: 1, icon: '🔧', color: '#dc2626' },
                { label: 'On Time', value: 2, icon: '⏰', color: '#d97706' },
            ].map((c, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 14, padding: '20px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: c.color }}>{c.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{c.label}</div>
                </div>
            ))}
        </div>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
            <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>Live Bus Tracking</h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>Real-time GPS tracking will appear here once vehicles are equipped with tracking devices and the GPS API is connected.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_BUS_ROUTES.map((r, i) => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb', textAlign: 'left' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: i < 2 ? '#10b981' : '#f59e0b', boxShadow: `0 0 0 4px ${i < 2 ? '#d1fae5' : '#fef3c7'}`, animation: i < 2 ? 'pulse 2s infinite' : 'none' }} />
                        <span style={{ fontSize: 20 }}>🚌</span>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 14 }}>{r.route_name}</p>
                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{r.vehicle_no} • Driver: {r.driver}</p>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: i < 2 ? '#059669' : '#d97706', background: i < 2 ? '#f0fdf4' : '#fffbeb', padding: '4px 10px', borderRadius: 8 }}>
                            {i < 2 ? '🟢 En Route' : '🔧 Maintenance'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Mock Fee Data
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_FEE_STRUCTURES = [
    { id: 1, class_name: 'Class 10', academic_year: '2025-26', frequency: 'Quarterly', components: [{ name: 'Tuition Fee', amount: 8000 }, { name: 'Development Fee', amount: 1500 }, { name: 'Library Fee', amount: 500 }, { name: 'Sports Fee', amount: 400 }, { name: 'Lab Fee', amount: 600 }], total: 11000 },
    { id: 2, class_name: 'Class 9', academic_year: '2025-26', frequency: 'Quarterly', components: [{ name: 'Tuition Fee', amount: 7500 }, { name: 'Development Fee', amount: 1500 }, { name: 'Library Fee', amount: 500 }, { name: 'Sports Fee', amount: 400 }], total: 9900 },
    { id: 3, class_name: 'Class 8', academic_year: '2025-26', frequency: 'Quarterly', components: [{ name: 'Tuition Fee', amount: 7000 }, { name: 'Development Fee', amount: 1200 }, { name: 'Sports Fee', amount: 300 }], total: 8500 },
    { id: 4, class_name: 'Class 7', academic_year: '2025-26', frequency: 'Quarterly', components: [{ name: 'Tuition Fee', amount: 6500 }, { name: 'Development Fee', amount: 1000 }, { name: 'Sports Fee', amount: 300 }], total: 7800 },
];

const MOCK_FEE_RECORDS = [
    { id: 1, student_id: 1, student_name: 'Aarav Sharma', admission_no: 'ADM-2024-001', class_name: 'Class 10', section: 'A', amount: 11000, paid: 6500, due: 4500, due_date: '2026-04-30', status: 'Partial', installment: 'Q1 2026', last_paid_date: '2026-04-10' },
    { id: 2, student_id: 2, student_name: 'Priya Gupta', admission_no: 'ADM-2024-002', class_name: 'Class 10', section: 'B', amount: 11000, paid: 11000, due: 0, due_date: '2026-04-30', status: 'Paid', installment: 'Q1 2026', last_paid_date: '2026-04-05' },
    { id: 3, student_id: 3, student_name: 'Rohan Singh', admission_no: 'ADM-2024-003', class_name: 'Class 9', section: 'A', amount: 9900, paid: 900, due: 9000, due_date: '2026-03-31', status: 'Overdue', installment: 'Q1 2026', last_paid_date: '2026-03-01' },
    { id: 4, student_id: 4, student_name: 'Sneha Patel', admission_no: 'ADM-2024-004', class_name: 'Class 8', section: 'C', amount: 8500, paid: 6500, due: 2000, due_date: '2026-05-15', status: 'Partial', installment: 'Q1 2026', last_paid_date: '2026-04-20' },
    { id: 5, student_id: 5, student_name: 'Arjun Kumar', admission_no: 'ADM-2024-005', class_name: 'Class 7', section: 'A', amount: 7800, paid: 7800, due: 0, due_date: '2026-04-30', status: 'Paid', installment: 'Q1 2026', last_paid_date: '2026-04-15' },
];

const MOCK_RECEIPTS = [
    { id: 'RCP-2026-001', student_name: 'Aarav Sharma', admission_no: 'ADM-2024-001', class_name: 'Class 10', amount: 6500, date: '2026-04-10', mode: 'Online', installment: 'Q1 2026', components: [{ name: 'Tuition Fee', amount: 5500 }, { name: 'Library Fee', amount: 500 }, { name: 'Sports Fee', amount: 500 }] },
    { id: 'RCP-2026-002', student_name: 'Priya Gupta', admission_no: 'ADM-2024-002', class_name: 'Class 10', amount: 11000, date: '2026-04-05', mode: 'UPI', installment: 'Q1 2026', components: [{ name: 'Tuition Fee', amount: 8000 }, { name: 'Development Fee', amount: 1500 }, { name: 'Library Fee', amount: 500 }, { name: 'Sports Fee', amount: 400 }, { name: 'Lab Fee', amount: 600 }] },
    { id: 'RCP-2026-003', student_name: 'Rohan Singh', admission_no: 'ADM-2024-003', class_name: 'Class 9', amount: 900, date: '2026-03-01', mode: 'Cash', installment: 'Q1 2026', components: [{ name: 'Development Fee', amount: 900 }] },
    { id: 'RCP-2026-004', student_name: 'Sneha Patel', admission_no: 'ADM-2024-004', class_name: 'Class 8', amount: 6500, date: '2026-04-20', mode: 'Cheque', installment: 'Q1 2026', components: [{ name: 'Tuition Fee', amount: 5800 }, { name: 'Sports Fee', amount: 700 }] },
    { id: 'RCP-2026-005', student_name: 'Arjun Kumar', admission_no: 'ADM-2024-005', class_name: 'Class 7', amount: 7800, date: '2026-04-15', mode: 'Online', installment: 'Q1 2026', components: [{ name: 'Tuition Fee', amount: 6500 }, { name: 'Development Fee', amount: 1000 }, { name: 'Sports Fee', amount: 300 }] },
];

const MOCK_SCHOLARSHIPS = [
    { id: 1, name: 'Merit Scholarship', type: 'Academic', discount_type: 'Percentage', discount_value: 50, eligible_criteria: 'Above 90% in previous year', max_students: 5, assigned: 1, status: 'Active', assigned_students: ['Priya Gupta'] },
    { id: 2, name: 'Sports Excellence Award', type: 'Sports', discount_type: 'Fixed', discount_value: 3000, eligible_criteria: 'District level sports achievement', max_students: 3, assigned: 1, status: 'Active', assigned_students: ['Arjun Kumar'] },
    { id: 3, name: 'SC/ST Fee Waiver', type: 'Category', discount_type: 'Percentage', discount_value: 100, eligible_criteria: 'SC/ST category certificate required', max_students: 10, assigned: 0, status: 'Active', assigned_students: [] },
    { id: 4, name: 'Sibling Discount', type: 'Family', discount_type: 'Percentage', discount_value: 10, eligible_criteria: 'Two or more siblings studying in school', max_students: 20, assigned: 3, status: 'Active', assigned_students: [] },
    { id: 5, name: 'EWS Scholarship', type: 'Financial', discount_type: 'Percentage', discount_value: 75, eligible_criteria: 'Annual family income below ₹1 Lakh', max_students: 8, assigned: 2, status: 'Active', assigned_students: [] },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. Fees Section (main export with 4 sub-tabs)
// ─────────────────────────────────────────────────────────────────────────────
export const FeesSection = () => {
    const [subTab, setSubTab] = useState('structure');
    const tabs = [
        { key: 'structure', label: '🏗️ Fee Structure' },
        { key: 'pending', label: '⏳ Pending Fees' },
        { key: 'receipts', label: '🧾 Fee Receipts' },
        { key: 'scholarships', label: '🎓 Discounts & Scholarships' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>💳 Fees Management</h2>
                    <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Manage fee structures, track pending dues, generate receipts & handle scholarships</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[{ label: 'Total Collected', val: '₹32,700', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' }, { label: 'Total Pending', val: '₹15,500', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }, { label: 'Overdue', val: '₹9,000', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }].map((p, i) => (
                        <div key={i} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
                            <span style={{ fontSize: 15, fontWeight: 900, color: p.color, display: 'block' }}>{p.val}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, color: p.color, opacity: 0.8 }}>{p.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 5, borderRadius: 12, flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setSubTab(t.key)}
                        style={{ padding: '9px 20px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', background: subTab === t.key ? 'white' : 'transparent', color: subTab === t.key ? '#4f46e5' : '#6b7280', boxShadow: subTab === t.key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none' }}>
                        {t.label}
                    </button>
                ))}
            </div>
            {subTab === 'structure' && <FeeStructureTab />}
            {subTab === 'pending' && <PendingFeesTab />}
            {subTab === 'receipts' && <FeeReceiptsTab />}
            {subTab === 'scholarships' && <ScholarshipsTab />}
        </div>
    );
};

// ─── 6a. Fee Structure Create ───────────────────────────────────────────────
const FeeStructureTab = () => {
    const [structures, setStructures] = useState(MOCK_FEE_STRUCTURES);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [form, setForm] = useState({ class_name: '', academic_year: '2025-26', frequency: 'Quarterly', components: [{ name: 'Tuition Fee', amount: '' }] });

    const addComp = () => setForm(f => ({ ...f, components: [...f.components, { name: '', amount: '' }] }));
    const removeComp = idx => setForm(f => ({ ...f, components: f.components.filter((_, i) => i !== idx) }));
    const updateComp = (idx, field, val) => setForm(f => ({ ...f, components: f.components.map((c, i) => i === idx ? { ...c, [field]: val } : c) }));
    const formTotal = form.components.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const handleSubmit = e => {
        e.preventDefault();
        const entry = { ...form, id: editId || Date.now(), total: formTotal };
        setStructures(prev => editId ? prev.map(s => s.id === editId ? entry : s) : [...prev, entry]);
        setShowModal(false); setEditId(null);
        setForm({ class_name: '', academic_year: '2025-26', frequency: 'Quarterly', components: [{ name: 'Tuition Fee', amount: '' }] });
    };
    const openEdit = s => { setForm({ class_name: s.class_name, academic_year: s.academic_year, frequency: s.frequency, components: [...s.components] }); setEditId(s.id); setShowModal(true); };

    const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
    const lbl = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                    <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', margin: 0 }}>Fee Structure Management</h3>
                    <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 3 }}>Create and manage fee structures for each class</p>
                </div>
                <button onClick={() => { setEditId(null); setForm({ class_name: '', academic_year: '2025-26', frequency: 'Quarterly', components: [{ name: 'Tuition Fee', amount: '' }] }); setShowModal(true); }}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
                    ＋ Create Fee Structure
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {structures.map(s => {
                    const isExp = expandedId === s.id;
                    return (
                        <div key={s.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', padding: '18px 20px', borderBottom: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 900, fontSize: 16, color: '#1e1b4b', margin: 0 }}>{s.class_name}</h4>
                                        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 11, background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{s.academic_year}</span>
                                            <span style={{ fontSize: 11, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{s.frequency}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 20, fontWeight: 900, color: '#4f46e5' }}>₹{s.total.toLocaleString()}</div>
                                        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>per installment</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '14px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{s.components.length} components</span>
                                    <button onClick={() => setExpandedId(isExp ? null : s.id)} style={{ fontSize: 12, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>{isExp ? '▲ Hide' : '▼ Details'}</button>
                                </div>
                                {isExp && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                                        {s.components.map((c, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6' }}>
                                                <span style={{ fontSize: 13, color: '#374151' }}>{c.name}</span>
                                                <span style={{ fontWeight: 800, color: '#111827', fontSize: 13 }}>₹{c.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#eef2ff', borderRadius: 8, border: '1px solid #c7d2fe' }}>
                                            <span style={{ fontWeight: 800, color: '#4f46e5', fontSize: 13 }}>Total</span>
                                            <span style={{ fontWeight: 900, color: '#4f46e5', fontSize: 15 }}>₹{s.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => openEdit(s)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#374151' }}>✏️ Edit</button>
                                    <button onClick={() => setStructures(prev => prev.filter(x => x.id !== s.id))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#dc2626' }}>🗑 Delete</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <button onClick={() => { setEditId(null); setShowModal(true); }} style={{ background: '#fafafa', borderRadius: 16, border: '2px dashed #d1d5db', padding: '40px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#9ca3af' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#4f46e5'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af'; }}>
                    <span style={{ fontSize: 32 }}>＋</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Add Fee Structure</span>
                </button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
                    <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1e1b4b', margin: 0 }}>{editId ? '✏️ Edit' : '🏗️ Create'} Fee Structure</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={lbl}>Class Name *</label>
                                    <select required value={form.class_name} onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))} style={inp}>
                                        <option value="">Select Class</option>
                                        {['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={lbl}>Academic Year *</label>
                                    <select required value={form.academic_year} onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))} style={inp}>
                                        {['2024-25', '2025-26', '2026-27'].map(y => <option key={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={lbl}>Fee Frequency</label>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {['Monthly', 'Quarterly', 'Half-Yearly', 'Annually'].map(fr => (
                                            <button key={fr} type="button" onClick={() => setForm(prev => ({ ...prev, frequency: fr }))}
                                                style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `2px solid ${form.frequency === fr ? '#6366f1' : '#e5e7eb'}`, background: form.frequency === fr ? '#eef2ff' : 'white', color: form.frequency === fr ? '#4f46e5' : '#6b7280', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                                {fr}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <label style={{ ...lbl, marginBottom: 0 }}>Fee Components</label>
                                    <button type="button" onClick={addComp} style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '4px 12px', borderRadius: 6, cursor: 'pointer' }}>＋ Add</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {form.components.map((comp, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <input placeholder="Component name" value={comp.name} onChange={e => updateComp(idx, 'name', e.target.value)} required style={{ ...inp, flex: 2, width: 'auto' }} />
                                            <div style={{ position: 'relative', flex: 1 }}>
                                                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>₹</span>
                                                <input type="number" placeholder="Amount" value={comp.amount} onChange={e => updateComp(idx, 'amount', e.target.value)} required style={{ ...inp, width: 'auto', paddingLeft: 26 }} />
                                            </div>
                                            {form.components.length > 1 && (
                                                <button type="button" onClick={() => removeComp(idx)} style={{ width: 32, height: 36, borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>×</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 12, padding: '12px 16px', background: '#eef2ff', borderRadius: 10, border: '1px solid #c7d2fe', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 700, color: '#4f46e5' }}>Total per Installment</span>
                                    <span style={{ fontWeight: 900, color: '#4f46e5', fontSize: 16 }}>₹{formTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: 12, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>{editId ? '✅ Update' : '✅ Create'} Structure</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── 6b. Pending Fees Tracking ───────────────────────────────────────────────
const PendingFeesTab = () => {
    const [records, setRecords] = useState(MOCK_FEE_RECORDS);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCollectModal, setShowCollectModal] = useState(null);
    const [collectAmount, setCollectAmount] = useState('');
    const [collectMode, setCollectMode] = useState('Cash');

    const classes = [...new Set(records.map(r => r.class_name))];
    const filtered = records.filter(r => {
        if (filterStatus && r.status !== filterStatus) return false;
        if (filterClass && r.class_name !== filterClass) return false;
        if (searchTerm && !r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) && !r.admission_no.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });
    const totalDue = filtered.reduce((s, r) => s + r.due, 0);
    const overdueCount = filtered.filter(r => r.status === 'Overdue').length;

    const handleCollect = () => {
        if (!collectAmount) return;
        setRecords(prev => prev.map(r => {
            if (r.id !== showCollectModal.id) return r;
            const newPaid = r.paid + Number(collectAmount);
            const newDue = Math.max(0, r.amount - newPaid);
            return { ...r, paid: newPaid, due: newDue, status: newDue <= 0 ? 'Paid' : 'Partial', last_paid_date: new Date().toISOString().split('T')[0] };
        }));
        setShowCollectModal(null); setCollectAmount('');
    };

    const sc = s => s === 'Paid' ? { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' } : s === 'Overdue' ? { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' } : { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14 }}>
                {[
                    { label: 'Total Due Amount', value: `₹${totalDue.toLocaleString()}`, icon: '💰', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
                    { label: 'Overdue Students', value: filtered.filter(r => r.status === 'Overdue').length, icon: '🔴', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
                    { label: 'Partial Payment', value: filtered.filter(r => r.status === 'Partial').length, icon: '🟡', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                    { label: 'Fully Paid', value: filtered.filter(r => r.status === 'Paid').length, icon: '✅', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
                ].map((c, i) => (
                    <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: '18px 16px' }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: c.color, opacity: 0.7, marginTop: 3 }}>{c.label}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="🔍 Search student..." style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', minWidth: 200 }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Status</option><option>Paid</option><option>Partial</option><option>Overdue</option>
                </select>
                <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none' }}>
                    <option value="">All Classes</option>{classes.map(c => <option key={c}>{c}</option>)}
                </select>
                {(filterStatus || filterClass || searchTerm) && <button onClick={() => { setFilterStatus(''); setFilterClass(''); setSearchTerm(''); }} style={{ padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#6b7280' }}>✕ Clear</button>}
                <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{filtered.length} records</span>
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['Student', 'Class', 'Installment', 'Total', 'Paid', 'Due', 'Due Date', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => {
                            const s = sc(r.status);
                            const pct = Math.round((r.paid / r.amount) * 100);
                            return (
                                <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }} onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${r.student_name}`} alt="" style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #e0e7ff' }} />
                                            <div>
                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{r.student_name}</p>
                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{r.admission_no}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#4f46e5', fontWeight: 600, fontSize: 13 }}>{r.class_name} {r.section}</td>
                                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#374151' }}>{r.installment}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#111827' }}>₹{r.amount.toLocaleString()}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>₹{r.paid.toLocaleString()}</div>
                                        <div style={{ width: 60, height: 4, background: '#e5e7eb', borderRadius: 2, marginTop: 4 }}><div style={{ width: `${pct}%`, height: '100%', background: '#10b981', borderRadius: 2 }} /></div>
                                        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{pct}%</div>
                                    </td>
                                    <td style={{ padding: '12px 14px', fontWeight: 800, color: r.due > 0 ? '#dc2626' : '#059669', fontSize: 14 }}>₹{r.due.toLocaleString()}</td>
                                    <td style={{ padding: '12px 14px', fontSize: 12, color: r.status === 'Overdue' ? '#dc2626' : '#6b7280', fontWeight: r.status === 'Overdue' ? 700 : 400 }}>{new Date(r.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '12px 14px' }}><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{r.status}</span></td>
                                    <td style={{ padding: '12px 14px' }}>
                                        {r.status !== 'Paid' ? (
                                            <button onClick={() => { setShowCollectModal(r); setCollectAmount(''); }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>💳 Collect</button>
                                        ) : <span style={{ fontSize: 12, color: '#9ca3af' }}>—</span>}
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No fee records found.</td></tr>}
                    </tbody>
                </table>
            </div>
            {overdueCount > 0 && (
                <div style={{ background: 'linear-gradient(135deg, #fef2f2, #fff7ed)', borderRadius: 16, padding: '18px 24px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h4 style={{ fontWeight: 800, color: '#dc2626', margin: 0, fontSize: 15 }}>⚠️ {overdueCount} students have overdue fees</h4>
                        <p style={{ color: '#9ca3af', fontSize: 13, margin: '4px 0 0' }}>Send reminder notifications to parents.</p>
                    </div>
                    <button style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#dc2626', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>📲 Send Reminders</button>
                </div>
            )}

            {showCollectModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
                    <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', margin: 0 }}>💳 Collect Fee Payment</h3>
                            <button onClick={() => setShowCollectModal(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                        </div>
                        <div style={{ padding: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: 14, background: '#f9fafb', borderRadius: 12, border: '1px solid #f3f4f6' }}>
                                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${showCollectModal.student_name}`} alt="" style={{ width: 46, height: 46, borderRadius: '50%' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: 15 }}>{showCollectModal.student_name}</p>
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{showCollectModal.admission_no} • {showCollectModal.class_name}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 900, color: '#dc2626', margin: 0, fontSize: 18 }}>₹{showCollectModal.due.toLocaleString()}</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Outstanding</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase' }}>Amount to Collect (₹) *</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#6b7280', fontSize: 16 }}>₹</span>
                                        <input type="number" max={showCollectModal.due} value={collectAmount} onChange={e => setCollectAmount(e.target.value)} placeholder={`Max ₹${showCollectModal.due}`}
                                            style={{ width: '100%', border: '2px solid #d1d5db', borderRadius: 10, padding: '11px 14px 11px 32px', fontSize: 16, outline: 'none', boxSizing: 'border-box', fontWeight: 700 }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        {[showCollectModal.due, Math.floor(showCollectModal.due / 2)].filter(v => v > 0).map(amt => (
                                            <button key={amt} type="button" onClick={() => setCollectAmount(String(amt))}
                                                style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                                ₹{amt.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase' }}>Payment Mode</label>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {['Cash', 'UPI', 'Online', 'Cheque', 'DD'].map(m => (
                                            <button key={m} type="button" onClick={() => setCollectMode(m)}
                                                style={{ padding: '7px 14px', borderRadius: 8, border: `2px solid ${collectMode === m ? '#6366f1' : '#e5e7eb'}`, background: collectMode === m ? '#eef2ff' : 'white', color: collectMode === m ? '#4f46e5' : '#6b7280', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                                <button onClick={() => setShowCollectModal(null)} style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleCollect} disabled={!collectAmount}
                                    style={{ flex: 2, padding: 12, border: 'none', borderRadius: 10, background: collectAmount ? 'linear-gradient(135deg, #059669, #047857)' : '#d1d5db', color: 'white', fontWeight: 700, cursor: collectAmount ? 'pointer' : 'not-allowed', fontSize: 14 }}>
                                    ✅ Confirm Collection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── 6c. Fee Receipts Generate ───────────────────────────────────────────────
const FeeReceiptsTab = () => {
    const [receipts] = useState(MOCK_RECEIPTS);
    const [viewReceipt, setViewReceipt] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = receipts.filter(r => !searchTerm || r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const modeIcon = m => ({ Cash: '💵', UPI: '📱', Online: '🌐', Cheque: '📄', DD: '🏦' }[m] || '💳');
    const schoolName = (() => { try { return JSON.parse(localStorage.getItem('user'))?.schoolName || 'VidyaSetu School'; } catch { return 'VidyaSetu School'; } })();

    if (viewReceipt) {
        const r = viewReceipt;
        return (
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <button onClick={() => setViewReceipt(null)} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer', marginBottom: 16, fontSize: 14 }}>← Back to Receipts</button>
                <div style={{ background: 'white', borderRadius: 20, border: '2px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', padding: '28px 32px', color: 'white', textAlign: 'center' }}>
                        <div style={{ fontSize: 36, marginBottom: 4 }}>🏫</div>
                        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{schoolName}</h2>
                        <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Official Fee Receipt</p>
                    </div>
                    <div style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '12px 32px', display: 'flex', justifyContent: 'space-between' }}>
                        <div><span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Receipt No</span><p style={{ margin: '2px 0 0', fontWeight: 900, color: '#4f46e5', fontSize: 15 }}>{r.id}</p></div>
                        <div style={{ textAlign: 'right' }}><span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Date</span><p style={{ margin: '2px 0 0', fontWeight: 700, color: '#111827', fontSize: 14 }}>{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p></div>
                    </div>
                    <div style={{ padding: '24px 32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, padding: 20, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                            {[['Student Name', r.student_name], ['Admission No', r.admission_no], ['Class', r.class_name], ['Installment', r.installment], ['Payment Mode', `${modeIcon(r.mode)} ${r.mode}`], ['Date', new Date(r.date).toLocaleDateString('en-IN')]].map(([label, value]) => (
                                <div key={label}><p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p><p style={{ margin: '3px 0 0', fontWeight: 700, color: '#111827', fontSize: 14 }}>{value}</p></div>
                            ))}
                        </div>
                        <h4 style={{ fontWeight: 700, color: '#374151', marginBottom: 12, fontSize: 14 }}>Fee Breakdown</h4>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                <thead><tr style={{ background: '#f3f4f6' }}><th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Description</th><th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Amount</th></tr></thead>
                                <tbody>{r.components.map((c, i) => <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}><td style={{ padding: '10px 16px', color: '#374151' }}>{c.name}</td><td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>₹{c.amount.toLocaleString()}</td></tr>)}</tbody>
                                <tfoot><tr style={{ background: '#eef2ff', borderTop: '2px solid #c7d2fe' }}><td style={{ padding: '14px 16px', fontWeight: 900, color: '#1e1b4b', fontSize: 15 }}>Total Paid</td><td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 900, color: '#4f46e5', fontSize: 18 }}>₹{r.amount.toLocaleString()}</td></tr></tfoot>
                            </table>
                        </div>
                        <div style={{ marginTop: 16, padding: '12px 16px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                            <p style={{ margin: 0, fontSize: 12, color: '#15803d', fontWeight: 600 }}>✅ Computer-generated receipt — no physical signature required.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                            <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>🖨️ Print</button>
                            <button style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>📩 WhatsApp</button>
                            <button style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>📧 Email</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                {[{ label: 'Total Receipts', value: receipts.length, icon: '🧾', color: '#4f46e5' }, { label: 'Total Collected', value: `₹${receipts.reduce((s, r) => s + r.amount, 0).toLocaleString()}`, icon: '💰', color: '#059669' }, { label: 'This Month', value: receipts.filter(r => r.date.startsWith('2026-04')).length, icon: '📅', color: '#d97706' }].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 3 }}>{c.label}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="🔍 Search by student name or receipt ID..." style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 14px', fontSize: 13, outline: 'none', minWidth: 280 }} />
                <span style={{ marginLeft: 'auto', background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{filtered.length} receipts</span>
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead><tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>{['Receipt ID', 'Student', 'Class', 'Installment', 'Amount', 'Mode', 'Date', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }} onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <td style={{ padding: '12px 16px' }}><span style={{ fontWeight: 700, color: '#4f46e5', fontSize: 13 }}>{r.id}</span></td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${r.student_name}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                        <div><p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{r.student_name}</p><p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{r.admission_no}</p></div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#4f46e5', fontWeight: 600 }}>{r.class_name}</td>
                                <td style={{ padding: '12px 16px', fontSize: 12, color: '#374151' }}>{r.installment}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 800, color: '#059669', fontSize: 14 }}>₹{r.amount.toLocaleString()}</td>
                                <td style={{ padding: '12px 16px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 600, color: '#374151' }}>{modeIcon(r.mode)} {r.mode}</span></td>
                                <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={() => setViewReceipt(r)} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>👁 View</button>
                                        <button onClick={() => window.print()} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #e5e7eb', background: 'white', color: '#374151', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>🖨️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No receipts found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── 6d. Discounts & Scholarships ────────────────────────────────────────────
const ScholarshipsTab = () => {
    const [scholarships, setScholarships] = useState(MOCK_SCHOLARSHIPS);
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(null);
    const [assignSearch, setAssignSearch] = useState('');
    const [form, setForm] = useState({ name: '', type: 'Academic', discount_type: 'Percentage', discount_value: '', eligible_criteria: '', max_students: '', status: 'Active' });

    const handleCreate = e => {
        e.preventDefault();
        setScholarships(prev => [...prev, { ...form, id: Date.now(), discount_value: Number(form.discount_value), max_students: Number(form.max_students), assigned: 0, assigned_students: [] }]);
        setShowModal(false);
        setForm({ name: '', type: 'Academic', discount_type: 'Percentage', discount_value: '', eligible_criteria: '', max_students: '', status: 'Active' });
    };

    const typeColors = { Academic: { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' }, Sports: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' }, Category: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }, Family: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' }, Financial: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' } };
    const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
    const lbl = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                {[{ label: 'Total Schemes', value: scholarships.length, icon: '🎓', color: '#4f46e5' }, { label: 'Active Schemes', value: scholarships.filter(s => s.status === 'Active').length, icon: '✅', color: '#059669' }, { label: 'Students Benefited', value: scholarships.reduce((sum, s) => sum + s.assigned, 0), icon: '👩‍🎓', color: '#d97706' }].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 3 }}>{c.label}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ fontWeight: 800, fontSize: 17, color: '#111827', margin: 0 }}>Scholarship & Discount Schemes</h3>
                <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 8px rgba(109,40,217,0.3)' }}>
                    ＋ New Scholarship / Discount
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
                {scholarships.map(s => {
                    const tc = typeColors[s.type] || typeColors.Academic;
                    const fillPct = s.max_students > 0 ? Math.round((s.assigned / s.max_students) * 100) : 0;
                    return (
                        <div key={s.id} style={{ background: 'white', borderRadius: 16, border: `1px solid ${s.status === 'Active' ? '#e5e7eb' : '#f3f4f6'}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', opacity: s.status === 'Active' ? 1 : 0.6 }}>
                            <div style={{ background: `linear-gradient(135deg, ${tc.bg}, white)`, borderBottom: `1px solid ${tc.border}`, padding: '16px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <div>
                                        <h4 style={{ fontWeight: 900, fontSize: 15, color: '#111827', margin: 0 }}>{s.name}</h4>
                                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`, fontWeight: 700, marginTop: 4, display: 'inline-block' }}>{s.type}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 900, fontSize: 20, color: s.discount_type === 'Percentage' ? '#7c3aed' : '#059669' }}>{s.discount_type === 'Percentage' ? `${s.discount_value}%` : `₹${Number(s.discount_value).toLocaleString()}`}</div>
                                        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{s.discount_type} discount</div>
                                    </div>
                                </div>
                                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{s.eligible_criteria}</p>
                            </div>
                            <div style={{ padding: '14px 20px' }}>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 5 }}>
                                        <span>Seats filled</span><span style={{ fontWeight: 700 }}>{s.assigned} / {s.max_students}</span>
                                    </div>
                                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                                        <div style={{ width: `${fillPct}%`, height: '100%', background: fillPct >= 90 ? '#ef4444' : fillPct >= 70 ? '#f59e0b' : '#10b981', borderRadius: 4, transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => setShowAssignModal(s)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #c7d2fe', background: '#eef2ff', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#4f46e5' }}>👩‍🎓 Assign</button>
                                    <button onClick={() => setScholarships(prev => prev.map(x => x.id === s.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x))}
                                        style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${s.status === 'Active' ? '#fecaca' : '#bbf7d0'}`, background: s.status === 'Active' ? '#fef2f2' : '#f0fdf4', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: s.status === 'Active' ? '#dc2626' : '#059669' }}>
                                        {s.status === 'Active' ? '⏸ Deactivate' : '▶ Activate'}
                                    </button>
                                </div>
                                {s.assigned_students && s.assigned_students.length > 0 && (
                                    <div style={{ marginTop: 10, padding: '8px 12px', background: '#f9fafb', borderRadius: 8 }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase' }}>Assigned to:</p>
                                        {s.assigned_students.map(name => <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, margin: '2px 4px 2px 0', padding: '3px 8px', background: '#eef2ff', color: '#4f46e5', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>👤 {name}</span>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <button onClick={() => setShowModal(true)} style={{ background: '#fafafa', borderRadius: 16, border: '2px dashed #d1d5db', padding: '40px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#9ca3af' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af'; }}>
                    <span style={{ fontSize: 32 }}>🎓</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Add Scholarship</span>
                </button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
                    <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #f5f3ff, #faf5ff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1e1b4b', margin: 0 }}>🎓 Create Scholarship / Discount</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                        </div>
                        <form onSubmit={handleCreate} style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div><label style={lbl}>Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} placeholder="e.g. Merit Scholarship" /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div><label style={lbl}>Type</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>{['Academic','Sports','Category','Family','Financial','Other'].map(t => <option key={t}>{t}</option>)}</select></div>
                                <div><label style={lbl}>Max Students</label><input required type="number" min="1" value={form.max_students} onChange={e => setForm(f => ({ ...f, max_students: e.target.value }))} style={inp} placeholder="e.g. 10" /></div>
                            </div>
                            <div>
                                <label style={lbl}>Discount Type</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {['Percentage', 'Fixed'].map(dt => <button key={dt} type="button" onClick={() => setForm(f => ({ ...f, discount_type: dt }))} style={{ flex: 1, padding: '10px', borderRadius: 8, border: `2px solid ${form.discount_type === dt ? '#7c3aed' : '#e5e7eb'}`, background: form.discount_type === dt ? '#f5f3ff' : 'white', color: form.discount_type === dt ? '#7c3aed' : '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{dt === 'Percentage' ? '% Percentage' : '₹ Fixed Amount'}</button>)}
                                </div>
                            </div>
                            <div>
                                <label style={lbl}>Discount Value *</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#6b7280' }}>{form.discount_type === 'Percentage' ? '%' : '₹'}</span>
                                    <input required type="number" min="1" max={form.discount_type === 'Percentage' ? 100 : undefined} value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} style={{ ...inp, paddingLeft: 32 }} placeholder={form.discount_type === 'Percentage' ? 'e.g. 50' : 'e.g. 5000'} />
                                </div>
                            </div>
                            <div><label style={lbl}>Eligibility Criteria</label><textarea value={form.eligible_criteria} onChange={e => setForm(f => ({ ...f, eligible_criteria: e.target.value }))} style={{ ...inp, minHeight: 70, resize: 'vertical' }} placeholder="e.g. Score above 90% in exams" /></div>
                            <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: 12, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>✅ Create Scholarship</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAssignModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
                    <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
                            <div><h3 style={{ fontWeight: 800, fontSize: 16, color: '#111827', margin: 0 }}>Assign Student</h3><p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0' }}>{showAssignModal.name}</p></div>
                            <button onClick={() => { setShowAssignModal(null); setAssignSearch(''); }} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                        </div>
                        <div style={{ padding: 24 }}>
                            <input value={assignSearch} onChange={e => setAssignSearch(e.target.value)} placeholder="🔍 Search student..." style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                                {MOCK_STUDENTS.filter(s => !assignSearch || s.name.toLowerCase().includes(assignSearch.toLowerCase())).map(s => {
                                    const assigned = showAssignModal.assigned_students?.includes(s.name);
                                    return (
                                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `1px solid ${assigned ? '#bbf7d0' : '#e5e7eb'}`, background: assigned ? '#f0fdf4' : 'white' }}>
                                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 13 }}>{s.name}</p>
                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{s.class_name} • {s.admission_no}</p>
                                            </div>
                                            {assigned ? <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>✓ Assigned</span> : (
                                                <button onClick={() => {
                                                    setScholarships(prev => prev.map(sc => sc.id === showAssignModal.id ? { ...sc, assigned: sc.assigned + 1, assigned_students: [...(sc.assigned_students || []), s.name] } : sc));
                                                    setShowAssignModal(prev => ({ ...prev, assigned_students: [...(prev.assigned_students || []), s.name] }));
                                                }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#4f46e5', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Assign</button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <button onClick={() => { setShowAssignModal(null); setAssignSearch(''); }} style={{ width: '100%', marginTop: 16, padding: 12, border: '1px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
