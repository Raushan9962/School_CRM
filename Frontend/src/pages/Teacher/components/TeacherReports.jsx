import React, { useState } from 'react';

const TeacherReports = () => {
    const [reportType, setReportType] = useState('performance');

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-700 cursor-pointer"
                >
                    <option value="performance">Class Performance Reports</option>
                    <option value="attendance">Attendance Reports</option>
                    <option value="subject">Subject-wise Analytics</option>
                </select>
                <select className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-700 cursor-pointer">
                    <option>Class 10 - A</option>
                    <option>Class 9 - B</option>
                </select>
                <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white border-none rounded-lg font-bold cursor-pointer transition-colors whitespace-nowrap shadow-sm">
                    Generate Report
                </button>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 min-h-[400px] flex flex-col items-center justify-center">
                {/* Mockup for report display area */}
                <div className="text-center text-slate-500 flex flex-col items-center max-w-md mx-auto">
                    <div className="text-6xl mb-4 select-none filter drop-shadow-sm">
                        {reportType === 'performance' ? '📊' : reportType === 'attendance' ? '📅' : '📈'}
                    </div>
                    <h3 className="m-0 mb-3 text-lg font-bold text-slate-800">
                        {reportType === 'performance' ? 'Class Performance Report' : reportType === 'attendance' ? 'Attendance Report' : 'Subject Analytics'}
                    </h3>
                    <p className="m-0 mb-8 text-slate-500">Data for Class 10 - A will be displayed here.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg font-bold cursor-pointer flex items-center gap-2 transition-colors">
                            <span className="text-sm">📄</span> Download PDF
                        </button>
                        <button className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold cursor-pointer flex items-center gap-2 transition-colors">
                            <span className="text-sm">📊</span> Export to Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherReports;
