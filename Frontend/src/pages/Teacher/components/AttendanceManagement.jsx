import React, { useState } from 'react';

const AttendanceManagement = () => {
    const [activeTab, setActiveTab] = useState('mark');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Attendance Management</h2>
                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📥 Download Reports
                    </button>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        ✓ Save Attendance
                    </button>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
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
                <div className="flex flex-col gap-6">
                    <div style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '200px' }}>
                            <option>Class 10 - A (Science)</option>
                            <option>Class 9 - B (Physics)</option>
                        </select>
                        <input type="date" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} defaultValue={new Date().toISOString().split('T')[0]} />
                        <button style={{ padding: '10px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Fetch Students</button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Roll No</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Student Name</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Remarks</th>
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
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{student.roll}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{student.name}</td>
                                        <td style={{ padding: '16px' }}>
                                            <div className="flex gap-2">
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
                <div className="flex flex-col gap-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>Diya Sharma (Roll: 2) - Class 10 A</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Requested correction for 12-Oct-2026: Mark as Present (Was marked Absent by mistake)</p>
                        </div>
                        <div className="flex gap-2">
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
