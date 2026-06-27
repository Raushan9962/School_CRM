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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Filter <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Current Semester
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search records..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '200px' }} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#4b5563', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Correction Request
                    </button>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Download Report
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
                            <span className="text-xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading attendance data...</div>
                ) : activeTab === 'daily' ? (
                    records.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No attendance records found.</div>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                    <th className="px-3 py-4 w-[60px]">S.No.</th>
                                    <th className="px-3 py-4">Date</th>
                                    <th className="px-3 py-4">Day</th>
                                    <th className="px-3 py-4">Remark</th>
                                    <th className="px-3 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                        <td className="px-3 py-4 text-gray-900 font-medium">
                                            {new Date(row.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 py-4 text-gray-600">
                                            {new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                        </td>
                                        <td className="px-3 py-4 text-gray-500">{row.remarks || '-'}</td>
                                        <td className="px-3 py-4 text-right">
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500',
                                                background: row.status === 'Present' ? '#dcfce7' : (row.status === 'Absent' ? '#fee2e2' : '#f1f5f9'),
                                                color: row.status === 'Present' ? '#166534' : (row.status === 'Absent' ? '#dc2626' : '#4b5563')
                                            }}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : activeTab === 'subject' ? (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Code</th>
                                <th className="px-3 py-4">Subject</th>
                                <th className="px-3 py-4">Total Classes</th>
                                <th className="px-3 py-4">Classes Attended</th>
                                <th className="px-3 py-4">Visual</th>
                                <th className="px-3 py-4 text-right">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectRecords.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', color: '#111827' }}>{row.id}</td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.subject}</td>
                                    <td className="px-3 py-4 text-gray-500">{row.total}</td>
                                    <td style={{ padding: '16px 12px', color: '#111827', fontWeight: '600' }}>{row.present}</td>
                                    <td style={{ padding: '16px 12px', width: '200px' }}>
                                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${row.percent}%`, background: row.percent > 90 ? '#10b981' : (row.percent > 75 ? '#0ea5e9' : '#ef4444'), borderRadius: '3px' }}></div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: '600', color: row.percent > 90 ? '#10b981' : '#0ea5e9' }}>
                                        {row.percent}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-10 text-center text-gray-500">
                        <p>No tabular data available for leaves. Please select Daily or Subject-wise.</p>
                    </div>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchAttendance} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>
        </div>
    );
};

export default AttendanceView;
