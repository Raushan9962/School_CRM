import React, { useState } from 'react';
import { Bell, Download, Filter, Megaphone, Calendar } from 'lucide-react';

const CircularAnnouncements = () => {
    const [filter, setFilter] = useState('All');

    const circulars = [
        { id: 1, title: 'Winter Vacation Schedule', category: 'Holiday Notice', date: '05 Nov 2023', description: 'School will remain closed from 25th Dec to 5th Jan.', important: true },
        { id: 2, title: 'PTM Schedule for Term 1', category: 'PTM', date: '02 Nov 2023', description: 'Parent Teacher Meeting for Term 1 is scheduled on 10th Nov.', important: false },
        { id: 3, title: 'Annual Sports Day', category: 'Event Notice', date: '28 Oct 2023', description: 'Annual sports day will be held on 20th Nov. Please submit participation forms.', important: false },
        { id: 4, title: 'Revision Test Timetable', category: 'Exam Notice', date: '25 Oct 2023', description: 'Find attached the revision test schedule for classes 6 to 10.', important: true },
    ];

    const filteredCirculars = filter === 'All' ? circulars : circulars.filter(c => c.category === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Circulars & Announcements</h1>
                    <p className="text-slate-500">Official notices and school updates.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Holiday Notice', 'PTM', 'Event Notice', 'Exam Notice'].map(category => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                            filter === category 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Circular List */}
            <div className="grid grid-cols-1 gap-3">
                {filteredCirculars.map((circular) => (
                    <div key={circular.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-start justify-between hover:border-blue-200 transition-colors relative overflow-hidden">
                        {circular.important && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${circular.important ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                <Megaphone size={18} />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h3 className="m-0 text-[13px] font-bold text-slate-800">{circular.title}</h3>
                                    {circular.important && (
                                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-bold uppercase tracking-wider rounded border border-rose-200">Important</span>
                                    )}
                                </div>
                                <p className="m-0 text-[12px] text-slate-500 mb-2">{circular.description}</p>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                        <Filter size={10} /> {circular.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                        <Calendar size={12} /> {circular.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2 mt-2 md:mt-0">
                            <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-[12px] font-semibold transition-colors border border-slate-300">
                                <Download size={14} /> Attachment
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredCirculars.length === 0 && (
                    <div className="text-center p-8 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                        <Bell size={32} className="text-slate-300 mb-3" />
                        <h3 className="m-0 text-sm font-bold text-slate-800 mb-1">No circulars found</h3>
                        <p className="m-0 text-[12px] text-slate-500">There are no notices matching the selected filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircularAnnouncements;
