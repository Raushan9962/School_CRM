import React, { useState } from 'react';
import { Calendar, FileText, Send, CheckCircle2, Clock, XCircle, Plus } from 'lucide-react';

const LeaveApplication = ({ childId }) => {
    const [showForm, setShowForm] = useState(false);

    const leaveHistory = [
        { id: 1, type: 'Medical Leave', fromDate: '2023-11-01', toDate: '2023-11-03', days: 3, reason: 'Viral Fever', status: 'Approved', appliedOn: '31 Oct 2023' },
        { id: 2, type: 'Family Function', fromDate: '2023-10-15', toDate: '2023-10-16', days: 2, reason: 'Attending cousin wedding', status: 'Approved', appliedOn: '10 Oct 2023' },
        { id: 3, type: 'Casual Leave', fromDate: '2023-09-05', toDate: '2023-09-05', days: 1, reason: 'Personal work', status: 'Rejected', appliedOn: '04 Sep 2023' },
        { id: 4, type: 'Medical Leave', fromDate: '2023-11-20', toDate: '2023-11-21', days: 2, reason: 'Dental appointment', status: 'Pending', appliedOn: '15 Nov 2023' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Leave Application</h1>
                    <p className="text-slate-500">Apply for leaves and track request status.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                    {showForm ? <XCircle size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancel Application' : 'Apply New Leave'}
                </button>
            </div>

            {/* Leave Application Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-md mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-blue-500" />
                        New Leave Request
                    </h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Leave Type</label>
                                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors">
                                    <option>Medical Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Family Function</option>
                                    <option>Out of Station</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">From Date</label>
                                    <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">To Date</label>
                                    <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for Leave</label>
                                <textarea rows="3" placeholder="Please provide a valid reason..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors custom-scrollbar"></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Supporting Document (Optional)</label>
                                <input type="file" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                <p className="text-[10px] text-slate-500 mt-1">Upload medical certificate if leave is more than 2 days.</p>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                                <Send size={18} />
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Leave History */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} className="text-slate-500" />
                        Leave Application History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Leave Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaveHistory.map((leave) => (
                                <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800">{leave.type}</p>
                                        <p className="text-xs text-slate-500">Applied on: {leave.appliedOn}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-800">{leave.fromDate} to {leave.toDate}</p>
                                        <p className="text-xs text-slate-500">{leave.days} Day(s)</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 max-w-[200px] truncate">{leave.reason}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            leave.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {leave.status === 'Approved' && <CheckCircle2 size={12} />}
                                            {leave.status === 'Rejected' && <XCircle size={12} />}
                                            {leave.status === 'Pending' && <Clock size={12} />}
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveApplication;
