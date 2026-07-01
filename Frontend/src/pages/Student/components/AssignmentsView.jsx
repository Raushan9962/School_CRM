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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Subject <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Due Date Range
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search assignment..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-48" />
                    </div>
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                        Upload Submission
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[160px] p-4 text-left cursor-pointer flex flex-col gap-1 relative -mb-[1px] border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className={`text-xs font-bold ${activeTab === tab.id ? 'text-blue-700' : 'text-slate-600'}`}>{tab.label}</span>
                            <span className={`text-lg font-bold leading-none ${activeTab === tab.id ? 'text-blue-800' : 'text-slate-800'}`}>{tab.count}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading assignments...</div>
                ) : filteredRecords.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">No assignments found.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">ID</th>
                                <th className="px-4 py-2 font-bold">Subject</th>
                                <th className="px-4 py-2 font-bold">Title & Description</th>
                                <th className="px-4 py-2 font-bold">Due Date</th>
                                <th className="px-4 py-2 font-bold text-center">Status</th>
                                <th className="px-4 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {filteredRecords.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 font-bold text-blue-600">ASN-{row.id.toString().padStart(3, '0')}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.subject_name}</td>
                                    <td className="px-4 py-2.5">
                                        <div className="font-bold text-slate-800">{row.title}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">{row.description}</div>
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-slate-600">{new Date(row.due_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            row.status === 'Graded' ? 'bg-emerald-50 text-emerald-600' : 
                                            (row.status === 'Submitted' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600')
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        {row.status === 'Pending' ? (
                                            <button className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5 border border-slate-200">
                                                <Upload size={14} /> Submit
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 font-bold">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchAssignments} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] font-bold gap-4">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-slate-700 bg-transparent font-bold cursor-pointer">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{filteredRecords.length} of {filteredRecords.length}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentsView;
