import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, Clock, MapPin, User } from 'lucide-react';
import apiFetch from '../../../services/api';

const TimetableView = () => {
    const [activeTab, setActiveTab] = useState('Monday');
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const res = await apiFetch(`/timetables/student/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setSchedule(data);
                }
            }
        } catch (error) {
            console.error("Error fetching timetable:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimetable();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    const tabs = days.map(day => ({
        id: day,
        label: day,
        count: schedule.filter(s => s.day_of_week === day).length.toString(),
        subtext: 'Periods'
    }));

    const filteredSchedule = schedule.filter(s => s.day_of_week === activeTab);

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Weekly View <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Current Week
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                        Download Timetable
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
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading timetable...</div>
                ) : filteredSchedule.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">No classes scheduled for {activeTab}.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Period</th>
                                <th className="px-4 py-2 font-bold">Time Slot</th>
                                <th className="px-4 py-2 font-bold">Subject</th>
                                <th className="px-4 py-2 font-bold">Instructor</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {filteredSchedule.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 font-bold text-blue-600">
                                        PRD-{idx + 1}
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-slate-400" /> {row.start_time} - {row.end_time}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.subject_name}</td>
                                    <td className="px-4 py-2.5 font-medium text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-slate-400" /> {row.teacher_name || 'TBA'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchTimetable} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] font-bold gap-4">
                <div>Total {filteredSchedule.length} Academic Periods on {activeTab}</div>
            </div>
        </div>
    );
};

export default TimetableView;
