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
                const response = await axios.get(`http://localhost:5000/api/parent/children/${childId}/homework`, {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen size={20} className="text-blue-500" />
                        <h3 className="text-sm font-semibold text-slate-700">Total Assignments</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{homework.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} className="text-amber-500" />
                        <h3 className="text-sm font-semibold text-slate-700">Pending Tasks</h3>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <h3 className="text-sm font-semibold text-slate-700">Submitted</h3>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">{submittedCount}</p>
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
                    <div key={hw.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{hw.assignment}</h3>
                                <p className="text-sm font-medium text-slate-600 mt-1">{hw.subject} • {hw.teacher}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                        <Calendar size={14} /> Due: {hw.dueDate}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        hw.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                        hw.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {hw.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-3">
                            <button className="flex-1 md:flex-none text-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-200">
                                View Details
                            </button>
                            {hw.status === 'Pending' && (
                                <button className="flex-1 md:flex-none text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                                    Upload Task
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredHomework.length === 0 && (
                    <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No homework found</h3>
                        <p className="text-slate-500">There are no assignments matching the selected filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeworkModule;
