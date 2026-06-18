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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Transport Fees Management</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
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

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
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
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                        <input type="text" placeholder="Search Student..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                            <option value="">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student Details</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Assigned Route</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Amount</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Payment Date</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentFees.map((s, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{s.student}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{s.id} • {s.class}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{s.route}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>{s.amount}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: getStatusStyle(s.status).bg, color: getStatusStyle(s.status).text }}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{s.date}</td>
                                        <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                                            {s.status !== 'Paid' && (
                                                <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Mark Paid</button>
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
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '48px' }}>🛣️</span>
                    <h3 style={{ color: '#0f172a', margin: '16px 0 8px 0' }}>Route-wise Fee Structure Setup</h3>
                    <p style={{ color: '#64748b' }}>Define and manage standard monthly/annual fees per route here.</p>
                </div>
            )}
        </div>
    );
};

export default TransportFees;
