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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        All Subjects <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Upload Date
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search resource..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '200px' }} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Ask Doubt
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
            <div style={{ overflowX: 'auto', padding: '0 24px 24px' }}>
                {activeTab === 'materials' ? (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">ID</th>
                                <th className="px-3 py-4">Subject</th>
                                <th className="px-3 py-4">Title</th>
                                <th className="px-3 py-4">Type</th>
                                <th className="px-3 py-4">Size</th>
                                <th className="px-3 py-4">Uploaded</th>
                                <th className="px-3 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', position: 'relative' }}>
                                        {row.isNew && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, background: '#0ea5e9', color: 'white', fontSize: '10px', padding: '2px 16px 2px 4px', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)', fontWeight: 'bold' }}>
                                                New
                                            </div>
                                        )}
                                        <span style={{ color: '#111827', display: 'block', marginTop: row.isNew ? '8px' : '0' }}>{row.id}</span>
                                    </td>
                                    <td style={{ padding: '16px 12px', color: '#4b5563', fontWeight: '500' }}>{row.subject}</td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.title}</td>
                                    <td className="px-3 py-4">
                                        <span style={{ padding: '4px 8px', background: row.type === 'PDF' ? '#fee2e2' : '#e0e7ff', color: row.type === 'PDF' ? '#ef4444' : '#4f46e5', borderRadius: '4px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <FileText size={14} /> {row.type}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-gray-500">{row.size}</td>
                                    <td className="px-3 py-4 text-gray-500">{row.date}</td>
                                    <td className="px-3 py-4 text-right">
                                        <button style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                                            <Download size={16} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : activeTab === 'lectures' ? (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">ID</th>
                                <th className="px-3 py-4">Subject</th>
                                <th className="px-3 py-4">Topic</th>
                                <th className="px-3 py-4">Duration</th>
                                <th className="px-3 py-4">Date</th>
                                <th className="px-3 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lectures.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                    <td style={{ padding: '16px 12px', position: 'relative' }}>
                                        {row.isNew && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, background: '#0ea5e9', color: 'white', fontSize: '10px', padding: '2px 16px 2px 4px', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)', fontWeight: 'bold' }}>
                                                New
                                            </div>
                                        )}
                                        <span style={{ color: '#111827', display: 'block', marginTop: row.isNew ? '8px' : '0' }}>{row.id}</span>
                                    </td>
                                    <td style={{ padding: '16px 12px', color: '#4b5563', fontWeight: '500' }}>{row.subject}</td>
                                    <td className="px-3 py-4 text-gray-900 font-medium">{row.title}</td>
                                    <td className="px-3 py-4">
                                        <span style={{ padding: '4px 8px', background: '#f1f5f9', color: '#4b5563', borderRadius: '4px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Video size={14} /> {row.duration}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-gray-500">{row.date}</td>
                                    <td className="px-3 py-4 text-right">
                                        <button style={{ background: '#0ea5e9', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                                            <Play size={14} fill="currentColor" /> Watch
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="px-3 py-4 w-[60px]">S.No.</th>
                                <th className="px-3 py-4">Academic Year</th>
                                <th className="px-3 py-4">Curriculum</th>
                                <th className="px-3 py-4">Status</th>
                                <th className="px-3 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-3 py-4 text-gray-500">1</td>
                                <td className="px-3 py-4 text-gray-900 font-medium">2026-2027</td>
                                <td className="px-3 py-4 text-gray-600">Complete Annual Syllabus</td>
                                <td className="px-3 py-4">
                                    <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Active</span>
                                </td>
                                <td className="px-3 py-4 text-right">
                                    <button style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                                        <Download size={16} /> Download PDF
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-4 py-2 border-t border-slate-200 text-gray-600 text-sm gap-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Rows per page: 
                    <select className="border-none outline-none text-gray-900 cursor-pointer bg-transparent">
                        <option>100</option>
                        <option>50</option>
                        <option>20</option>
                    </select>
                </div>
                <div>1-{activeTab === 'materials' ? materials.length : (activeTab === 'lectures' ? lectures.length : 1)} of {activeTab === 'materials' ? materials.length : (activeTab === 'lectures' ? lectures.length : 1)}</div>
                <div className="flex gap-2">
                    <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }} disabled><ChevronLeft size={20} /></button>
                    <button style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default AcademicsView;
