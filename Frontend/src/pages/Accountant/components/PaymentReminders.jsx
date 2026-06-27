import React, { useState } from 'react';
import { Bell, Send, Settings, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const PaymentReminders = () => {
    const [activeTab, setActiveTab] = useState('defaulters');
    const [sending, setSending] = useState(false);

    const defaulters = [
        { id: 'ST-101', name: 'Aarav Patel', class: '10-A', parentPhone: '+91 9876543210', dueAmount: 25000, dueSince: '15 Days', lastReminder: '2 Days Ago' },
        { id: 'ST-105', name: 'Rohan Gupta', class: '9-B', parentPhone: '+91 9123456789', dueAmount: 12000, dueSince: '30 Days', lastReminder: '5 Days Ago' },
        { id: 'ST-201', name: 'Sneha Sharma', class: '12-Sci', parentPhone: '+91 9988776655', dueAmount: 45000, dueSince: '45 Days', lastReminder: '1 Week Ago' }
    ];

    const logs = [
        { id: 1, type: 'SMS', recipient: 'Parents of Class 10', message: 'Term 1 Fee is due on 30 Jun.', date: '18 Jun, 09:00 AM', status: 'Sent' },
        { id: 2, type: 'Email', recipient: 'Aarav Patel (Parent)', message: 'Your Transport Fee is overdue.', date: '17 Jun, 04:30 PM', status: 'Sent' },
        { id: 3, type: 'SMS', recipient: 'Rohan Gupta (Parent)', message: 'Term 2 Fee payment failed.', date: '16 Jun, 11:15 AM', status: 'Failed' }
    ];

    const handleSendReminders = () => {
        setSending(true);
        setTimeout(() => {
            setSending(false);
            alert('Reminders sent successfully!');
            setActiveTab('logs');
        }, 1500);
    };

    const totalDefaulters = defaulters.length;
    const totalDueAmount = defaulters.reduce((acc, curr) => acc + curr.dueAmount, 0);

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Defaulters & Reminders</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage outstanding fee defaulters and send automated reminders</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('defaulters')} className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${activeTab === 'defaulters' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        Defaulters List
                    </button>
                    <button onClick={() => setActiveTab('send')} className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${activeTab === 'send' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        Send Reminders
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${activeTab === 'logs' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        Logs
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${activeTab === 'settings' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Defaulters</p>
                    <p className="text-base font-bold text-red-600 m-0">{totalDefaulters}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Outstanding</p>
                    <p className="text-base font-bold text-red-600 m-0">₹{totalDueAmount.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {activeTab === 'defaulters' && (
                <div className="bg-white rounded shadow-sm border border-slate-200">
                    <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                            <AlertTriangle size={16} className="text-amber-500" /> Outstanding Fee Defaulters
                        </h3>
                        <button onClick={handleSendReminders} disabled={sending} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 shadow-sm disabled:opacity-70">
                            {sending ? 'Sending...' : <><Bell size={14} /> Send Bulk Reminder</>}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold">Student</th>
                                    <th className="px-4 py-2 font-bold">Parent Contact</th>
                                    <th className="px-4 py-2 font-bold">Due Amount</th>
                                    <th className="px-4 py-2 font-bold">Overdue Since</th>
                                    <th className="px-4 py-2 font-bold">Last Reminder</th>
                                    <th className="px-4 py-2 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {defaulters.map((d) => (
                                    <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5">
                                            <div className="font-bold text-slate-800">{d.name} <span className="text-slate-400 font-normal">({d.id})</span></div>
                                            <div className="text-[10px] text-slate-500">{d.class}</div>
                                        </td>
                                        <td className="px-4 py-2.5 font-medium text-slate-700">{d.parentPhone}</td>
                                        <td className="px-4 py-2.5 font-bold text-red-600">₹{d.dueAmount.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-2.5 text-slate-600">
                                            <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded">{d.dueSince}</span>
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-500 font-medium">{d.lastReminder}</td>
                                        <td className="px-4 py-2.5 text-right">
                                            <button className="text-blue-600 font-bold hover:underline">Ping</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'send' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 max-w-2xl">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5"><Send size={16} className="text-blue-600" /> Compose Reminder</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSendReminders(); }} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience *</label>
                            <select className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                <option>All Defaulters</option>
                                <option>Class 10 Defaulters</option>
                                <option>Overdue &gt; 30 Days</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Message Template *</label>
                            <textarea rows="4" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none resize-none" defaultValue="Dear Parent, This is a gentle reminder that fee for [Student Name] is overdue by [Amount]. Please clear the dues at the earliest. - VidyaSetu"></textarea>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button type="submit" disabled={sending} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 disabled:opacity-70 flex items-center gap-1">
                                {sending ? 'Sending...' : <><Send size={14} /> Send Now</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="bg-white rounded shadow-sm border border-slate-200">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm m-0">Recent Reminder Logs</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold">Type</th>
                                    <th className="px-4 py-2 font-bold">Recipient</th>
                                    <th className="px-4 py-2 font-bold">Message Snippet</th>
                                    <th className="px-4 py-2 font-bold">Date & Time</th>
                                    <th className="px-4 py-2 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5 font-bold text-slate-700">{log.type}</td>
                                        <td className="px-4 py-2.5 text-slate-600">{log.recipient}</td>
                                        <td className="px-4 py-2.5 text-slate-500 truncate max-w-[200px]">{log.message}</td>
                                        <td className="px-4 py-2.5 text-slate-600">{log.date}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`flex items-center gap-1 font-bold ${log.status === 'Sent' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {log.status === 'Sent' ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {log.status}
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
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 max-w-2xl">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5"><Settings size={16} className="text-blue-600" /> Automation Settings</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded">
                            <div>
                                <p className="font-bold text-sm text-slate-800 m-0">Auto-Reminders Before Due Date</p>
                                <p className="text-xs text-slate-500 m-0">Send a gentle reminder 3 days before the fee is due.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded">
                            <div>
                                <p className="font-bold text-sm text-slate-800 m-0">Auto-Reminders For Defaulters</p>
                                <p className="text-xs text-slate-500 m-0">Send a reminder every 7 days to outstanding defaulters.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentReminders;
