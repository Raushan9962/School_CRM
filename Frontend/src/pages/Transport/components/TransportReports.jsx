import React, { useState } from 'react';

const TransportReports = () => {
    const [reportType, setReportType] = useState('vehicle');

    const reportOptions = [
        { id: 'vehicle', label: 'Vehicle Report' },
        { id: 'route', label: 'Route Report' },
        { id: 'driver', label: 'Driver Report' },
        { id: 'student', label: 'Student Transport Report' },
        { id: 'maintenance', label: 'Maintenance Report' },
        { id: 'fuel', label: 'Fuel Consumption Report' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Reports & Analytics</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '250px' }}
                >
                    {reportOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                </select>
                <input type="date" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                <span style={{ alignSelf: 'center', color: '#64748b' }}>to</span>
                <input type="date" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                <button style={{ padding: '10px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Generate Report</button>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        📊
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                        {reportOptions.find(o => o.id === reportType)?.label}
                    </h3>
                    <p style={{ margin: '0 0 24px 0' }}>Data visualization and detailed tabular report will be displayed here.</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button style={{ padding: '10px 20px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📄 Download PDF
                        </button>
                        <button style={{ padding: '10px 20px', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📊 Export to Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportReports;
