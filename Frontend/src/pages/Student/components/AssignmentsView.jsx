import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import apiFetch from '../../../services/api';

const AssignmentsView = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const res = await apiFetch(`/homework/student/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    
                    // Add mock statuses since there is no submission table
                    const mappedData = data.map(d => {
                        const dueDate = new Date(d.due_date);
                        const today = new Date();
                        let status = 'Pending';
                        if (dueDate < today) status = 'Submitted';
                        return {
                            ...d,
                            status
                        };
                    });
                    
                    setRecords(mappedData);
                }
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const pendingCount = records.filter(r => r.status === 'Pending').length;
    const submittedCount = records.filter(r => r.status === 'Submitted').length;
    const gradedCount = records.filter(r => r.status === 'Graded').length;

    const tabs = [
        { id: 'all', label: 'All Assignments', count: records.length, subtext: 'Current Semester' },
        { id: 'pending', label: 'Pending', count: pendingCount, subtext: 'Due this week' },
        { id: 'submitted', label: 'Submitted', count: submittedCount, subtext: 'Awaiting Grade' },
        { id: 'graded', label: 'Graded', count: gradedCount, subtext: 'Completed' }
    ];

    const filteredRecords = records.filter(r => activeTab === 'all' || r.status.toLowerCase() === activeTab);

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Subject <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Due Date Range
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search assignment..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '200px' }} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Upload Submission
                    </button>
                </div>
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
                            <span className="text-2xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading assignments...</div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No assignments found.</div>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">ID</th>
                                <th className="px-3 py-4">Subject</th>
                                <th className="px-3 py-4">Title</th>
                                <th className="px-3 py-4">Due Date</th>
                                <th className="px-3 py-4 text-right">Status</th>
                                <th className="px-3 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', color: '#0ea5e9' }}>ASN-{row.id.toString().padStart(3, '0')}</td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.subject_name}</td>
                                    <td className="px-3 py-4 text-gray-600">
                                        <div style={{ fontWeight: '500', color: '#1e293b' }}>{row.title}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{row.description}</div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-600">{new Date(row.due_date).toLocaleDateString()}</td>
                                    <td className="px-3 py-4 text-right">
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                            background: row.status === 'Graded' ? '#dcfce7' : (row.status === 'Submitted' ? '#e0f2fe' : '#fef9c3'),
                                            color: row.status === 'Graded' ? '#166534' : (row.status === 'Submitted' ? '#0369a1' : '#ca8a04')
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-right">
                                        {row.status === 'Pending' ? (
                                            <button style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
                                                <Upload size={14} /> Submit
                                            </button>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchAssignments} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-4 border-t border-slate-200 text-gray-600 text-sm gap-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Rows per page: 
                    <select className="border-none outline-none text-gray-900 cursor-pointer bg-transparent">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{filteredRecords.length} of {filteredRecords.length}</div>
                <div className="flex gap-2">
                    <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }} disabled><ChevronLeft size={20} /></button>
                    <button style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentsView;
