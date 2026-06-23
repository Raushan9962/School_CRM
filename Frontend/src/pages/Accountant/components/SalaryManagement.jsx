import React, { useState } from 'react';

const SalaryManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const salaries = [
        { id: 'EMP-001', name: 'Dr. Anita Desai', role: 'Principal', basic: '₹ 80,000', deductions: '₹ 12,000', pf_esi: '₹ 4,000', bonus: '₹ 5,000', net: '₹ 69,000', status: 'Processed' },
        { id: 'EMP-002', name: 'Ramesh Kumar', role: 'Teacher', basic: '₹ 45,000', deductions: '₹ 4,500', pf_esi: '₹ 2,500', bonus: '₹ 0', net: '₹ 38,000', status: 'Processed' },
        { id: 'EMP-003', name: 'Suresh Singh', role: 'Transport', basic: '₹ 25,000', deductions: '₹ 1,500', pf_esi: '₹ 1,000', bonus: '₹ 2,000', net: '₹ 24,500', status: 'Pending' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Salary Management</h2>
                <button style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                    ⚡ Process Bulk Salary
                </button>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['list', 'deductions', 'bonus'].map(tab => (
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
                        {tab === 'list' ? 'Employee Salary' : tab === 'deductions' ? 'Tax & Deductions' : 'Bonus Management'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <input type="month" defaultValue="2026-06" className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Departments</option>
                            <option value="teaching">Teaching Staff</option>
                            <option value="admin">Administration</option>
                            <option value="support">Support Staff</option>
                        </select>
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Statuses</option>
                            <option value="Processed">Processed</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Employee</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Basic Pay</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Deductions & PF</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Bonus</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Net Salary</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.map((s, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p className="m-0 mb-1 text-sm font-semibold text-slate-800">{s.name}</p>
                                            <span className="text-xs text-slate-500">{s.id} • {s.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{s.basic}</td>
                                        <td className="px-6 py-4">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#ef4444' }}>Tax: -{s.deductions}</p>
                                            <span style={{ fontSize: '13px', color: '#ef4444' }}>PF/ESI: -{s.pf_esi}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981' }}>{s.bonus !== '₹ 0' ? `+${s.bonus}` : '-'}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>{s.net}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: s.status === 'Processed' ? '#dcfce7' : '#fef3c7', color: s.status === 'Processed' ? '#166534' : '#d97706' }}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {s.status === 'Pending' ? (
                                                <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Process</button>
                                            ) : (
                                                <button style={{ padding: '6px 12px', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Payslip</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'deductions' && (
                <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
                    <span className="text-[48px]">📉</span>
                    <h3 className="text-slate-900 my-4 mb-2">Tax & Deduction Management</h3>
                    <p className="text-slate-500">Configure standard tax brackets, PF, ESI, and other automated deductions.</p>
                </div>
            )}

            {activeTab === 'bonus' && (
                <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
                    <span className="text-[48px]">🎁</span>
                    <h3 className="text-slate-900 my-4 mb-2">Bonus Management</h3>
                    <p className="text-slate-500">Approve and assign festival bonuses, performance rewards, or advance payouts.</p>
                </div>
            )}
        </div>
    );
};

export default SalaryManagement;
