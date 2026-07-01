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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Category <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Filter Date
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search ticket id or subject..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-64" />
                    </div>
                    <button onClick={() => setShowModal(true)} className="px-4 py-1.5 bg-blue-600 text-white border-none rounded text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
                        <PlusCircle size={14} /> Raise Ticket
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[160px] p-4 text-left cursor-pointer flex flex-col gap-1 relative -mb-[1px] border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className={`text-xs font-bold ${activeTab === tab.id ? 'text-blue-700' : 'text-slate-600'}`}>{tab.label}</span>
                            <span className={`text-lg font-bold leading-none ${activeTab === tab.id ? 'text-blue-800' : 'text-slate-800'}`}>{tab.count}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading complaints...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">No complaints found.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Ticket ID</th>
                                <th className="px-4 py-2 font-bold">Subject</th>
                                <th className="px-4 py-2 font-bold">Category</th>
                                <th className="px-4 py-2 font-bold">Created Date</th>
                                <th className="px-4 py-2 font-bold">Priority</th>
                                <th className="px-4 py-2 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {filteredTickets.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 font-bold text-blue-600">
                                        TKT-{row.id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.subject}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{row.category}</td>
                                    <td className="px-4 py-2.5 text-slate-600 font-medium">{new Date(row.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`inline-flex items-center gap-1 font-bold ${
                                            row.priority === 'High' || row.priority === 'Urgent' ? 'text-red-500' : 
                                            (row.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500')
                                        }`}>
                                            {(row.priority === 'High' || row.priority === 'Urgent') && <AlertCircle size={12} />}
                                            {row.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            row.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 
                                            (row.status === 'Open' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchComplaints} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] font-bold gap-4">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-slate-700 bg-transparent font-bold cursor-pointer">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{filteredTickets.length} of {filteredTickets.length}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>

            {/* Raise Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Raise a Complaint Ticket</h2>
                        
                        <form onSubmit={handleRaiseTicket} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Brief description of the issue" className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                                        <option>IT Support</option>
                                        <option>Maintenance</option>
                                        <option>Administration</option>
                                        <option>Academics</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
                                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" placeholder="Provide more details..." className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"></textarea>
                            </div>

                            <button type="submit" className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors cursor-pointer shadow-sm">
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
