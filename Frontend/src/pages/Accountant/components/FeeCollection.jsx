import React, { useState } from 'react';

const FeeCollection = () => {
    const [activeTab, setActiveTab] = useState('collect');

    const recentCollections = [
        { id: 'TXN-98234', receipt: 'REC-2026-001', student: 'Aarav Patel', amount: '₹ 15,000', method: 'Online', date: '18 Jun 2026' },
        { id: 'TXN-98235', receipt: 'REC-2026-002', student: 'Diya Sharma', amount: '₹ 10,000', method: 'Cash', date: '18 Jun 2026' },
        { id: 'TXN-98236', receipt: 'REC-2026-003', student: 'Rohan Gupta', amount: '₹ 25,000', method: 'Cheque', date: '17 Jun 2026' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Fee Collection Desk</h2>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['collect', 'history'].map(tab => (
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
                        {tab === 'collect' ? 'Collect Fees' : 'Collection History'}
                    </button>
                ))}
            </div>

            {activeTab === 'collect' && (
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1e293b' }}>Student Details</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">Search Student</label>
                                <input type="text" placeholder="Enter Admission No. or Name..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                            </div>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Student Name: <strong style={{ color: '#1e293b' }}>Aarav Patel</strong></p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Class: <strong style={{ color: '#1e293b' }}>10-A</strong></p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Pending Dues: <strong style={{ color: '#dc2626' }}>₹ 25,000</strong></p>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">Select Fee to Pay</label>
                                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                    <option>Term 1 Fee (₹ 25,000)</option>
                                    <option>Transport Fee (₹ 1,500)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1e293b' }}>Payment Details</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">Amount Receiving (₹)</label>
                                <input type="number" defaultValue="25000" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">Payment Method</label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                        <input type="radio" name="method" defaultChecked /> Cash
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                        <input type="radio" name="method" /> Online/UPI
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                        <input type="radio" name="method" /> Cheque
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">Remarks / Cheque No.</label>
                                <input type="text" placeholder="Optional details..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <button style={{ flex: 1, padding: '12px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                                    💳 Process Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <input type="text" placeholder="Search Receipt No. or TXN ID..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <input type="date" className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Receipt No.</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Transaction ID & Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Student Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Payment Method</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCollections.map((c, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{c.receipt}</td>
                                        <td className="px-6 py-4">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#475569' }}>{c.id}</p>
                                            <span className="text-xs text-slate-500">{c.date}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{c.student}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{c.amount}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{c.method}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                🖨️ Print
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeCollection;
