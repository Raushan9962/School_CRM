import React, { useState } from 'react';

const LeaveManagement = () => {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const leaveHistory = [
        { id: 'LV-2026-08', type: 'Sick Leave', duration: '12-Oct-2026 to 13-Oct-2026', days: 2, status: 'Approved', appliedOn: '10-Oct-2026' },
        { id: 'LV-2026-09', type: 'Casual Leave', duration: '20-Oct-2026 to 20-Oct-2026', days: 1, status: 'Pending', appliedOn: '18-Oct-2026' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Leave Management</h2>
                <button onClick={() => setIsApplyModalOpen(true)} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
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
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Leave History</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Reference ID</th>
                            <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Leave Type</th>
                            <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Duration (Days)</th>
                            <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Applied On</th>
                            <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveHistory.map((leave, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#3b82f6', fontWeight: '500' }}>{leave.id}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>{leave.type}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{leave.duration}</p>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{leave.days} Days</span>
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{leave.appliedOn}</td>
                                <td style={{ padding: '16px 24px' }}>
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
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Apply for Leave</h3>
                            <button onClick={() => setIsApplyModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Leave Type</label>
                                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Half Day</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>From Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>To Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Reason for Leave</label>
                                <textarea rows="3" placeholder="Briefly explain your reason..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Supporting Document (Medical Certificate etc.)</label>
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
