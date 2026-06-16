import React from 'react';

const AttendanceManagement = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Mark Attendance</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
                        <option>Grade 10 - Section A</option>
                        <option>Grade 10 - Section B</option>
                        <option>Grade 11 - Science</option>
                    </select>
                    <input type="date" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '8px 0 0 8px' }}>Roll No</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Student Name</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Status</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '0 8px 8px 0', textAlign: 'center' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px', color: '#64748b' }}>101</td>
                        <td style={{ padding: '16px', fontWeight: '500', color: '#1e293b' }}>Alice Smith</td>
                        <td style={{ padding: '16px' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>Present</span></td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}>P</button>
                            <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>A</button>
                        </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px', color: '#64748b' }}>102</td>
                        <td style={{ padding: '16px', fontWeight: '500', color: '#1e293b' }}>Bob Johnson</td>
                        <td style={{ padding: '16px' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>Absent</span></td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}>P</button>
                            <button style={{ padding: '6px 12px', background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', borderRadius: '6px', cursor: 'pointer' }}>A</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ padding: '10px 24px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Save Attendance</button>
            </div>
        </div>
    );
};

export default AttendanceManagement;
