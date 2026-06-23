import React, { useState } from 'react';

const ExpenseManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const expenses = [
        { id: 'EXP-1001', category: 'Electricity', amount: '₹ 45,000', date: '15 Jun 2026', description: 'Main building electricity bill', status: 'Paid' },
        { id: 'EXP-1002', category: 'Stationery', amount: '₹ 12,500', date: '14 Jun 2026', description: 'Exam papers and printer ink', status: 'Pending' },
        { id: 'EXP-1003', category: 'Maintenance', amount: '₹ 25,000', date: '12 Jun 2026', description: 'Plumbing repair in Block B', status: 'Paid' },
        { id: 'EXP-1004', category: 'Internet', amount: '₹ 8,000', date: '10 Jun 2026', description: 'Monthly fiber broadband', status: 'Paid' }
    ];

    const categories = [
        'Electricity', 'Internet', 'Water', 'Stationery', 'Maintenance', 'Event Expenses', 'Transport Expenses', 'Miscellaneous'
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Expense Management</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('add')} style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                        ➕ Log Expense
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['list', 'add'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab ? '#0ea5e9' : 'white',
                            color: activeTab === tab ? 'white' : '#64748b',
                            border: activeTab === tab ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'list' ? 'Expense Records' : 'Add/Edit Expense'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Categories</option>
                            {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <input type="month" className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Expense ID & Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Description</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((e, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p className="m-0 mb-1 text-sm font-semibold text-slate-800">{e.id}</p>
                                            <span className="text-xs text-slate-500">{e.date}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155', fontWeight: '500' }}>{e.category}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{e.description}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#ef4444', fontWeight: '600' }}>{e.amount}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: e.status === 'Paid' ? '#dcfce7' : '#fef3c7', color: e.status === 'Paid' ? '#166534' : '#d97706' }}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button style={{ padding: '6px 12px', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'add' && (
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Expense Category</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option value="">Select Category...</option>
                                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Amount (₹)</label>
                            <input type="number" placeholder="Enter amount" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Expense Date</label>
                            <input type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Payment Status</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Paid</option>
                                <option>Pending</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Description</label>
                            <textarea rows="3" placeholder="Provide details about this expense..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none resize-y"></textarea>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Attach Receipt/Invoice</label>
                            <input type="file" style={{ width: '100%', padding: '10px', border: '1px dashed #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }} />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Expense</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseManagement;
