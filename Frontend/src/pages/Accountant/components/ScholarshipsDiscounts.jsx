import React, { useState } from 'react';

const ScholarshipsDiscounts = () => {
    const [activeTab, setActiveTab] = useState('list');

    const grants = [
        { id: 'GR-1001', student: 'Aarav Patel', class: '10-A', type: 'Merit Scholarship', amount: '₹ 10,000', validTill: 'Mar 2027', status: 'Approved' },
        { id: 'GR-1002', student: 'Kavya Verma', class: '8-C', type: 'Sibling Discount', amount: '20% off Tuition', validTill: 'Lifetime', status: 'Approved' },
        { id: 'GR-1003', student: 'Rohan Gupta', class: '10-A', type: 'Sports Concession', amount: '₹ 5,000', validTill: 'Dec 2026', status: 'Pending Approval' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Scholarships & Discounts</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('assign')} style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                        ➕ Grant Discount
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
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
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                        <input type="text" placeholder="Search Student..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                            <option value="">All Types</option>
                            <option value="scholarship">Scholarships</option>
                            <option value="discount">Discounts</option>
                            <option value="concession">Concessions</option>
                        </select>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Class</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Grant Type</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Amount / %</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Valid Till</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grants.map((g, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{g.student}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{g.id}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{g.class}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155' }}>{g.type}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{g.amount}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{g.validTill}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: g.status === 'Approved' ? '#dcfce7' : '#fef3c7', color: g.status === 'Approved' ? '#166534' : '#d97706' }}>
                                                {g.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Student</label>
                            <input type="text" placeholder="Search by name or admission no." style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Discount / Scholarship Type</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option>Sibling Discount</option>
                                <option>Merit Scholarship</option>
                                <option>Sports Concession</option>
                                <option>Staff Child Concession</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Discount Value</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="number" placeholder="Enter value" style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                <select style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>₹ (Flat)</option>
                                    <option>% (Percentage)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Validity</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option>This Term Only</option>
                                <option>This Academic Year</option>
                                <option>Lifetime (Until Graduation)</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Remarks / Reason for Grant</label>
                            <textarea rows="3" placeholder="Provide justification..." style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                        <button onClick={() => setActiveTab('list')} style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Submit for Approval</button>
                    </div>
                </div>
            )}

            {activeTab === 'types' && (
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '48px' }}>📜</span>
                    <h3 style={{ color: '#0f172a', margin: '16px 0 8px 0' }}>Manage Discount/Scholarship Types</h3>
                    <p style={{ color: '#64748b' }}>Define the rules and standard amounts for different types of financial grants here.</p>
                </div>
            )}
        </div>
    );
};

export default ScholarshipsDiscounts;
