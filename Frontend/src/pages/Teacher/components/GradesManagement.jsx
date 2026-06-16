import React from 'react';

const GradesManagement = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Grades Management</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
                        <option>Grade 10 - Section A</option>
                        <option>Grade 10 - Section B</option>
                    </select>
                    <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
                        <option>Mid-Term Exam</option>
                        <option>Unit Test 1</option>
                    </select>
                </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '8px 0 0 8px' }}>Roll No</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Student Name</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Subject</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '0 8px 8px 0' }}>Marks (out of 100)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px', color: '#64748b' }}>101</td>
                        <td style={{ padding: '16px', fontWeight: '500', color: '#1e293b' }}>Alice Smith</td>
                        <td style={{ padding: '16px', color: '#64748b' }}>Mathematics</td>
                        <td style={{ padding: '16px' }}>
                            <input type="number" defaultValue={85} style={{ padding: '6px 12px', width: '80px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px', color: '#64748b' }}>102</td>
                        <td style={{ padding: '16px', fontWeight: '500', color: '#1e293b' }}>Bob Johnson</td>
                        <td style={{ padding: '16px', color: '#64748b' }}>Mathematics</td>
                        <td style={{ padding: '16px' }}>
                            <input type="number" defaultValue={92} style={{ padding: '6px 12px', width: '80px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ padding: '10px 24px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Grades</button>
            </div>
        </div>
    );
};

export default GradesManagement;
