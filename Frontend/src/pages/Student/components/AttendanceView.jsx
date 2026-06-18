import React from 'react';

const AttendanceView = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Attendance Record</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📥 Download Report
                    </button>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        ✍️ Correction Request
                    </button>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>📅 Total Days</p>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>120</p>
                </div>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #10b981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>✅ Days Present</p>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>110</p>
                </div>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #ef4444', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>❌ Days Absent</p>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>10</p>
                </div>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #8b5cf6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>📊 Percentage</p>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>91.6%</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Subject-wise Attendance</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { subject: 'Mathematics', present: 45, total: 48, percent: 93.7 },
                            { subject: 'Physics', present: 40, total: 42, percent: 95.2 },
                            { subject: 'Chemistry', present: 38, total: 42, percent: 90.4 },
                            { subject: 'English', present: 35, total: 40, percent: 87.5 },
                            { subject: 'Computer Science', present: 28, total: 30, percent: 93.3 },
                        ].map((sub, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ fontWeight: '500', color: '#334155' }}>{sub.subject}</span>
                                    <span style={{ color: '#64748b' }}>{sub.present}/{sub.total} ({sub.percent}%)</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${sub.percent}%`, background: sub.percent > 90 ? '#10b981' : (sub.percent > 75 ? '#3b82f6' : '#ef4444'), borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Recent History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { date: '25 Oct 2026', status: 'Present', type: 'present' },
                            { date: '24 Oct 2026', status: 'Present', type: 'present' },
                            { date: '23 Oct 2026', status: 'Absent', type: 'absent', reason: 'Fever' },
                            { date: '22 Oct 2026', status: 'Holiday', type: 'holiday', reason: 'Dussehra' },
                        ].map((record, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#334155' }}>{record.date}</p>
                                    {record.reason && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>{record.reason}</p>}
                                </div>
                                <span style={{ 
                                    padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                                    background: record.type === 'present' ? '#d1fae5' : (record.type === 'absent' ? '#fee2e2' : '#f1f5f9'),
                                    color: record.type === 'present' ? '#059669' : (record.type === 'absent' ? '#dc2626' : '#64748b')
                                }}>
                                    {record.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
