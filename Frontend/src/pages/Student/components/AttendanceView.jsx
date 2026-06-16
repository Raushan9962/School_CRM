import React from 'react';

const AttendanceView = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#0f172a' }}>Attendance Record</h2>
            
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Total Days</p>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>120</p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Days Present</p>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>110</p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Days Absent</p>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>10</p>
                </div>
            </div>

            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Recent Absences</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '8px 0 0 8px' }}>Date</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Reason</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '0 8px 8px 0' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px' }}>10 Oct 2026</td>
                        <td style={{ padding: '16px' }}>Fever</td>
                        <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Excused</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px' }}>05 Sep 2026</td>
                        <td style={{ padding: '16px' }}>Family Event</td>
                        <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Unexcused</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceView;
