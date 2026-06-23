import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Calendar, RefreshCw, ChevronLeft, ChevronRight, PlusCircle, AlertCircle, X } from 'lucide-react';
import apiFetch from '../../../services/api';

const ComplaintView = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('IT Support');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const res = await apiFetch(`/complaints/user/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTickets(data);
                }
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleRaiseTicket = async (e) => {
        e.preventDefault();
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                
                const payload = {
                    user_id: user.id,
                    subject: subject,
                    category: category,
                    priority: priority,
                    description: description,
                    status: 'Open'
                };

                const res = await apiFetch(`/complaints`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    setShowModal(false);
                    fetchComplaints();
                    setSubject('');
                    setCategory('IT Support');
                    setPriority('Medium');
                    setDescription('');
                }
            }
        } catch (error) {
            console.error("Error creating complaint:", error);
        }
    };

    const openCount = tickets.filter(t => t.status === 'Open').length;
    const progressCount = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

    const tabs = [
        { id: 'all', label: 'All Tickets', count: tickets.length, subtext: 'Total Filed' },
        { id: 'open', label: 'Open', count: openCount, subtext: 'Awaiting Action' },
        { id: 'progress', label: 'In Progress', count: progressCount, subtext: 'Being Handled' },
        { id: 'resolved', label: 'Resolved', count: resolvedCount, subtext: 'Completed' }
    ];

    const filteredTickets = tickets.filter(t => activeTab === 'all' || t.status.toLowerCase().includes(activeTab));

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Category <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Filter Date
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search ticket id or subject..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '250px' }} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-sky-500 border-none rounded text-white text-sm font-medium cursor-pointer flex items-center gap-1.5 hover:bg-sky-600 transition-colors">
                        <PlusCircle size={16} /> Raise Ticket
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
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading complaints...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No complaints found.</div>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Ticket ID</th>
                                <th className="px-3 py-4">Subject</th>
                                <th className="px-3 py-4">Category</th>
                                <th className="px-3 py-4">Created Date</th>
                                <th className="px-3 py-4">Priority</th>
                                <th className="px-3 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', color: '#0ea5e9', fontWeight: '500' }}>
                                        TKT-{row.id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.subject}</td>
                                    <td className="px-3 py-4 text-gray-600">{row.category}</td>
                                    <td className="px-3 py-4 text-gray-600">{new Date(row.created_at).toLocaleDateString()}</td>
                                    <td className="px-3 py-4">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: row.priority === 'High' || row.priority === 'Urgent' ? '#ef4444' : (row.priority === 'Medium' ? '#d97706' : '#6b7280') }}>
                                            {(row.priority === 'High' || row.priority === 'Urgent') && <AlertCircle size={14} />}
                                            {row.priority}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-right">
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                            background: row.status === 'Resolved' ? '#dcfce7' : (row.status === 'Open' ? '#fee2e2' : '#fef3c7'),
                                            color: row.status === 'Resolved' ? '#166534' : (row.status === 'Open' ? '#dc2626' : '#b45309')
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchComplaints} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
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
                <div>1-{filteredTickets.length} of {filteredTickets.length}</div>
                <div className="flex gap-2">
                    <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }} disabled><ChevronLeft size={20} /></button>
                    <button style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Raise Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div style={{ background: 'white', borderRadius: '8px', width: '400px', padding: '24px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                            <X size={20} />
                        </button>
                        <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#111827' }}>Raise a Complaint Ticket</h2>
                        
                        <form onSubmit={handleRaiseTicket} className="flex flex-col gap-4">
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>Subject</label>
                                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Brief description of the issue" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>

                            <div className="flex gap-3">
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none' }}>
                                        <option>IT Support</option>
                                        <option>Maintenance</option>
                                        <option>Administration</option>
                                        <option>Academics</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>Priority</label>
                                    <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none' }}>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>Detailed Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" placeholder="Provide more details..." style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }}></textarea>
                            </div>

                            <button type="submit" style={{ padding: '12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
                                Submit Complaint
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintView;
