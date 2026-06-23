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
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Vendor Management</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('add')} style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                        ➕ Register Vendor
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
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
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex gap-4">
                        <input type="text" placeholder="Search Vendor Name..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Categories</option>
                            {vendorTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Vendor Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact Number</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Pending Dues</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map((v, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p className="m-0 mb-1 text-sm font-semibold text-slate-800">{v.name}</p>
                                            <span className="text-xs text-slate-500">{v.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{v.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{v.contact}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: v.pendingDue === '₹ 0' ? '#10b981' : '#dc2626', fontWeight: '600' }}>{v.pendingDue}</td>
                                        <td className="px-6 py-4 flex gap-2">
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
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Vendor Name / Company Name</label>
                            <input type="text" placeholder="Enter name" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Vendor Type</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option value="">Select Type...</option>
                                {vendorTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Contact Person Name</label>
                            <input type="text" placeholder="Enter name" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Contact Number</label>
                            <input type="text" placeholder="10-digit number" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">GSTIN / Tax ID</label>
                            <input type="text" placeholder="Optional" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Bank Account Details</label>
                            <input type="text" placeholder="A/C No, IFSC, Bank Name" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Vendor</button>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
                    <span className="text-[48px]">💸</span>
                    <h3 className="text-slate-900 my-4 mb-2">Record Vendor Payments</h3>
                    <p className="text-slate-500">Select a vendor, enter the payment amount, transaction details, and upload the invoice here to clear dues.</p>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;
