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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrValue, setQrValue] = useState('');
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    // Mock user data
    const user = {
        name: "Rahul Kumar",
        photo: "https://ui-avatars.com/api/?name=Rahul+Kumar&background=0D8ABC&color=fff&size=128",
        classSec: "Class 10 - A",
        rollNo: "10A045",
        attendance: 92,
    };

    // Chart Data
    const chartData = {
        labels: ['Unit Test 1', 'Half Yearly', 'Unit Test 2', 'Pre-Board', 'Final'],
        datasets: [
            {
                label: 'Academic Performance (%)',
                data: [75, 82, 88, 85, 91],
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

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Welcome Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                padding: '24px', 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <img src={user.photo} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a' }}>Welcome back, {user.name}! 👋</h2>
                        <div style={{ display: 'flex', gap: '24px', color: '#64748b', fontSize: '15px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📚 <strong>Class:</strong> {user.classSec}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔢 <strong>Roll No:</strong> {user.rollNo}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <button 
                        onClick={handleOpenQR}
                        style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        <span style={{ fontSize: '20px' }}>📱</span> Show Attendance QR
                    </button>
                </div>
            </div>

            {/* QR Code Modal */}
            {isQrModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', width: '400px', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Daily Attendance QR</h3>
                            <button onClick={() => setIsQrModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                        
                        <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                            <QRCode value={qrValue} size={200} level="H" />
                        </div>
                        
                        <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#334155', fontWeight: '500' }}>Scan at the School Entry Gate</p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fffbeb', color: '#d97706', padding: '8px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '14px' }}>
                            <span>⏳ Valid for:</span>
                            <span style={{ fontSize: '16px', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
                        </div>
                        
                        <p style={{ margin: '16px 0 0 0', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>This QR code is generated in real-time and will expire automatically.</p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Attendance</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>{user.attendance}%</p>
                    <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Overall Percentage</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>📅</span>
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Next Exam</h3>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>Mathematics</p>
                    <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Tomorrow, 9:00 AM</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>📝</span>
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Pending Assignments</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>3</p>
                    <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Due this week</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>📋</span>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Fee Due Status</h3>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>₹ 2,500</p>
                    <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.8 }}>Due by 25th Oct</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>💰</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Performance Graph & Today's Classes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>📈 Academic Performance</h3>
                        <div style={{ height: '300px' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>⏰ Today's Classes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { time: '08:30 AM - 09:15 AM', subject: 'Physics', teacher: 'Mr. Sharma', status: 'completed' },
                                { time: '09:15 AM - 10:00 AM', subject: 'Chemistry', teacher: 'Mrs. Gupta', status: 'active' },
                                { time: '10:15 AM - 11:00 AM', subject: 'Mathematics', teacher: 'Mr. Verma', status: 'upcoming' },
                            ].map((cls, idx) => (
                                <div key={idx} style={{ 
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', 
                                    borderRadius: '12px', background: cls.status === 'active' ? '#eff6ff' : '#f8fafc',
                                    borderLeft: `4px solid ${cls.status === 'active' ? '#3b82f6' : (cls.status === 'completed' ? '#10b981' : '#cbd5e1')}`
                                }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{cls.subject}</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>👨‍🏫 {cls.teacher}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#334155' }}>{cls.time}</p>
                                        <span style={{ 
                                            fontSize: '11px', padding: '4px 8px', borderRadius: '12px', fontWeight: '600', textTransform: 'uppercase',
                                            background: cls.status === 'active' ? '#dbeafe' : (cls.status === 'completed' ? '#d1fae5' : '#f1f5f9'),
                                            color: cls.status === 'active' ? '#2563eb' : (cls.status === 'completed' ? '#059669' : '#64748b')
                                        }}>
                                            {cls.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Latest Notices */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>📣 Latest Notices</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>Important</span>
                            <h4 style={{ margin: '8px 0', fontSize: '15px', color: '#1e293b' }}>Pre-Board Exam Datesheet</h4>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>The datesheet for the upcoming pre-board examinations has been published. Please check the Exams section.</p>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>2 hours ago</span>
                        </div>
                        <div style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', background: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>Event</span>
                            <h4 style={{ margin: '8px 0', fontSize: '15px', color: '#1e293b' }}>Annual Sports Meet 2026</h4>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>Registrations for the Annual Sports Meet are now open. Interested students can apply through the Activities portal.</p>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 day ago</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', background: '#d1fae5', padding: '2px 8px', borderRadius: '4px' }}>General</span>
                            <h4 style={{ margin: '8px 0', fontSize: '15px', color: '#1e293b' }}>Winter Uniform Guidelines</h4>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>All students are required to switch to the winter uniform starting from next Monday.</p>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>3 days ago</span>
                        </div>
                    </div>
                    <button style={{ width: '100%', padding: '12px', marginTop: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = '#f8fafc'}>
                        View All Notices
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
