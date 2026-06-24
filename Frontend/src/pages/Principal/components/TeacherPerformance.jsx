import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BarChart2, Star, UserCheck, BookOpen, AlertTriangle } from 'lucide-react';

const TeacherPerformance = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiFetch('/principal/teachers/performance');
                const data = await res.json();
                if (data.success) {
                    setPerformanceData(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch teacher performance", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading performance metrics...</div>;

    return (
        <div className="animate-fade-in p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800 m-0">Teacher Performance Monitoring</h2>
                <p className="text-slate-500 text-sm mt-1">Track attendance regularity, class results, and student feedback.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceData.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">No teacher performance data available.</div>
                ) : (
                    performanceData.map(teacher => (
                        <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 m-0">{teacher.name}</h3>
                                    <p className="text-sm text-slate-500 m-0 mt-1 font-medium">{teacher.subject}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    teacher.status === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 flex items-center gap-1'
                                }`}>
                                    {teacher.status === 'Needs Review' && <AlertTriangle size={12} />}
                                    {teacher.status}
                                </span>
                            </div>
                            
                            <div className="p-5 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <BarChart2 size={14} className="text-blue-500" /> Class Pass Rate
                                    </div>
                                    <div className="text-xl font-bold text-slate-800">{teacher.metrics.classPassRate}</div>
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <UserCheck size={14} className="text-emerald-500" /> Attendance
                                    </div>
                                    <div className="text-xl font-bold text-slate-800">{teacher.metrics.attendance}</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <BookOpen size={14} className="text-purple-500" /> Syllabus Done
                                    </div>
                                    <div className="text-xl font-bold text-slate-800">{teacher.metrics.syllabusCompletion}</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <Star size={14} className="text-amber-400" /> Rating
                                    </div>
                                    <div className="text-xl font-bold text-slate-800 flex items-baseline gap-1">
                                        {teacher.metrics.studentRating}
                                        <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-right">
                                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold border-none bg-transparent cursor-pointer">View Detailed Report →</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherPerformance;
