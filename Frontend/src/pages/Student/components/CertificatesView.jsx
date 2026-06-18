import React, { useState } from 'react';

const CertificatesView = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Certificates</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                {[
                    { name: 'Bonafide Certificate', status: 'Available', color: '#3b82f6', bg: '#eff6ff' },
                    { name: 'Character Certificate', status: 'Available', color: '#10b981', bg: '#ecfdf5' },
                    { name: 'Fee Certificate', status: 'Available', color: '#8b5cf6', bg: '#f5f3ff' },
                    { name: 'Transfer Certificate', status: 'Not Requested', color: '#ef4444', bg: '#fef2f2' }
                ].map((cert, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: cert.bg, color: cert.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📜</div>
                        <div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>{cert.name}</h3>
                            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', background: cert.status === 'Available' ? '#dcfce7' : '#f1f5f9', color: cert.status === 'Available' ? '#166534' : '#64748b' }}>
                                {cert.status}
                            </span>
                        </div>
                        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '12px' }}>
                            {cert.status === 'Available' ? (
                                <button style={{ flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    ⬇️ Download
                                </button>
                            ) : (
                                <button style={{ flex: 1, padding: '10px', background: 'white', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    ➕ Request
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1e293b' }}>Certificate Requests History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '14px' }}>
                            <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Request ID</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Certificate Type</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date Requested</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Reason</th>
                            <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: 'REQ-2026-112', type: 'Bonafide Certificate', date: '01 Nov 2026', reason: 'Bank Account Opening', status: 'Approved', bg: '#dcfce7', color: '#166534' },
                            { id: 'REQ-2026-098', type: 'Fee Certificate', date: '15 Sep 2026', reason: 'Income Tax Return', status: 'Approved', bg: '#dcfce7', color: '#166534' }
                        ].map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px', fontWeight: '500', color: '#3b82f6' }}>{row.id}</td>
                                <td style={{ padding: '16px', color: '#334155' }}>{row.type}</td>
                                <td style={{ padding: '16px', color: '#64748b' }}>{row.date}</td>
                                <td style={{ padding: '16px', color: '#64748b' }}>{row.reason}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ padding: '4px 10px', background: row.bg, color: row.color, borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{row.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CertificatesView;
