import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';

const AttendanceModule = ({ childId }) => {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`\${import.meta.env.VITE_API_BASE_URL}/parent/children/${childId}/attendance`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAttendance(response.data);
            } catch (error) {
                console.error("Error fetching attendance", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) fetchAttendance();
    }, [childId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading attendance data...</div>;
    if (!attendance) return <div className="p-8 text-center text-rose-500">Failed to load attendance data.</div>;

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Attendance Tracker</h1>
                <p className="text-slate-500">Monitor your child's daily presence and leaves.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <CalendarIcon size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Overall Attendance</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{attendance.percentage}%</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Days Present</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{attendance.presentDays}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <XCircle size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Days Absent</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{attendance.absentDays}</h3>
                    </div>
                </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-slate-500" />
                        <h3 className="m-0 text-sm font-bold text-slate-800">Recent Attendance History</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {attendance.recent && attendance.recent.map((record, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-[13px] font-medium text-slate-800">{record.date}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                            record.status === 'Present' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModule;
