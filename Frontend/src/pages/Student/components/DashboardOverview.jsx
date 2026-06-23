import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import QRCode from 'react-qr-code';
import { Hand, Book, Hash, Smartphone, CalendarDays, FileEdit, ClipboardList, IndianRupee, TrendingUp, Clock, User, BellRing, RefreshCw, FileText } from 'lucide-react';
import StatCard from '../../../components/layout/StatCard';
import apiFetch from '../../../services/api';

import QRScannerModal from '../../../components/common/QRScannerModal';

const panelStyle = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  border: '1px solid rgba(255,255,255,0.5)',
  display: 'flex',
  flexDirection: 'column'
};

const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' };

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = ({ onNavigate }) => {
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [qrValue, setQrValue] = useState('');
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        name: "Student",
        photo: "",
        classSec: "N/A",
        rollNo: "N/A",
        attendance: 0,
        pendingFees: 0,
        latestResult: null
    });

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                
                // Fetch profile
                const profileRes = await apiFetch(`/students/user/${userObj.id}`);
                let profileData = null;
                if (profileRes.ok) {
                    profileData = await profileRes.json();
                }

                // Fetch stats
                const statsRes = await apiFetch(`/students/dashboard/${userObj.id}`);
                let statsData = null;
                if (statsRes.ok) {
                    statsData = await statsRes.json();
                }

                setUser({
                    name: profileData?.name || userObj.name,
                    photo: `https://ui-avatars.com/api/?name=${profileData?.name || userObj.name}&background=random`,
                    classSec: profileData?.class_name || "N/A",
                    rollNo: `STU-${profileData?.id || 'N/A'}`,
                    attendance: statsData?.attendancePercentage || 0,
                    pendingFees: statsData?.pendingFees || 0,
                    latestResult: statsData?.latestResult || null
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Chart Data (Mocked since we don't have historical progression yet)
    const chartData = {
        labels: ['Unit Test 1', 'Half Yearly', 'Unit Test 2', 'Pre-Board', 'Final'],
        datasets: [
            {
                label: 'Academic Performance (%)',
                data: [75, 82, 88, 85, user.latestResult?.marks_obtained ? Math.round((user.latestResult.marks_obtained/user.latestResult.total_marks)*100) : 91],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { min: 0, max: 100 }
        }
    };

    useEffect(() => {
        let timer;
        if (isQrModalOpen && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsQrModalOpen(false); // Auto close when expired
        }
        return () => clearInterval(timer);
    }, [isQrModalOpen, timeLeft]);

    const handleOpenQR = () => {
        const timestamp = new Date().toISOString();
        const payload = JSON.stringify({
            studentId: user.rollNo,
            name: user.name,
            timestamp: timestamp,
            validUntil: new Date(Date.now() + 15 * 60000).toISOString()
        });
        setQrValue(payload);
        setTimeLeft(15 * 60);
        setIsQrModalOpen(true);
    };

    const handleScanSuccess = async (scannedData) => {
        setIsScannerOpen(false);
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/attendance/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ qrPayload: scannedData })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Attendance Marked Successfully!');
                fetchDashboardData(); // refresh stats
            } else {
                alert(data.error || 'Failed to mark attendance.');
            }
        } catch (e) {
            alert('Error marking attendance.');
            console.error(e);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="flex flex-col gap-6">
            <QRScannerModal 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScanSuccess={handleScanSuccess} 
            />

            {/* Header Title */}
            <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
                <h1 className="m-0 text-2xl font-semibold text-slate-800 tracking-wide uppercase">
                    {user.name || 'STUDENT DASHBOARD'}
                </h1>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent text-white rounded shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                        Scan Attendance
                    </button>
                </div>
            </div>

            {/* Prominent Next Class Notification */}
            <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shadow-sm shrink-0">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="m-0 text-sky-900 font-bold text-base">Next Class: Mathematics</h3>
                        <p className="m-0 text-sky-700 text-sm mt-1">Starts in 15 mins (10:30 AM) • Room 101</p>
                    </div>
                </div>
                <button 
                    onClick={() => onNavigate && onNavigate('timetable')}
                    className="bg-sky-600 text-white px-5 py-2.5 rounded-lg font-medium border-none cursor-pointer hover:bg-sky-700 transition-colors text-sm shadow-sm hidden sm:block">
                    View Timetable
                </button>
            </div>

            {/* Core Stats Grid - Matches Screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="Attendance"
                    metrics={[
                        { label: 'Total Present', value: `${user.attendance}%` },
                        { label: 'Days Attended', value: Math.floor(user.attendance * 2.2) }
                    ]}
                    bottomComponent={
                        <div className="flex items-center gap-6 mt-2">
                            <div className="flex items-center border-b border-slate-300 pb-1">
                                <select className="border-none bg-transparent text-[13px] text-slate-600 outline-none cursor-pointer p-0 pr-4 appearance-none">
                                    <option>Date</option>
                                </select>
                                <span className="text-[10px] text-slate-400 ml-[-12px]">▼</span>
                            </div>
                            <div className="flex items-center border-b border-slate-300 pb-1 flex-1">
                                <input type="text" placeholder="DD/MM/YYYY" className="border-none bg-transparent text-[13px] text-slate-600 outline-none w-full" />
                                <CalendarDays size={14} className="text-slate-400" />
                            </div>
                        </div>
                    }
                />
                
                <StatCard 
                    title="Fee Status"
                    metrics={[
                        { label: 'Pending Fees', value: user.pendingFees > 0 ? `₹${user.pendingFees}` : '₹0.00' },
                        { label: 'Total Invoices', value: user.pendingFees > 0 ? '1' : '0' }
                    ]}
                    bottomComponent={
                        <div className="flex items-center border-b border-slate-300 pb-1 mt-2 w-max pr-8">
                            <select className="border-none bg-transparent text-[13px] text-slate-600 outline-none cursor-pointer p-0 pr-4 appearance-none">
                                <option>Today</option>
                                <option>This Month</option>
                            </select>
                            <span className="text-[10px] text-slate-400 ml-[-12px]">▼</span>
                        </div>
                    }
                />

                <StatCard 
                    title="Academics & Online"
                    extraHeaderIcon={<RefreshCw size={18} className="text-sky-500" />}
                    metrics={[
                        { label: 'Latest Result', value: user.latestResult ? `${user.latestResult.grade}` : 'N/A' },
                        { label: 'Total Marks', value: user.latestResult ? `${user.latestResult.marks_obtained}/${user.latestResult.total_marks}` : '0' },
                        { label: 'Pending Assignments', value: '2' },
                        { label: 'Action Needed', value: '0' }
                    ]}
                />

                <StatCard 
                    title="Library & Transport"
                    metrics={[
                        { label: 'Books Due', value: '1' },
                        { label: 'Transport Status', value: 'Active' },
                    ]}
                />
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Academic Performance Chart */}
                <div style={panelStyle}>
                    <h3 style={panelTitleStyle}><TrendingUp size={20} color="#3b82f6" /> Academic Progression</h3>
                    <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Today's Schedule & Quick Alerts */}
                <div className="flex flex-col gap-6">
                    <div style={panelStyle}>
                        <h3 style={{ ...panelTitleStyle, color: '#f59e0b' }}><BellRing size={20} /> Quick Alerts</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <AlertItem icon={<IndianRupee size={16} />} text={user.pendingFees > 0 ? `Term Fee of ₹ ${user.pendingFees} is pending` : `No pending fees`} isUrgent={user.pendingFees > 0} />
                            <AlertItem icon={<FileText size={16} />} text="Science Project due tomorrow" isUrgent={true} />
                            <AlertItem icon={<Book size={16} />} text="Library Book 'The Alchemist' due in 3 days" isUrgent={false} />
                        </div>
                    </div>

                    <div style={panelStyle}>
                        <h3 style={panelTitleStyle}><Clock size={20} color="#8b5cf6" /> Next Classes</h3>
                        <div className="flex flex-col gap-4">
                            <ScheduleItem time="10:30 AM" subject="Mathematics" room="Room 101" />
                            <ScheduleItem time="11:15 AM" subject="Physics" room="Lab 2" />
                            <ScheduleItem time="12:00 PM" subject="English" room="Room 101" isNext />
                        </div>
                    </div>
                </div>
            </div>

            {/* Digital ID QR Modal */}
            {isQrModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '40px',
                        width: '100%',
                        maxWidth: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '24px',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <button 
                            onClick={() => setIsQrModalOpen(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                        >
                            ✕
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#0f172a' }}>Digital Student ID</h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Scan for attendance & library</p>
                        </div>

                        <div style={{ 
                            background: '#f8fafc', 
                            padding: '24px', 
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <QRCode 
                                value={qrValue} 
                                size={200}
                                level="H"
                            />
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            background: timeLeft < 300 ? '#fef2f2' : '#f0fdf4',
                            color: timeLeft < 300 ? '#ef4444' : '#10b981',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            <RefreshCw size={14} className={timeLeft < 300 ? "animate-spin" : ""} />
                            QR Valid for {formatTime(timeLeft)}
                        </div>

                        <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px', width: '100%' }}>
                            <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#0f172a' }}>{user.name}</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{user.classSec} • {user.rollNo}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const AlertItem = ({ icon, text, isUrgent }) => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px', 
        background: isUrgent ? '#fef2f2' : '#f8fafc', 
        borderLeft: `4px solid ${isUrgent ? '#ef4444' : '#3b82f6'}`,
        borderRadius: '0 8px 8px 0'
    }}>
        <div style={{ color: isUrgent ? '#ef4444' : '#3b82f6' }}>{icon}</div>
        <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>{text}</span>
    </div>
);

const ScheduleItem = ({ time, subject, room, isNext }) => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '16px',
        position: 'relative'
    }}>
        <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            background: isNext ? '#8b5cf6' : '#cbd5e1',
            marginTop: '4px',
            boxShadow: isNext ? '0 0 0 4px rgba(139,92,246,0.2)' : 'none'
        }}></div>
        <div style={{ flex: 1, paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{subject}</span>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{time}</span>
            </div>
            <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} /> {room}
            </span>
        </div>
    </div>
);

export default DashboardOverview;
