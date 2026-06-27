import React, { useState } from 'react';

const MaintenanceManagement = () => {
    const [activeTab, setActiveTab] = useState('schedule');

    const maintenanceRecords = [
        { id: 'MNT-001', bus: 'B-01', type: 'Routine Service', lastService: '10-May-2026', nextService: '10-Nov-2026', cost: '₹5,000', status: 'Completed' },
        { id: 'MNT-002', bus: 'B-02', type: 'Tire Replacement', lastService: '15-Jun-2026', nextService: '15-Dec-2027', cost: '₹12,000', status: 'In Progress' },
        { id: 'MNT-003', bus: 'V-01', type: 'AC Repair', lastService: '01-Jun-2026', nextService: '-', cost: '₹3,500', status: 'Pending' }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl text-slate-900">Maintenance Management</h2>
                {activeTab === 'schedule' && (
                    <button onClick={() => setActiveTab('add')} className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                        ➕ Log Maintenance
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['schedule', 'fuel', 'add'].map(tab => (
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
                        {tab === 'schedule' ? 'Service Schedule & Repairs' : tab === 'fuel' ? 'Fuel Records' : 'Log Maintenance'}
                    </button>
                ))}
            </div>

            {activeTab === 'schedule' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Bus No & ID</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Maintenance Type</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Service Dates</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Cost</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenanceRecords.map((m, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-4 py-2">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{m.bus}</p>
                                            <span className="text-xs text-slate-500">{m.id}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{m.type}</td>
                                        <td className="px-4 py-2">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#475569' }}>Last: {m.lastService}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#10b981', fontWeight: '500' }}>Next: {m.nextService}</p>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>{m.cost}</td>
                                        <td className="px-4 py-2">
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: m.status === 'Completed' ? '#dcfce7' : (m.status === 'In Progress' ? '#fef3c7' : '#fee2e2'), color: m.status === 'Completed' ? '#166534' : (m.status === 'In Progress' ? '#d97706' : '#dc2626') }}>
                                                {m.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'fuel' && (
                <div className="bg-white p-10 rounded-lg text-center shadow-sm">
                    <span className="text-[48px]">⛽</span>
                    <h3 className="text-slate-900 my-4 mb-2">Fuel Tracking Module</h3>
                    <p className="text-slate-500">Log daily fuel consumption and analyze fuel efficiency per vehicle here.</p>
                </div>
            )}

            {activeTab === 'add' && (
                <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Vehicle</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Bus...</option>
                                <option>B-01</option>
                                <option>B-02</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Maintenance Type</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Routine Service</option>
                                <option>Repair</option>
                                <option>Part Replacement</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Service Date</label>
                            <input type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Next Service Due</label>
                            <input type="date" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Maintenance Cost (₹)</label>
                            <input type="number" placeholder="e.g. 5000" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Status</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Completed</option>
                                <option>In Progress</option>
                                <option>Pending</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Details / Remarks</label>
                            <textarea rows="3" placeholder="Describe the maintenance done..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none resize-y"></textarea>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('schedule')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Log Maintenance</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceManagement;
