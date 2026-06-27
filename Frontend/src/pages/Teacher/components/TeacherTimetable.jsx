import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Calendar } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TeacherTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const todayDay = DAYS[new Date().getDay() - 1] || '';

    useEffect(() => {
        apiFetch('/teacher-portal/my-timetable', { headers })
            .then(r => r.json())
            .then(d => { if (d.success) setTimetable(d.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const byDay = DAYS.reduce((acc, day) => {
        acc[day] = timetable.filter(t => t.day_of_week?.toLowerCase() === day.toLowerCase());
        return acc;
    }, {});

    const subjectColors = {};
    const palette = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];
    let colorIdx = 0;
    timetable.forEach(t => {
        if (!subjectColors[t.subject_name]) {
            subjectColors[t.subject_name] = palette[colorIdx % palette.length];
            colorIdx++;
        }
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Calendar size={22} className="text-indigo-600" /> My Timetable
                </h2>
                <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 font-bold whitespace-nowrap">
                    {timetable.length} period(s) per week
                </div>
            </div>

            {loading ? (
                <div className="text-center p-20 text-slate-400 font-medium">Loading timetable...</div>
            ) : timetable.length === 0 ? (
                <div className="bg-white rounded-lg p-16 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
                    <Calendar size={48} strokeWidth={1.5} className="text-slate-300 mb-4" />
                    <h3 className="text-slate-500 font-bold m-0 mb-2 text-sm">No timetable assigned</h3>
                    <p className="text-slate-400 m-0 text-sm">Contact your administrator to set up your timetable.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {DAYS.map(day => {
                        const periods = byDay[day];
                        const isToday = day === todayDay;
                        return (
                            <div key={day} className={`bg-white rounded-lg overflow-hidden transition-shadow ${isToday ? 'border-2 border-indigo-500 shadow-[0_4px_16px_rgba(99,102,241,0.12)]' : 'border border-slate-100 shadow-sm hover:shadow-md'}`}>
                                <div className={`px-5 py-3 flex items-center justify-between ${isToday ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-slate-50'}`}>
                                    <span className={`font-bold text-[15px] ${isToday ? 'text-white' : 'text-slate-700'}`}>
                                        {day} {isToday && '(Today)'}
                                    </span>
                                    <span className={`text-xs font-bold ${isToday ? 'text-white/80' : 'text-slate-400'}`}>
                                        {periods.length} period(s)
                                    </span>
                                </div>
                                {periods.length === 0 ? (
                                    <div className="px-5 py-4 text-slate-400 text-sm italic font-medium">No classes scheduled</div>
                                ) : (
                                    <div className="flex flex-wrap gap-3 p-4 sm:p-5">
                                        {periods.map((p, i) => {
                                            const color = subjectColors[p.subject_name] || '#6366f1';
                                            return (
                                                <div key={i} className="px-4 py-3 rounded-xl min-w-[140px]" style={{ background: color + '15', border: `1px solid ${color}30` }}>
                                                    <p className="m-0 mb-1 text-[11px] font-extrabold uppercase tracking-wider" style={{ color }}>Period {p.period_number}</p>
                                                    <p className="m-0 mb-0.5 text-[14px] font-bold text-slate-800">{p.subject_name}</p>
                                                    <p className="m-0 mb-0.5 text-[12px] font-medium text-slate-500">Class {p.class_name} {p.section}</p>
                                                    <p className="m-0 text-[11px] font-bold text-slate-400">{p.start_time} – {p.end_time}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TeacherTimetable;
