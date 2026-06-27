import React, { useState } from 'react';

const RouteManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const routes = [
        { id: 'RT-01', name: 'North City Circular', bus: 'B-01', driver: 'Rajesh Kumar', stops: 12, distance: '15 km', estTime: '45 mins' },
        { id: 'RT-02', name: 'South Avenue Express', bus: 'B-02', driver: 'Sunil Sharma', stops: 8, distance: '10 km', estTime: '30 mins' },
        { id: 'RT-03', name: 'East Side Pickups', bus: 'V-01', driver: 'Ramesh Singh', stops: 5, distance: '8 km', estTime: '25 mins' }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl text-slate-900">Route Management</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('add')} className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                        ➕ Create Route
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
                        {tab === 'list' ? 'Route List' : 'Add/Edit Route'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Route Name & No</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Assigned Bus</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Assigned Driver</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Stats (Stops/Dist/Time)</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routes.map((r, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-4 py-2">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{r.name}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>{r.id}</span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{r.bus}</td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{r.driver}</td>
                                        <td className="px-4 py-2">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{r.stops} Stops • {r.distance}</p>
                                            <span className="text-xs text-slate-500">~{r.estTime}</span>
                                        </td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <button className="px-3 py-1.5 bg-blue-50 text-blue-500 border-none rounded-md text-[13px] font-medium cursor-pointer hover:bg-blue-100 transition-colors">Edit</button>
                                            <button style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'add' && (
                <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Route Number</label>
                            <input type="text" placeholder="e.g. RT-04" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Route Name</label>
                            <input type="text" placeholder="e.g. West End Link" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Assign Bus</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Bus...</option>
                                <option>B-01</option>
                                <option>B-02</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Assign Driver</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Driver...</option>
                                <option>Rajesh Kumar</option>
                                <option>Sunil Sharma</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Total Distance (km)</label>
                            <input type="number" placeholder="e.g. 12" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Estimated Time (mins)</label>
                            <input type="number" placeholder="e.g. 40" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Route</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteManagement;
