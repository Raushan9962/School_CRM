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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Semester <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Select Date Range
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search subject..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-48" />
                    </div>
                    <button className="px-4 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">
                        Re-evaluation
                    </button>
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                        Export Report
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
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading exam results...</div>
                ) : activeTab === 'results' ? (
                    results.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">No exam results found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                    <th className="px-4 py-2 font-bold">Code</th>
                                    <th className="px-4 py-2 font-bold">Subject</th>
                                    <th className="px-4 py-2 font-bold">Date</th>
                                    <th className="px-4 py-2 font-bold">Obtained / Total</th>
                                    <th className="px-4 py-2 font-bold">Grade</th>
                                    <th className="px-4 py-2 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {results.map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">
                                            {row.exam_id}
                                        </td>
                                        <td className="px-4 py-2.5 font-medium text-slate-600">
                                            {row.subject_name || row.exam_name}
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-500">
                                            {new Date(row.exam_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">
                                            {row.marks_obtained}
                                        </td>
                                        <td className={`px-4 py-2.5 font-bold ${row.grade?.includes('A') ? 'text-emerald-500' : 'text-blue-500'}`}>
                                            {row.grade}
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                row.grade?.includes('F') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {row.grade?.includes('F') ? 'Fail' : 'Pass'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : activeTab === 'schedule' ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Code</th>
                                <th className="px-4 py-2 font-bold">Exam Subject</th>
                                <th className="px-4 py-2 font-bold">Date</th>
                                <th className="px-4 py-2 font-bold">Time</th>
                                <th className="px-4 py-2 font-bold text-right">Type</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {schedule.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 relative">
                                        {row.isNew && (
                                            <div className="absolute top-0 left-0 bg-blue-500 text-white text-[8px] px-2 py-0.5 rounded-br-lg font-bold">
                                                NEW
                                            </div>
                                        )}
                                        <span className={`block font-bold text-slate-700 ${row.isNew ? 'mt-3' : ''}`}>{row.id}</span>
                                    </td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.subject}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{row.date}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{row.time}</td>
                                    <td className="px-4 py-2.5 text-right">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{row.type}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">
                        <p>No tabular data available for this view. Please select Results or Schedule.</p>
                    </div>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchResults} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer">
                    <RefreshCw size={18} />
                </button>
            </div>
        </div>
    );
};

export default ExamsView;
