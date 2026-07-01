import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import apiFetch from '../../../services/api';

const AttendanceView = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const res = await apiFetch(`/attendance/student/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
                }
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === 'Present').length;
    const overallPercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0.0';

    const tabs = [
        { id: 'daily', label: 'Daily Attendance', count: `${overallPercentage}%`, subtext: 'Current Semester' },
        { id: 'subject', label: 'Subject-wise', count: '5', subtext: 'Subjects Tracked' },
        { id: 'leaves', label: 'Leaves Taken', count: records.filter(r => r.status === 'Absent').length, subtext: 'Days Absent' }
    ];

    const subjectRecords = [
        // Subject wise isn't supported in standard attendance table yet, so dummy data
        { id: 'SUB-001', subject: 'Mathematics', present: 45, total: 48, percent: 93.7 },
        { id: 'SUB-002', subject: 'Physics', present: 40, total: 42, percent: 95.2 },
        { id: 'SUB-003', subject: 'Chemistry', present: 38, total: 42, percent: 90.4 },
        { id: 'SUB-004', subject: 'English', present: 35, total: 40, percent: 87.5 },
        { id: 'SUB-005', subject: 'Computer Science', present: 28, total: 30, percent: 93.3 },
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Filter <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Current Semester
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search records..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-48" />
                    </div>
                    <button className="px-4 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">
                        Correction Request
                    </button>
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                        Download Report
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
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading attendance data...</div>
                ) : activeTab === 'daily' ? (
                    records.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">No attendance records found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                    <th className="px-4 py-2 font-bold">Date</th>
                                    <th className="px-4 py-2 font-bold">Day</th>
                                    <th className="px-4 py-2 font-bold">Remark</th>
                                    <th className="px-4 py-2 font-bold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {records.map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">
                                            {new Date(row.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2.5 font-medium text-slate-600">
                                            {new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-500">{row.remarks || '-'}</td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                row.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 
                                                (row.status === 'Absent' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600')
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : activeTab === 'subject' ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Code</th>
                                <th className="px-4 py-2 font-bold">Subject</th>
                                <th className="px-4 py-2 font-bold text-center">Total Classes</th>
                                <th className="px-4 py-2 font-bold text-center">Classes Attended</th>
                                <th className="px-4 py-2 font-bold">Visual</th>
                                <th className="px-4 py-2 font-bold text-right">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {subjectRecords.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.id}</td>
                                    <td className="px-4 py-2.5 font-medium text-slate-600">{row.subject}</td>
                                    <td className="px-4 py-2.5 text-center text-slate-500">{row.total}</td>
                                    <td className="px-4 py-2.5 text-center font-bold text-slate-800">{row.present}</td>
                                    <td className="px-4 py-2.5 w-[200px]">
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${row.percent > 90 ? 'bg-emerald-500' : (row.percent > 75 ? 'bg-blue-500' : 'bg-red-500')}`}
                                                style={{ width: `${row.percent}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className={`px-4 py-2.5 text-right font-bold ${row.percent > 90 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                        {row.percent}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">
                        <p>No tabular data available for leaves. Please select Daily or Subject-wise.</p>
                    </div>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchAttendance} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer">
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
                <div>1-{records.length} of {records.length}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
