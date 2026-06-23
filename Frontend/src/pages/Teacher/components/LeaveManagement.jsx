import React, { useState } from 'react';

const LeaveManagement = () => {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const leaveHistory = [
        { id: 'LV-2026-08', type: 'Sick Leave', duration: '12-Oct-2026 to 13-Oct-2026', days: 2, status: 'Approved', appliedOn: '10-Oct-2026' },
        { id: 'LV-2026-09', type: 'Casual Leave', duration: '20-Oct-2026 to 20-Oct-2026', days: 1, status: 'Pending', appliedOn: '18-Oct-2026' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Leave Management</h2>
                <button onClick={() => setIsApplyModalOpen(true)} className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                    ➕ Apply Leave
                </button>
            </div>

            {/* Leave Balances */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏥</div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#64748b' }}>Sick Leave Balance</h3>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>8</p>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏖️</div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#64748b' }}>Casual Leave Balance</h3>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>5</p>
                </div>
            </div>

            {/* Leave History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 className="m-0 text-lg text-slate-800">Leave History</h3>
                </div>
                <table className="w-full border-collapse text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Reference ID</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Leave Type</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Duration (Days)</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Applied On</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveHistory.map((leave, idx) => (
                            <tr key={idx} className="border-b border-slate-200">
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#3b82f6', fontWeight: '500' }}>{leave.id}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>{leave.type}</td>
                                <td className="px-6 py-4">
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{leave.duration}</p>
                                    <span className="text-xs text-slate-500">{leave.days} Days</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{leave.appliedOn}</td>
                                <td className="px-6 py-4">
                                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: leave.status === 'Approved' ? '#dcfce7' : (leave.status === 'Pending' ? '#fef3c7' : '#fee2e2'), color: leave.status === 'Approved' ? '#166534' : (leave.status === 'Pending' ? '#d97706' : '#dc2626') }}>
                                        {leave.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Apply Leave Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="m-0 text-xl text-slate-900">Apply for Leave</h3>
                            <button onClick={() => setIsApplyModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Leave Type</label>
                                <select className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Half Day</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-slate-700">From Date</label>
                                    <input type="date" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-slate-700">To Date</label>
                                    <input type="date" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Reason for Leave</label>
                                <textarea rows="3" placeholder="Briefly explain your reason..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Supporting Document (Medical Certificate etc.)</label>
                                <input type="file" style={{ fontSize: '14px', color: '#64748b' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsApplyModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsApplyModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Submit Application</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
