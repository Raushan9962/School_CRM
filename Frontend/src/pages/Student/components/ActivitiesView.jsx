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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Category <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Filter Date
                    </button>

                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search events..." className="py-2 pr-3 pl-9 border border-slate-200 rounded text-sm outline-none w-48 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-shadow" />
                    </div>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b-2 border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[160px] p-4 text-left cursor-pointer flex flex-col gap-1 relative -mb-[2px] rounded-t-lg transition-colors border ${
                            activeTab === tab.id 
                                ? 'bg-sky-50 border-sky-500 border-b-0 border-t-4' 
                                : 'bg-white border-slate-200 border-b-0 border-t-transparent hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="text-sm text-gray-600 font-medium">{tab.label}</span>
                            <span className="text-2xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {activeTab === 'upcoming' ? (
                    loading ? (
                        <div className="p-10 text-center text-gray-500">Loading events...</div>
                    ) : upcomingEvents.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No events found.</div>
                    ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="p-4 w-[60px]">S.No.</th>
                                <th className="p-4">Event ID</th>
                                <th className="p-4">Event Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Event Date</th>
                                <th className="p-4">Reg. Deadline</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingEvents.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-gray-500">{idx + 1}</td>
                                    <td className="p-4 relative">
                                        {row.isNew && (
                                            <div className="absolute top-0 left-0 bg-sky-500 text-white text-[10px] py-0.5 pr-4 pl-1 font-bold" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}>
                                                New
                                            </div>
                                        )}
                                        <span className={`text-gray-900 block ${row.isNew ? 'mt-2' : 'mt-0'}`}>{row.id}</span>
                                    </td>
                                    <td className="p-4 text-gray-900 font-medium">
                                        {row.title}
                                        <div className="text-xs text-gray-500 mt-1">📍 {row.venue}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-slate-100 text-gray-600 rounded text-xs font-medium">{row.category}</span>
                                    </td>
                                    <td className="p-4 text-gray-600">{row.date}</td>
                                    <td className={`p-4 ${row.status === 'Closed' ? 'text-red-500' : 'text-gray-600'}`}>{row.deadline}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            disabled={row.status === 'Closed'} 
                                            className={`px-3 py-1.5 rounded font-medium ${
                                                row.status === 'Open' 
                                                    ? 'bg-sky-500 text-white hover:bg-sky-600 cursor-pointer transition-colors' 
                                                    : 'bg-slate-100 text-gray-400 cursor-not-allowed'
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
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="p-4 w-[60px]">S.No.</th>
                                <th className="p-4">Event ID</th>
                                <th className="p-4">Event Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Date Participated</th>
                                <th className="p-4">Result / Position</th>
                                <th className="p-4 text-right">Certificate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-gray-500">{idx + 1}</td>
                                    <td className="p-4 text-gray-900">{row.id}</td>
                                    <td className="p-4 text-gray-900 font-medium">{row.title}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-slate-100 text-gray-600 rounded text-xs font-medium">{row.category}</span>
                                    </td>
                                    <td className="p-4 text-gray-600">{row.date}</td>
                                    <td className={`p-4 ${row.result !== 'Participant' ? 'text-emerald-500 font-semibold' : 'text-gray-600'}`}>
                                        {row.result}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            disabled={!row.certificate} 
                                            className={`inline-flex items-center gap-1 bg-transparent border-none font-medium ${
                                                row.certificate 
                                                    ? 'text-sky-500 cursor-pointer hover:text-sky-600 transition-colors' 
                                                    : 'text-slate-300 cursor-not-allowed'
                                            }`}
                                        >
                                            <Download size={16} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-10 text-center text-gray-500">
                        <p>No major achievements recorded yet. Keep participating!</p>
                    </div>
                )}
                
                {/* Floating Action Button */}
                <button 
                    onClick={fetchEvents} 
                    className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center cursor-pointer shadow-[0_4px_6px_rgba(14,165,233,0.4)] hover:bg-sky-600 transition-all hover:scale-105 active:scale-95"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center p-4 px-6 border-t border-slate-200 text-gray-600 text-sm gap-6">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-gray-900 cursor-pointer bg-transparent focus:ring-0">
                        <option>100</option>
                        <option>50</option>
                        <option>20</option>
                    </select>
                </div>
                <div>1-{activeTab === 'upcoming' ? upcomingEvents.length : history.length} of {activeTab === 'upcoming' ? upcomingEvents.length : history.length}</div>
                <div className="flex gap-2">
                    <button className="bg-transparent border-none text-gray-400 flex items-center disabled:opacity-50" disabled><ChevronLeft size={20} /></button>
                    <button className="bg-transparent border-none text-gray-600 cursor-pointer flex items-center hover:text-gray-900 transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default ActivitiesView;
