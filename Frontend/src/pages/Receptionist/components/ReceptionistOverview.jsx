import React from 'react';

const ReceptionistOverview = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(236, 72, 153, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Today's Visitors</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>45</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>12 Currently in premises</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(20, 184, 166, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Admission Enquiries</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>18</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Pending follow-ups</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Calls Handled</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>124</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Today</p>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Recent Front Desk Activity</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>👤</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Visitor Entry: Michael Brown</p>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Meeting with: Principal (10:15 AM)</span>
                        </div>
                    </li>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>📞</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Enquiry: Grade 1 Admission</p>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Forwarded to Admissions Team</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ReceptionistOverview;
