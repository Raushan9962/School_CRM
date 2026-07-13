import React from 'react';
import { IndianRupee, FileText, CheckCircle2, Clock } from 'lucide-react';

const FineManagement = () => {
    // This is a static UI for Phase 1. Real API integration will be done in Phase 2.
    const mockFines = [
        { id: 1, student: 'Rahul Sharma', class: '10th A', amount: 45, status: 'Pending', date: '2023-10-15', book: 'Physics NCERT' },
        { id: 2, student: 'Priya Patel', class: '8th B', amount: 15, status: 'Paid', date: '2023-10-14', book: 'Harry Potter' },
        { id: 3, student: 'Amit Kumar', class: '12th Science', amount: 120, status: 'Pending', date: '2023-10-10', book: 'Advanced Calculus' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded">
                        <IndianRupee size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Fine Management</h2>
                        <p className="text-sm text-slate-500 m-0">Track and collect overdue book penalties</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-semibold shadow-sm">
                    <FileText size={16} /> Export
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center"><IndianRupee size={18} /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Collected</p>
                        <h3 className="text-xl font-bold text-slate-800 m-0">₹ 1,250</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center"><Clock size={18} /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Dues</p>
                        <h3 className="text-xl font-bold text-slate-800 m-0">₹ 450</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center"><CheckCircle2 size={18} /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fines Cleared</p>
                        <h3 className="text-xl font-bold text-slate-800 m-0">84</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-800 m-0">Recent Fine Records</h3>
                </div>
                <div className="p-6 text-center bg-white border-b border-slate-100">
                    <p className="text-sm text-slate-500 font-medium m-0">Fine payment gateway and advanced tracking will be activated in the next update.</p>
                </div>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Student</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Book</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {mockFines.map(fine => (
                            <tr key={fine.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <p className="font-bold text-slate-800 text-sm m-0">{fine.student}</p>
                                    <p className="text-xs text-slate-500 m-0">{fine.class}</p>
                                </td>
                                <td className="p-4 text-sm text-slate-600 font-medium">{fine.book}</td>
                                <td className="p-4 text-sm font-semibold text-slate-800">₹ {fine.amount}</td>
                                <td className="p-4 text-sm text-slate-600">{fine.date}</td>
                                <td className="p-4 text-right">
                                    <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded ${fine.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                        {fine.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FineManagement;
