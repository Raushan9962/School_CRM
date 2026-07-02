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
                const response = await axios.get(`http://localhost:5000/api/parent/children/${childId}/timetable`, {
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
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex overflow-x-auto">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                            activeDay === day 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timetable List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <CalendarIcon size={18} className="text-blue-500" />
                    <h3 className="text-lg font-bold text-slate-800">Schedule for {activeDay}</h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                    {timetable.map((period, index) => (
                        <div key={index} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-slate-50 transition-colors">
                            <div className="w-24 text-center shrink-0">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold mb-2">
                                    <Clock size={12} /> Period {period.period}
                                </span>
                                <p className="text-sm font-bold text-slate-800">{period.time}</p>
                            </div>
                            
                            <div className="w-1 sm:w-px h-10 sm:h-12 bg-slate-200"></div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Subject</p>
                                        <p className="text-sm font-bold text-slate-800">{period.subject}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Teacher</p>
                                        <p className="text-sm font-bold text-slate-800">{period.teacher}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {(!timetable || timetable.length === 0) && (
                        <div className="p-12 text-center text-slate-500">
                            No schedule available for {activeDay}.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimetableModule;
