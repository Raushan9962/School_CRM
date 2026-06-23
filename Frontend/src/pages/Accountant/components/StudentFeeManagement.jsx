import React, { useState } from 'react';

const StudentFeeManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const studentsFees = [
        { id: 'ST-001', name: 'Aarav Patel', class: '10-A', feeType: 'Term 1 Fee', due: '₹ 25,000', paid: '₹ 25,000', remaining: '₹ 0', status: 'Paid' },
        { id: 'ST-002', name: 'Diya Sharma', class: '9-B', feeType: 'Term 1 Fee', due: '₹ 22,000', paid: '₹ 10,000', remaining: '₹ 12,000', status: 'Partial' },
        { id: 'ST-003', name: 'Rohan Gupta', class: '10-A', feeType: 'Term 2 Fee', due: '₹ 25,000', paid: '₹ 0', remaining: '₹ 25,000', status: 'Unpaid' }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Paid': return { bg: '#dcfce7', text: '#166534' };
            case 'Partial': return { bg: '#fef3c7', text: '#d97706' };
            case 'Unpaid': return { bg: '#fee2e2', text: '#dc2626' };
            default: return { bg: '#f1f5f9', text: '#475569' };
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Student Fee Management</h2>
                <div className="flex gap-3">
                    <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📄 Generate Invoices
                    </button>
                    <button onClick={() => setActiveTab('assign')} style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                        ➕ Assign Fee Structure
                    </button>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['list', 'assign', 'structure'].map(tab => (
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
                        {tab === 'list' ? 'Fee Records' : tab === 'assign' ? 'Assign Fees' : 'Manage Fee Structures'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <input type="text" placeholder="Search by Student Name or ID..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Classes</option>
                            <option value="10">Class 10</option>
                            <option value="9">Class 9</option>
                        </select>
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Partial">Partial</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Student Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Class</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Fee Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Due Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Paid Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Remaining</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsFees.map((s, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p className="m-0 mb-1 text-sm font-semibold text-slate-800">{s.name}</p>
                                            <span className="text-xs text-slate-500">{s.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.class}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155', fontWeight: '500' }}>{s.feeType}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.due}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{s.paid}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>{s.remaining}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: getStatusStyle(s.status).bg, color: getStatusStyle(s.status).text }}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {s.status !== 'Paid' && (
                                                <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Collect</button>
                                            )}
                                            <button style={{ padding: '6px 12px', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'assign' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Class</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Class...</option>
                                <option>Class 10</option>
                                <option>Class 9</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Student (Optional)</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>All Students in Class</option>
                                <option>Aarav Patel</option>
                                <option>Diya Sharma</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Fee Structure</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Structure...</option>
                                <option>Annual Tuition Fee 2026-27</option>
                                <option>Term 1 Fee 2026-27</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Due Date</label>
                            <input type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Assign Fee</button>
                    </div>
                </div>
            )}

            {activeTab === 'structure' && (
                <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
                    <span className="text-[48px]">🏗️</span>
                    <h3 className="text-slate-900 my-4 mb-2">Fee Structure Management</h3>
                    <p className="text-slate-500">Create and manage standard fee structures (e.g., Annual Fee = Tuition + Admission + Library) to easily assign to classes.</p>
                </div>
            )}
        </div>
    );
};

export default StudentFeeManagement;
