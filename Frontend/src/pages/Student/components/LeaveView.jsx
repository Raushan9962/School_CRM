import React, { useState } from 'react';

const LeaveView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Leave Management</h2>
                <button onClick={() => setIsModalOpen(true)} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                    ➕ Apply for Leave
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>⏳</div>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>1</p>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Pending</p>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>✅</div>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>3</p>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Approved</p>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>❌</div>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>0</p>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Rejected</p>
                </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1e293b' }}>Leave History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '14px' }}>
                            <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px', fontWeight: '600' }}>Date(s)</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Type</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Reason</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Attachment</th>
                            <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0', fontWeight: '600' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { dates: '10 Nov - 11 Nov 2026', type: 'Sick Leave', reason: 'Viral Fever', doc: 'Medical_Cert.pdf', status: 'Pending', statusColor: '#d97706', statusBg: '#fef3c7' },
                            { dates: '24 Oct 2026', type: 'Casual Leave', reason: 'Family Function', doc: null, status: 'Approved', statusColor: '#166534', statusBg: '#dcfce7' },
                            { dates: '15 Sep - 16 Sep 2026', type: 'Sick Leave', reason: 'Stomach Ache', doc: 'Prescription.jpg', status: 'Approved', statusColor: '#166534', statusBg: '#dcfce7' },
                        ].map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px', fontWeight: '500', color: '#334155' }}>{row.dates}</td>
                                <td style={{ padding: '16px', color: '#64748b' }}>{row.type}</td>
                                <td style={{ padding: '16px', color: '#334155' }}>{row.reason}</td>
                                <td style={{ padding: '16px' }}>
                                    {row.doc ? (
                                        <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📄 {row.doc}
                                        </button>
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>None</span>
                                    )}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ padding: '4px 10px', background: row.statusBg, color: row.statusColor, borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{row.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Apply for Leave</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Leave Type</label>
                                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Emergency Leave</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>From Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>To Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Reason</label>
                                <textarea rows="3" placeholder="Explain the reason for your leave..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Medical Certificate / Document (Optional)</label>
                                <div style={{ border: '1px dashed #cbd5e1', padding: '20px', borderRadius: '8px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '24px' }}>📤</span>
                                    <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748b' }}>Click to upload or drag and drop</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Submit Application</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveView;
