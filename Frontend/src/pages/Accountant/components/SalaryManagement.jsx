import React, { useState } from 'react';

const SalaryManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const salaries = [
        { id: 'EMP-001', name: 'Dr. Anita Desai', role: 'Principal', basic: '₹ 80,000', deductions: '₹ 12,000', pf_esi: '₹ 4,000', bonus: '₹ 5,000', net: '₹ 69,000', status: 'Processed' },
        { id: 'EMP-002', name: 'Ramesh Kumar', role: 'Teacher', basic: '₹ 45,000', deductions: '₹ 4,500', pf_esi: '₹ 2,500', bonus: '₹ 0', net: '₹ 38,000', status: 'Processed' },
        { id: 'EMP-003', name: 'Suresh Singh', role: 'Transport', basic: '₹ 25,000', deductions: '₹ 1,500', pf_esi: '₹ 1,000', bonus: '₹ 2,000', net: '₹ 24,500', status: 'Pending' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Salary Management</h2>
                <button style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                    ⚡ Process Bulk Salary
                </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
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
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                        <input type="month" defaultValue="2026-06" style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                            <option value="">All Departments</option>
                            <option value="teaching">Teaching Staff</option>
                            <option value="admin">Administration</option>
                            <option value="support">Support Staff</option>
                        </select>
                        <select style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                            <option value="">All Statuses</option>
                            <option value="Processed">Processed</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Employee</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Basic Pay</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Deductions & PF</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Bonus</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Net Salary</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.map((s, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{s.name}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{s.id} • {s.role}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155' }}>{s.basic}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#ef4444' }}>Tax: -{s.deductions}</p>
                                            <span style={{ fontSize: '13px', color: '#ef4444' }}>PF/ESI: -{s.pf_esi}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981' }}>{s.bonus !== '₹ 0' ? `+${s.bonus}` : '-'}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>{s.net}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: s.status === 'Processed' ? '#dcfce7' : '#fef3c7', color: s.status === 'Processed' ? '#166534' : '#d97706' }}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
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
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '48px' }}>📉</span>
                    <h3 style={{ color: '#0f172a', margin: '16px 0 8px 0' }}>Tax & Deduction Management</h3>
                    <p style={{ color: '#64748b' }}>Configure standard tax brackets, PF, ESI, and other automated deductions.</p>
                </div>
            )}

            {activeTab === 'bonus' && (
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '48px' }}>🎁</span>
                    <h3 style={{ color: '#0f172a', margin: '16px 0 8px 0' }}>Bonus Management</h3>
                    <p style={{ color: '#64748b' }}>Approve and assign festival bonuses, performance rewards, or advance payouts.</p>
                </div>
            )}
        </div>
    );
};

export default SalaryManagement;
