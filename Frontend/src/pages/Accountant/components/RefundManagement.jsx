import React, { useState } from 'react';

const RefundManagement = () => {
    const [activeTab, setActiveTab] = useState('requests');

    const refunds = [
        { id: 'REF-2001', origTxn: 'TXN-98101', student: 'Aarav Patel', amount: '₹ 5,000', reason: 'Excess fee paid by mistake', status: 'Pending' },
        { id: 'REF-2002', origTxn: 'TXN-98055', student: 'Rohan Gupta', amount: '₹ 15,000', reason: 'Transport cancellation mid-term', status: 'Approved' },
        { id: 'REF-2003', origTxn: 'TXN-97999', student: 'Diya Sharma', amount: '₹ 2,000', reason: 'Double payment online', status: 'Processed' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Refund Management</h2>
                {activeTab === 'requests' && (
                    <button onClick={() => setActiveTab('initiate')} style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                        ➕ Initiate Refund
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['requests', 'initiate'].map(tab => (
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
                        {tab === 'requests' ? 'Refund Requests' : 'Initiate Refund'}
                    </button>
                ))}
            </div>

            {activeTab === 'requests' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <input type="text" placeholder="Search Refund ID or TXN ID..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Processed">Processed</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Refund ID & Orig TXN</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Student</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Refund Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Reason</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {refunds.map((r, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p className="m-0 mb-1 text-sm font-semibold text-slate-800">{r.id}</p>
                                            <span className="text-xs text-slate-500">Orig: {r.origTxn}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{r.student}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{r.amount}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{r.reason}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', 
                                                background: r.status === 'Processed' ? '#dcfce7' : r.status === 'Pending' ? '#fef3c7' : '#e0e7ff', 
                                                color: r.status === 'Processed' ? '#166534' : r.status === 'Pending' ? '#d97706' : '#4f46e5' }}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {r.status === 'Pending' && (
                                                <>
                                                    <button style={{ padding: '6px 12px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Approve</button>
                                                    <button style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Reject</button>
                                                </>
                                            )}
                                            {r.status === 'Approved' && (
                                                <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Process Payout</button>
                                            )}
                                            {r.status === 'Processed' && (
                                                <button style={{ padding: '6px 12px', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Receipt</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'initiate' && (
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Original Transaction ID</label>
                            <div className="flex gap-3">
                                <input type="text" placeholder="e.g. TXN-98234" style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                <button style={{ padding: '12px 24px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Verify TXN</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">Refund Amount (₹)</label>
                                <input type="number" placeholder="Enter amount to refund" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">Refund Method</label>
                                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                    <option>Bank Transfer (NEFT/IMPS)</option>
                                    <option>Original Payment Method</option>
                                    <option>Cash</option>
                                    <option>Cheque</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Reason for Refund</label>
                            <textarea rows="3" placeholder="Provide justification..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none resize-y"></textarea>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Bank Account Details (If transferring to Bank)</label>
                            <input type="text" placeholder="A/C No, IFSC, Account Holder Name" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('requests')} className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Initiate Refund</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundManagement;
