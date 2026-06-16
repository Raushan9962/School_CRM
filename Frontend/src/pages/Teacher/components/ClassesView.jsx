import React from 'react';

const ClassesView = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#0f172a' }}>My Classes Schedule</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #059669', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ padding: '4px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>09:00 AM - 10:00 AM</span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Room 101</span>
                    </div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Mathematics</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Grade 10 - Section A</p>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Take Attendance</button>
                    </div>
                </div>

                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #0284c7', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ padding: '4px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>10:15 AM - 11:15 AM</span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Room 102</span>
                    </div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Physics</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Grade 11 - Science</p>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button style={{ flex: 1, padding: '8px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Take Attendance</button>
                    </div>
                </div>

                <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #d97706', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>11:30 AM - 12:30 PM</span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Room 101</span>
                    </div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Mathematics</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Grade 10 - Section B</p>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button style={{ flex: 1, padding: '8px', background: '#d97706', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Take Attendance</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassesView;
