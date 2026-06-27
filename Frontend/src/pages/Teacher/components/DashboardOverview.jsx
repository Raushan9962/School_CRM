import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, Users, Clock, Briefcase, Calendar, QrCode, CheckCircle2, MoreHorizontal, TrendingUp, ClipboardCheck, FileText, BarChart2 } from 'lucide-react';
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            {/* Minimal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>
                        <Calendar size={14} />
                        <span>{todayStr}</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>
                        {greeting}, {user.name?.split(' ')[0] || 'Teacher'}
                    </h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Here's what's happening with your classes today.</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {attendanceStatus && (
                        <div style={{ padding: '8px 12px', background: attendanceStatus.type === 'success' ? '#dcfce7' : '#fee2e2', color: attendanceStatus.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${attendanceStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={14} /> {attendanceStatus.message}
                        </div>
                    )}
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        style={{ padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <QrCode size={16} /> Mark Attendance
                    </button>
                </div>
            </div>

            {/* Clean KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Classes</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{stats?.totalClasses ?? '0'}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Students</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{stats?.totalStudents ?? '0'}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending Tasks</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{stats?.pendingWork ?? '0'}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Today's Periods</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{stats?.todaySchedule?.length ?? '0'}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '8px' }}>
                {/* Today's Schedule (Takes up 2 columns on large screens) */}
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} className="text-blue-600" />
                            Today's Class Schedule
                        </h3>
                        <span style={{ background: '#e0f2fe', color: '#0284c7', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                            {stats?.todaySchedule?.length || 0} Classes
                        </span>
                    </div>
                    
                    <div style={{ padding: '0' }}>
                        {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Time</th>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Class / Subject</th>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Room</th>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.todaySchedule.map((cls, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50">
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500' }}>
                                                {cls.time}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{cls.class} - {cls.section}</p>
                                                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{cls.subject}</p>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                                {cls.room || '-'}
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                <button style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', color: '#0284c7', background: '#e0f2fe', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                    Take Attendance
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
                                    <Calendar size={24} className="text-slate-400" />
                                </div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#334155' }}>No Classes Today</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Enjoy your free day or focus on lesson planning.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ClipboardCheck size={16} className="text-emerald-600" />
                                Quick Actions
                            </h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px' }}>
                            <button style={{ padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }} className="hover:border-blue-300 hover:bg-blue-50 transition-colors">
                                <FileText size={20} className="text-blue-600" />
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Add Marks</span>
                            </button>
                            <button style={{ padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }} className="hover:border-purple-300 hover:bg-purple-50 transition-colors">
                                <BookOpen size={20} className="text-purple-600" />
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Assignment</span>
                            </button>
                            <button style={{ padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }} className="hover:border-amber-300 hover:bg-amber-50 transition-colors">
                                <Users size={20} className="text-amber-600" />
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Parent Chat</span>
                            </button>
                            <button style={{ padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }} className="hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                                <BarChart2 size={20} className="text-emerald-600" />
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Reports</span>
                            </button>
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', flex: 1, padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <TrendingUp size={16} className="text-amber-500" />
                            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '14px' }}>Recent Activity</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginTop: '5px' }}></div>
                                <div>
                                    <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#334155' }}>Marked attendance for <span style={{ fontWeight: 'bold' }}>Class 10-A</span></p>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>2 hours ago</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginTop: '5px' }}></div>
                                <div>
                                    <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#334155' }}>Uploaded Math Assignment</p>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>Yesterday</p>
                                </div>
                            </div>
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
