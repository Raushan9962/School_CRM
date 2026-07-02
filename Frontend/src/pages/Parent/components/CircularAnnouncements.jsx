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
            <div className="grid grid-cols-1 gap-4">
                {filteredCirculars.map((circular) => (
                    <div key={circular.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                        {circular.important && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        )}
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${circular.important ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{circular.title}</h3>
                                    {circular.important && (
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded-full">Important</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{circular.description}</p>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        <Filter size={12} /> {circular.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                        <Calendar size={12} /> {circular.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-3">
                            <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-200">
                                <Download size={16} /> Attachment
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredCirculars.length === 0 && (
                    <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No circulars found</h3>
                        <p className="text-slate-500">There are no notices matching the selected filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircularAnnouncements;
