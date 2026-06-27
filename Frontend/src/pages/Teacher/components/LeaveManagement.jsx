import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { ClipboardList, Plus, X, CheckCircle, AlertTriangle, Coffee, Activity, Award } from 'lucide-react';

const LEAVE_TYPES = ['Casual Leave', 'Medical Leave', 'Earned Leave', 'Half Day', 'Other'];

const STATUS_STYLE = {
    'Approved': { bg: '#dcfce7', color: '#166534' },
    'Pending':  { bg: '#fef3c7', color: '#d97706' },
    'Rejected': { bg: '#fee2e2', color: '#dc2626' },
};

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({
        leave_type: 'Casual Leave',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchLeaves = async () => {
        try {
            const res = await apiFetch('/teacher-portal/leaves', { headers });
            const data = await res.json();
            if (data.success) setLeaves(data.data);
        } catch (e) {
            console.error('Failed to fetch leaves', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submitLeave = async () => {
        if (!form.start_date || !form.end_date || !form.reason.trim()) {
            setMsg('error:Please fill in all required fields.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiFetch('/teacher-portal/leaves', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Leave application submitted successfully!');
                setIsModalOpen(false);
                setForm({ leave_type: 'Casual Leave', start_date: '', end_date: '', reason: '' });
                fetchLeaves();
            } else {
                setMsg('error:' + (data.message || 'Failed to submit leave.'));
            }
        } catch (e) {
            setMsg('error:Network error. Please try again.');
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg(''), 4000);
        }
    };

    // Calculate leave balance from leave history
    const leaveBalance = { casual: 8, medical: 5, earned: 12 };
    leaves.forEach(l => {
        if (l.status !== 'Approved') return;
        const days = l.end_date && l.start_date
            ? Math.round((new Date(l.end_date) - new Date(l.start_date)) / (1000 * 60 * 60 * 24)) + 1
            : 1;
        const type = (l.leave_type || l.type || '').toLowerCase();
        if (type.includes('casual')) leaveBalance.casual = Math.max(0, leaveBalance.casual - days);
        if (type.includes('medical') || type.includes('sick')) leaveBalance.medical = Math.max(0, leaveBalance.medical - days);
        if (type.includes('earned')) leaveBalance.earned = Math.max(0, leaveBalance.earned - days);
    });

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList size={22} className="text-indigo-600" /> Leave Management
                </h2>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Apply Leave</span>
                </button>
            </div>

            {/* Status Message */}
            {msg && (
                <div className={`p-3 rounded-lg flex items-center gap-2 font-semibold text-sm border ${isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Casual Leave (CL)', balance: leaveBalance.casual, total: 8, color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', icon: <Coffee size={24} className="text-blue-600" /> },
                    { label: 'Medical Leave (ML)', balance: leaveBalance.medical, total: 5, color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', icon: <Activity size={24} className="text-red-600" /> },
                    { label: 'Earned Leave (EL)', balance: leaveBalance.earned, total: 12, color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', icon: <Award size={24} className="text-amber-600" /> },
                ].map((l, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className={`${l.bg} p-2.5 rounded-lg flex items-center justify-center`}>
                                {l.icon}
                            </div>
                            <span className={`text-xs font-bold ${l.text} ${l.bg} px-3 py-1 rounded-full`}>
                                {l.balance} / {l.total} Remaining
                            </span>
                        </div>
                        <p className="m-0 mb-2.5 text-[15px] font-bold text-slate-900">{l.label}</p>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden flex w-full">
                            <div className={`h-full rounded-full ${l.color} transition-all duration-500`} style={{ width: `${(l.balance / l.total) * 100}%` }} />
                        </div>
                        <p className="m-0 mt-2 text-xs font-medium text-slate-500">{l.total - l.balance} days used this year</p>
                    </div>
                ))}
            </div>

            {/* Leave History Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="m-0 text-sm font-bold text-slate-900">Leave History</h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{leaves.length} record(s)</span>
                </div>
                
                {loading ? (
                    <div className="p-10 text-center text-slate-400 font-medium">Loading...</div>
                ) : leaves.length === 0 ? (
                    <div className="p-16 text-center border-t border-slate-50">
                        <ClipboardList size={48} strokeWidth={1.5} className="text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-600 font-bold m-0 mb-1 text-sm">No leave records</h3>
                        <p className="text-slate-400 m-0 text-sm font-medium">You haven't applied for any leave yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['#', 'Leave Type', 'Duration', 'Reason', 'Applied On', 'Status'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leaves.map((l, i) => {
                                    const type = l.leave_type || l.type || '—';
                                    const from = formatDate(l.start_date || l.from_date);
                                    const to = formatDate(l.end_date || l.to_date);
                                    const status = l.status || 'Pending';
                                    const statusColor = status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200');
                                    
                                    return (
                                        <tr key={l.id || i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-400">{i + 1}</td>
                                            <td className="px-5 py-4 text-sm font-bold text-slate-700">{type}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                                                <span>{from}</span>
                                                {from !== to && <><br /><span className="text-xs font-medium text-slate-400">to {to}</span></>}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-500 max-w-[200px] truncate" title={l.reason}>
                                                {l.reason}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-500">{formatDate(l.created_at)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor}`}>{status}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Apply Leave Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-4 md:p-5 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                            <X size={16} />
                        </button>
                        <h3 className="m-0 mb-4 text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ClipboardList size={20} className="text-indigo-600" /> Apply for Leave
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-bold text-slate-700">Leave Type <span className="text-red-500">*</span></label>
                                <select name="leave_type" value={form.leave_type} onChange={handleChange} 
                                    className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
                                    {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1.5 text-sm font-bold text-slate-700">From Date <span className="text-red-500">*</span></label>
                                    <input type="date" name="start_date" value={form.start_date} onChange={handleChange} 
                                        className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-text" />
                                </div>
                                <div>
                                    <label className="block mb-1.5 text-sm font-bold text-slate-700">To Date <span className="text-red-500">*</span></label>
                                    <input type="date" name="end_date" value={form.end_date} onChange={handleChange} min={form.start_date} 
                                        className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-text" />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-bold text-slate-700">Reason <span className="text-red-500">*</span></label>
                                <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Briefly explain the reason for your leave..." 
                                    className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400" />
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors">Cancel</button>
                                <button onClick={submitLeave} disabled={submitting} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold transition-colors shadow-sm">
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
