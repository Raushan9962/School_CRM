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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Weekly View <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Current Week
                    </button>
                </div>

                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Download Timetable
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
                            <span className="text-xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading timetable...</div>
                ) : filteredSchedule.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No classes scheduled for {activeTab}.</div>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Period</th>
                                <th className="px-3 py-4">Time Slot</th>
                                <th className="px-3 py-4">Subject</th>
                                <th className="px-3 py-4">Instructor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedule.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', color: '#111827' }}>
                                        PRD-{idx + 1}
                                    </td>
                                    <td style={{ padding: '16px 12px', color: '#4b5563', fontWeight: '500' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} /> {row.start_time} - {row.end_time}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 12px', color: '#111827', fontWeight: '600' }}>{row.subject_name}</td>
                                    <td className="px-3 py-4 text-gray-600">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <User size={14} /> {row.teacher_name || 'TBA'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button onClick={fetchTimetable} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-4 py-2 border-t border-slate-200 text-gray-600 text-sm gap-4">
                <div>Total {filteredSchedule.length} Academic Periods on {activeTab}</div>
            </div>
        </div>
    );
};

export default TimetableView;
