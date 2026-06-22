import React from 'react';
import StatCard from '../../../components/layout/StatCard';
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
                background: '#ffffff', 
                padding: '24px', 
                borderRadius: '8px', 
                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                border: '1px solid #e2e8f0'
            }}>
                <img src={teacher.photo} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b', fontWeight: 600 }}>Welcome back, {teacher.name}! 👋</h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>{teacher.designation}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <StatCard 
                    title="Class Overview" 
                    metrics={[
                        { label: "Today's Classes", value: '4' },
                        { label: 'Total Students', value: '142' }
                    ]}
                />
                <StatCard 
                    title="Action Needed" 
                    metrics={[
                        { label: 'Attendance Pending', value: '2' },
                        { label: 'Assignments to Review', value: '28' }
                    ]}
                    bottomComponent={
                        <div style={{ textAlign: 'right' }}>
                            <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Go to Tasks</a>
                        </div>
                    }
                />
                <StatCard 
                    title="Performance" 
                    extraHeaderIcon={<span className="material-icons">assessment</span>}
                    metrics={[
                        { label: 'Avg Class Score', value: '81%' },
                        { label: 'Top Class', value: '9-A' }
                    ]}
                    bottomComponent={
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <select style={{ padding: '6px 12px', border: 'none', background: 'transparent', color: '#475569', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
                                <option>Mid-Term</option>
                                <option>Finals</option>
                            </select>
                        </div>
                    }
                />
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
