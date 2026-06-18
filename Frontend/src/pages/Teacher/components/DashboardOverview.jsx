import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
    // Mock teacher data
    const teacher = {
        name: "Anita Sharma",
        photo: "https://ui-avatars.com/api/?name=Anita+Sharma&background=10B981&color=fff&size=128",
        designation: "Senior Science Teacher",
    };

    const performanceData = {
        labels: ['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B'],
        datasets: [
            {
                label: 'Average Marks (%)',
                data: [82, 78, 85, 74],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderRadius: 4,
            },
        ],
    };

    const performanceOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { min: 0, max: 100 }
        }
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
                gap: '24px',
                border: '1px solid #e2e8f0'
            }}>
                <img src={teacher.photo} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a' }}>Welcome back, {teacher.name}! 👋</h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>{teacher.designation}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Today's Classes</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>4</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '80px', opacity: 0.1 }}>👨‍🏫</span>
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Total Students</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>142</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '80px', opacity: 0.1 }}>👥</span>
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Attendance Pending</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>2</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '80px', opacity: 0.1 }}>📅</span>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Assignments to Review</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>28</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '80px', opacity: 0.1 }}>📋</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Performance Graph */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>📊 Class Performance Summary</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={performanceData} options={performanceOptions} />
                        </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>📝 Upcoming Exams</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { class: 'Class 10-A', subject: 'Science', type: 'Unit Test 2', date: 'Oct 25, 2026' },
                                { class: 'Class 9-B', subject: 'Science', type: 'Half Yearly', date: 'Nov 10, 2026' }
                            ].map((exam, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{exam.class} - {exam.subject}</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{exam.type}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
                                        {exam.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Today's Schedule */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>⏰ Today's Schedule</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { time: '08:30 AM', class: 'Class 10-A', subject: 'Physics', status: 'completed' },
                                { time: '10:15 AM', class: 'Class 9-B', subject: 'Chemistry', status: 'active' },
                                { time: '11:00 AM', class: 'Class 10-B', subject: 'Physics', status: 'upcoming' },
                                { time: '01:30 PM', class: 'Class 9-A', subject: 'Biology', status: 'upcoming' }
                            ].map((cls, idx) => (
                                <div key={idx} style={{ position: 'relative', paddingLeft: '16px', borderLeft: `2px solid ${cls.status === 'active' ? '#3b82f6' : (cls.status === 'completed' ? '#10b981' : '#cbd5e1')}` }}>
                                    <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: cls.status === 'active' ? '#3b82f6' : (cls.status === 'completed' ? '#10b981' : '#cbd5e1') }}></div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: cls.status === 'active' ? '#2563eb' : '#1e293b' }}>{cls.time} - {cls.class}</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{cls.subject}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Notices */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>📣 Recent Notices</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>Staff</span>
                                <h4 style={{ margin: '8px 0', fontSize: '14px', color: '#1e293b' }}>Staff Meeting Today</h4>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>2 hours ago</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', background: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>General</span>
                                <h4 style={{ margin: '8px 0', fontSize: '14px', color: '#1e293b' }}>Submit Unit Test 1 Marks</h4>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
