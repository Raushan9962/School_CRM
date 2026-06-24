import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';
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

const PlaceholderView = ({ title }) => {
    const lowerTitle = title.toLowerCase();
    
    const [data, setData] = useState([]);
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);

    let category = 'generic';
    let endpoint = '';
    
    if (lowerTitle.includes('attendance')) { category = 'attendance'; endpoint = '/principal/attendance'; }
    else if (lowerTitle.includes('teacher') || lowerTitle.includes('staff')) { category = 'staff'; endpoint = '/principal/staff'; }
    else if (lowerTitle.includes('fee') || lowerTitle.includes('finance') || lowerTitle.includes('expense')) { category = 'finance'; endpoint = '/principal/fees'; }
    else if (lowerTitle.includes('exam') || lowerTitle.includes('result') || lowerTitle.includes('performance')) { category = 'academic'; endpoint = '/principal/exams'; }
    else if (lowerTitle.includes('leave')) { category = 'leave'; endpoint = '/principal/leaves'; }
    else if (lowerTitle.includes('admission')) { category = 'admissions'; endpoint = '/principal/admissions'; }

    useEffect(() => {
        const fetchData = async () => {
            if (!endpoint) {
                setLoading(false);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const response = await apiFetch(`${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error("Network response was not ok");
                const json = await response.json();
                
                if (json.data) {
                    if (Array.isArray(json.data)) {
                        setData(json.data);
                        setKpiData({ total: json.data.length });
                    } else if (typeof json.data === 'object') {
                        if (json.data.recent) {
                            setData(json.data.recent);
                            setKpiData(json.data);
                        } else {
                            setKpiData(json.data);
                            setData([]);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching generic data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    const formatHeader = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    const kpi1 = kpiData?.totalExpected ? `₹${kpiData.totalExpected}` : (kpiData?.total || 0);
    const kpi2 = kpiData?.totalCollected ? `₹${kpiData.totalCollected}` : (kpiData?.studentAvg || 'N/A');
    const kpi3 = kpiData?.pending ? `₹${kpiData.pending}` : (kpiData?.teacherAvg || 'N/A');

    const kpiCards = [
        { label: category === 'finance' ? 'Total Expected' : 'Total Records', value: kpi1, active: true },
        { label: category === 'finance' ? 'Total Collected' : (category === 'attendance' ? 'Student Avg' : 'Active / Success'), value: kpi2, active: false },
        { label: category === 'finance' ? 'Pending' : (category === 'attendance' ? 'Teacher Avg' : 'Pending Actions'), value: kpi3, active: false },
        { label: 'This Month', value: '+12%', sublabel: 'vs last month', active: false }
    ];

    let columns = [];
    if (data && data.length > 0) {
        columns = Object.keys(data[0]).map(key => ({
            label: formatHeader(key),
            key: key,
            sortable: true,
            render: (row) => {
                const val = String(row[key]);
                if (['Active', 'Present', 'Approved', 'Paid', 'Completed'].includes(val)) {
                    return <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-xs">{val}</span>;
                }
                if (['Pending', 'Late', 'On Leave', 'Pending Review'].includes(val)) {
                    return <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded text-xs">{val}</span>;
                }
                if (['Absent', 'Archived', 'Rejected'].includes(val)) {
                    return <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded text-xs">{val}</span>;
                }
                return val;
            }
        }));
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-10">
            <PremiumTable 
                title={title}
                columns={columns} 
                data={data} 
                kpiCards={kpiCards} 
            />

            {(category === 'finance' || category === 'academic' || category === 'attendance') && (
                <div className="mt-6 bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-6">{title} Trends</h3>
                    <div className="h-[200px] w-full">
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
                                        bodyFont: { size: 14, weight: 'bold' }
                                    }
                                },
                                scales: {
                                    x: { grid: { display: false } },
                                    y: { 
                                        border: { display: false },
                                        grid: { color: '#f1f5f9' }
                                    }
                                }
                            }} 
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                datasets: [{
                                    label: 'Count',
                                    data: [40, 70, 45, 90, 65, 80, 55, 100, 30, 85, 60, 75],
                                    backgroundColor: '#3b82f6',
                                    borderRadius: 4,
                                    barPercentage: 0.6
                                }]
                            }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaceholderView;
