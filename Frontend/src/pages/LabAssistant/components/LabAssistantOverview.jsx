import React from 'react';

const LabAssistantOverview = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Total Equipment</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>854</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Across all labs</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Functional</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>842</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Ready to use</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Under Maintenance</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>12</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Require fixing/replacement</p>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Recent Lab Activity</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>🔬</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Microscope 12 checked out</p>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>By: Mr. Johnson (Biology)</span>
                        </div>
                    </li>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>⚠️</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Damaged Beaker Reported</p>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Chemistry Lab 02</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LabAssistantOverview;
