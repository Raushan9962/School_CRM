import React, { useState } from 'react';

const CommunicationView = () => {
    const [activeTab, setActiveTab] = useState('notices');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Communication Hub</h2>
                <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                    ✉️ Send Query to Admin
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '500px' }}>
                <div style={{ width: '280px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#1e293b' }}>
                        Categories
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => setActiveTab('notices')} style={{ padding: '16px', textAlign: 'left', background: activeTab === 'notices' ? '#eff6ff' : 'transparent', border: 'none', borderLeft: activeTab === 'notices' ? '4px solid #3b82f6' : '4px solid transparent', color: activeTab === 'notices' ? '#2563eb' : '#475569', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px' }}>📣</span> School Notices & Circulars
                        </button>
                        <button onClick={() => setActiveTab('events')} style={{ padding: '16px', textAlign: 'left', background: activeTab === 'events' ? '#eff6ff' : 'transparent', border: 'none', borderLeft: activeTab === 'events' ? '4px solid #3b82f6' : '4px solid transparent', color: activeTab === 'events' ? '#2563eb' : '#475569', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px' }}>🎭</span> Event Updates
                        </button>
                        <button onClick={() => setActiveTab('teachers')} style={{ padding: '16px', textAlign: 'left', background: activeTab === 'teachers' ? '#eff6ff' : 'transparent', border: 'none', borderLeft: activeTab === 'teachers' ? '4px solid #3b82f6' : '4px solid transparent', color: activeTab === 'teachers' ? '#2563eb' : '#475569', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px' }}>👨‍🏫</span> Teacher Messages / Chat
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {activeTab === 'notices' && (
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>Recent Notices & Circulars</h3>
                            {[
                                { title: 'Winter Vacation Announcement', date: '05 Dec 2026', sender: 'Principal Office', desc: 'The school will remain closed for winter vacation from 25th Dec to 5th Jan.', type: 'Notice' },
                                { title: 'Fee Submission Deadline', date: '01 Nov 2026', sender: 'Accounts Dept', desc: 'Please ensure all pending fees for the current term are submitted before 10th Nov.', type: 'Circular' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', padding: '2px 8px', background: item.type === 'Notice' ? '#fee2e2' : '#e0e7ff', color: item.type === 'Notice' ? '#dc2626' : '#4f46e5', borderRadius: '4px', fontWeight: '600' }}>{item.type}</span>
                                        <span style={{ fontSize: '12px', color: '#64748b' }}>{item.date}</span>
                                    </div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' }}>{item.title}</h4>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{item.desc}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>By: {item.sender}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>Upcoming Event Updates</h3>
                            {[
                                { title: 'Annual Science Exhibition', date: '20 Nov 2026', time: '09:00 AM', venue: 'School Auditorium', desc: 'All participants must submit their project reports by 15th Nov.' },
                                { title: 'Inter-School Football Match', date: '12 Nov 2026', time: '10:00 AM', venue: 'City Sports Ground', desc: 'The school team will be playing against St. Jude High School.' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', gap: '16px' }}>
                                    <div style={{ background: '#f1f5f9', minWidth: '60px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px', color: '#3b82f6', border: '1px solid #cbd5e1' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.date.split(' ')[1].toUpperCase()}</span>
                                        <span style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1' }}>{item.date.split(' ')[0]}</span>
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{item.title}</h4>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>⏰ {item.time} &nbsp;&nbsp; 📍 {item.venue}</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'teachers' && (
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div style={{ width: '250px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                    <input type="text" placeholder="Search teacher..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {[
                                        { name: 'Mr. Sharma (Physics)', lastMsg: 'Don\'t forget the assignment', time: '10:30 AM', unread: 1 },
                                        { name: 'Mrs. Gupta (Chemistry)', lastMsg: 'Yes, the syllabus is updated', time: 'Yesterday', unread: 0 },
                                        { name: 'Mr. Verma (Math)', lastMsg: 'See you in class', time: 'Mon', unread: 0 }
                                    ].map((t, idx) => (
                                        <div key={idx} style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', background: idx === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👨‍🏫</div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h5 style={{ margin: 0, fontSize: '14px', color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{t.name}</h5>
                                                    <span style={{ fontSize: '11px', color: t.unread ? '#3b82f6' : '#94a3b8', fontWeight: t.unread ? 'bold' : 'normal' }}>{t.time}</span>
                                                </div>
                                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{t.lastMsg}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                                <div style={{ padding: '16px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👨‍🏫</div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Mr. Sharma</h4>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#10b981' }}>Online</p>
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                                    <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 0', border: '1px solid #e2e8f0', maxWidth: '80%' }}>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>Hello Rahul, please make sure to submit the Physics practical file by tomorrow.</p>
                                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '4px', textAlign: 'right' }}>10:28 AM</span>
                                    </div>
                                    <div style={{ alignSelf: 'flex-end', background: '#3b82f6', padding: '12px 16px', borderRadius: '16px 16px 0 16px', maxWidth: '80%', color: 'white' }}>
                                        <p style={{ margin: 0, fontSize: '14px' }}>Yes sir, I have completed it. I will bring it tomorrow.</p>
                                        <span style={{ fontSize: '10px', color: '#bfdbfe', display: 'block', marginTop: '4px', textAlign: 'right' }}>10:30 AM ✓✓</span>
                                    </div>
                                    <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 0', border: '1px solid #e2e8f0', maxWidth: '80%' }}>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>Great. Don't forget the assignment questions as well.</p>
                                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '4px', textAlign: 'right' }}>10:30 AM</span>
                                    </div>
                                </div>
                                <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
                                    <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                                    <button style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#3b82f6', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px' }}>➤</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunicationView;
