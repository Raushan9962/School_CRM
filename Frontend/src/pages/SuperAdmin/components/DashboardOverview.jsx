import React, { useState, useEffect } from 'react';
import { 
    Building2, 
    Users, 
    IndianRupee, 
    BarChart3, 
    Clock, 
    AlertTriangle, 
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
    totalSchools: 0,
    totalUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    activePlans: 0,
    expiringSoon: 0,
    newRequests: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/super-admin/dashboard');
        const data = await res.json();
        if (data.success) {
          const uRoles = data.stats.usersByRole || {};
          const totalUsers = Object.values(uRoles).reduce((a, b) => a + b, 0);
          setStats(prev => ({
            ...prev,
            totalSchools: data.stats.totalSchools || 0,
            totalUsers: totalUsers,
            totalRevenue: parseFloat(data.stats.revenue?.total_revenue) || 0,
            monthlyRevenue: parseFloat(data.stats.revenue?.monthly_revenue) || 0,
            yearlyRevenue: parseFloat(data.stats.revenue?.yearly_revenue) || 0,
            activePlans: data.stats.totalSchools || 0,
            loading: false
          }));
        }
      } catch (error) {
        console.error("Error fetching super admin stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  const containerStyle = { display: 'flex', flexDirection: 'column', paddingBottom: '24px' };
  const headerStyle = { borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
  const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
  const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
  const sectionTitleStyle = { fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' };

  const statCards = [
    { title: 'Total Schools', value: stats.loading ? '...' : stats.totalSchools, icon: <Building2 size={18} />, bg: '#eff6ff', color: '#3b82f6', targetTab: 'schools' },
    { title: 'Total Users', value: stats.loading ? '...' : stats.totalUsers.toLocaleString(), icon: <Users size={18} />, bg: '#ecfdf5', color: '#10b981', targetTab: null },
    { title: 'Active Plans', value: stats.loading ? '...' : stats.activePlans, icon: <Activity size={18} />, bg: '#f5f3ff', color: '#8b5cf6', targetTab: 'finance' },
    { title: 'Expiring Soon', value: stats.loading ? '...' : stats.expiringSoon, icon: <Clock size={18} />, bg: '#fffbeb', color: '#f59e0b', targetTab: 'schools' },
    { title: 'Total Revenue', value: stats.loading ? '...' : `₹${(stats.totalRevenue/100000).toFixed(1)}L`, icon: <IndianRupee size={18} />, bg: '#f0fdfa', color: '#14b8a6', targetTab: 'finance' },
    { title: 'Monthly MRR', value: stats.loading ? '...' : `₹${(stats.monthlyRevenue/1000).toFixed(1)}k`, icon: <BarChart3 size={18} />, bg: '#fef2f2', color: '#ef4444', targetTab: 'finance' },
    { title: 'New Requests', value: stats.loading ? '...' : stats.newRequests, icon: <AlertTriangle size={18} />, bg: '#eef2ff', color: '#6366f1', targetTab: 'schools' },
    { title: 'Inactive Schools', value: '0', icon: <Building2 size={18} />, bg: '#fdf2f8', color: '#ec4899', targetTab: 'schools' },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Platform Revenue',
            data: [15000, 22000, 18000, 31000, 29000, 45000, 50000, 46000, 55000, 62000, 58000, 80000],
            backgroundColor: '#3b82f6',
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
    <div style={containerStyle} className="animate-fade-in gap-6">
        <div style={headerStyle} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
                <h2 style={titleStyle}>Dashboard Overview</h2>
                <p style={subTitleStyle}>Platform administrative summary and key metrics</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, idx) => (
                <div 
                    key={idx} 
                    onClick={() => {
                        if (card.targetTab && setActiveTab) {
                            setActiveTab(card.targetTab);
                        }
                    }}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', cursor: card.targetTab ? 'pointer' : 'default' }}
                    className={`hover:border-slate-300 hover:shadow-md ${card.targetTab ? 'active:scale-[0.98]' : ''}`}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2" style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h3 style={sectionTitleStyle}>
                    <BarChart3 size={16} className="text-slate-500" /> Revenue Growth (Yearly)
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
                            { title: 'New School', desc: 'DNS School registered on platform', time: '10 mins ago', color: '#3b82f6' },
                            { title: 'Subscription Renewed', desc: 'Delhi Public School renewed Premium Plan', time: '1 hr ago', color: '#10b981' },
                            { title: 'Expiring Alert', desc: 'St. Xaviers plan expiring in 3 days', time: '3 hrs ago', color: '#f59e0b' },
                            { title: 'System Status', desc: 'All services running optimally', time: '5 hrs ago', color: '#22c55e' }
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
