import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Bell, QrCode, X } from 'lucide-react';
import QRCode from 'react-qr-code';
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
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrPayload, setQrPayload] = useState(null);
    const [alerts, setAlerts] = useState({ criticalAlerts: [], pendingLeaves: [] });

    const handleGenerateQR = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/principal/attendance-qr', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setQrPayload(data.qrPayload || data.data?.token || 'test-qr-token');
                setShowQRModal(true);
            } else {
                alert('Failed to generate QR code');
            }
        } catch (err) {
            console.error("Error generating QR:", err);
            alert('Error generating QR code');
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const [statsRes, alertsRes] = await Promise.all([
                    apiFetch('/principal/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } }),
                    apiFetch('/principal/dashboard-alerts', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.data);
                }

                if (alertsRes.ok) {
                    const alertsData = await alertsRes.json();
                    if (alertsData.success) {
                        setAlerts(alertsData.data);
                    }
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
        { title: 'Total Students', value: stats.totalStudents, icon: <FcReadingEbook size={28} />, color: '#3b82f6', bg: '#eff6ff', borderTop: 'border-t-blue-500', tab: 'students' },
        { title: 'Total Teachers', value: stats.totalTeachers, icon: <FcBusinesswoman size={28} />, color: '#10b981', bg: '#ecfdf5', borderTop: 'border-t-emerald-500', tab: 'teachers' },
        { title: 'Accountants', value: stats.totalAccountants, icon: <FcCalculator size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'finance' },
        { title: 'Librarians', value: stats.totalLibrarians, icon: <FcLibrary size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'library' },
        { title: 'Receptionists', value: stats.totalReceptionists, icon: <FcCallback size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'announcements' },
        { title: 'Transport Staff', value: stats.totalTransportStaff, icon: <FcAutomotive size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'transport' },
        { title: 'Hostel Wardens', value: stats.totalWardens, icon: <FcHome size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'overview' },
        { title: 'HR Managers', value: stats.totalHR, icon: <FcManager size={28} />, color: '#8b5cf6', bg: '#f5f3ff', borderTop: 'border-t-violet-500', tab: 'overview' },
        { title: 'Today Attendance', value: `${stats.todayAttendancePercent}%`, icon: <FcCalendar size={28} />, color: '#f59e0b', bg: '#fffbeb', borderTop: 'border-t-amber-500', tab: 'students' },
        { title: 'Fees Collected', value: `₹${stats.feesCollected.toLocaleString()}`, icon: <FcCurrencyExchange size={28} />, color: '#14b8a6', bg: '#f0fdfa', borderTop: 'border-t-teal-500', tab: 'finance' },
        { title: 'Pending Fees', value: `₹${stats.pendingFees.toLocaleString()}`, icon: <FcDebt size={28} />, color: '#ef4444', bg: '#fef2f2', borderTop: 'border-t-rose-500', tab: 'finance' },
        { title: 'Upcoming Exams', value: `${stats.upcomingExams} Days`, icon: <FcLibrary size={28} />, color: '#6366f1', bg: '#eef2ff', borderTop: 'border-t-indigo-500', tab: 'exams' },
        { title: 'New Admissions', value: stats.newAdmissions, icon: <FcAddDatabase size={28} />, color: '#ec4899', bg: '#fdf2f8', borderTop: 'border-t-pink-500', tab: 'students' },
        { title: 'Notifications', value: stats.notifications, icon: <FcSms size={28} />, color: '#eab308', bg: '#fefce8', borderTop: 'border-t-yellow-500', tab: 'announcements' },
        { title: 'Birthday Today', value: stats.birthdayToday, icon: <FcInvite size={28} />, color: '#f43f5e', bg: '#fff1f2', borderTop: 'border-t-rose-500', tab: 'students' },
    ];

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading Dashboard Stats...</div>;
    }

    return (
        <div className="animate-fade-in max-w-[1600px] mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Overview</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={handleGenerateQR}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer border-none text-sm"
                    >
                        <QrCode size={16} />
                        Generate Daily Attendance QR
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Generate Report</button>
                </div>
            </div>
            
            {showQRModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col items-center p-8 relative">
                        <button 
                            onClick={() => setShowQRModal(false)} 
                            className="absolute top-4 right-4 p-1 hover:bg-slate-200 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>
                        <h3 className="font-bold text-xl text-slate-800 mb-2 mt-4 text-center">Daily Attendance QR</h3>
                        <p className="text-slate-500 text-sm mb-8 text-center">Display this QR code for students and staff to scan using their mobile apps.</p>
                        
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            {qrPayload && <QRCode value={qrPayload} size={250} level="H" />}
                        </div>
                        
                        <p className="text-xs text-slate-400 mt-8">Valid for today only ({new Date().toLocaleDateString()})</p>
                    </div>
                </div>
            )}
            
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
                {/* Critical Alerts Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            Critical Alerts
                        </h3>
                        <button className="text-[12px] text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer">View All</button>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
                        {alerts.criticalAlerts.length === 0 ? (
                            <div className="text-center text-sm text-slate-500 py-4">No critical alerts today.</div>
                        ) : (
                            alerts.criticalAlerts.map((alert) => (
                                <div key={alert.id} className={`p-3 rounded-lg border ${
                                    alert.severity === 'high' ? 'bg-rose-50/50 border-rose-100' : 
                                    alert.severity === 'medium' ? 'bg-amber-50/50 border-amber-100' : 'bg-blue-50/50 border-blue-100'
                                }`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                            alert.severity === 'high' ? 'text-rose-600' : 
                                            alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                                        }`}>{alert.type}</span>
                                        <span className="text-[10px] font-medium text-slate-400">{alert.time}</span>
                                    </div>
                                    <p className="text-[13px] font-medium text-slate-800 leading-snug m-0">{alert.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Approvals (Pending Leaves) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[15px] font-bold text-slate-800">Quick Approvals</h3>
                        <span className="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{alerts.pendingLeaves.length} Pending</span>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
                        {alerts.pendingLeaves.length === 0 ? (
                            <div className="text-center text-sm text-slate-500 py-4">No pending approvals.</div>
                        ) : (
                            alerts.pendingLeaves.map((leave) => (
                                <div key={leave.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-800 m-0">{leave.applicant}</p>
                                            <p className="text-[11px] text-slate-500 m-0">{leave.role} • {leave.type}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="p-1 rounded bg-emerald-100 text-emerald-600 hover:bg-emerald-200 cursor-pointer border-none" title="Approve">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </button>
                                            <button className="p-1 rounded bg-rose-100 text-rose-600 hover:bg-rose-200 cursor-pointer border-none" title="Reject">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium m-0 truncate">{leave.duration}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <button onClick={() => setActiveTab('leave')} className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border-none cursor-pointer">
                        View All Requests
                    </button>
                </div>

                {/* Revenue Trend Chart */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
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
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [{
                                    label: 'Revenue',
                                    data: [45000, 72000, 50000, 95000, 68000, 85000],
                                    backgroundColor: '#3b82f6',
                                    borderRadius: 4,
                                    barPercentage: 0.6
                                }]
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
