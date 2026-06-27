import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, ArrowLeftRight } from 'lucide-react';

const RefundManagement = () => {
    const [view, setView] = useState('requests'); // 'requests' or 'initiate'

    const refunds = [
        { id: 'REF-2001', origTxn: 'TXN-98101', student: 'Aarav Patel', amount: '₹ 5,000', reason: 'Excess fee paid by mistake', status: 'Pending' },
        { id: 'REF-2002', origTxn: 'TXN-98055', student: 'Rohan Gupta', amount: '₹ 15,000', reason: 'Transport cancellation mid-term', status: 'Approved' },
        { id: 'REF-2003', origTxn: 'TXN-97999', student: 'Diya Sharma', amount: '₹ 2,000', reason: 'Double payment online', status: 'Processed' }
    ];

    if (view === 'initiate') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Initiate Refund</h2>
                        <p className="text-xs text-slate-500 mt-1">Start a new refund process for a student</p>
                    </div>
                    <button onClick={() => setView('requests')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setView('requests'); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Search Original Transaction ID *</label>
                            <div className="flex gap-2">
                                <input type="text" required placeholder="e.g. TXN-12345" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                                <button type="button" className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Verify</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Refund Amount (₹) *</label>
                            <input type="number" required placeholder="0" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Refund *</label>
                        <textarea required rows="2" placeholder="Explain why this refund is being initiated..." className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none resize-none"></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Refund Method *</label>
                            <select required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                <option value="original">Original Payment Method</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="wallet">Adjust in Next Fee</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account / Details (if applicable)</label>
                            <input type="text" placeholder="Account No. / UPI ID" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setView('requests')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Submit Request
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Refund Management</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage and process student fee refunds</p>
                </div>
                <button 
                    onClick={() => setView('initiate')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <Plus size={16} /> Initiate Refund
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Processed (MTD)</p>
                    <p className="text-base font-bold text-emerald-600 m-0">₹ 24,000</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Pending Approval</p>
                    <p className="text-base font-bold text-amber-600 m-0">1</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Pending Processing</p>
                    <p className="text-base font-bold text-blue-600 m-0">1</p>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                        <ArrowLeftRight size={16} className="text-blue-600" /> Refund Requests
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search ID..." 
                            className="w-48 pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold">Refund ID & Orig TXN</th>
                                <th className="px-4 py-2 font-bold">Student</th>
                                <th className="px-4 py-2 font-bold">Refund Amount</th>
                                <th className="px-4 py-2 font-bold">Reason</th>
                                <th className="px-4 py-2 font-bold">Status</th>
                                <th className="px-4 py-2 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {refunds.map((r, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5">
                                        <div className="font-bold text-slate-800">{r.id}</div>
                                        <div className="text-[10px] text-slate-500">Orig: {r.origTxn}</div>
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-700">{r.student}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{r.amount}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{r.reason}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                                            r.status === 'Processed' ? 'bg-emerald-50 text-emerald-700' : 
                                            r.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                                            'bg-blue-50 text-blue-700'
                                        }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right flex justify-end gap-1.5">
                                        {r.status === 'Pending' && (
                                            <>
                                                <button className="px-2 py-1 bg-emerald-50 text-emerald-700 font-bold rounded hover:bg-emerald-100 border border-emerald-100">Approve</button>
                                                <button className="px-2 py-1 bg-red-50 text-red-600 font-bold rounded hover:bg-red-100 border border-red-100">Reject</button>
                                            </>
                                        )}
                                        {r.status === 'Approved' && (
                                            <button className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 border border-blue-100">Process</button>
                                        )}
                                        {r.status === 'Processed' && (
                                            <button className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200">Receipt</button>
                                        )}
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

export default RefundManagement;
