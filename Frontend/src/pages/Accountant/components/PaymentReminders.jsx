import React, { useState } from 'react';

const PaymentReminders = () => {
    const [activeTab, setActiveTab] = useState('send');

    const logs = [
        { id: 1, type: 'SMS', recipient: 'Parents of Class 10', message: 'Term 1 Fee is due on 30 Jun 2026.', date: '18 Jun 2026, 09:00 AM', status: 'Sent' },
        { id: 2, type: 'Email', recipient: 'Aarav Patel (Parent)', message: 'Your Transport Fee is overdue.', date: '17 Jun 2026, 04:30 PM', status: 'Sent' },
        { id: 3, type: 'SMS', recipient: 'Rohan Gupta (Parent)', message: 'Term 2 Fee payment failed.', date: '16 Jun 2026, 11:15 AM', status: 'Failed' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Payment Reminders</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['send', 'logs', 'settings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab ? '#0ea5e9' : 'white',
                            color: activeTab === tab ? 'white' : '#64748b',
                            border: activeTab === tab ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'send' ? 'Send Reminders' : tab === 'logs' ? 'Reminder Logs' : 'Automation Settings'}
                    </button>
                ))}
            </div>

            {activeTab === 'send' && (
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Target Audience</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                <option>All Students with Pending Dues</option>
                                <option>Class 10 - Pending Dues</option>
                                <option>Class 9 - Pending Dues</option>
                                <option>Specific Student(s)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Communication Channels</label>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                    <input type="checkbox" defaultChecked /> SMS
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                    <input type="checkbox" defaultChecked /> Email
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                    <input type="checkbox" defaultChecked /> Push Notification (App)
                                </label>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Message Template</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', marginBottom: '12px' }}>
                                <option>Standard Due Reminder</option>
                                <option>Overdue Warning</option>
                                <option>Custom Message</option>
                            </select>
                            <textarea 
                                rows="4" 
                                defaultValue="Dear Parent, This is a gentle reminder that the Term 1 Fee of ₹[Amount] for [Student_Name] is due by [Due_Date]. Please ignore if already paid."
                                style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                            ></textarea>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                        <button style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🚀</span> Send Now
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Date & Time</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Channel</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Recipient</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Message Preview</th>
                                    <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((l, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{l.date}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{l.type}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#334155' }}>{l.recipient}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{l.message}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: l.status === 'Sent' ? '#dcfce7' : '#fee2e2', color: l.status === 'Sent' ? '#166534' : '#dc2626' }}>
                                                {l.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <span style={{ fontSize: '48px' }}>⚙️</span>
                    <h3 style={{ color: '#0f172a', margin: '16px 0 8px 0' }}>Automation Settings</h3>
                    <p style={{ color: '#64748b' }}>Configure automatic reminders to be sent X days before or after the due date.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentReminders;
