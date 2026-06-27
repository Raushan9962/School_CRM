import React, { useState, useEffect } from 'react';
import { 
    Users, 
    BookOpen, 
    Calculator, 
    Calendar, 
    CreditCard, 
    Clock,
    PhoneCall,
    Bus,
    Home,
    UserCog,
    IndianRupee,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react';
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
        totalStudents: 850,
        totalTeachers: 45,
        totalAccountants: 2,
        totalLibrarians: 3,
        totalReceptionists: 2,
        totalTransportStaff: 12,
        totalWardens: 4,
        totalHR: 1,
        todayAttendancePercent: 92,
        feesCollected: 1250000,
        pendingFees: 450000,
        upcomingExams: 14,
        newAdmissions: 28,
        notifications: 5,
        birthdayToday: 3
    });
    const [loading, setLoading] = useState(false);

    // Using exact Accountant dashboard styling
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const sectionTitleStyle = { fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' };

    const statCards = [
        { title: 'Total Students', value: stats.totalStudents, icon: <Users size={18} />, bg: '#eff6ff', color: '#3b82f6', tab: 'student' },
        { title: 'Total Teachers', value: stats.totalTeachers, icon: <BookOpen size={18} />, bg: '#ecfdf5', color: '#10b981', tab: 'teacher' },
        { title: 'Accountants', value: stats.totalAccountants, icon: <Calculator size={18} />, bg: '#f5f3ff', color: '#8b5cf6', tab: 'accountant' },
        { title: 'Transport Staff', value: stats.totalTransportStaff, icon: <Bus size={18} />, bg: '#fffbeb', color: '#f59e0b', tab: 'transport_staff' },
        { title: 'Fees Collected', value: `₹${(stats.feesCollected/100000).toFixed(1)}L`, icon: <IndianRupee size={18} />, bg: '#f0fdfa', color: '#14b8a6', tab: 'finance' },
        { title: 'Pending Fees', value: `₹${(stats.pendingFees/100000).toFixed(1)}L`, icon: <Clock size={18} />, bg: '#fef2f2', color: '#ef4444', tab: 'finance' },
        { title: 'Today Attendance', value: `${stats.todayAttendancePercent}%`, icon: <Activity size={18} />, bg: '#eef2ff', color: '#6366f1', tab: 'student' },
        { title: 'Upcoming Exams', value: stats.upcomingExams, icon: <Calendar size={18} />, bg: '#fdf2f8', color: '#ec4899', tab: 'student' },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Fee Collection',
                data: [45000, 52000, 48000, 61000, 59000, 75000, 80000, 76000, 85000, 92000, 88000, 110000],
                backgroundColor: '#3b82f6',
                borderRadius: 4,
            },
            {
                label: 'Expenses',
                data: [30000, 32000, 31000, 35000, 34000, 38000, 40000, 42000, 45000, 48000, 50000, 55000],
                backgroundColor: '#ef4444',
                borderRadius: 4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true, font: { size: 11 } } },
        },
        scales: {
            y: { beginAtZero: true, grid: { borderDash: [2, 4], color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
    };

    return (
        <div style={containerStyle} className="animate-fade-in">
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Dashboard Overview</h2>
                    <p style={subTitleStyle}>School administrative summary and key metrics</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {statCards.map((card, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setActiveTab(card.tab)}
                        style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                        className="hover:border-slate-300 hover:shadow-md"
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {card.icon}
                        </div>
                        <div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{card.title}</p>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Chart Section */}
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <h3 style={sectionTitleStyle}>
                        <TrendingUp size={16} className="text-slate-500" /> Revenue vs Expenses (Yearly)
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Quick Actions & Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <h3 style={sectionTitleStyle}>
                            <Activity size={16} className="text-slate-500" /> Recent Activity
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: 'New Admission', desc: 'Aarav Patel added to Class 10-A', time: '10 mins ago', color: '#3b82f6' },
                                { title: 'Fee Collected', desc: '₹45,000 collected via Term 1', time: '1 hr ago', color: '#10b981' },
                                { title: 'Leave Request', desc: 'Mr. Sharma (Math) requested 2 days', time: '3 hrs ago', color: '#f59e0b' },
                                { title: 'Transport Alert', desc: 'Bus Route #4 delayed by 15m', time: '5 hrs ago', color: '#ef4444' }
                            ].map((alert, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: alert.color, marginTop: '6px' }}></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>{alert.title}</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>{alert.desc}</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
