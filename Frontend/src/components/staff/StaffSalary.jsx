import React, { useState, useEffect } from 'react';
import { IndianRupee, FileText, Download } from 'lucide-react';
import apiFetch from '../../services/api';

const StaffSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSalary();
    }, []);

    const fetchSalary = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [salRes, attRes, leaveRes] = await Promise.all([
                apiFetch('/staff/salary', { headers }),
                apiFetch('/staff/attendance', { headers }),
                apiFetch('/staff/leaves', { headers })
            ]);

            const salData = await salRes.json();
            const attData = await attRes.json();
            const leaveData = await leaveRes.json();

            if (salData.success) setSalaries(salData.data);
            if (attData.success) setAttendance(attData.data);
            if (leaveData.success) setLeaves(leaveData.data);

        } catch (err) {
            console.error('Error fetching salary', err);
        } finally {
            setLoading(false);
        }
    };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthStats = React.useMemo(() => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Count present days in current month
        const presentDays = attendance.filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear && a.status === 'Present';
        }).length;

        // Count leaves in current month
        let leavesTaken = 0;
        leaves.forEach(l => {
            if (l.status === 'Approved') {
                const sd = new Date(l.start_date || l.from_date);
                if (sd.getMonth() === currentMonth && sd.getFullYear() === currentYear) {
                    const ed = new Date(l.end_date || l.to_date);
                    const days = Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1;
                    leavesTaken += days;
                }
            }
        });

        // Calculate expected salary based on latest basic_salary
        let basic = 25000; // default assumption if no history
        if (salaries.length > 0) {
            basic = parseFloat(salaries[0].basic_salary) || 25000;
        }
        const dailyWage = basic / daysInMonth;
        const projectedSalary = Math.round((presentDays + leavesTaken) * dailyWage);

        return {
            totalDays: daysInMonth,
            presentDays,
            leavesTaken,
            projectedSalary
        };
    }, [attendance, leaves, salaries]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <IndianRupee size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 m-0">Salary Slips & Payroll</h2>
                        <p className="text-sm text-slate-500 m-0">View your monthly salary details and deductions</p>
                    </div>
                </div>
            </div>

            {/* Current Month Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex flex-col gap-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Month Presence</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-bold text-slate-800 m-0">{currentMonthStats.presentDays}</h3>
                        <span className="text-sm font-medium text-slate-500 mb-1">/ {currentMonthStats.totalDays} Days</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex flex-col gap-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Approved Leaves</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-bold text-slate-800 m-0">{currentMonthStats.leavesTaken}</h3>
                        <span className="text-sm font-medium text-slate-500 mb-1">Days Off</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex flex-col gap-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Salary</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-bold text-slate-800 m-0">₹ {currentMonthStats.projectedSalary.toLocaleString('en-IN')}</h3>
                        <span className="text-sm font-medium text-slate-500 mb-1">Estimated</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="m-0 text-sm font-bold text-slate-900">Salary History</h3>
                    <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">{salaries.length} record(s)</span>
                </div>
                
                {loading ? (
                    <div className="p-10 text-center text-slate-400 font-medium">Loading...</div>
                ) : salaries.length === 0 ? (
                    <div className="p-16 text-center border-t border-slate-50">
                        <FileText size={48} strokeWidth={1.5} className="text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-600 font-bold m-0 mb-1 text-sm">No payroll records found</h3>
                        <p className="text-slate-400 m-0 text-sm font-medium">Your salary slips will appear here once generated by the Accountant.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Month/Year</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Pay</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Allowances</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Deductions</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Net Salary</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salaries.map((s, i) => (
                                    <tr key={s.id || i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700">{s.month} {s.year}</td>
                                        <td className="px-5 py-4 text-sm text-slate-600">₹{s.basic_salary}</td>
                                        <td className="px-5 py-4 text-sm text-emerald-600 font-medium">+ ₹{s.allowances}</td>
                                        <td className="px-5 py-4 text-sm text-red-600 font-medium">- ₹{s.deductions}</td>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-900">₹{s.net_salary}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${s.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-slate-500">
                                            {s.payment_date ? new Date(s.payment_date).toLocaleDateString('en-IN') : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffSalary;
