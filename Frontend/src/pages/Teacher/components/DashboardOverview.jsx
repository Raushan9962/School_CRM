import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, Users, Clock, Briefcase, Calendar, QrCode, CheckCircle2, ClipboardCheck, FileText, BarChart2, TrendingUp } from 'lucide-react';
import QRScannerModal from './QRScannerModal';

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiFetch('/teacher-portal/dashboard-stats', { headers });
                const data = await res.json();
                if (data.success) setStats(data.data);
            } catch (e) {
                console.error('Failed to fetch teacher dashboard stats', e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleQRScan = async (qrToken) => {
        setIsScannerOpen(false);
        try {
            const res = await apiFetch('/teacher-portal/mark-attendance-qr', {
                method: 'POST',
                headers,
                body: JSON.stringify({ qrToken })
            });
            const data = await res.json();
            if (data.success) {
                setAttendanceStatus({ type: 'success', message: 'Attendance marked successfully!' });
            } else {
                setAttendanceStatus({ type: 'error', message: data.message || 'Invalid QR code.' });
            }
            setTimeout(() => setAttendanceStatus(null), 5000);
        } catch (err) {
            setAttendanceStatus({ type: 'error', message: 'Failed to communicate with server.' });
            setTimeout(() => setAttendanceStatus(null), 5000);
        }
    };

    const now = new Date();
    const hours = now.getHours();
    const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
    const todayStr = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const sectionTitleStyle = { fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 };

    const statCards = [
        { title: 'Total Classes', value: stats?.totalClasses ?? '0', icon: <BookOpen size={18} />, bg: '#eff6ff', color: '#3b82f6' },
        { title: 'Total Students', value: stats?.totalStudents ?? '0', icon: <Users size={18} />, bg: '#ecfdf5', color: '#10b981' },
        { title: 'Pending Tasks', value: stats?.pendingWork ?? '0', icon: <Briefcase size={18} />, bg: '#fef2f2', color: '#ef4444' },
        { title: "Today's Periods", value: stats?.todaySchedule?.length ?? '0', icon: <Clock size={18} />, bg: '#f5f3ff', color: '#8b5cf6' }
    ];

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        <Calendar size={14} />
                        <span>{todayStr}</span>
                    </div>
                    <h2 style={titleStyle}>
                        {greeting}, {user.name?.split(' ')[0] || 'Teacher'}
                    </h2>
                    <p style={subTitleStyle}>Here's what's happening with your classes today.</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {attendanceStatus && (
                        <div style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: attendanceStatus.type === 'success' ? '#ecfdf5' : '#fef2f2', color: attendanceStatus.type === 'success' ? '#047857' : '#b91c1c', borderColor: attendanceStatus.type === 'success' ? '#a7f3d0' : '#fecaca' }}>
                            <CheckCircle2 size={16} /> {attendanceStatus.message}
                        </div>
                    )}
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    >
                        <QrCode size={16} /> Mark Attendance
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {statCards.map((card, idx) => (
                    <div 
                        key={idx} 
                        style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}
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
                {/* Today's Schedule */}
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                        <h3 style={sectionTitleStyle}>
                            <Calendar size={18} color="#64748b" />
                            Today's Class Schedule
                        </h3>
                        <span style={{ padding: '4px 10px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>
                            {stats?.todaySchedule?.length || 0} Classes
                        </span>
                    </div>
                    
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '500px' }}>
                                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Time</th>
                                        <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Class / Subject</th>
                                        <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Room</th>
                                        <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.todaySchedule.map((cls, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                                                {cls.time}
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{cls.class} - {cls.section}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>{cls.subject}</p>
                                            </td>
                                            <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                                                {cls.room || '-'}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                <button style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                    Take Attendance
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '64px', height: '64px', backgroundColor: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                    <Calendar size={28} color="#94a3b8" />
                                </div>
                                <h4 style={{ margin: '0 0 4px 0', color: '#334155', fontWeight: 'bold' }}>No Classes Today</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Enjoy your free day or focus on lesson planning.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3 style={sectionTitleStyle}>
                                <ClipboardCheck size={16} color="#10b981" />
                                Quick Actions
                            </h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                { title: 'Add Marks', icon: <FileText size={20} color="#64748b" /> },
                                { title: 'Assignment', icon: <BookOpen size={20} color="#64748b" /> },
                                { title: 'Parent Chat', icon: <Users size={20} color="#64748b" /> },
                                { title: 'Reports', icon: <BarChart2 size={20} color="#64748b" /> }
                            ].map((action, i) => (
                                <button key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', gap: '8px', cursor: 'pointer' }}>
                                    {action.icon}
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3 style={sectionTitleStyle}>
                                <TrendingUp size={16} color="#64748b" /> Recent Activity
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: 'Marked attendance for Class 10-A', time: '2 hours ago', color: '#10b981' },
                                { title: 'Uploaded Math Assignment', time: 'Yesterday', color: '#94a3b8' }
                            ].map((act, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: act.color, borderRadius: '50%', marginTop: '6px', flexShrink: 0 }}></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#334155', lineHeight: 1.3 }}>{act.title}</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <QRScannerModal 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScan={handleQRScan} 
            />
        </div>
    );
};

export default DashboardOverview;
