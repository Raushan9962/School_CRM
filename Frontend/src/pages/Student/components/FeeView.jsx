import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Download, Search, RefreshCw, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import apiFetch from '../../../services/api';

const FeeView = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFees = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                // Fetch fees for the logged-in student (using user.id)
                const res = await apiFetch(`/fees/student/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
                }
            }
        } catch (error) {
            console.error("Error fetching fees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    const handlePayFee = async (feeId) => {
        try {
            const payload = {
                status: 'Paid',
                paid_date: new Date().toISOString().split('T')[0]
            };
            const res = await apiFetch(`/fees/${feeId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchFees(); // Refresh data
            }
        } catch (error) {
            console.error("Error paying fee:", error);
        }
    };

    const pendingCount = records.filter(r => r.status === 'Pending').length;
    const paidCount = records.filter(r => r.status === 'Paid').length;
    const fineCount = records.filter(r => r.status === 'Fine').length;

    const tabs = [
        { id: 'all', label: 'All records', count: records.length, subtext: 'Filtered by date' },
        { id: 'pending', label: 'Pending fees', count: pendingCount, subtext: 'All time' },
        { id: 'paid', label: 'Paid fees', count: paidCount, subtext: 'All time' },
        { id: 'fine', label: 'Fines', count: fineCount, subtext: 'All time' }
    ];

    const filteredRecords = records.filter(r => activeTab === 'all' || r.status.toLowerCase() === activeTab);

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Filter <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Date Range
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '200px' }} />
                    </div>
                </div>

                <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <Download size={16} style={{ marginRight: '6px' }} /> Export
                </button>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b-2 border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            minWidth: '160px',
                            padding: '16px',
                            background: activeTab === tab.id ? '#e0f2fe' : 'white',
                            border: '1px solid',
                            borderColor: activeTab === tab.id ? '#0ea5e9' : '#e2e8f0',
                            borderBottom: 'none',
                            borderRadius: '8px 8px 0 0',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            position: 'relative',
                            marginBottom: '-2px',
                            borderTopWidth: activeTab === tab.id ? '3px' : '1px'
                        }}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="text-sm text-gray-600 font-medium">{tab.label}</span>
                            <span className="text-xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading fees data...</div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No fee records found.</div>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Due Date</th>
                                <th className="px-3 py-4">Description</th>
                                <th className="px-3 py-4">Status</th>
                                <th className="px-3 py-4 text-right">Amount</th>
                                <th style={{ padding: '16px 12px', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">
                                        {idx + 1}
                                    </td>
                                    <td className="px-3 py-4 text-gray-600">
                                        {new Date(row.due_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">
                                        {row.description || 'Academic Fee'}
                                    </td>
                                    <td className="px-3 py-4">
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                            background: row.status === 'Paid' ? '#dcfce7' : '#fee2e2',
                                            color: row.status === 'Paid' ? '#166534' : '#dc2626'
                                        }}>
                                            {row.status}
                                        </span>
                                        {row.status === 'Paid' && row.paid_date && (
                                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                                                Paid on: {new Date(row.paid_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: '600', color: '#111827' }}>₹ {row.amount}</td>
                                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                        {row.status === 'Pending' ? (
                                            <button 
                                                onClick={() => handlePayFee(row.id)}
                                                style={{ padding: '6px 12px', background: '#0ea5e9', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                                                Pay Now
                                            </button>
                                        ) : (
                                            <button style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
                                                <Download size={14} /> Receipt
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                <button onClick={fetchFees} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>
        </div>
    );
};

export default FeeView;
