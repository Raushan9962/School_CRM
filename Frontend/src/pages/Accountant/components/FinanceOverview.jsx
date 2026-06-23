import React from 'react';

const FinanceOverview = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Dashboard Home</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💰</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Fee Collection (Today)</p>
                        <h3 className="m-0 text-xl text-slate-800">₹ 1,25,000</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📈</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Monthly Revenue</p>
                        <h3 className="m-0 text-xl text-slate-800">₹ 24,50,000</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⏳</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Pending Fees</p>
                        <h3 className="m-0 text-xl text-slate-800">₹ 5,20,000</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📉</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Expenses</p>
                        <h3 className="m-0 text-xl text-slate-800">₹ 8,40,000</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💸</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Salary Paid</p>
                        <h3 className="m-0 text-xl text-slate-800">₹ 12,00,000</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ffedd5', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⌛</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Salary Pending</p>
                        <h3 className="m-0 text-xl text-slate-800">₹ 4,50,000</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ffe4e6', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⚠️</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Outstanding Dues</p>
                        <h3 className="m-0 text-xl text-slate-800">₹ 2,10,000</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 className="m-0 text-lg text-slate-800">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Transaction ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Description</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155', fontWeight: '500' }}>TXN-98234</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>18 Jun 2026, 10:30 AM</td>
                                <td className="px-6 py-4 text-sm text-slate-700">Term 2 Fee - Aarav Patel (10-A)</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>Income</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>+ ₹ 15,000</td>
                                <td className="px-6 py-4"><span style={{ padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Completed</span></td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155', fontWeight: '500' }}>TXN-98233</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>17 Jun 2026, 02:15 PM</td>
                                <td className="px-6 py-4 text-sm text-slate-700">Vendor Payment - Saraswati Stationers</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#ef4444', fontWeight: '600' }}>Expense</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>- ₹ 45,000</td>
                                <td className="px-6 py-4"><span style={{ padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Completed</span></td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155', fontWeight: '500' }}>TXN-98232</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>17 Jun 2026, 11:00 AM</td>
                                <td className="px-6 py-4 text-sm text-slate-700">Admission Fee - Riya Sharma (5-B)</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>Income</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>+ ₹ 25,000</td>
                                <td className="px-6 py-4"><span style={{ padding: '4px 12px', background: '#fef3c7', color: '#d97706', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Pending</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;
