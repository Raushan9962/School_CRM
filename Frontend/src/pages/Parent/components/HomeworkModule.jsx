import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const HomeworkModule = ({ childId }) => {
    const [homework, setHomework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`\${import.meta.env.VITE_API_BASE_URL}/parent/children/${childId}/homework`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHomework(response.data);
            } catch (error) {
                console.error("Error fetching homework data", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) fetchHomework();
    }, [childId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading homework data...</div>;
    if (!homework) return <div className="p-8 text-center text-rose-500">Failed to load homework data.</div>;

    const filteredHomework = filter === 'All' ? homework : homework.filter(hw => hw.status === filter);

    const pendingCount = homework.filter(hw => hw.status === 'Pending').length;
    const submittedCount = homework.filter(hw => hw.status === 'Submitted').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Homework & Assignments</h1>
                    <p className="text-slate-500">Monitor daily tasks and submissions.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Assignments</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{homework.length}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pending Tasks</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{pendingCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Submitted</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{submittedCount}</h3>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Pending', 'Submitted', 'Checked'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                            filter === status 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Homework List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredHomework.map((hw) => (
                    <div key={hw.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:border-blue-200 transition-colors">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 border border-blue-100">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">{hw.assignment}</h3>
                                <p className="text-[12px] font-medium text-slate-500 mt-0.5">{hw.subject} • {hw.teacher}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                        <Calendar size={12} /> Due: {hw.dueDate}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                        hw.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                        hw.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>
                                        {hw.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <button className="flex-1 md:flex-none text-center px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-[13px] font-semibold transition-colors border border-slate-300">
                                View Details
                            </button>
                            {hw.status === 'Pending' && (
                                <button className="flex-1 md:flex-none text-center px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-[13px] font-semibold transition-colors shadow-sm">
                                    Upload Task
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredHomework.length === 0 && (
                    <div className="text-center p-8 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                        <BookOpen size={32} className="text-slate-300 mb-3" />
                        <h3 className="text-sm font-bold text-slate-800 mb-1">No homework found</h3>
                        <p className="text-[12px] text-slate-500">There are no assignments matching the selected filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeworkModule;
