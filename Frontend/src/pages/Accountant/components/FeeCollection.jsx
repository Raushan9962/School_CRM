import React, { useState } from 'react';

const FeeCollection = () => {
    const [activeTab, setActiveTab] = useState('collect');

    const recentCollections = [
        { id: 'TXN-98234', receipt: 'REC-2026-001', student: 'Aarav Patel', amount: '₹ 15,000', method: 'Online', date: '18 Jun 2026' },
        { id: 'TXN-98235', receipt: 'REC-2026-002', student: 'Diya Sharma', amount: '₹ 10,000', method: 'Cash', date: '18 Jun 2026' },
        { id: 'TXN-98236', receipt: 'REC-2026-003', student: 'Rohan Gupta', amount: '₹ 25,000', method: 'Cheque', date: '17 Jun 2026' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Fee Collection Desk</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['collect', 'history'].map(tab => (
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
                        {tab === 'collect' ? 'Collect Fees' : 'Collection History'}
                    </button>
                ))}
            </div>

            {activeTab === 'collect' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1e293b' }}>Student Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Search Student</label>
                                <input type="text" placeholder="Enter Admission No. or Name..." style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Student Name: <strong style={{ color: '#1e293b' }}>Aarav Patel</strong></p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Class: <strong style={{ color: '#1e293b' }}>10-A</strong></p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Pending Dues: <strong style={{ color: '#dc2626' }}>₹ 25,000</strong></p>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Fee to Pay</label>
                                <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>Term 1 Fee (₹ 25,000)</option>
                                    <option>Transport Fee (₹ 1,500)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1e293b' }}>Payment Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Amount Receiving (₹)</label>
                                <input type="number" defaultValue="25000" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Payment Method</label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                        <input type="radio" name="method" defaultChecked /> Cash
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                        <input type="radio" name="method" /> Online/UPI
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                        <input type="radio" name="method" /> Cheque
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Remarks / Cheque No.</label>
                                <input type="text" placeholder="Optional details..." style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <button style={{ flex: 1, padding: '12px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                                    💳 Process Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                        <input type="text" placeholder="Search Receipt No. or TXN ID..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <input type="date" style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Receipt No.</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Transaction ID & Date</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student Name</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Amount</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Payment Method</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCollections.map((c, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{c.receipt}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#475569' }}>{c.id}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{c.date}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155' }}>{c.student}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{c.amount}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{c.method}</td>
                                        <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                                            <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                🖨️ Print
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeCollection;
