import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar as CalendarIcon, User, BookOpen } from 'lucide-react';

const TimetableModule = ({ childId }) => {
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`\${import.meta.env.VITE_API_BASE_URL}/parent/children/${childId}/timetable`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTimetable(response.data);
            } catch (error) {
                console.error("Error fetching timetable data", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) fetchTimetable();
    }, [childId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading timetable...</div>;
    if (!timetable) return <div className="p-8 text-center text-rose-500">Failed to load timetable.</div>;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [activeDay, setActiveDay] = useState('Monday');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Class Timetable</h1>
                    <p className="text-slate-500">Daily schedule and teacher assignments.</p>
                </div>
            </div>

            {/* Day Selector */}
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex overflow-x-auto mb-4">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-md text-[12px] font-bold tracking-wide transition-all ${
                            activeDay === day 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timetable List */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <CalendarIcon size={16} className="text-blue-500" />
                    <h3 className="m-0 text-sm font-bold text-slate-800">Schedule for {activeDay}</h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                    {timetable.map((period, index) => (
                        <div key={index} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                            <div className="w-24 text-left sm:text-center shrink-0">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-bold mb-1 uppercase tracking-wider">
                                    <Clock size={10} /> Period {period.period}
                                </span>
                                <p className="m-0 text-[13px] font-bold text-slate-800">{period.time}</p>
                            </div>
                            
                            <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                        <BookOpen size={16} />
                                    </div>
                                    <div>
                                        <p className="m-0 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</p>
                                        <p className="m-0 text-[13px] font-bold text-slate-800">{period.subject}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="m-0 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Teacher</p>
                                        <p className="m-0 text-[13px] font-bold text-slate-800">{period.teacher}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {(!timetable || timetable.length === 0) && (
                        <div className="p-8 text-center text-slate-500 text-[13px]">
                            No schedule available for {activeDay}.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimetableModule;
