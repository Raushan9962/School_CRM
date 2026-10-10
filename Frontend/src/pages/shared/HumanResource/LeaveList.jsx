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
                            return (
                                <tr key={l.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-3 font-medium text-slate-600">{i + 1}</td>
                                    <td className="p-3 font-bold text-slate-800">{user?.name || 'Applicant'}</td>
                                    <td className="p-3">
                                        <p className="font-bold text-slate-800 text-sm">{l.leave_type || l.type}</p>
                                        <p className="text-xs text-slate-500 mt-1 max-w-[150px] truncate">{l.reason}</p>
                                    </td>
                                    <td className="p-3 text-sm text-slate-600 font-medium">
                                        {l.start_date ? new Date(l.start_date).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td className="p-3 text-sm text-slate-600 font-medium">
                                        {l.end_date ? new Date(l.end_date).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td className="p-3 text-center text-sm font-bold text-slate-700">
                                        {calculateDays(l.start_date, l.end_date)}
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
                                        <button className="text-slate-900 hover:text-blue-800 font-bold text-xs uppercase tracking-wide">View</button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveList;
