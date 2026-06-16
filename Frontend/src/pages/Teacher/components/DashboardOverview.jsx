import React from 'react';

const DashboardOverview = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Total Students</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>142</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Across 4 classes</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Classes Today</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>5</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Next: Grade 10 Math at 11:00 AM</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Pending Grading</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>28</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Assignments to review</p>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Upcoming Meetings & Events</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>👨‍🏫</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Staff Meeting</p>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Today, 3:00 PM - Principal's Office</span>
                        </div>
                    </li>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>👨‍👩‍👧</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Parent-Teacher Conference</p>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tomorrow, 4:00 PM - 6:00 PM</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardOverview;
