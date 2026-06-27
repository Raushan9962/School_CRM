import React, { useState } from 'react';

const StopManagement = () => {
    const [activeTab, setActiveTab] = useState('list');

    const stops = [
        { id: 'STP-01', name: 'Green Park Metro', location: 'Green Park, South Delhi', pickupTime: '07:15 AM', dropTime: '03:45 PM', route: 'North City Circular (RT-01)' },
        { id: 'STP-02', name: 'Hauz Khas Village', location: 'Hauz Khas, South Delhi', pickupTime: '07:30 AM', dropTime: '03:30 PM', route: 'North City Circular (RT-01)' },
        { id: 'STP-03', name: 'Lajpat Nagar Market', location: 'Lajpat Nagar, South Delhi', pickupTime: '07:10 AM', dropTime: '03:50 PM', route: 'South Avenue Express (RT-02)' }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl text-slate-900">Stop Management</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('add')} className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                        ➕ Create Stop
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
                        {tab === 'list' ? 'Stop List' : 'Add/Edit Stop'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200 flex gap-4">
                        <select style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}>
                            <option value="">Filter by Route...</option>
                            <option value="RT-01">North City Circular (RT-01)</option>
                            <option value="RT-02">South Avenue Express (RT-02)</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Stop Name & ID</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Location</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Timings (Pickup/Drop)</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Assigned Route</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stops.map((s, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-4 py-2">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{s.name}</p>
                                            <span className="text-xs text-slate-500">{s.id}</span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{s.location}</td>
                                        <td className="px-4 py-2">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#10b981', fontWeight: '500' }}>↑ {s.pickupTime}</p>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#3b82f6', fontWeight: '500' }}>↓ {s.dropTime}</p>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{s.route}</td>
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
                            <label className="block mb-2 text-sm font-medium text-slate-700">Stop Name</label>
                            <input type="text" placeholder="e.g. Green Park Metro" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Assign Route</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Route...</option>
                                <option>North City Circular (RT-01)</option>
                                <option>South Avenue Express (RT-02)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Pickup Time</label>
                            <input type="time" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Drop Time</label>
                            <input type="time" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Detailed Location</label>
                            <textarea rows="2" placeholder="Full address or landmark..." className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none resize-y"></textarea>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Stop</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StopManagement;
