import React, { useState } from 'react';

const ComplaintView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Helpdesk & Complaints</h2>
                <button onClick={() => setIsModalOpen(true)} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                    ➕ Raise a Ticket
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>🎫</div>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>2</p>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Open</p>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>⚙️</div>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>1</p>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>In Progress</p>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>✅</div>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>4</p>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Resolved</p>
                </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>My Tickets</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['all', 'open', 'resolved'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 16px', background: activeTab === tab ? '#f1f5f9' : 'transparent', color: activeTab === tab ? '#0f172a' : '#64748b', border: '1px solid', borderColor: activeTab === tab ? '#cbd5e1' : 'transparent', borderRadius: '20px', fontWeight: '500', fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize' }}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { id: 'TKT-1024', subject: 'Wifi not working in library', category: 'IT Support', date: '10 Nov 2026', status: 'Open', statusColor: '#dc2626', statusBg: '#fee2e2' },
                        { id: 'TKT-1021', subject: 'Bus arriving late consistently', category: 'Transport', date: '08 Nov 2026', status: 'In Progress', statusColor: '#d97706', statusBg: '#fef3c7' },
                        { id: 'TKT-0985', subject: 'Error in fee receipt amount', category: 'Accounts', date: '25 Oct 2026', status: 'Resolved', statusColor: '#166534', statusBg: '#dcfce7' },
                        { id: 'TKT-0942', subject: 'Request for extra sports equipment', category: 'Sports', date: '12 Oct 2026', status: 'Resolved', statusColor: '#166534', statusBg: '#dcfce7' }
                    ].map((ticket, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', transition: 'all 0.2s', cursor: 'pointer', ':hover': { borderColor: '#cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ background: 'white', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '20px' }}>
                                    {ticket.category === 'IT Support' ? '💻' : (ticket.category === 'Transport' ? '🚌' : (ticket.category === 'Accounts' ? '💰' : '⚽'))}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6' }}>{ticket.id}</span>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>• {ticket.date}</span>
                                    </div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{ticket.subject}</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Category: {ticket.category}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                <span style={{ padding: '4px 12px', background: ticket.statusBg, color: ticket.statusColor, borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{ticket.status}</span>
                                <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>View Details ➔</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Raise a Ticket</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Category</label>
                                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>IT / Tech Support</option>
                                    <option>Academics</option>
                                    <option>Transport</option>
                                    <option>Accounts / Fee</option>
                                    <option>Hostel</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Subject</label>
                                <input type="text" placeholder="Brief summary of the issue" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Description</label>
                                <textarea rows="4" placeholder="Describe your issue in detail..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Attachment (Optional)</label>
                                <input type="file" style={{ fontSize: '14px', color: '#64748b' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Submit Ticket</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintView;
