import React, { useState, useEffect } from 'react';
import { CalendarDays, Filter, CheckCircle2, XCircle, Clock, FileText, Check, X } from 'lucide-react';
import apiFetch from '../../../services/api';

const LeaveManagement = ({ roleFilter }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/school-admin/leaves');
            const data = await res.json();
            if (data.success) {
                let filtered = data.data;
                if (roleFilter) {
                    const rf = roleFilter.toLowerCase();
                    if (rf.includes('transport')) {
                        filtered = filtered.filter(l => {
                            const r = (l.applicant_role || l.role || '').toLowerCase();
                            return r.includes('transport') || r.includes('driver');
                        });
                    } else {
                        filtered = filtered.filter(l => {
                            const r = (l.applicant_role || l.role || '').toLowerCase();
                            return r.includes(rf) || rf.includes(r);
                        });
                    }
                }
                setLeaves(filtered);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [roleFilter]);

    const updateStatus = async (id, status) => {
        try {
            const res = await apiFetch(`/school-admin/leaves/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
            } else {
                alert(data.message || 'Failed to update leave status');
            }
        } catch (error) {
            console.error('Error updating leave:', error);
        }
    };

    let filteredLeaves = leaves.filter(l => 
        l.applicant_name?.toLowerCase().includes(search.toLowerCase()) || 
        l.applicant_role?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Pending') filteredLeaves = filteredLeaves.filter(l => l.status === 'Pending');
    if (activeKpi === 'Approved') filteredLeaves = filteredLeaves.filter(l => l.status === 'Approved');
    if (activeKpi === 'Rejected') filteredLeaves = filteredLeaves.filter(l => l.status === 'Rejected');

    return (
        <div className="flex flex-col gap-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    onClick={() => setActiveKpi('All')}
                    className={`bg-white p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 shadow-sm hover:shadow ${
                        activeKpi === 'All' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
                    }`}
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Requests</p>
                        <h3 className="text-xl font-extrabold text-slate-800 leading-none">{leaves.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Pending')}
                    className={`bg-white p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 shadow-sm hover:shadow ${
                        activeKpi === 'Pending' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                    }`}
                >
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pending</p>
                        <h3 className="text-xl font-extrabold text-slate-800 leading-none">{leaves.filter(l => l.status === 'Pending').length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Approved')}
                    className={`bg-white p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 shadow-sm hover:shadow ${
                        activeKpi === 'Approved' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                    }`}
                >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Approved</p>
                        <h3 className="text-xl font-extrabold text-slate-800 leading-none">{leaves.filter(l => l.status === 'Approved').length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Rejected')}
                    className={`bg-white p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 shadow-sm hover:shadow ${
                        activeKpi === 'Rejected' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200'
                    }`}
                >
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <XCircle size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Rejected</p>
                        <h3 className="text-xl font-extrabold text-slate-800 leading-none">{leaves.filter(l => l.status === 'Rejected').length}</h3>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-slate-50/70 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays size={18} className="text-slate-500" /> Leave Requests
                    </h3>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all w-full sm:w-auto">
                        <Filter size={15} className="text-slate-400 shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Search name, role..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-none outline-none text-xs text-slate-700 bg-transparent w-full sm:w-52 placeholder-slate-400"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Type & Days</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm font-semibold text-slate-400">Loading requests...</td>
                                </tr>
                            ) : filteredLeaves.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm font-medium text-slate-400">No leave requests found.</td>
                                </tr>
                            ) : (
                                filteredLeaves.map((row, idx) => (
                                    <tr key={row.id || idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={row.applicant_image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.applicant_name}`} 
                                                    alt={row.applicant_name} 
                                                    className="w-9 h-9 rounded-full border border-slate-200 object-cover shrink-0"
                                                />
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800 leading-tight">{row.applicant_name}</p>
                                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-0.5">{row.applicant_role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-bold text-sm text-slate-800 leading-tight">{row.type || row.leave_type}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{row.days || 1} Day(s)</p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="text-sm font-medium text-slate-700 leading-tight">
                                                {row.from_date || row.start_date ? new Date(row.from_date || row.start_date).toLocaleDateString('en-IN') : '—'}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                to {row.to_date || row.end_date ? new Date(row.to_date || row.end_date).toLocaleDateString('en-IN') : '—'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                row.status === 'Approved'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : row.status === 'Rejected'
                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {row.status === 'Approved' && <CheckCircle2 size={13} />}
                                                {row.status === 'Rejected' && <XCircle size={13} />}
                                                {row.status === 'Pending' && <Clock size={13} />}
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {row.status === 'Pending' ? (
                                                <div className="flex gap-2 justify-end">
                                                    <button 
                                                        onClick={() => updateStatus(row.id, 'Approved')} 
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
                                                    >
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(row.id, 'Rejected')} 
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors shadow-2xs"
                                                    >
                                                        <X size={14} /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium italic">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;
