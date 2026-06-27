import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BarChart2, Star, UserCheck, BookOpen, AlertTriangle, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';

const TeacherPerformance = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiFetch('/principal/teachers/performance');
                const data = await res.json();
                if (data.success && data.data) {
                    setPerformanceData(data.data);
                } else {
                    setPerformanceData([]);
                }
            } catch (err) {
                console.error("Error fetching performance data", err);
                setPerformanceData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-5 text-center text-slate-500 font-medium">Loading performance metrics...</div>;

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredData = performanceData;
    if (activeKpi === 'Excellent') filteredData = performanceData.filter(t => t.status === 'Excellent');
    if (activeKpi === 'Good') filteredData = performanceData.filter(t => t.status === 'Good');
    if (activeKpi === 'Needs Review') filteredData = performanceData.filter(t => t.status === 'Needs Review');

    const kpiCards = [
        { label: 'All Teachers', value: performanceData.length, active: activeKpi === 'All', onClick: () => setActiveKpi('All') },
        { label: 'Excellent', value: performanceData.filter(t => t.status === 'Excellent').length, active: activeKpi === 'Excellent', onClick: () => setActiveKpi('Excellent') },
        { label: 'Good', value: performanceData.filter(t => t.status === 'Good').length, active: activeKpi === 'Good', onClick: () => setActiveKpi('Good') },
        { label: 'Needs Review', value: performanceData.filter(t => t.status === 'Needs Review').length, active: activeKpi === 'Needs Review', onClick: () => setActiveKpi('Needs Review') }
    ];

    return (
        <div className="animate-fade-in p-2">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 m-0">Teacher Performance Monitoring</h2>
                    <p className="text-slate-500 text-sm mt-1">Track attendance regularity, class results, and student feedback.</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none focus:border-blue-400">
                        <option>Current Term</option>
                        <option>Previous Term</option>
                        <option>Annual Overall</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="flex overflow-x-auto border border-slate-200 bg-[#f8fafc] rounded-xl mb-4 custom-scrollbar">
                {kpiCards.map((kpi, idx) => (
                    <div 
                        key={idx} 
                        onClick={kpi.onClick}
                        className={`flex-1 min-w-[120px] p-4 border-r last:border-r-0 border-slate-200 cursor-pointer transition-colors ${kpi.active ? 'bg-[#eef6ff] border-t-2 border-t-blue-500' : 'bg-white border-t-2 border-t-transparent hover:bg-slate-50'}`}
                    >
                        <p className="text-[13px] font-medium text-slate-600">{kpi.label}</p>
                        <div className="flex items-end justify-between mt-1">
                            <span className={`text-xl font-bold ${kpi.active ? 'text-slate-900' : 'text-slate-700'}`}>{kpi.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredData.map(teacher => (
                    <div key={teacher.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group">
                        
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="p-4 border-b border-slate-100 flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}&backgroundColor=0284c7`} alt={teacher.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-sm text-slate-800 m-0 leading-tight pr-6">{teacher.name}</h3>
                                <p className="text-sm text-slate-500 m-0 mt-0.5 font-medium">{teacher.subject}</p>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        teacher.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : 
                                        teacher.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {teacher.status === 'Needs Review' && <AlertTriangle size={10} />}
                                        {teacher.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 grid grid-cols-2 gap-y-6 gap-x-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <BarChart2 size={14} className="text-blue-500" /> Class Pass Rate
                                </div>
                                <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    {teacher.metrics.classPassRate}
                                    {teacher.trend === 'up' ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-amber-500" />}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <UserCheck size={14} className="text-emerald-500" /> Attendance
                                </div>
                                <div className="text-xl font-black text-slate-800">
                                    {teacher.metrics.attendance}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <BookOpen size={14} className="text-purple-500" /> Syllabus Done
                                </div>
                                <div className="text-xl font-black text-slate-800">
                                    {teacher.metrics.syllabusCompletion}
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div className="bg-purple-500 h-full rounded-full" style={{width: teacher.metrics.syllabusCompletion}}></div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <Star size={14} className="text-amber-400" /> Rating
                                </div>
                                <div className="text-xl font-black text-slate-800 flex items-baseline gap-1">
                                    {teacher.metrics.studentRating}
                                    <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                                </div>
                                <div className="flex gap-0.5 mt-2">
                                    {[1,2,3,4,5].map(star => (
                                        <Star key={star} size={12} className={star <= Math.round(parseFloat(teacher.metrics.studentRating)) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-bold border-none bg-transparent cursor-pointer w-full hover:bg-blue-50/50 py-2 rounded transition-colors">
                                View Detailed Report &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherPerformance;
