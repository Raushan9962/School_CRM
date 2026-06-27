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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Leave Type <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Date Range
                    </button>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-sky-500 border-none rounded text-white text-sm font-medium cursor-pointer flex items-center gap-1.5 hover:bg-sky-600 transition-colors">
                        <PlusCircle size={16} /> Apply Leave
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b-2 border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[160px] p-4 text-left cursor-pointer flex flex-col gap-1 relative -mb-[2px] rounded-t-lg transition-colors border ${activeTab === tab.id ? 'bg-sky-50 border-sky-500 border-b-transparent border-t-4' : 'bg-white border-slate-200 border-b-transparent border-t border-t-transparent hover:bg-slate-50'}`}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="text-sm text-gray-600 font-medium">{tab.label}</span>
                            <span className="text-xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading leave records...</div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No leave applications found.</div>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">App ID</th>
                                <th className="px-3 py-4">Leave Type</th>
                                <th className="px-3 py-4">Duration</th>
                                <th className="px-3 py-4">Days</th>
                                <th className="px-3 py-4">Reason</th>
                                <th className="px-3 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">
                                        LAV-{row.id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.type}</td>
                                    <td className="px-3 py-4 text-gray-600">
                                        {new Date(row.from_date).toLocaleDateString()} to {new Date(row.to_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 py-4 text-gray-900 font-semibold">{row.days}</td>
                                    <td className="px-3 py-4 text-gray-500">{row.reason}</td>
                                    <td className="px-3 py-4 text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === 'Approved' ? 'bg-green-100 text-green-800' : (row.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchLeaves} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-4 py-2 border-t border-slate-200 text-gray-600 text-sm gap-4">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-gray-900 cursor-pointer bg-transparent">
                        <option>100</option>
                        <option>50</option>
                        <option>20</option>
                    </select>
                </div>
                <div>1-{filteredRecords.length} of {filteredRecords.length}</div>
                <div className="flex gap-2">
                    <button className="bg-transparent border-none text-gray-400 flex items-center cursor-not-allowed" disabled><ChevronLeft size={20} /></button>
                    <button className="bg-transparent border-none text-gray-600 cursor-pointer flex items-center hover:text-gray-900 transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Apply Leave Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[400px] p-4 relative shadow-xl">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="m-0 mb-5 text-sm text-gray-900 font-semibold">Apply for Leave</h2>
                        
                        <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-2 font-medium">Leave Type</label>
                                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full p-2.5 rounded border border-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-white">
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Medical Leave</option>
                                    <option>Half Day</option>
                                </select>
                            </div>
                            
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-2 font-medium">From Date</label>
                                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required className="w-full p-2.5 rounded border border-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-2 font-medium">To Date</label>
                                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required className="w-full p-2.5 rounded border border-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2 font-medium">Reason</label>
                                <textarea value={reason} onChange={(e) => setReason(e.target.value)} required rows="3" placeholder="Explain your reason briefly..." className="w-full p-2.5 rounded border border-slate-200 outline-none resize-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"></textarea>
                            </div>

                            <button type="submit" className="w-full p-3 bg-sky-500 text-white border-none rounded font-semibold cursor-pointer mt-2 hover:bg-sky-600 transition-colors">
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
