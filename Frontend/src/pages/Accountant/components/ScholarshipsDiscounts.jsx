import React, { useState } from 'react';

const ScholarshipsDiscounts = () => {
    const [activeTab, setActiveTab] = useState('list');

    const grants = [
        { id: 'GR-1001', student: 'Aarav Patel', class: '10-A', type: 'Merit Scholarship', amount: '₹ 10,000', validTill: 'Mar 2027', status: 'Approved' },
        { id: 'GR-1002', student: 'Kavya Verma', class: '8-C', type: 'Sibling Discount', amount: '20% off Tuition', validTill: 'Lifetime', status: 'Approved' },
        { id: 'GR-1003', student: 'Rohan Gupta', class: '10-A', type: 'Sports Concession', amount: '₹ 5,000', validTill: 'Dec 2026', status: 'Pending Approval' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Scholarships & Discounts</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('assign')} style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                        ➕ Grant Discount
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['list', 'assign', 'types'].map(tab => (
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
                        {tab === 'list' ? 'Approved Grants' : tab === 'assign' ? 'Assign Discount' : 'Manage Grant Types'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <input type="text" placeholder="Search Student..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Types</option>
                            <option value="scholarship">Scholarships</option>
                            <option value="discount">Discounts</option>
                            <option value="concession">Concessions</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Student</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Class</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Grant Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount / %</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Valid Till</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grants.map((g, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p className="m-0 mb-1 text-sm font-semibold text-slate-800">{g.student}</p>
                                            <span className="text-xs text-slate-500">{g.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{g.class}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{g.type}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{g.amount}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{g.validTill}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: g.status === 'Approved' ? '#dcfce7' : '#fef3c7', color: g.status === 'Approved' ? '#166534' : '#d97706' }}>
                                                {g.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {g.status === 'Pending Approval' ? (
                                                <button style={{ padding: '6px 12px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Approve</button>
                                            ) : (
                                                <button style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Revoke</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'assign' && (
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Student</label>
                            <input type="text" placeholder="Search by name or admission no." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Discount / Scholarship Type</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Sibling Discount</option>
                                <option>Merit Scholarship</option>
                                <option>Sports Concession</option>
                                <option>Staff Child Concession</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Discount Value</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Enter value" style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                <select style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>₹ (Flat)</option>
                                    <option>% (Percentage)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Validity</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>This Term Only</option>
                                <option>This Academic Year</option>
                                <option>Lifetime (Until Graduation)</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Remarks / Reason for Grant</label>
                            <textarea rows="3" placeholder="Provide justification..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none resize-y"></textarea>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Submit for Approval</button>
                    </div>
                </div>
            )}

            {activeTab === 'types' && (
                <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
                    <span className="text-[48px]">📜</span>
                    <h3 className="text-slate-900 my-4 mb-2">Manage Discount/Scholarship Types</h3>
                    <p className="text-slate-500">Define the rules and standard amounts for different types of financial grants here.</p>
                </div>
            )}
        </div>
    );
};

export default ScholarshipsDiscounts;
