import React, { useState } from 'react';

const VehicleManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const vehicles = [
        { id: 1, busNo: 'B-01', regNo: 'DL-1PC-4567', type: 'Bus', capacity: 50, status: 'Active', nextFitness: '15-Dec-2026' },
        { id: 2, busNo: 'B-02', regNo: 'DL-1PC-8910', type: 'Mini Bus', capacity: 30, status: 'Maintenance', nextFitness: '02-Nov-2026' },
        { id: 3, busNo: 'V-01', regNo: 'DL-4CX-1122', type: 'Van', capacity: 15, status: 'Active', nextFitness: '20-Jan-2027' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Vehicle Management</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('add')} className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                        ➕ Add Vehicle
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
                        {tab === 'list' ? 'Vehicle List' : 'Add/Edit Vehicle'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Bus No</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Registration</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type & Capacity</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Fitness Due</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((v, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{v.busNo}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{v.regNo}</td>
                                        <td className="px-6 py-4">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{v.type}</p>
                                            <span className="text-xs text-slate-500">Capacity: {v.capacity}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{v.nextFitness}</td>
                                        <td className="px-6 py-4">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: v.status === 'Active' ? '#dcfce7' : '#fef3c7', color: v.status === 'Active' ? '#166534' : '#d97706' }}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button className="px-3 py-1.5 bg-blue-50 text-blue-500 border-none rounded-md text-[13px] font-medium cursor-pointer hover:bg-blue-100 transition-colors">Edit</button>
                                            <button style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Disable</button>
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
                            <label className="block mb-2 text-sm font-medium text-slate-700">Bus Number</label>
                            <input type="text" placeholder="e.g. B-05" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Registration Number</label>
                            <input type="text" placeholder="e.g. DL-1PC-1234" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Vehicle Type</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Bus</option>
                                <option>Mini Bus</option>
                                <option>Van</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Seating Capacity</label>
                            <input type="number" placeholder="e.g. 50" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">GPS Device ID</label>
                            <input type="text" placeholder="e.g. GPS-9982" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Insurance Details (Policy No)</label>
                            <input type="text" placeholder="e.g. INS-459021" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Fitness Certificate Expiry</label>
                            <input type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Pollution Certificate Expiry</label>
                            <input type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Vehicle</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleManagement;
