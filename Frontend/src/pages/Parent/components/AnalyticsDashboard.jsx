import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Target, Book } from 'lucide-react';

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
                <p className="text-slate-500">Interactive charts and progress monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 shrink-0">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Performance Trend</p>
                        <div className="flex items-center gap-2">
                            <h3 className="m-0 text-base font-bold text-slate-800">+5%</h3>
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">UP</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 shrink-0">
                        <Minus size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Attendance Trend</p>
                        <div className="flex items-center gap-2">
                            <h3 className="m-0 text-base font-bold text-slate-800">85%</h3>
                            <span className="text-[10px] text-slate-600 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">STABLE</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
                        <Target size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Homework Done</p>
                        <div className="flex items-center gap-2">
                            <h3 className="m-0 text-base font-bold text-slate-800">92%</h3>
                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">HIGH</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center text-rose-700 shrink-0">
                        <TrendingDown size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Weakest Subject</p>
                        <div className="flex items-center gap-2">
                            <h3 className="m-0 text-[14px] font-bold text-slate-800">English</h3>
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">FOCUS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center">
                    <Activity size={32} className="text-slate-300 mb-3" />
                    <h3 className="m-0 text-sm font-bold text-slate-800 mb-1">Performance Graph</h3>
                    <p className="m-0 text-[12px] text-slate-500">Chart integration goes here</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center">
                    <Book size={32} className="text-slate-300 mb-3" />
                    <h3 className="m-0 text-sm font-bold text-slate-800 mb-1">Subject Comparison Radar</h3>
                    <p className="m-0 text-[12px] text-slate-500">Chart integration goes here</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
