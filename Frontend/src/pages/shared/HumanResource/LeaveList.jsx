import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { CalendarDays, Clock } from 'lucide-react';

const STATUS_COLOR = {
    'Approved': { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    'Pending': { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    'Rejected': { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

const LeaveList = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
        
        const fetchLeaves = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await apiFetch('/staff/leaves', { headers: { Authorization: `Bearer ${token}` } });
                if(res.status === 404) {
                    // Fallback to teacher portal if staff route doesn't work for this user yet
                    const fallback = await apiFetch('/teacher-portal/leaves', { headers: { Authorization: `Bearer ${token}` } });
                    const fbData = await fallback.json();
                    if (fbData.success) setLeaves(fbData.data || []);
                } else {
                    const data = await res.json();
                    if (data.success) {
                        setLeaves(data.data || []);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaves();
    }, []);

    const [selectedLeave, setSelectedLeave] = useState(null);

    const calculateDays = (start, end) => {
        if (!start || !end) return 0;
        const s = new Date(start);
        const e = new Date(end);
        const diffTime = Math.abs(e - s);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    if (loading) {
        return <div className="text-center p-10 text-slate-500 font-bold">Loading leave history...</div>;
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">sl</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Applicant</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Leave Category</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Date of Start</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Date of End</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase text-center">Days</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Apply Date</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                        <th className="p-3 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="p-10 text-center">
                                <CalendarDays size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-500 font-medium">No leaves found</p>
                            </td>
                        </tr>
                    ) : (
                        leaves.map((l, i) => {
                            const status = STATUS_COLOR[l.status] || STATUS_COLOR['Pending'];
                            const startDate = l.start_date || l.from_date;
                            const endDate = l.end_date || l.to_date;
                            const daysCount = l.days || calculateDays(startDate, endDate);

                            return (
                                <tr key={l.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-3 font-medium text-slate-600">{i + 1}</td>
                                    <td className="p-3 font-bold text-slate-800">{user?.name || 'Applicant'}</td>
                                    <td className="p-3">
                                        <p className="font-bold text-slate-800 text-sm">{l.leave_type || l.type}</p>
                                        <p className="text-xs text-slate-500 mt-1 max-w-[180px] truncate">{l.reason}</p>
                                    </td>
                                    <td className="p-3 text-sm text-slate-600 font-medium">
                                        {startDate ? new Date(startDate).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td className="p-3 text-sm text-slate-600 font-medium">
                                        {endDate ? new Date(endDate).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td className="p-3 text-center text-sm font-bold text-slate-700">
                                        {daysCount}
                                    </td>
                                    <td className="p-3 text-sm text-slate-600 font-medium">
                                        {l.created_at || l.applied_on ? new Date(l.created_at || l.applied_on).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td className="p-3">
                                        <span 
                                            className="px-2 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 border"
                                            style={{ backgroundColor: status.bg, color: status.color, borderColor: status.border }}
                                        >
                                            {l.status === 'Pending' && <Clock size={12} />}
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button 
                                            onClick={() => setSelectedLeave(l)}
                                            className="text-slate-900 hover:text-blue-700 font-bold text-xs uppercase tracking-wide px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* View Leave Details Modal */}
            {selectedLeave && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800">Leave Details</h3>
                            <button 
                                onClick={() => setSelectedLeave(null)}
                                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-xs uppercase text-slate-400 font-bold block">Leave Type</span>
                                <span className="font-semibold text-slate-800 text-base">{selectedLeave.leave_type || selectedLeave.type}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-xs uppercase text-slate-400 font-bold block">Start Date</span>
                                    <span className="font-medium text-slate-700">
                                        {selectedLeave.start_date || selectedLeave.from_date ? new Date(selectedLeave.start_date || selectedLeave.from_date).toLocaleDateString('en-IN') : '—'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs uppercase text-slate-400 font-bold block">End Date</span>
                                    <span className="font-medium text-slate-700">
                                        {selectedLeave.end_date || selectedLeave.to_date ? new Date(selectedLeave.end_date || selectedLeave.to_date).toLocaleDateString('en-IN') : '—'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs uppercase text-slate-400 font-bold block">Status</span>
                                <span className="inline-block mt-1 font-bold px-2.5 py-0.5 rounded text-xs border"
                                    style={{
                                        backgroundColor: (STATUS_COLOR[selectedLeave.status] || STATUS_COLOR['Pending']).bg,
                                        color: (STATUS_COLOR[selectedLeave.status] || STATUS_COLOR['Pending']).color,
                                        borderColor: (STATUS_COLOR[selectedLeave.status] || STATUS_COLOR['Pending']).border
                                    }}
                                >
                                    {selectedLeave.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs uppercase text-slate-400 font-bold block">Reason</span>
                                <p className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 whitespace-pre-wrap">
                                    {selectedLeave.reason || 'No reason specified'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => setSelectedLeave(null)}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveList;
