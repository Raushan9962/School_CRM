import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Target, Book } from 'lucide-react';

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
                <p className="text-slate-500">Interactive charts and progress monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-2">Performance Trend</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-emerald-600">+5%</h3>
                        <div className="flex items-center text-sm font-medium text-emerald-600 mb-1">
                            <TrendingUp size={16} className="mr-1" />
                            Up
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Compared to last term</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-2">Attendance Trend</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-slate-800">85%</h3>
                        <div className="flex items-center text-sm font-medium text-slate-500 mb-1">
                            <Minus size={16} className="mr-1" />
                            Stable
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Consistent this month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-2">Homework Completion</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-blue-600">92%</h3>
                        <div className="flex items-center text-sm font-medium text-blue-600 mb-1">
                            <Target size={16} className="mr-1" />
                            High
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Excellent submission rate</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-2">Weakest Subject</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-xl font-bold text-rose-600">English</h3>
                        <div className="flex items-center text-sm font-medium text-rose-600 mb-1">
                            <TrendingDown size={16} className="mr-1" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Needs more attention</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center">
                    <Activity size={48} className="text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Performance Graph</h3>
                    <p className="text-slate-500 text-sm">Chart integration (e.g. Recharts or Chart.js) goes here</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center">
                    <Book size={48} className="text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Subject Comparison Radar</h3>
                    <p className="text-slate-500 text-sm">Chart integration goes here</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
