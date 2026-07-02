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
                const response = await axios.get(`http://localhost:5000/api/parent/children/${childId}/attendance`, {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Overall Attendance</p>
                        <h3 className="text-3xl font-bold text-blue-600">{attendance.percentage}%</h3>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <CalendarIcon size={24} className="text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <h3 className="text-sm font-semibold text-slate-700">Days Present</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{attendance.presentDays}</p>
                    <p className="text-xs text-slate-500 mt-1">Total days attended</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <XCircle size={20} className="text-rose-500" />
                        <h3 className="text-sm font-semibold text-slate-700">Days Absent</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{attendance.absentDays}</p>
                    <p className="text-xs text-slate-500 mt-1">Total days missed</p>
                </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} className="text-slate-500" />
                        Recent Attendance History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {attendance.recent && attendance.recent.map((record, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{record.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
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
