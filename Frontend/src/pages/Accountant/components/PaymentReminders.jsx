import React, { useState } from 'react';
import DataTable from '../../../components/layout/DataTable';

const PaymentReminders = () => {
    const [activeTab, setActiveTab] = useState('send');

    const logs = [
        { id: 1, type: 'SMS', recipient: 'Parents of Class 10', message: 'Term 1 Fee is due on 30 Jun 2026.', date: '18 Jun 2026, 09:00 AM', status: 'Sent' },
        { id: 2, type: 'Email', recipient: 'Aarav Patel (Parent)', message: 'Your Transport Fee is overdue.', date: '17 Jun 2026, 04:30 PM', status: 'Sent' },
        { id: 3, type: 'SMS', recipient: 'Rohan Gupta (Parent)', message: 'Term 2 Fee payment failed.', date: '16 Jun 2026, 11:15 AM', status: 'Failed' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Payment Reminders</h2>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
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
                            <label className="block mb-2 text-sm font-medium text-slate-700">Select Target Audience</label>
                            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option>All Students with Pending Dues</option>
                                <option>Class 10 - Pending Dues</option>
                                <option>Class 9 - Pending Dues</option>
                                <option>Specific Student(s)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">Communication Channels</label>
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
                            <label className="block mb-2 text-sm font-medium text-slate-700">Message Template</label>
                            <select style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', marginBottom: '12px' }}>
                                <option>Standard Due Reminder</option>
                                <option>Overdue Warning</option>
                                <option>Custom Message</option>
                            </select>
                            <textarea 
                                rows="4" 
                                defaultValue="Dear Parent, This is a gentle reminder that the Term 1 Fee of ₹[Amount] for [Student_Name] is due by [Due_Date]. Please ignore if already paid."
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none resize-y"
                            ></textarea>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <button className="px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button style={{ padding: '12px 24px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🚀</span> Send Now
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div style={{ marginTop: '16px' }}>
                    <DataTable 
                        columns={[
                            { key: 'date', label: 'Date & Time' },
                            { key: 'type', label: 'Channel', render: (row) => <span style={{ fontWeight: 500, color: '#1e293b' }}>{row.type}</span> },
                            { key: 'recipient', label: 'Recipient' },
                            { key: 'message', label: 'Message Preview' },
                            { key: 'status', label: 'Status', render: (row) => (
                                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: row.status === 'Sent' ? '#dcfce7' : '#fee2e2', color: row.status === 'Sent' ? '#166534' : '#dc2626' }}>
                                    {row.status}
                                </span>
                            )}
                        ]}
                        data={logs}
                    />
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
                    <span className="text-[48px]">⚙️</span>
                    <h3 className="text-slate-900 my-4 mb-2">Automation Settings</h3>
                    <p className="text-slate-500">Configure automatic reminders to be sent X days before or after the due date.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentReminders;
