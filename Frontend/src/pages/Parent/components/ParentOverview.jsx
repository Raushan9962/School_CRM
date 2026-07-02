import React from 'react';
import { Users, BookOpen, IndianRupee, Clock, CalendarDays, Award } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-xl ${colorClass}`}>
            <Icon size={24} className="opacity-80" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const ParentOverview = ({ childId }) => {
    // In a real implementation, this would fetch overview data for the specific childId
    
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
                <p className="text-slate-500">Quick summary of academic progress and activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Attendance"
                    value="85%"
                    icon={CalendarDays}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Pending Fees"
                    value="₹20,000"
                    icon={IndianRupee}
                    colorClass="bg-rose-50 text-rose-600"
                />
                <StatCard
                    title="Next Exam"
                    value="15 Nov"
                    icon={Award}
                    colorClass="bg-amber-50 text-amber-600"
                />
                <StatCard
                    title="Pending Homework"
                    value="3"
                    icon={BookOpen}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Recent Notifications Widget */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-blue-500" />
                        Recent Notifications
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <p className="text-sm font-semibold text-slate-800">PTM Scheduled</p>
                            <p className="text-xs text-slate-500 mt-1">Parent-Teacher Meeting is scheduled for 10th Nov.</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-sm font-semibold text-slate-800">Fee Reminder</p>
                            <p className="text-xs text-slate-500 mt-1">Second installment of tuition fee is due soon.</p>
                        </div>
                    </div>
                </div>

                {/* Upcoming Schedule Widget */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CalendarDays size={18} className="text-emerald-500" />
                        Today's Schedule
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                            <div className="w-16 text-center shrink-0">
                                <p className="text-xs font-bold text-slate-800">08:00 AM</p>
                                <p className="text-[10px] text-slate-500 uppercase">Period 1</p>
                            </div>
                            <div className="w-1 h-10 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Mathematics</p>
                                <p className="text-xs text-slate-500">Mr. Sharma • Room 102</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                            <div className="w-16 text-center shrink-0">
                                <p className="text-xs font-bold text-slate-800">08:45 AM</p>
                                <p className="text-[10px] text-slate-500 uppercase">Period 2</p>
                            </div>
                            <div className="w-1 h-10 bg-emerald-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Science Lab</p>
                                <p className="text-xs text-slate-500">Mrs. Gupta • Bio Lab</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentOverview;
