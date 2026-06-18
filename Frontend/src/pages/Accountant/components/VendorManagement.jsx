import React, { useState } from 'react';

const VendorManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const vendors = [
        { id: 'VND-001', name: 'Saraswati Stationers', type: 'Stationery Supplier', contact: '+91 9876543210', pendingDue: '₹ 15,000', status: 'Active' },
        { id: 'VND-002', name: 'Rapid City Travels', type: 'Bus Contractor', contact: '+91 9123456789', pendingDue: '₹ 0', status: 'Active' },
        { id: 'VND-003', name: 'Global Uniforms', type: 'Uniform Supplier', contact: '+91 9988776655', pendingDue: '₹ 45,000', status: 'Active' }
    ];

    const vendorTypes = ['Stationery Supplier', 'Bus Contractor', 'Uniform Supplier', 'Maintenance Vendor', 'Event Management', 'IT Equipment'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Vendor Management</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('add')} style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                        ➕ Register Vendor
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['list', 'add', 'payments'].map(tab => (
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
                        {tab === 'list' ? 'Registered Vendors' : tab === 'add' ? 'Add/Edit Vendor' : 'Record Payments'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                        <input type="text" placeholder="Search Vendor Name..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                            <option value="">All Categories</option>
                            {vendorTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Vendor Details</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Type</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Contact Number</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Pending Dues</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map((v, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{v.name}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{v.id}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155' }}>{v.type}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{v.contact}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: v.pendingDue === '₹ 0' ? '#10b981' : '#dc2626', fontWeight: '600' }}>{v.pendingDue}</td>
                                        <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                                            <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Pay</button>
                                            <button style={{ padding: '6px 12px', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'add' && (
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Vendor Name / Company Name</label>
                            <input type="text" placeholder="Enter name" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Vendor Type</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option value="">Select Type...</option>
                                {vendorTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Contact Person Name</label>
                            <input type="text" placeholder="Enter name" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Contact Number</label>
                            <input type="text" placeholder="10-digit number" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>GSTIN / Tax ID</label>
                            <input type="text" placeholder="Optional" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Bank Account Details</label>
                            <input type="text" placeholder="A/C No, IFSC, Bank Name" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                        <button onClick={() => setActiveTab('list')} style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Vendor</button>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '48px' }}>💸</span>
                    <h3 style={{ color: '#0f172a', margin: '16px 0 8px 0' }}>Record Vendor Payments</h3>
                    <p style={{ color: '#64748b' }}>Select a vendor, enter the payment amount, transaction details, and upload the invoice here to clear dues.</p>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;
