import React from 'react';

const DashboardOverview = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Attendance</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>92%</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>This Month</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Next Exam</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Mathematics</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>12th October 2026</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Pending Assignments</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>3</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Due this week</p>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Recent Notifications</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>📣</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>School closed tomorrow due to heavy rain</p>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>2 hours ago</span>
                        </div>
                    </li>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>🏆</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Annual Sports Meet next week!</p>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>1 day ago</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardOverview;
