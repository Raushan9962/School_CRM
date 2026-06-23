import React, { useState } from 'react';

const TeacherCommunication = () => {
    const [activeTab, setActiveTab] = useState('announcements');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Communication</h2>
                {activeTab === 'announcements' && (
                    <button className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                        ➕ New Announcement
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['announcements', 'students', 'parents', 'principal'].map(tab => (
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
                        {tab === 'announcements' ? 'Announcements' : `Message ${tab}`}
                    </button>
                ))}
            </div>

            {activeTab === 'announcements' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Important</span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>2 hours ago</span>
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>Tomorrow's Physics Lab is Cancelled</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>Due to maintenance work in the lab, tomorrow's practical session for Class 10-A is cancelled. We will cover theoretical concepts in the regular classroom.</p>
                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>To: Class 10 - A</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab !== 'announcements' && (
                <div style={{ display: 'flex', gap: '24px', height: '600px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    {/* Contacts Sidebar */}
                    <div style={{ width: '300px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                            <input type="text" placeholder={`Search ${activeTab}...`} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {[1, 2, 3].map((_, idx) => (
                                <div key={idx} style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: idx === 0 ? '#f8fafc' : 'white', borderLeft: idx === 0 ? '4px solid #3b82f6' : '4px solid transparent' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>U</div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{activeTab === 'students' ? 'Aarav Patel' : activeTab === 'parents' ? 'Mr. Sharma (Diya\'s Father)' : 'Dr. R.K. Singh (Principal)'}</h4>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{idx === 0 ? 'Can you please review my assignment?' : 'Sure, we can meet tomorrow.'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>U</div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{activeTab === 'students' ? 'Aarav Patel' : activeTab === 'parents' ? 'Mr. Sharma (Diya\'s Father)' : 'Dr. R.K. Singh (Principal)'}</h3>
                                <p style={{ margin: 0, fontSize: '12px', color: '#10b981' }}>Online</p>
                            </div>
                        </div>

                        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
                            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 0', border: '1px solid #e2e8f0', maxWidth: '70%' }}>
                                <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>Hello, {activeTab === 'principal' ? 'Sir' : 'Teacher'}!</p>
                                <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>10:30 AM</span>
                            </div>
                            <div style={{ alignSelf: 'flex-end', background: '#3b82f6', padding: '12px 16px', borderRadius: '16px 16px 0 16px', maxWidth: '70%' }}>
                                <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>Yes, tell me. How can I help you?</p>
                                <span style={{ display: 'block', fontSize: '11px', color: '#bfdbfe', marginTop: '4px', textAlign: 'right' }}>10:32 AM</span>
                            </div>
                        </div>

                        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
                            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#f1f5f9', color: '#64748b', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📎</button>
                            <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: '10px 16px', borderRadius: '20px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#3b82f6', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherCommunication;
