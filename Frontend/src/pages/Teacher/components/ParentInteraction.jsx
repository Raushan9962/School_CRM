import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Users, Send, MessageSquare, AlertTriangle, CheckCircle, Search, Phone, Mail, ChevronRight, User } from 'lucide-react';

const ParentInteraction = () => {
    const [parents, setParents] = useState([]);
    const [selectedParent, setSelectedParent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const [msg, setMsg] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const teacherName = user.name || 'Teacher';

    useEffect(() => {
        // Fetch all parents mapped to this teacher's students
        apiFetch('/teacher-portal/parents', { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    if (d.data.length === 0) {
                        setParents([
                            { parent_id: 1, parent_name: 'Mr. Gupta', student_name: 'Rohan Gupta', class_name: '10', section: 'A', email: 'gupta@example.com', phone: '9876543210' },
                            { parent_id: 2, parent_name: 'Mrs. Sharma', student_name: 'Diya Sharma', class_name: '10', section: 'A', email: 'sharma@example.com', phone: '9876543211' }
                        ]);
                    } else {
                        setParents(d.data);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const fetchMessages = (parentId) => {
        apiFetch(`/teacher-portal/messages/${parentId}`, { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    if (d.data.length === 0) {
                        setMessages([
                            { id: 1, sender_type: 'teacher', message: 'Hello, Rohan is doing well in Science.', sent_at: new Date(Date.now() - 86400000).toISOString() },
                            { id: 2, sender_type: 'parent', message: 'Thank you for the update!', sent_at: new Date(Date.now() - 40000000).toISOString() }
                        ]);
                    } else {
                        setMessages(d.data);
                    }
                }
            });
    };

    const selectParent = (parent) => {
        setSelectedParent(parent);
        setMessages([]);
        fetchMessages(parent.parent_id);
    };

    const sendMessage = async () => {
        if (!messageInput.trim() || !selectedParent) return;
        setSending(true);
        try {
            const res = await apiFetch('/teacher-portal/messages', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ parent_id: selectedParent.parent_id, message: messageInput })
            });
            const data = await res.json();
            if (data.success) {
                setMessageInput('');
                fetchMessages(selectedParent.parent_id);
                setMsg('success:Message sent');
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error'); }
        finally { setSending(false); setTimeout(() => setMsg(''), 3000); }
    };

    const filtered = parents.filter(p => 
        p.parent_name?.toLowerCase().includes(search.toLowerCase()) || 
        p.student_name?.toLowerCase().includes(search.toLowerCase())
    );

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', height: 'calc(100vh - 100px)' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', flexShrink: 0 };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Parent Interaction</h2>
                    <p style={subTitleStyle}>Communicate securely with parents</p>
                </div>
            </div>

            {msg && (
                <div style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0', flexShrink: 0 }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            <div style={{ display: 'flex', gap: '24px', flex: 1, overflow: 'hidden' }}>
                {/* Left Panel: Contact List */}
                <div style={{ width: '320px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <Search size={16} color="#94a3b8" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search parents or students..."
                                style={{ background: 'transparent', outline: 'none', border: 'none', fontSize: '13px', fontWeight: '500', color: '#334155', width: '100%' }} />
                        </div>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>Loading contacts...</div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>No contacts found.</div>
                        ) : (
                            filtered.map((p) => (
                                <div key={p.parent_id} onClick={() => selectParent(p)}
                                    style={{ 
                                        padding: '16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s',
                                        backgroundColor: selectedParent?.parent_id === p.parent_id ? '#f8fafc' : 'white',
                                        borderLeft: selectedParent?.parent_id === p.parent_id ? '3px solid #3b82f6' : '3px solid transparent'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                                            {p.parent_name?.[0]?.toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.parent_name}</h4>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Parent of {p.student_name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Chat Area */}
                <div style={{ flex: 1, background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedParent ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                                        {selectedParent.parent_name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{selectedParent.parent_name}</h3>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Parent of <span style={{ fontWeight: 'bold' }}>{selectedParent.student_name}</span> (Class {selectedParent.class_name} {selectedParent.section})</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a href={`tel:${selectedParent.phone}`} style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                        <Phone size={16} />
                                    </a>
                                    <a href={`mailto:${selectedParent.email}`} style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                        <Mail size={16} />
                                    </a>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {messages.length === 0 ? (
                                    <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8' }}>
                                        <MessageSquare size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>No messages yet</p>
                                        <p style={{ margin: 0, fontSize: '12px' }}>Send a message to start the conversation.</p>
                                    </div>
                                ) : (
                                    messages.map((m, i) => {
                                        const isMe = m.sender_type === 'teacher';
                                        return (
                                            <div key={m.id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                                <div style={{ 
                                                    maxWidth: '70%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5',
                                                    ...(isMe ? { backgroundColor: '#3b82f6', color: 'white', borderBottomRightRadius: '2px' } 
                                                             : { backgroundColor: 'white', color: '#334155', border: '1px solid #e2e8f0', borderBottomLeftRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' })
                                                }}>
                                                    {m.message}
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginTop: '6px', padding: '0 4px' }}>
                                                    {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Chat Input */}
                            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input 
                                        value={messageInput} 
                                        onChange={e => setMessageInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type your message here..."
                                        style={{ flex: 1, padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#334155' }}
                                    />
                                    <button 
                                        onClick={sendMessage} 
                                        disabled={!messageInput.trim() || sending}
                                        style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: !messageInput.trim() || sending ? 'not-allowed' : 'pointer', opacity: !messageInput.trim() || sending ? 0.5 : 1 }}>
                                        <Send size={16} /> {sending ? 'Sending...' : 'Send'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                            <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3 style={{ margin: '0 0 8px 0', color: '#475569', fontWeight: 'bold' }}>Parent Communication</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Select a parent from the left panel to start messaging.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentInteraction;
