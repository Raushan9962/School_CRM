import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import apiFetch from '../../../services/api';

const ExamsView = () => {
    const [activeTab, setActiveTab] = useState('results');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const res = await apiFetch(`/results/student/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const tabs = [
        { id: 'results', label: 'Latest Results', count: results.length, subtext: 'Mid-Term Exams' },
        { id: 'schedule', label: 'Upcoming Exams', count: 3, subtext: 'November' },
        { id: 'performance', label: 'Class Rank', count: '4th', subtext: 'Out of 45' },
        { id: 'grade', label: 'Overall Grade', count: 'A+', subtext: 'Average 88.5%' }
    ];

    const schedule = [
        { id: 'SCH-001', subject: 'Mathematics Final', date: '12 Nov 2026', time: '10:00 AM - 1:00 PM', type: 'Theory', isNew: true },
        { id: 'SCH-002', subject: 'Physics Practical', date: '15 Nov 2026', time: '09:00 AM - 12:00 PM', type: 'Practical', isNew: false },
        { id: 'SCH-003', subject: 'Chemistry Final', date: '18 Nov 2026', time: '10:00 AM - 1:00 PM', type: 'Theory', isNew: false },
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Semester <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Select Date Range
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search subject..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '200px' }} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#4b5563', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Re-evaluation
                    </button>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Export Report
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
                    <div className="p-10 text-center text-gray-500">Loading exam results...</div>
                ) : activeTab === 'results' ? (
                    results.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No exam results found.</div>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                    <th className="px-3 py-4 w-[60px]">S.No.</th>
                                    <th className="px-3 py-4">Code</th>
                                    <th className="px-3 py-4">Subject</th>
                                    <th className="px-3 py-4">Date</th>
                                    <th className="px-3 py-4">Obtained / Total</th>
                                    <th className="px-3 py-4">Grade</th>
                                    <th className="px-3 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                        <td style={{ padding: '16px 12px', color: '#111827' }}>
                                            {row.exam_id}
                                        </td>
                                        <td className="px-3 py-4 text-gray-900 font-medium">
                                            {row.subject_name || row.exam_name}
                                        </td>
                                        <td className="px-3 py-4 text-gray-500">
                                            {new Date(row.exam_date).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 12px', color: '#111827', fontWeight: '600' }}>
                                            {row.marks_obtained}
                                        </td>
                                        <td style={{ padding: '16px 12px', color: row.grade?.includes('A') ? '#10b981' : '#0ea5e9', fontWeight: 'bold' }}>
                                            {row.grade}
                                        </td>
                                        <td style={{ padding: '16px 12px', textAlign: 'right', color: row.grade?.includes('F') ? '#ef4444' : '#10b981', fontWeight: '500' }}>
                                            {row.grade?.includes('F') ? 'Fail' : 'Pass'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : activeTab === 'schedule' ? (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Code</th>
                                <th className="px-3 py-4">Exam Subject</th>
                                <th className="px-3 py-4">Date</th>
                                <th className="px-3 py-4">Time</th>
                                <th className="px-3 py-4 text-right">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', position: 'relative' }}>
                                        {row.isNew && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, background: '#0ea5e9', color: 'white', fontSize: '10px', padding: '2px 16px 2px 4px', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)', fontWeight: 'bold' }}>
                                                New
                                            </div>
                                        )}
                                        <span style={{ color: '#111827', display: 'block', marginTop: row.isNew ? '8px' : '0' }}>{row.id}</span>
                                    </td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.subject}</td>
                                    <td className="px-3 py-4 text-gray-600">{row.date}</td>
                                    <td className="px-3 py-4 text-gray-600">{row.time}</td>
                                    <td className="px-3 py-4 text-right">
                                        <span style={{ padding: '4px 8px', background: '#f1f5f9', color: '#4b5563', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{row.type}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-10 text-center text-gray-500">
                        <p>No tabular data available for this view. Please select Results or Schedule.</p>
                    </div>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchResults} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>
        </div>
    );
};

export default ExamsView;
