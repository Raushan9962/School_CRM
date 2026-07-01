import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import apiFetch from '../../../services/api';

const ActivitiesView = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [eventsData, setEventsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await apiFetch(`/events`);
            if (res.ok) {
                const data = await res.json();
                setEventsData(data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const upcomingEvents = eventsData.map((e, idx) => {
        const eventDate = new Date(e.date);
        const isClosed = eventDate < new Date();
        return {
            id: `EVT-${eventDate.getFullYear()}-${e.id.toString().padStart(2, '0')}`,
            title: e.name,
            category: 'General',
            date: eventDate.toLocaleDateString(),
            deadline: isClosed ? 'Passed' : new Date(eventDate.getTime() - 86400000).toLocaleDateString(), // 1 day before
            venue: e.organizer || 'Main Campus',
            status: isClosed ? 'Closed' : 'Open',
            isNew: idx === 0
        };
    });

    const history = [
        // Dummy data for history since there is no participation table
        { id: 'HST-045', title: 'Tech Innovators Hackathon', category: 'Technology', date: '15 Sep 2026', result: '1st Runner Up', certificate: true }
    ];

    const tabs = [
        { id: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length.toString(), subtext: 'Registrations Open' },
        { id: 'history', label: 'Participation History', count: history.length.toString(), subtext: 'Past Events' },
        { id: 'achievements', label: 'Achievements', count: '0', subtext: 'Awards & Medals' }
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Category <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Filter Date
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search events..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-48" />
                    </div>
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
                {activeTab === 'upcoming' ? (
                    loading ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading events...</div>
                    ) : upcomingEvents.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">No events found.</div>
                    ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Event ID</th>
                                <th className="px-4 py-2 font-bold">Event Title</th>
                                <th className="px-4 py-2 font-bold text-center">Category</th>
                                <th className="px-4 py-2 font-bold">Event Date</th>
                                <th className="px-4 py-2 font-bold">Reg. Deadline</th>
                                <th className="px-4 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {upcomingEvents.map((row, idx) => (
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
                                    <td className="px-4 py-2.5">
                                        <div className="font-bold text-slate-800">{row.title}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">📍 {row.venue}</div>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{row.category}</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-600 font-medium">{row.date}</td>
                                    <td className={`px-4 py-2.5 font-bold ${row.status === 'Closed' ? 'text-red-500' : 'text-slate-600'}`}>{row.deadline}</td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button 
                                            disabled={row.status === 'Closed'} 
                                            className={`px-3 py-1.5 rounded font-bold transition-colors inline-flex items-center gap-1.5 border ${
                                                row.status === 'Open' 
                                                    ? 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {row.status === 'Open' ? 'Register Now' : 'Closed'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )
                ) : activeTab === 'history' ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Event ID</th>
                                <th className="px-4 py-2 font-bold">Event Title</th>
                                <th className="px-4 py-2 font-bold text-center">Category</th>
                                <th className="px-4 py-2 font-bold">Date Participated</th>
                                <th className="px-4 py-2 font-bold">Result / Position</th>
                                <th className="px-4 py-2 font-bold text-right">Certificate</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {history.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.id}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.title}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{row.category}</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-600 font-medium">{row.date}</td>
                                    <td className={`px-4 py-2.5 font-bold ${row.result !== 'Participant' ? 'text-emerald-500' : 'text-slate-600'}`}>
                                        {row.result}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button 
                                            disabled={!row.certificate} 
                                            className={`inline-flex items-center gap-1.5 font-bold ${
                                                row.certificate 
                                                    ? 'text-blue-600 cursor-pointer hover:text-blue-700 transition-colors bg-transparent border-none' 
                                                    : 'text-slate-300 cursor-not-allowed bg-transparent border-none'
                                            }`}
                                        >
                                            <Download size={14} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">
                        <p>No major achievements recorded yet. Keep participating!</p>
                    </div>
                )}
                
                {/* Floating Action Button */}
                <button 
                    onClick={fetchEvents} 
                    className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] font-bold gap-4">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-slate-700 bg-transparent font-bold cursor-pointer">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{activeTab === 'upcoming' ? upcomingEvents.length : history.length} of {activeTab === 'upcoming' ? upcomingEvents.length : history.length}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default ActivitiesView;
