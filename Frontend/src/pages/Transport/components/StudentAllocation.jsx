import React, { useState } from 'react';

const StudentAllocation = () => {
    const [activeTab, setActiveTab] = useState('list');

    const students = [
        { id: 'ST-001', name: 'Aarav Patel', class: '10-A', pickup: 'Green Park Metro', drop: 'Green Park Metro', bus: 'B-01', route: 'North City Circular' },
        { id: 'ST-002', name: 'Diya Sharma', class: '9-B', pickup: 'Hauz Khas Village', drop: 'Hauz Khas Village', bus: 'B-01', route: 'North City Circular' },
        { id: 'ST-003', name: 'Rohan Gupta', class: '10-A', pickup: 'Lajpat Nagar Market', drop: 'Lajpat Nagar Market', bus: 'B-02', route: 'South Avenue Express' }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl text-slate-900">Student Transport Allocation</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('assign')} className="px-5 py-2.5 bg-blue-500 border-none rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition">
                        ➕ Assign Student
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['list', 'assign'].map(tab => (
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
                        {tab === 'list' ? 'Allocated Students' : 'Assign / Modify Route'}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200 flex gap-4">
                        <input type="text" placeholder="Search by Student Name or ID..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Classes</option>
                            <option value="10">Class 10</option>
                            <option value="9">Class 9</option>
                        </select>
                        <select className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                            <option value="">All Routes</option>
                            <option value="RT-01">North City Circular</option>
                            <option value="RT-02">South Avenue Express</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Student</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Class</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Pickup / Drop Point</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Assigned Bus & Route</th>
                                    <th className="px-4 py-2 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="px-4 py-2">
                                            <p className="m-0 mb-1 text-sm font-semibold text-slate-800">{s.name}</p>
                                            <span className="text-xs text-slate-500">{s.id}</span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{s.class}</td>
                                        <td className="px-4 py-2 text-sm text-slate-600">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#10b981', fontWeight: '500' }}>↑ {s.pickup}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#3b82f6', fontWeight: '500' }}>↓ {s.drop}</p>
                                        </td>
                                        <td className="px-4 py-2">
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{s.route}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>Bus: {s.bus}</span>
                                        </td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <button className="px-3 py-1.5 bg-blue-50 text-blue-500 border-none rounded-md text-[13px] font-medium cursor-pointer hover:bg-blue-100 transition-colors">Change Route</button>
                                            <button style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'assign' && (
                <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Student</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select from list...</option>
                                <option>Kavya Verma (Class 10-B)</option>
                                <option>Ishaan Singh (Class 9-A)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Route</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Route...</option>
                                <option>North City Circular (RT-01)</option>
                                <option>South Avenue Express (RT-02)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Pickup Point</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Stop...</option>
                                <option>Green Park Metro</option>
                                <option>Hauz Khas Village</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Drop Point</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>Select Stop...</option>
                                <option>Green Park Metro</option>
                                <option>Hauz Khas Village</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button onClick={() => setActiveTab('list')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Assign Transport</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAllocation;
