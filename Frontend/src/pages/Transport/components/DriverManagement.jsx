import React, { useState } from 'react';

const DriverManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const drivers = [
        { id: 'DR-001', name: 'Rajesh Kumar', mobile: '+91 98765 43210', licenseNo: 'DL-1420110012345', licenseExpiry: '15-Dec-2028', status: 'Active', route: 'Route A' },
        { id: 'DR-002', name: 'Sunil Sharma', mobile: '+91 87654 32109', licenseNo: 'DL-1420150098765', licenseExpiry: '02-Nov-2026', status: 'Active', route: 'Route B' },
        { id: 'DR-003', name: 'Ramesh Singh', mobile: '+91 76543 21098', licenseNo: 'HR-2620180054321', licenseExpiry: '20-Jan-2029', status: 'On Leave', route: '-' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Driver Management</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('add')} className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                        ➕ Add Driver
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['list', 'add'].map(tab => (
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
                        {tab === 'list' ? 'Driver List' : 'Add/Edit Driver'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Driver Name & ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">License Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Assigned Route</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((d, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-6 py-4">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{d.name}</p>
                                            <span className="text-xs text-slate-500">{d.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{d.mobile}</td>
                                        <td className="px-6 py-4">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{d.licenseNo}</p>
                                            <span className="text-xs text-slate-500">Exp: {d.licenseExpiry}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{d.route}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: d.status === 'Active' ? '#dcfce7' : '#fef3c7', color: d.status === 'Active' ? '#166534' : '#d97706' }}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button className="px-3 py-1.5 bg-blue-50 text-blue-500 border-none rounded-md text-[13px] font-medium cursor-pointer hover:bg-blue-100 transition-colors">Edit</button>
                                            <button style={{ padding: '6px 12px', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Assign Route</button>
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
                            <label className="block mb-2 text-sm font-medium text-slate-700">Driver Name</label>
                            <input type="text" placeholder="e.g. Rajesh Kumar" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Employee ID</label>
                            <input type="text" placeholder="e.g. DR-005" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Mobile Number</label>
                            <input type="text" placeholder="e.g. +91 9876543210" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Emergency Contact</label>
                            <input type="text" placeholder="e.g. +91 9988776655" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">License Number</label>
                            <input type="text" placeholder="e.g. DL-..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">License Expiry Date</label>
                            <input type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Residential Address</label>
                            <textarea rows="3" placeholder="Full address..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none resize-y"></textarea>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Driver</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverManagement;
