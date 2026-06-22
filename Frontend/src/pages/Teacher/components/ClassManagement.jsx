import React, { useState, useEffect } from 'react';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/principal/classes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.data) {
                    setClasses(json.data);
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleSelectClass = async (cls) => {
        setSelectedClass(cls);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/principal/students`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.data) {
                // Filter students by classId
                const filtered = json.data.filter(s => String(s.classId) === String(cls.id));
                setStudents(filtered);
            }
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Class Management</h2>
            </div>

            {loading ? (
                <div style={{ color: '#64748b' }}>Loading classes...</div>
            ) : !selectedClass ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                    {classes.map(cls => (
                        <div key={cls.id} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{cls.name} - Section {cls.section}</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '14px' }}>
                                    <span>📆 Created On</span>
                                    <span style={{ fontWeight: '500', color: '#0f172a' }}>{new Date(cls.created_at || new Date()).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button onClick={() => handleSelectClass(cls)} style={{ flex: 1, padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}>
                                    View Student List
                                </button>
                                <button style={{ flex: 1, padding: '10px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                    Manage Activities
                                </button>
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', background: 'white', padding: '24px', borderRadius: '16px' }}>
                            No classes found in the database.
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setSelectedClass(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                            ← Back to Classes
                        </button>
                        <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>{selectedClass.name} (Section {selectedClass.section}) - Student List</h3>
                    </div>

                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Roll No</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student Name</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Admission No</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Attendance</th>
                                        <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{student.rollNumber || 'N/A'}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                        {student.name ? student.name.charAt(0) : '?'}
                                                    </div>
                                                    <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{student.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{student.admissionNo}</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: student.attendance === 'N/A' ? '#64748b' : '#10b981', fontWeight: '500' }}>{student.attendance}</td>
                                            <td style={{ padding: '16px' }}>
                                                <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>View Profile</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>No students found in this class.</td>
                                        </tr>
                                    )}
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
