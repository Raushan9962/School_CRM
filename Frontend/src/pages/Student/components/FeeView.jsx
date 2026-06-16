import React from 'react';

const FeeView = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#0f172a' }}>Fee Management</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '24px', borderRadius: '16px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '16px', opacity: 0.9 }}>Amount Due</p>
                    <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>$450.00</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.8 }}>Due on 31 Oct 2026</p>
                    <button style={{ marginTop: '16px', padding: '12px', background: 'white', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        Pay Now
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Total Fee (Annual)</p>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>$2,400.00</p>
                    </div>
                    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Total Paid</p>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>$1,950.00</p>
                    </div>
                </div>
            </div>

            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Payment History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '8px 0 0 8px' }}>Date</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Description</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Amount</th>
                        <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600', borderRadius: '0 8px 8px 0' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px' }}>01 Sep 2026</td>
                        <td style={{ padding: '16px' }}>Term 2 Fee</td>
                        <td style={{ padding: '16px' }}>$800.00</td>
                        <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Paid</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px' }}>15 Aug 2026</td>
                        <td style={{ padding: '16px' }}>Library Fine</td>
                        <td style={{ padding: '16px' }}>$15.00</td>
                        <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Paid</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px' }}>01 May 2026</td>
                        <td style={{ padding: '16px' }}>Term 1 Fee</td>
                        <td style={{ padding: '16px' }}>$800.00</td>
                        <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Paid</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default FeeView;
