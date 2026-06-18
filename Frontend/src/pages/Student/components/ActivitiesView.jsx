import React, { useState } from 'react';

const ActivitiesView = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Activities & Events</h2>
            </div>

            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <button onClick={() => setActiveTab('upcoming')} style={{ padding: '8px 16px', background: activeTab === 'upcoming' ? '#eff6ff' : 'transparent', color: activeTab === 'upcoming' ? '#2563eb' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    📅 Upcoming Events
                </button>
                <button onClick={() => setActiveTab('history')} style={{ padding: '8px 16px', background: activeTab === 'history' ? '#eff6ff' : 'transparent', color: activeTab === 'history' ? '#2563eb' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    🏆 Participation History
                </button>
            </div>

            {activeTab === 'upcoming' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {[
                        { title: 'Annual Science Exhibition', type: 'Competition', date: '20 Nov 2026', desc: 'Showcase your innovative science projects to the school and win exciting prizes.', bg: '#eff6ff', color: '#3b82f6', icon: '🔬' },
                        { title: 'Inter-House Sports Meet', type: 'Sports', date: '12 Dec 2026', desc: 'Participate in various track and field events and represent your house.', bg: '#ecfdf5', color: '#10b981', icon: '🏃‍♂️' },
                        { title: 'Robotics Workshop', type: 'Workshop', date: '05 Nov 2026', desc: 'A hands-on workshop on building and programming autonomous robots.', bg: '#fef3c7', color: '#d97706', icon: '🤖' },
                        { title: 'Debate Competition', type: 'Competition', date: '15 Nov 2026', desc: 'Theme: Impact of AI on modern education. Open for classes 9-12.', bg: '#f5f3ff', color: '#8b5cf6', icon: '🎙️' }
                    ].map((event, idx) => (
                        <div key={idx} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '120px', background: event.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative' }}>
                                {event.icon}
                                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', color: event.color, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{event.type}</span>
                            </div>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>{event.title}</h3>
                                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>📅 {event.date}</p>
                                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#475569', lineHeight: '1.5', flex: 1 }}>{event.desc}</p>
                                <button style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#2563eb'} onMouseLeave={e => e.target.style.background = '#3b82f6'}>
                                    Register Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '14px' }}>
                                <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Event Name</th>
                                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Type</th>
                                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date</th>
                                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Achievement/Role</th>
                                <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>Certificate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Inter-School Quiz', type: 'Competition', date: '15 Aug 2026', role: 'Winner (1st Prize) 🏆', doc: 'Yes' },
                                { name: 'Coding Bootcamp', type: 'Workshop', date: '10 Jul 2026', role: 'Participant', doc: 'Yes' },
                                { name: 'Tree Plantation Drive', type: 'Social Service', date: '05 Jun 2026', role: 'Volunteer', doc: 'No' }
                            ].map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: '#1e293b' }}>{row.name}</td>
                                    <td style={{ padding: '16px', color: '#64748b' }}>{row.type}</td>
                                    <td style={{ padding: '16px', color: '#64748b' }}>{row.date}</td>
                                    <td style={{ padding: '16px', color: '#334155', fontWeight: row.role.includes('Winner') ? 'bold' : 'normal' }}>{row.role}</td>
                                    <td style={{ padding: '16px' }}>
                                        {row.doc === 'Yes' ? (
                                            <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                ⬇️ Download
                                            </button>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActivitiesView;
