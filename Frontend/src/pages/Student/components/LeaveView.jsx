import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight, PlusCircle, X } from 'lucide-react';
import apiFetch from '../../../services/api';

const LeaveView = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const res = await apiFetch(`/leaves/user/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
                }
            }
        } catch (error) {
            console.error("Error fetching leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                
                // Calculate days roughly
                const start = new Date(fromDate);
                const end = new Date(toDate);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                const payload = {
                    user_id: user.id,
                    type: leaveType,
                    from_date: fromDate,
                    to_date: toDate,
                    days: diffDays,
                    reason: reason,
                    status: 'Pending'
                };

                const res = await apiFetch(`/leaves`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    setShowModal(false);
                    fetchLeaves();
                    setFromDate('');
                    setToDate('');
                    setReason('');
                }
            }
        } catch (error) {
            console.error("Error applying leave:", error);
        }
    };

    const pendingCount = records.filter(r => r.status === 'Pending').length;
    const approvedCount = records.filter(r => r.status === 'Approved').length;
    const rejectedCount = records.filter(r => r.status === 'Rejected').length;

    const tabs = [
        { id: 'all', label: 'All Applications', count: records.length, subtext: 'Total Applied' },
        { id: 'pending', label: 'Pending', count: pendingCount, subtext: 'Awaiting Approval' },
        { id: 'approved', label: 'Approved', count: approvedCount, subtext: 'Leaves Granted' },
        { id: 'rejected', label: 'Rejected', count: rejectedCount, subtext: 'Declined' }
    ];

    const filteredRecords = records.filter(r => activeTab === 'all' || r.status.toLowerCase() === activeTab);

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Leave Type <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Date Range
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <button onClick={() => setShowModal(true)} className="px-4 py-1.5 bg-blue-600 text-white border-none rounded text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
                        <PlusCircle size={14} /> Apply Leave
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
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading leave records...</div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">No leave applications found.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">App ID</th>
                                <th className="px-4 py-2 font-bold">Leave Type</th>
                                <th className="px-4 py-2 font-bold">Duration</th>
                                <th className="px-4 py-2 font-bold">Days</th>
                                <th className="px-4 py-2 font-bold">Reason</th>
                                <th className="px-4 py-2 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {filteredRecords.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 font-bold text-blue-600">
                                        LAV-{row.id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.type}</td>
                                    <td className="px-4 py-2.5 text-slate-600 font-medium">
                                        {new Date(row.from_date).toLocaleDateString()} to {new Date(row.to_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.days}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{row.reason}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                                            (row.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')
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
                <button onClick={fetchLeaves} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer">
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
                <div>1-{filteredRecords.length} of {filteredRecords.length}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>

            {/* Apply Leave Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Apply for Leave</h2>
                        
                        <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Leave Type</label>
                                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow">
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Medical Leave</option>
                                    <option>Half Day</option>
                                </select>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">From Date</label>
                                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">To Date</label>
                                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason</label>
                                <textarea value={reason} onChange={(e) => setReason(e.target.value)} required rows="3" placeholder="Explain your reason briefly..." className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"></textarea>
                            </div>

                            <button type="submit" className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors cursor-pointer shadow-sm">
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveView;
