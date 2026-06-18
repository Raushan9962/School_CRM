import React, { useState } from 'react';

const Notifications = () => {
    const [activeTab, setActiveTab] = useState('new');

    const pastNotifications = [
        { id: 1, title: 'Bus 04 Delayed', message: 'Bus 04 (North Route) is delayed by 15 mins due to traffic.', recipient: 'Students, Parents (Route: North City Circular)', date: '18-Jun-2026 07:15 AM' },
        { id: 2, title: 'Route 02 Maintenance', message: 'Bus B-02 will be under maintenance tomorrow. Substitute Van V-01 assigned.', recipient: 'Students, Parents (Route: South Avenue Express)', date: '17-Jun-2026 02:00 PM' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Transport Notifications</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['new', 'history'].map(tab => (
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
                        {tab === 'new' ? 'Send New Notification' : 'Notification History'}
                    </button>
                ))}
            </div>

            {activeTab === 'new' && (
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Recipients</label>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                    <input type="checkbox" /> All Transport Students
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                    <input type="checkbox" /> All Parents
                                </label>
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option value="">Or filter by specific Route...</option>
                                    <option value="RT-01">North City Circular (RT-01)</option>
                                    <option value="RT-02">South Avenue Express (RT-02)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Message Title</label>
                            <input type="text" placeholder="e.g. Bus 04 Delayed by 15 mins" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Message Content</label>
                            <textarea rows="5" placeholder="Type your notification message here..." style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                            📤 Send Notification
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pastNotifications.map(n => (
                        <div key={n.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{n.title}</h4>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>{n.date}</span>
                            </div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569' }}>{n.message}</p>
                            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>👥</span> Sent to: {n.recipient}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
