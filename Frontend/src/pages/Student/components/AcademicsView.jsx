import React, { useState } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight, FileText, Video, Download, Play } from 'lucide-react';

const AcademicsView = () => {
    const [activeTab, setActiveTab] = useState('materials');

    const tabs = [
        { id: 'materials', label: 'Study Materials', count: '24', subtext: 'PDFs & Docs' },
        { id: 'lectures', label: 'Recorded Lectures', count: '12', subtext: 'Video Links' },
        { id: 'syllabus', label: 'Syllabus', count: '1', subtext: 'Annual 2026-27' }
    ];

    const materials = [
        { id: 'MAT-001', title: 'Chapter 5: Calculus Notes', subject: 'Mathematics', type: 'PDF', size: '2.4 MB', date: '22 Oct 2026', isNew: true },
        { id: 'MAT-002', title: 'Physics Formula Sheet', subject: 'Physics', type: 'PDF', size: '1.1 MB', date: '20 Oct 2026', isNew: true },
        { id: 'MAT-003', title: 'Organic Chemistry Reactions', subject: 'Chemistry', type: 'DOCX', size: '3.5 MB', date: '18 Oct 2026', isNew: false },
        { id: 'MAT-004', title: 'English Grammar Rules', subject: 'English', type: 'PDF', size: '1.8 MB', date: '15 Oct 2026', isNew: false },
    ];

    const lectures = [
        { id: 'LEC-001', title: 'Integration Basics', subject: 'Mathematics', duration: '45 mins', date: '15 Oct 2026', isNew: true },
        { id: 'LEC-002', title: 'Laws of Motion', subject: 'Physics', duration: '52 mins', date: '14 Oct 2026', isNew: false },
        { id: 'LEC-003', title: 'Chemical Bonding', subject: 'Chemistry', duration: '38 mins', date: '12 Oct 2026', isNew: false },
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        All Subjects <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Upload Date
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search resource..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-48" />
                    </div>
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                        Ask Doubt
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
                {activeTab === 'materials' ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">ID</th>
                                <th className="px-4 py-2 font-bold">Subject</th>
                                <th className="px-4 py-2 font-bold">Title</th>
                                <th className="px-4 py-2 font-bold">Type</th>
                                <th className="px-4 py-2 font-bold">Size</th>
                                <th className="px-4 py-2 font-bold">Uploaded</th>
                                <th className="px-4 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {materials.map((row, idx) => (
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
                                    <td className="px-4 py-2.5 font-medium text-slate-600">{row.subject}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.title}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-max ${row.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                            <FileText size={12} /> {row.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-500">{row.size}</td>
                                    <td className="px-4 py-2.5 text-slate-500">{row.date}</td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 transition-colors">
                                            <Download size={14} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : activeTab === 'lectures' ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">ID</th>
                                <th className="px-4 py-2 font-bold">Subject</th>
                                <th className="px-4 py-2 font-bold">Topic</th>
                                <th className="px-4 py-2 font-bold">Duration</th>
                                <th className="px-4 py-2 font-bold">Date</th>
                                <th className="px-4 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {lectures.map((row, idx) => (
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
                                    <td className="px-4 py-2.5 font-medium text-slate-600">{row.subject}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.title}</td>
                                    <td className="px-4 py-2.5">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold flex items-center gap-1 w-max">
                                            <Video size={12} /> {row.duration}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-500">{row.date}</td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold hover:bg-blue-700 inline-flex items-center gap-1.5 transition-colors">
                                            <Play size={12} fill="currentColor" /> Watch
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Academic Year</th>
                                <th className="px-4 py-2 font-bold">Curriculum</th>
                                <th className="px-4 py-2 font-bold">Status</th>
                                <th className="px-4 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-2.5 text-slate-500">1</td>
                                <td className="px-4 py-2.5 font-bold text-slate-800">2026-2027</td>
                                <td className="px-4 py-2.5 text-slate-600">Complete Annual Syllabus</td>
                                <td className="px-4 py-2.5">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase">Active</span>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 transition-colors">
                                        <Download size={14} /> Download PDF
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] font-bold gap-4">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-slate-700 bg-transparent font-bold cursor-pointer">
                        <option>100</option>
                        <option>50</option>
                        <option>20</option>
                    </select>
                </div>
                <div>1-{activeTab === 'materials' ? materials.length : (activeTab === 'lectures' ? lectures.length : 1)} of {activeTab === 'materials' ? materials.length : (activeTab === 'lectures' ? lectures.length : 1)}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default AcademicsView;
