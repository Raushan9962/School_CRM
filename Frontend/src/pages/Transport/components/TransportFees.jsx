import React, { useState } from 'react';

const TransportFees = () => {
    const [activeTab, setActiveTab] = useState('student');

    const studentFees = [
        { id: 'ST-001', student: 'Aarav Patel', class: '10-A', route: 'North City Circular', amount: '₹1,500', status: 'Paid', date: '05-Jun-2026' },
        { id: 'ST-002', student: 'Diya Sharma', class: '9-B', route: 'North City Circular', amount: '₹1,500', status: 'Pending', date: '-' },
        { id: 'ST-003', student: 'Rohan Gupta', class: '10-A', route: 'South Avenue Express', amount: '₹2,000', status: 'Overdue', date: '-' }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Paid': return { bg: '#dcfce7', text: '#166534' };
            case 'Pending': return { bg: '#fef3c7', text: '#d97706' };
            case 'Overdue': return { bg: '#fee2e2', text: '#dc2626' };
            default: return { bg: '#f1f5f9', text: '#475569' };
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Transport Fees Management</h2>
                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📥 Export List
                    </button>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        🔔 Send Reminders
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#166534' }}>💰</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Total Collected</p>
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>₹1,45,000</h3>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#d97706' }}>⏳</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Total Pending</p>
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>₹25,500</h3>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#dc2626' }}>⚠️</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Total Overdue</p>
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>₹12,000</h3>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['student', 'route'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab ? '#10b981' : 'white',
                            color: activeTab === tab ? 'white' : '#64748b',
                            border: activeTab === tab ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'student' ? 'Student-wise Fees' : 'Route-wise Fee Structure'}
                    </button>
                ))}
            </div>

            {activeTab === 'student' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <input type="text" placeholder="Search Student..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Student Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Assigned Route</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Payment Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentFees.map((s, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{s.student}</p>
                                            <span className="text-xs text-slate-500">{s.id} • {s.class}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.route}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>{s.amount}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: getStatusStyle(s.status).bg, color: getStatusStyle(s.status).text }}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{s.date}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {s.status !== 'Paid' && (
                                                <button className="px-3 py-1.5 bg-blue-50 text-blue-500 border-none rounded-md text-[13px] font-medium cursor-pointer hover:bg-blue-100 transition-colors">Mark Paid</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'route' && (
                <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
                    <span className="text-[48px]">🛣️</span>
                    <h3 className="text-slate-900 my-4 mb-2">Route-wise Fee Structure Setup</h3>
                    <p className="text-slate-500">Define and manage standard monthly/annual fees per route here.</p>
                </div>
            )}
        </div>
    );
};

export default TransportFees;
