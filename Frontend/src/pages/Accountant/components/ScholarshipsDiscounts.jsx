import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, Award } from 'lucide-react';

const ScholarshipsDiscounts = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'

    const grants = [
        { id: 'GR-1001', student: 'Aarav Patel', class: '10-A', type: 'Merit Scholarship', amount: '₹ 10,000', validTill: 'Mar 2027', status: 'Approved' },
        { id: 'GR-1002', student: 'Kavya Verma', class: '8-C', type: 'Sibling Discount', amount: '20% off Tuition', validTill: 'Lifetime', status: 'Approved' },
        { id: 'GR-1003', student: 'Rohan Gupta', class: '10-A', type: 'Sports Concession', amount: '₹ 5,000', validTill: 'Dec 2026', status: 'Pending Approval' }
    ];

    if (view === 'form') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Assign Scholarship / Discount</h2>
                        <p className="text-xs text-slate-500 mt-1">Grant fee concessions to deserving students</p>
                    </div>
                    <button onClick={() => setView('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setView('list'); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Search Student *</label>
                            <input type="text" required placeholder="Name or ID (e.g. ST-001)" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Grant Type *</label>
                            <select required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                <option value="">Select Type</option>
                                <option value="merit">Merit Scholarship</option>
                                <option value="sibling">Sibling Discount</option>
                                <option value="sports">Sports Concession</option>
                                <option value="staff">Staff Child Discount</option>
                                <option value="custom">Custom Concession</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Value Type</label>
                                <select className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                    <option value="fixed">Fixed Amount (₹)</option>
                                    <option value="percent">Percentage (%)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Value *</label>
                                <input type="number" required placeholder="0" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Valid Till *</label>
                            <select required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                <option value="current_session">Current Academic Session</option>
                                <option value="specific_month">Specific Month</option>
                                <option value="lifetime">Lifetime / Until Graduation</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Remarks</label>
                        <input type="text" placeholder="Optional notes for approval" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Assign Grant
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
                    <h1 className="text-xl font-bold text-slate-800 m-0">Scholarships & Discounts</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage student fee concessions and grants</p>
                </div>
                <button 
                    onClick={() => setView('form')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <Plus size={16} /> Assign Discount
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Active Grants</p>
                    <p className="text-base font-bold text-slate-800 m-0">124</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Pending Approvals</p>
                    <p className="text-base font-bold text-amber-600 m-0">5</p>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                        <Award size={16} className="text-blue-600" /> Granted Scholarships & Discounts
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-48 pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold">Student</th>
                                <th className="px-4 py-2 font-bold">Class</th>
                                <th className="px-4 py-2 font-bold">Grant Type</th>
                                <th className="px-4 py-2 font-bold">Amount / %</th>
                                <th className="px-4 py-2 font-bold">Valid Till</th>
                                <th className="px-4 py-2 font-bold">Status</th>
                                <th className="px-4 py-2 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {grants.map((g, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5">
                                        <div className="font-bold text-slate-800">{g.student}</div>
                                        <div className="text-[10px] text-slate-500">{g.id}</div>
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-600">{g.class}</td>
                                    <td className="px-4 py-2.5 font-medium text-slate-700">{g.type}</td>
                                    <td className="px-4 py-2.5 font-bold text-emerald-600">{g.amount}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{g.validTill}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                                            g.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                            {g.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right flex justify-end gap-2">
                                        {g.status === 'Pending Approval' ? (
                                            <button className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded hover:bg-emerald-100 border border-emerald-100">Approve</button>
                                        ) : (
                                            <button className="px-2.5 py-1 bg-red-50 text-red-600 font-bold rounded hover:bg-red-100 border border-red-100">Revoke</button>
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

export default ScholarshipsDiscounts;
