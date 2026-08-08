import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, Bell, Megaphone, Plus, Clock, CheckCircle, Minus, Search, Filter } from 'lucide-react';
import apiFetch from '../../../services/api';

const CommunicationCenter = () => {
    const [search, setSearch] = useState('');
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Email',
        subject: '',
        audience: 'All Students',
        status: 'Sent'
    });

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await apiFetch('/principal/communications');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setMessages(data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching communications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    let filteredData = messages.filter(m => 
        m.subject?.toLowerCase().includes(search.toLowerCase()) || 
        m.audience?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeTab === 'Email') filteredData = filteredData.filter(m => m.type === 'Email');
    if (activeTab === 'SMS') filteredData = filteredData.filter(m => m.type === 'SMS');
    if (activeTab === 'App Notice') filteredData = filteredData.filter(m => m.type === 'App Notice');

    const handleCreateMessage = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/communications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            setFormData({ type: 'Email', subject: '', audience: 'All Students', status: 'Sent' });
            
            // Re-fetch
            const res = await apiFetch('/principal/communications');
            const data = await res.json();
            if (data.success && data.data) setMessages(data.data);
        } catch (err) {
            console.error("Error creating communication:", err);
        }
    };

    const kpiCards = [
        { id: 'All', label: 'Total Comms', value: messages.length.toString(), icon: <Megaphone size={24} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
        { id: 'Email', label: 'Emails Sent', value: messages.filter(m => m.type === 'Email').length.toString(), icon: <Mail size={24} />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
        { id: 'SMS', label: 'SMS Sent', value: messages.filter(m => m.type === 'SMS').length.toString(), icon: <Smartphone size={24} />, iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
        { id: 'App Notice', label: 'App Notices', value: messages.filter(m => m.type === 'App Notice').length.toString(), icon: <Bell size={24} />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Sent': return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 shadow-sm"><CheckCircle size={14} /> Sent</span>;
            case 'Scheduled': return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 shadow-sm"><Clock size={14} /> Scheduled</span>;
            case 'Draft': return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 shadow-sm"><Minus size={14} /> Draft</span>;
            default: return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'Email': return <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-inner"><Mail size={20} /></div>;
            case 'SMS': return <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-inner"><Smartphone size={20} /></div>;
            case 'App Notice': return <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-inner"><Bell size={20} /></div>;
            default: return <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-inner"><Megaphone size={20} /></div>;
        }
    };

    // Inline style objects matching TransportManagement
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
    const btnSecondary = { padding: '8px 16px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

    return (
        <div style={containerStyle} className="animate-fade-in pb-10">
            {/* Header Area */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Communication Center</h2>
                    <p style={subTitleStyle}>Manage and track all official school announcements.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setIsModalOpen(true)} style={btnPrimary}>
                        <Plus size={16} /> Compose Message
                    </button>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {kpiCards.map(card => (
                    <div 
                        key={card.id} 
                        onClick={() => setActiveTab(card.id)}
                        style={{ 
                            background: 'white', 
                            padding: '16px', 
                            borderRadius: '8px', 
                            border: activeTab === card.id ? '1px solid #3b82f6' : '1px solid #e2e8f0', 
                            boxShadow: activeTab === card.id ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            cursor: 'pointer', 
                            transition: 'all 0.2s' 
                        }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: card.iconBg === 'bg-blue-50' ? '#eff6ff' : card.iconBg === 'bg-emerald-50' ? '#dcfce7' : card.iconBg === 'bg-purple-50' ? '#f3e8ff' : '#ffedd5', color: card.iconColor === 'text-blue-500' ? '#1d4ed8' : card.iconColor === 'text-emerald-500' ? '#166534' : card.iconColor === 'text-purple-500' ? '#6b21a8' : '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {React.cloneElement(card.icon, { size: 18 })}
                        </div>
                        <div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{card.label}</p>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area Table */}
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Megaphone size={16} className="text-slate-500" /> Active Communications
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search subjects, audiences..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '12px', width: '200px' }}
                        />
                    </div>
                </div>

                {/* Table View */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Message Details</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Author & Audience</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No records found.</td>
                                </tr>
                            ) : (
                                filteredData.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.subject}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {row.type === 'Email' ? <Mail size={12} /> : row.type === 'SMS' ? <Smartphone size={12} /> : <Bell size={12} />}
                                                {row.type}
                                            </p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.author}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>
                                                To: <span style={{ fontWeight: 'bold', color: '#334155' }}>{row.audience}</span>
                                            </p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontWeight: '500' }}>{row.date}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {getStatusBadge(row.status)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>Compose Message</h3>
                        </div>
                        <form onSubmit={handleCreateMessage} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Subject</label>
                                <input required type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} />
                            </div>
                            <div>
                                <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}}>
                                    <option value="Email">Email</option>
                                    <option value="SMS">SMS</option>
                                    <option value="App Notice">App Notice</option>
                                </select>
                            </div>
                            <div>
                                <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Audience</label>
                                <select value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}}>
                                    <option value="All Students">All Students</option>
                                    <option value="All Teachers">All Teachers</option>
                                    <option value="Parents">Parents</option>
                                    <option value="Class 10">Class 10</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondary}>Cancel</button>
                                <button type="submit" style={btnPrimary}>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunicationCenter;

