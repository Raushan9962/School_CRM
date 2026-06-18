import React, { useState } from 'react';

const AttendanceManagement = () => {
    const [activeTab, setActiveTab] = useState('mark');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Attendance Management</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📥 Download Reports
                    </button>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        ✓ Save Attendance
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['mark', 'daily', 'monthly', 'subject', 'requests'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab ? '#10b981' : 'white',
                            color: activeTab === tab ? 'white' : '#64748b',
                            border: activeTab === tab ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'mark' ? 'Mark Attendance' : tab === 'requests' ? 'Correction Requests' : `${tab} View`}
                    </button>
                ))}
            </div>

            {activeTab === 'mark' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '200px' }}>
                            <option>Class 10 - A (Science)</option>
                            <option>Class 9 - B (Physics)</option>
                        </select>
                        <input type="date" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} defaultValue={new Date().toISOString().split('T')[0]} />
                        <button style={{ padding: '10px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Fetch Students</button>
                    </div>

                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Roll No</th>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student Name</th>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { roll: 1, name: 'Aarav Patel', status: 'Present' },
                                    { roll: 2, name: 'Diya Sharma', status: 'Absent' },
                                    { roll: 3, name: 'Rohan Gupta', status: 'Present' },
                                    { roll: 4, name: 'Ishaan Singh', status: 'Late' },
                                    { roll: 5, name: 'Kavya Verma', status: 'Present' }
                                ].map((student, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{student.roll}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{student.name}</td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {['Present', 'Absent', 'Late', 'Half Day'].map(status => (
                                                    <button key={status} style={{
                                                        padding: '6px 12px',
                                                        background: student.status === status ? (status === 'Present' ? '#10b981' : status === 'Absent' ? '#ef4444' : '#f59e0b') : '#f1f5f9',
                                                        color: student.status === status ? 'white' : '#64748b',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}>
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <input type="text" placeholder="Add remark..." style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', outline: 'none' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>Diya Sharma (Roll: 2) - Class 10 A</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Requested correction for 12-Oct-2026: Mark as Present (Was marked Absent by mistake)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Reject</button>
                            <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Approve</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholder for other tabs */}
            {['daily', 'monthly', 'subject'].includes(activeTab) && (
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Attendance View</h3>
                    <p style={{ margin: 0 }}>Detailed reports and analytics will be displayed here.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceManagement;
