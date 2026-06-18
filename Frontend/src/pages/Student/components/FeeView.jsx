import React from 'react';

const FeeView = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Fees Management</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ❓ Raise Query
                    </button>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        💳 Pay Fees Online
                    </button>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '32px 24px', borderRadius: '16px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '16px', opacity: 0.9 }}>Pending Amount</p>
                    <p style={{ margin: 0, fontSize: '42px', fontWeight: 'bold' }}>₹ 2,500</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.8 }}>Due by 31 Oct 2026</p>
                    <button style={{ marginTop: '24px', padding: '14px', background: 'white', color: '#dc2626', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        Pay Now
                    </button>
                    <span style={{ position: 'absolute', right: -20, bottom: -20, fontSize: '120px', opacity: 0.1 }}>⚠️</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Total Fees (Annual)</p>
                        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>₹ 24,000</p>
                    </div>
                    <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Paid Fees</p>
                        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>₹ 21,500</p>
                    </div>
                    <div style={{ padding: '24px', background: '#fff1f2', borderRadius: '16px', border: '1px solid #ffe4e6', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#be123c', fontSize: '14px' }}>Fine Amount</p>
                        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#e11d48' }}>₹ 50</p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#f43f5e' }}>Late fee added</p>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1e293b' }}>Payment History</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '14px' }}>
                                <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Receipt No.</th>
                                <th style={{ padding: '12px 16px' }}>Date</th>
                                <th style={{ padding: '12px 16px' }}>Description</th>
                                <th style={{ padding: '12px 16px' }}>Amount</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                                <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'REC-2026-092', date: '01 Sep 2026', desc: 'Term 2 Fee', amount: 8000, status: 'Paid' },
                                { id: 'REC-2026-054', date: '15 Aug 2026', desc: 'Library Fine', amount: 150, status: 'Paid' },
                                { id: 'REC-2026-011', date: '01 May 2026', desc: 'Term 1 Fee', amount: 13500, status: 'Paid' },
                            ].map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: '#334155' }}>{row.id}</td>
                                    <td style={{ padding: '16px', color: '#64748b' }}>{row.date}</td>
                                    <td style={{ padding: '16px', color: '#334155' }}>{row.desc}</td>
                                    <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>₹ {row.amount}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>{row.status}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            ⬇️ Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeView;
