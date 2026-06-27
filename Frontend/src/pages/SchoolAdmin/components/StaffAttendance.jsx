import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Filter, CheckCircle2, XCircle, Clock, Users, Check, X, AlertCircle } from 'lucide-react';
import apiFetch from '../../../services/api';

const StaffAttendance = ({ roleFilter }) => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`/school-admin/staff-attendance?date=${date}`);
            const data = await res.json();
            if (data.success) {
                let filtered = data.data;
                if (roleFilter) {
                    if (roleFilter === 'Transport Staff') {
                        filtered = filtered.filter(u => u.role === 'Transport Manager' || u.role === 'Driver' || u.role === 'Transport Staff');
                    } else {
                        filtered = filtered.filter(u => u.role === roleFilter);
                    }
                }
                setStaffList(filtered);
            }
        } catch (error) {
            console.error('Error fetching staff attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [date, roleFilter]);

    const markAttendance = async (userId, status) => {
        try {
            const res = await apiFetch('/school-admin/staff-attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, date, status })
            });
            const data = await res.json();
            if (data.success) {
                setStaffList(prev => prev.map(staff => 
                    staff.user_id === userId ? { ...staff, status: status } : staff
                ));
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Failed to mark attendance');
        }
    };

    let filteredStaff = staffList.filter(s => 
        s.name?.toLowerCase().includes(search.toLowerCase()) || 
        s.role?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Present') filteredStaff = filteredStaff.filter(s => s.status === 'Present');
    if (activeKpi === 'Absent') filteredStaff = filteredStaff.filter(s => s.status === 'Absent');
    if (activeKpi === 'Half Day') filteredStaff = filteredStaff.filter(s => s.status === 'Half Day');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>Attendance records</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <CalendarIcon size={16} color="#64748b" />
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Staff</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{staffList.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Present')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Present' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Present' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Present</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{staffList.filter(s => s.status === 'Present').length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Absent')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Absent' ? '1px solid #ef4444' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Absent' ? '0 0 0 1px #ef4444' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef2f2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <XCircle size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Absent</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{staffList.filter(s => s.status === 'Absent').length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Half Day')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Half Day' ? '1px solid #f59e0b' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Half Day' ? '0 0 0 1px #f59e0b' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Half Day</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{staffList.filter(s => s.status === 'Half Day').length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} className="text-slate-500" /> Attendance Roster
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search staff..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '12px', width: '200px' }}
                        />
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Staff Member</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Current Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Mark Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading roster...</td>
                                </tr>
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No records found.</td>
                                </tr>
                            ) : (
                                filteredStaff.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.name}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>{row.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ 
                                                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                                                background: row.status === 'Present' ? '#dcfce7' : (row.status === 'Absent' ? '#fef2f2' : (row.status === 'Half Day' ? '#fef3c7' : '#f1f5f9')),
                                                color: row.status === 'Present' ? '#166534' : (row.status === 'Absent' ? '#991b1b' : (row.status === 'Half Day' ? '#92400e' : '#475569')),
                                                border: `1px solid ${row.status === 'Present' ? '#bbf7d0' : (row.status === 'Absent' ? '#fecaca' : (row.status === 'Half Day' ? '#fde68a' : '#cbd5e1'))}`
                                            }}>
                                                {row.status || 'Not Marked'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                <button 
                                                    onClick={() => markAttendance(row.user_id, 'Present')} 
                                                    style={{ background: row.status === 'Present' ? '#059669' : '#ecfdf5', border: '1px solid #a7f3d0', color: row.status === 'Present' ? 'white' : '#059669', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <Check size={14} /> P
                                                </button>
                                                <button 
                                                    onClick={() => markAttendance(row.user_id, 'Absent')} 
                                                    style={{ background: row.status === 'Absent' ? '#dc2626' : '#fef2f2', border: '1px solid #fecaca', color: row.status === 'Absent' ? 'white' : '#dc2626', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <X size={14} /> A
                                                </button>
                                                <button 
                                                    onClick={() => markAttendance(row.user_id, 'Half Day')} 
                                                    style={{ background: row.status === 'Half Day' ? '#d97706' : '#fffbeb', border: '1px solid #fde68a', color: row.status === 'Half Day' ? 'white' : '#d97706', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <Clock size={14} /> HD
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffAttendance;
