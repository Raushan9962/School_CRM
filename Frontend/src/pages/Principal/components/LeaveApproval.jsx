import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Check, X, Clock, Calendar } from 'lucide-react';

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await apiFetch('/principal/leaves');
            const data = await res.json();
            if (data.success) {
                setLeaves(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch leave requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this leave request?`)) return;
        try {
            await apiFetch(`/principal/leaves/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchData();
        } catch (err) {
            console.error("Error updating leave", err);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading leave requests...</div>;

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const pastLeaves = leaves.filter(l => l.status !== 'Pending');

    return (
        <div className="animate-fade-in p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800 m-0">Leave Approval Workflow</h2>
                <p className="text-slate-500 text-sm mt-1">Review and manage leave applications from teachers and staff.</p>
            </div>

            {pendingLeaves.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-amber-500" /> Pending Approvals ({pendingLeaves.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {pendingLeaves.map(leave => (
                            <div key={leave.id} className="bg-white border border-amber-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-800 m-0 text-lg">{leave.name}</h4>
                                        <p className="text-sm font-medium text-slate-500 m-0 mt-0.5">{leave.role} {leave.employee_id ? `(${leave.employee_id})` : ''}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{leave.type} Leave</span>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                        <Calendar size={16} className="text-slate-400"/>
                                        <span className="font-semibold">{new Date(leave.from_date).toLocaleDateString()}</span>
                                        <span className="text-slate-400">to</span>
                                        <span className="font-semibold">{new Date(leave.to_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                        {leave.days} Day{leave.days > 1 ? 's' : ''}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <p className="text-sm text-slate-600 italic m-0">"{leave.reason}"</p>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleAction(leave.id, 'Approved')}
                                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-2 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                                    >
                                        <Check size={18} /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(leave.id, 'Rejected')}
                                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                                    >
                                        <X size={18} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg font-bold text-slate-700 mb-4">Past Records</h3>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600">Applicant</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">Leave Type</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">Duration</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pastLeaves.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No past leave records.</td></tr>
                            ) : (
                                pastLeaves.map(leave => (
                                    <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 text-sm">{leave.name}</div>
                                            <div className="text-xs text-slate-500">{leave.role}</div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-600">{leave.type}</td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {new Date(leave.from_date).toLocaleDateString()} to {new Date(leave.to_date).toLocaleDateString()}
                                            <span className="ml-2 text-xs font-bold text-slate-400">({leave.days}d)</span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                            }`}>
                                                {leave.status}
                                            </span>
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

export default LeaveApproval;
