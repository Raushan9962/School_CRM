import React, { useState } from 'react';

const StudentAllocation = () => {
    const [activeTab, setActiveTab] = useState('list');

    const students = [
        { id: 'ST-001', name: 'Aarav Patel', class: '10-A', pickup: 'Green Park Metro', drop: 'Green Park Metro', bus: 'B-01', route: 'North City Circular' },
        { id: 'ST-002', name: 'Diya Sharma', class: '9-B', pickup: 'Hauz Khas Village', drop: 'Hauz Khas Village', bus: 'B-01', route: 'North City Circular' },
        { id: 'ST-003', name: 'Rohan Gupta', class: '10-A', pickup: 'Lajpat Nagar Market', drop: 'Lajpat Nagar Market', bus: 'B-02', route: 'South Avenue Express' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Student Transport Allocation</h2>
                {activeTab === 'list' && (
                    <button onClick={() => setActiveTab('assign')} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        ➕ Assign Student
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
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
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                        <input type="text" placeholder="Search by Student Name or ID..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                        <select style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                            <option value="">All Classes</option>
                            <option value="10">Class 10</option>
                            <option value="9">Class 9</option>
                        </select>
                        <select style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                            <option value="">All Routes</option>
                            <option value="RT-01">North City Circular</option>
                            <option value="RT-02">South Avenue Express</option>
                        </select>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Class</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Pickup / Drop Point</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Assigned Bus & Route</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{s.name}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>{s.id}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{s.class}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#10b981', fontWeight: '500' }}>↑ {s.pickup}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#3b82f6', fontWeight: '500' }}>↓ {s.drop}</p>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{s.route}</p>
                                            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>Bus: {s.bus}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                                            <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Change Route</button>
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
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Student</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option>Select from list...</option>
                                <option>Kavya Verma (Class 10-B)</option>
                                <option>Ishaan Singh (Class 9-A)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Route</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option>Select Route...</option>
                                <option>North City Circular (RT-01)</option>
                                <option>South Avenue Express (RT-02)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Pickup Point</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option>Select Stop...</option>
                                <option>Green Park Metro</option>
                                <option>Hauz Khas Village</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Drop Point</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option>Select Stop...</option>
                                <option>Green Park Metro</option>
                                <option>Hauz Khas Village</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                        <button onClick={() => setActiveTab('list')} style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Assign Transport</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAllocation;
