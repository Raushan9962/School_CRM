import React from 'react';

const TransportRequests = () => {
    const requests = [
        { id: 'REQ-101', student: 'Aarav Patel', class: '10-A', type: 'Route Change', detail: 'Change from RT-01 to RT-02', date: '18-Jun-2026', status: 'Pending' },
        { id: 'REQ-102', student: 'Diya Sharma', class: '9-B', type: 'Stop Change', detail: 'Change drop point to Lajpat Nagar', date: '17-Jun-2026', status: 'Pending' },
        { id: 'REQ-103', student: 'Rohan Gupta', class: '10-A', type: 'New Transport', detail: 'Requires transport from August', date: '15-Jun-2026', status: 'Approved' },
        { id: 'REQ-104', student: 'Kavya Verma', class: '8-C', type: 'Cancellation', detail: 'Relocating to nearby society', date: '14-Jun-2026', status: 'Rejected' }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Pending': return { bg: '#fef3c7', text: '#d97706' };
            case 'Approved': return { bg: '#dcfce7', text: '#166534' };
            case 'Rejected': return { bg: '#fee2e2', text: '#dc2626' };
            default: return { bg: '#f1f5f9', text: '#475569' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Transport Requests</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '200px' }}>
                    <option value="">All Request Types</option>
                    <option value="New Transport">New Transport</option>
                    <option value="Route Change">Route Change</option>
                    <option value="Stop Change">Stop Change</option>
                    <option value="Cancellation">Cancellation</option>
                </select>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button style={{ padding: '10px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Filter</button>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Request ID & Date</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student Details</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Request Type & Details</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{r.id}</p>
                                        <span style={{ fontSize: '12px', color: '#64748b' }}>{r.date}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{r.student}</p>
                                        <span style={{ fontSize: '12px', color: '#64748b' }}>Class: {r.class}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>{r.type}</p>
                                        <span style={{ fontSize: '13px', color: '#475569' }}>{r.detail}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: getStatusStyle(r.status).bg, color: getStatusStyle(r.status).text }}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                                        {r.status === 'Pending' ? (
                                            <>
                                                <button style={{ padding: '6px 12px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Approve</button>
                                                <button style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Reject</button>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Processed</span>
                                        )}
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

export default TransportRequests;
