import React from 'react';

const AuditLogs = () => {
    const logs = [
        { id: 1, date: '18 Jun 2026, 11:45 AM', user: 'Accountant_Admin', action: 'Approved Refund of ₹ 15,000 for Rohan Gupta (REF-2002)', module: 'Refund Management', ip: '192.168.1.10' },
        { id: 2, date: '18 Jun 2026, 10:30 AM', user: 'Accountant_Admin', action: 'Collected Fee of ₹ 15,000 from Aarav Patel (TXN-98234)', module: 'Fee Collection', ip: '192.168.1.10' },
        { id: 3, date: '18 Jun 2026, 09:15 AM', user: 'System_Auto', action: 'Sent Automated SMS Reminders to Class 10 Parents', module: 'Payment Reminders', ip: 'System' },
        { id: 4, date: '17 Jun 2026, 02:15 PM', user: 'Accountant_Admin', action: 'Recorded Expense of ₹ 45,000 for Stationery (EXP-1001)', module: 'Expense Management', ip: '192.168.1.10' },
        { id: 5, date: '17 Jun 2026, 11:00 AM', user: 'Super_Admin', action: 'Updated Fee Structure for Academic Year 2026-27', module: 'Fee Categories', ip: '192.168.1.5' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Financial Audit Logs</h2>
                <div className="flex gap-3">
                    <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📥 Export Logs
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <input type="date" className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                    <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                        <option value="">All Users</option>
                        <option value="accountant">Accountant_Admin</option>
                        <option value="system">System_Auto</option>
                        <option value="super">Super_Admin</option>
                    </select>
                    <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                        <option value="">All Modules</option>
                        <option value="fee">Fee Collection</option>
                        <option value="expense">Expense Management</option>
                        <option value="refund">Refund Management</option>
                        <option value="salary">Salary Management</option>
                    </select>
                    <input type="text" placeholder="Search Actions..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', minWidth: '200px' }} />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date & Time</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">User</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Module</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Action Performed</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>{log.date}</td>
                                    <td className="px-6 py-4">
                                        <span style={{ padding: '4px 8px', background: log.user === 'System_Auto' ? '#f1f5f9' : '#eff6ff', color: log.user === 'System_Auto' ? '#64748b' : '#3b82f6', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                            {log.user}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{log.module}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>{log.action}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace' }}>{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Showing 1 to 5 of 124 entries</span>
                    <div className="flex gap-2">
                        <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: 'white', color: '#94a3b8', borderRadius: '6px', cursor: 'not-allowed' }}>Previous</button>
                        <button style={{ padding: '6px 12px', border: '1px solid #0ea5e9', background: '#0ea5e9', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>1</button>
                        <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', borderRadius: '6px', cursor: 'pointer' }}>2</button>
                        <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', borderRadius: '6px', cursor: 'pointer' }}>3</button>
                        <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', borderRadius: '6px', cursor: 'pointer' }}>Next</button>
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#b91c1c' }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>Security Notice</h4>
                    <p style={{ margin: 0, fontSize: '13px' }}>Audit logs are read-only and cannot be altered or deleted by any user, including the Super Admin. These records are maintained for financial compliance.</p>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
