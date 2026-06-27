import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Paperclip, Send, Bell, Users, User, ArrowLeft } from 'lucide-react';

const TeacherCommunication = () => {
    const [activeTab, setActiveTab] = useState('announcements');
    const [isComposing, setIsComposing] = useState(false);

    // Inline style objects mapping standard Tailwind
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: '600px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
    const btnSecondary = { padding: '8px 16px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

    const tabs = [
        { id: 'announcements', label: 'Announcements', icon: <Bell size={16} /> },
        { id: 'students', label: 'Students', icon: <Users size={16} /> },
        { id: 'parents', label: 'Parents', icon: <User size={16} /> },
        { id: 'principal', label: 'Principal', icon: <MessageSquare size={16} /> },
    ];

    if (isComposing) {
        return (
            <div style={containerStyle} className="animate-fade-in">
                <div style={headerStyle}>
                    <div>
                        <h2 style={titleStyle}>New Announcement</h2>
                        <p style={subTitleStyle}>Broadcast a message to your classes</p>
                    </div>
                    <button onClick={() => setIsComposing(false)} style={btnSecondary}>
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>
                
                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Target Audience</label>
                            <select style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}}>
                                <option>All My Classes</option>
                                <option>Class 10 - A</option>
                                <option>Class 9 - B</option>
                            </select>
                        </div>
                        <div>
                            <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Title / Subject</label>
                            <input type="text" placeholder="E.g., Lab cancelled tomorrow" style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} />
                        </div>
                        <div>
                            <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Message</label>
                            <textarea placeholder="Write your announcement here..." style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px', minHeight: '120px'}} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                            <button onClick={() => setIsComposing(false)} style={btnPrimary}>
                                Broadcast Announcement
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle} className="animate-fade-in">
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Communication Center</h2>
                    <p style={subTitleStyle}>Connect with students, parents, and staff</p>
                </div>
                {activeTab === 'announcements' && (
                    <button onClick={() => setIsComposing(true)} style={btnPrimary}>
                        <Plus size={16} /> New Announcement
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab.id ? '#1e293b' : 'white',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            border: activeTab === tab.id ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'announcements' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #fecaca', textTransform: 'uppercase' }}>Important</span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>2 hours ago</span>
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b', fontWeight: 'bold' }}>Tomorrow's Physics Lab is Cancelled</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>Due to maintenance work in the lab, tomorrow's practical session for Class 10-A is cancelled. We will cover theoretical concepts in the regular classroom.</p>
                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>To: Class 10 - A</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flex: 1, background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', minHeight: '500px' }}>
                    {/* Contacts Sidebar */}
                    <div style={{ width: '280px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                        <div style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px' }}>
                                <Search size={14} color="#94a3b8" />
                                <input type="text" placeholder={`Search ${activeTab}...`} style={{ border: 'none', outline: 'none', fontSize: '12px', width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {[1, 2, 3].map((_, idx) => (
                                <div key={idx} style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: idx === 0 ? 'white' : 'transparent', borderLeft: idx === 0 ? '3px solid #1e293b' : '3px solid transparent' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>U</div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>{activeTab === 'students' ? 'Aarav Patel' : activeTab === 'parents' ? 'Mr. Sharma (Diya\'s Father)' : 'Dr. R.K. Singh'}</h4>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{idx === 0 ? 'Can you please review my assignment?' : 'Sure, we can meet tomorrow.'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>U</div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: 'bold' }}>{activeTab === 'students' ? 'Aarav Patel' : activeTab === 'parents' ? 'Mr. Sharma (Diya\'s Father)' : 'Dr. R.K. Singh (Principal)'}</h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>Online</p>
                            </div>
                        </div>

                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
                            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '8px 8px 8px 0', border: '1px solid #e2e8f0', maxWidth: '70%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>Hello, {activeTab === 'principal' ? 'Sir' : 'Teacher'}!</p>
                                <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginTop: '6px', fontWeight: 'bold' }}>10:30 AM</span>
                            </div>
                            <div style={{ alignSelf: 'flex-end', background: '#1e293b', padding: '12px 16px', borderRadius: '8px 8px 0 8px', maxWidth: '70%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <p style={{ margin: 0, fontSize: '13px', color: 'white' }}>Yes, tell me. How can I help you?</p>
                                <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginTop: '6px', textAlign: 'right', fontWeight: 'bold' }}>10:32 AM</span>
                            </div>
                        </div>

                        <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paperclip size={16} /></button>
                            <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                            <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#1e293b', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                                <Send size={14} /> Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherCommunication;
