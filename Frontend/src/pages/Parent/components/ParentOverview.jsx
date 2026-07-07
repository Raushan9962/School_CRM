import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, CalendarDays, Award, BookOpen, Clock, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            <Icon size={18} className="opacity-90" />
        </div>
        <div>
            <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">{title}</p>
            <h3 className="m-0 text-base font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const ParentOverview = ({ childId }) => {
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/parent/children/${childId}/overview`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data && response.data.success) {
                    setOverviewData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching overview data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) {
            fetchOverview();
        }
    }, [childId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!overviewData) {
        return <div className="text-center text-slate-500 mt-10">Unable to load dashboard data.</div>;
    }

    // Chart Configuration
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Attendance (%)',
                data: [90, 85, 92, 88, 95, 91, overviewData.attendance_percentage || 85],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            y: { min: 0, max: 100 }
        }
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-slate-500">Key metrics and summary of your child's progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Fees Paid"
                    value={`₹${overviewData.total_paid.toLocaleString()}`}
                    icon={IndianRupee}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Pending Fees"
                    value={`₹${overviewData.total_pending.toLocaleString()}`}
                    icon={IndianRupee}
                    colorClass="bg-rose-50 text-rose-600"
                />
                <StatCard
                    title="Overall Attendance"
                    value={`${overviewData.attendance_percentage}%`}
                    icon={CalendarDays}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Exams Attended"
                    value={overviewData.total_exams}
                    icon={Award}
                    colorClass="bg-amber-50 text-amber-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                
                {/* Attendance Chart */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                        <Activity size={18} className="text-blue-500" />
                        <h3 className="m-0 text-sm font-bold text-slate-800">Attendance Trend</h3>
                    </div>
                    <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                        <Clock size={18} className="text-slate-500" />
                        <h3 className="m-0 text-sm font-bold text-slate-800">Recent Activity</h3>
                    </div>
                    
                    {overviewData.recent_activity && overviewData.recent_activity.length > 0 ? (
                        <div className="space-y-4 flex-1">
                            {overviewData.recent_activity.map((activity, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="mt-1 shrink-0">
                                        <div className={`w-2 h-2 rounded-full mt-1.5
                                            ${activity.type === 'fee' ? 'bg-emerald-500' : 
                                              activity.type === 'leave' ? 'bg-amber-500' : 
                                              'bg-blue-500'}`}
                                        ></div>
                                    </div>
                                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex-1">
                                        <p className="text-[13px] font-bold text-slate-800 m-0 mb-0.5">{activity.title}</p>
                                        <p className="text-[11px] text-slate-600 m-0">{activity.description}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium m-0">
                                            {new Date(activity.time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 p-8">
                            <Clock size={32} className="mb-2 opacity-30" />
                            <p className="text-[12px] m-0">No recent activity found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentOverview;
