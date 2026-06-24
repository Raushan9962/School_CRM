import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Bell } from 'lucide-react';
import { 
    FcReadingEbook, 
    FcBusinesswoman, 
    FcOrganization, 
    FcCalendar, 
    FcCurrencyExchange, 
    FcDebt, 
    FcLibrary, 
    FcAddDatabase, 
    FcSms, 
    FcInvite,
    FcCalculator,
    FcCallback,
    FcAutomotive,
    FcHome,
    FcManager
} from 'react-icons/fc';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import apiFetch from '../../../services/api';

const DashboardOverview = ({ setActiveTab }) => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalAccountants: 0,
        totalLibrarians: 0,
        totalReceptionists: 0,
        totalTransportStaff: 0,
        totalWardens: 0,
        totalHR: 0,
        todayAttendancePercent: 0,
        feesCollected: 0,
        pendingFees: 0,
        upcomingExams: 0,
        newAdmissions: 0,
        notifications: 0,
        birthdayToday: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiFetch('/school-admin/dashboard-stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Students', value: stats.totalStudents, icon: <FcReadingEbook size={28} />, color: '#3b82f6', bg: '#eff6ff', borderTop: 'border-t-blue-500', tab: 'student' },
        { title: 'Total Teachers', value: stats.totalTeachers, icon: <FcBusinesswoman size={28} />, color: '#10b981', bg: '#ecfdf5', borderTop: 'border-t-emerald-500', tab: 'teacher' },
        { title: 'Accountants', value: stats.totalAccountants, icon: <FcCalculator size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'accountant' },
        { title: 'Librarians', value: stats.totalLibrarians, icon: <FcLibrary size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'librarian' },
        { title: 'Receptionists', value: stats.totalReceptionists, icon: <FcCallback size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'receptionist' },
        { title: 'Transport Staff', value: stats.totalTransportStaff, icon: <FcAutomotive size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'transport_staff' },
        { title: 'Hostel Wardens', value: stats.totalWardens, icon: <FcHome size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'warden' },
        { title: 'HR Managers', value: stats.totalHR, icon: <FcManager size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'hr' },
        { title: 'Today Attendance', value: `${stats.todayAttendancePercent}%`, icon: <FcCalendar size={28} />, color: '#f59e0b', bg: '#fffbeb', borderTop: 'border-t-amber-500', tab: 'student' },
        { title: 'Fees Collected', value: `₹${stats.feesCollected.toLocaleString()}`, icon: <FcCurrencyExchange size={28} />, color: '#14b8a6', bg: '#f0fdfa', borderTop: 'border-t-teal-500', tab: 'finance' },
        { title: 'Pending Fees', value: `₹${stats.pendingFees.toLocaleString()}`, icon: <FcDebt size={28} />, color: '#ef4444', bg: '#fef2f2', borderTop: 'border-t-rose-500', tab: 'finance' },
        { title: 'Upcoming Exams', value: `${stats.upcomingExams} Days`, icon: <FcLibrary size={28} />, color: '#6366f1', bg: '#eef2ff', borderTop: 'border-t-indigo-500', tab: 'student' },
        { title: 'New Admissions', value: stats.newAdmissions, icon: <FcAddDatabase size={28} />, color: '#ec4899', bg: '#fdf2f8', borderTop: 'border-t-pink-500', tab: 'student' },
        { title: 'Notifications', value: stats.notifications, icon: <FcSms size={28} />, color: '#eab308', bg: '#fefce8', borderTop: 'border-t-yellow-500', tab: 'overview' },
        { title: 'Birthday Today', value: stats.birthdayToday, icon: <FcInvite size={28} />, color: '#f43f5e', bg: '#fff1f2', borderTop: 'border-t-rose-500', tab: 'student' },
    ];

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading Dashboard Stats...</div>;
    }

    return (
        <div className="animate-fade-in max-w-[1600px] mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Overview</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Generate Report</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((card, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setActiveTab(card.tab)}
                        className={`bg-white rounded-xl border border-slate-200 border-t-2 ${card.borderTop} shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-all cursor-pointer p-4 flex flex-col justify-between h-[120px]`}
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-[13px] font-semibold text-slate-500">{card.title}</p>
                            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center border border-white/40 shadow-sm" style={{ backgroundColor: card.bg }}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
                            <div className="flex items-center text-emerald-500 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                <ArrowUpRight size={12} />
                                <span>2.5%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[15px] font-bold text-slate-800">Revenue Trend</h3>
                        <select className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-600 outline-none">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[250px] w-full">
                        <Bar 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: '#1e293b',
                                        padding: 10,
                                        titleFont: { size: 13 },
                                        bodyFont: { size: 14, weight: 'bold' },
                                        callbacks: {
                                            label: (context) => `₹${context.raw.toLocaleString()}`
                                        }
                                    }
                                },
                                scales: {
                                    x: { grid: { display: false } },
                                    y: { 
                                        border: { display: false },
                                        grid: { color: '#f1f5f9' },
                                        ticks: {
                                            callback: (value) => `₹${value / 1000}k`
                                        }
                                    }
                                }
                            }} 
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                datasets: [{
                                    label: 'Revenue',
                                    data: [45000, 72000, 50000, 95000, 68000, 85000, 58000, 110000, 40000, 90000, 65000, 80000],
                                    backgroundColor: '#3b82f6',
                                    borderRadius: 4,
                                    barPercentage: 0.6
                                }]
                            }} 
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[15px] font-bold text-slate-800">Recent Activity</h3>
                        <button className="text-[12px] text-blue-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-3 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <Bell size={14} className="text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-medium text-slate-700 leading-tight">System update completed successfully</p>
                                    <p className="text-[11px] text-slate-400 mt-1">{i} hour{i > 1 ? 's' : ''} ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
