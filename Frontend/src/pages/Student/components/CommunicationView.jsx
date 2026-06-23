import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight, MessageCircle, Bell, Megaphone, CheckCircle } from 'lucide-react';
import apiFetch from '../../../services/api';

const CommunicationView = () => {
    const [activeTab, setActiveTab] = useState('notices');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await apiFetch(`/notifications/role/Student`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // For demonstration, map target_role "Student" to Notices
    const notices = notifications.map((n, idx) => ({
        id: `NTC-${n.id.toString().padStart(3, '0')}`,
        title: n.title,
        date: new Date(n.created_at).toLocaleDateString(),
        sender: 'Admin',
        desc: n.message,
        type: 'Notice',
        isNew: idx === 0
    }));

    const events = [
        { id: 'EVT-012', title: 'Annual Science Exhibition', date: '20 Nov 2026', time: '09:00 AM', venue: 'School Auditorium', type: 'Academic', isNew: true },
        { id: 'EVT-011', title: 'Inter-School Football Match', date: '12 Nov 2026', time: '10:00 AM', venue: 'City Sports Ground', type: 'Sports', isNew: false }
    ];

    const messages = [
        { id: 'MSG-001', sender: 'Mr. Sharma', subject: 'Physics', preview: "Don't forget the assignment", date: 'Today, 10:30 AM', status: 'Unread', isNew: true },
        { id: 'MSG-002', sender: 'Mrs. Gupta', subject: 'Chemistry', preview: 'Yes, the syllabus is updated', date: 'Yesterday', status: 'Read', isNew: false }
    ];

    const tabs = [
        { id: 'notices', label: 'Notices', count: notices.length.toString(), subtext: 'Official Circulars' },
        { id: 'events', label: 'Events', count: events.length.toString(), subtext: 'Upcoming Activities' },
        { id: 'messages', label: 'Messages', count: messages.length.toString(), subtext: 'Chats' }
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Type <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Filter Date
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search communications..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '200px' }} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MessageCircle size={16} /> Send Message
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b-2 border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            minWidth: '160px',
                            padding: '16px',
                            background: activeTab === tab.id ? '#e0f2fe' : 'white',
                            border: '1px solid',
                            borderColor: activeTab === tab.id ? '#0ea5e9' : '#e2e8f0',
                            borderBottom: 'none',
                            borderRadius: '8px 8px 0 0',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            position: 'relative',
                            marginBottom: '-2px',
                            borderTopWidth: activeTab === tab.id ? '3px' : '1px'
                        }}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="text-sm text-gray-600 font-medium">{tab.label}</span>
                            <span className="text-2xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {activeTab === 'notices' ? (
                    loading ? (
                        <div className="p-10 text-center text-gray-500">Loading notices...</div>
                    ) : notices.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No notices found.</div>
                    ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Ref ID</th>
                                <th className="px-3 py-4">Subject</th>
                                <th className="px-3 py-4">Sender</th>
                                <th className="px-3 py-4">Date</th>
                                <th className="px-3 py-4 text-right">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', position: 'relative' }}>
                                        {row.isNew && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, background: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 16px 2px 4px', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)', fontWeight: 'bold' }}>
                                                New
                                            </div>
                                        )}
                                        <span style={{ color: '#0ea5e9', display: 'block', marginTop: row.isNew ? '8px' : '0' }}>{row.id}</span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div style={{ color: '#111827', fontWeight: '600' }}>{row.title}</div>
                                        <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{row.desc}</div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-600">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Megaphone size={14} /> {row.sender}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-600">{row.date}</td>
                                    <td className="px-3 py-4 text-right">
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                            background: row.type === 'Notice' ? '#e0e7ff' : '#fce7f3',
                                            color: row.type === 'Notice' ? '#4f46e5' : '#db2777'
                                        }}>
                                            {row.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )
                ) : activeTab === 'events' ? (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Event ID</th>
                                <th className="px-3 py-4">Event Name</th>
                                <th className="px-3 py-4">Date & Time</th>
                                <th className="px-3 py-4">Venue</th>
                                <th className="px-3 py-4 text-right">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', color: '#0ea5e9' }}>{row.id}</td>
                                    <td style={{ padding: '16px 12px', color: '#111827', fontWeight: '600' }}>{row.title}</td>
                                    <td className="px-3 py-4 text-gray-600">{row.date} • {row.time}</td>
                                    <td className="px-3 py-4 text-gray-600">{row.venue}</td>
                                    <td className="px-3 py-4 text-right">
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                            background: '#dcfce7',
                                            color: '#166534'
                                        }}>
                                            {row.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">From</th>
                                <th className="px-3 py-4">Subject & Preview</th>
                                <th className="px-3 py-4">Date</th>
                                <th className="px-3 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.sender}</td>
                                    <td className="px-3 py-4">
                                        <div style={{ color: '#111827', fontWeight: row.status === 'Unread' ? '700' : '500' }}>{row.subject}</div>
                                        <div style={{ color: '#6b7280', fontSize: '13px' }}>{row.preview}</div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-600">{row.date}</td>
                                    <td className="px-3 py-4 text-right">
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: row.status === 'Unread' ? '#3b82f6' : '#9ca3af', fontSize: '12px', fontWeight: '500' }}>
                                            {row.status === 'Unread' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>}
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchNotifications} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-4 border-t border-slate-200 text-gray-600 text-sm gap-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Rows per page: 
                    <select className="border-none outline-none text-gray-900 cursor-pointer bg-transparent">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{activeTab === 'notices' ? notices.length : (activeTab === 'events' ? events.length : messages.length)} of {activeTab === 'notices' ? notices.length : (activeTab === 'events' ? events.length : messages.length)}</div>
                <div className="flex gap-2">
                    <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }} disabled><ChevronLeft size={20} /></button>
                    <button style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default CommunicationView;
