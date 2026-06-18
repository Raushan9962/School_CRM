import React, { useState } from 'react';

const ClassManagement = () => {
    const [selectedClass, setSelectedClass] = useState(null);

    const classes = [
        { id: 1, name: 'Class 10 - A', subject: 'Science', strength: 45, schedule: 'Mon, Wed, Fri - 08:30 AM' },
        { id: 2, name: 'Class 10 - B', subject: 'Science', strength: 42, schedule: 'Tue, Thu - 10:15 AM' },
        { id: 3, name: 'Class 9 - A', subject: 'Physics', strength: 38, schedule: 'Mon, Wed - 11:00 AM' },
        { id: 4, name: 'Class 9 - B', subject: 'Physics', strength: 40, schedule: 'Tue, Fri - 01:30 PM' }
    ];

    const students = [
        { id: '10A01', name: 'Aarav Patel', rollNo: 1, attendance: '92%', grade: 'A' },
        { id: '10A02', name: 'Diya Sharma', rollNo: 2, attendance: '88%', grade: 'B+' },
        { id: '10A03', name: 'Rohan Gupta', rollNo: 3, attendance: '95%', grade: 'A+' },
        { id: '10A04', name: 'Ishaan Singh', rollNo: 4, attendance: '78%', grade: 'B' },
        { id: '10A05', name: 'Kavya Verma', rollNo: 5, attendance: '98%', grade: 'A+' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Class Management</h2>
            </div>

            {!selectedClass ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {classes.map(cls => (
                        <div key={cls.id} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{cls.name}</h3>
                                <span style={{ padding: '4px 12px', background: '#eff6ff', color: '#3b82f6', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{cls.subject}</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '14px' }}>
                                    <span>👥 Class Strength</span>
                                    <span style={{ fontWeight: '500', color: '#0f172a' }}>{cls.strength} Students</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '14px' }}>
                                    <span>⏰ Schedule</span>
                                    <span style={{ fontWeight: '500', color: '#0f172a' }}>{cls.schedule}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button onClick={() => setSelectedClass(cls)} style={{ flex: 1, padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}>
                                    View Student List
                                </button>
                                <button style={{ flex: 1, padding: '10px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                    Manage Activities
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setSelectedClass(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                            ← Back to Classes
                        </button>
                        <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>{selectedClass.name} - Student List</h3>
                    </div>

                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Roll No</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student Name</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student ID</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Attendance</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Grade</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{student.rollNo}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{student.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{student.id}</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#10b981', fontWeight: '500' }}>{student.attendance}</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{student.grade}</td>
                                            <td style={{ padding: '16px' }}>
                                                <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>View Profile</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
