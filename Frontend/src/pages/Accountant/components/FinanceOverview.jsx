import React, { useState, useEffect, useRef } from 'react';
import { IndianRupee, TrendingUp, Clock, TrendingDown, CheckCircle2, AlertTriangle, AlertCircle, ScanLine, UserCheck } from 'lucide-react';
import apiFetch from '../../../services/api';

const FinanceOverview = () => {
    const [stats, setStats] = useState({
        todaysCollection: 0,
        thisMonthCollection: 0,
        todaysExpenses: 0,
        totalExpenses: 0,
        pendingFees: 0,
        salaryPaid: 0,
        salaryPending: 0,
        defaultersCount: 0
    });
    
    // Attendance Scanner State
    const [scanInput, setScanInput] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const scannerInputRef = useRef(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await apiFetch('/accountant/dashboard-stats');
            const data = await res.json();
            if (data.success) {
                setStats({
                    todaysCollection: parseFloat(data.data.todaysCollection) || 0,
                    thisMonthCollection: parseFloat(data.data.thisMonthCollection) || 0,
                    todaysExpenses: parseFloat(data.data.todaysExpenses) || 0,
                    totalExpenses: parseFloat(data.data.totalExpenses) || 0,
                    pendingFees: parseFloat(data.data.pendingFees) || 0,
                    salaryPaid: parseFloat(data.data.salaryPaid) || 0,
                    salaryPending: parseFloat(data.data.salaryPending) || 0,
                    defaultersCount: parseInt(data.data.defaultersCount) || 0
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    const handleScanSubmit = (e) => {
        e.preventDefault();
        if (!scanInput.trim()) return;
        setAttendanceStatus({ type: 'success', message: `Attendance marked for ID: ${scanInput}` });
        setScanInput('');
        setTimeout(() => setAttendanceStatus(null), 3000);
        if (scannerInputRef.current) {
            scannerInputRef.current.focus();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>Dashboard Home</h2>
            </div>

            {/* Accountant Attendance Scanner */}
            <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ScanLine size={18} />
                    <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>Accountant Attendance</p>
                    </div>
                </div>
                
                <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '8px', flex: 1 }}>
                    <input 
                        ref={scannerInputRef}
                        type="text" 
                        autoFocus
                        placeholder="Scan Barcode / Enter ID here..." 
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck size={14} /> Mark Present
                    </button>
                </form>

                {attendanceStatus && (
                    <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} /> {attendanceStatus.message}
                    </div>
                )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IndianRupee size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Fee Collection (Today)</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>₹ {stats.todaysCollection.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Monthly Revenue</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>₹ {stats.thisMonthCollection.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending Fees</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>₹ {stats.pendingFees.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingDown size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Expenses</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>₹ {stats.totalExpenses.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Salary Paid</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>₹ {stats.salaryPaid.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ffedd5', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Salary Pending</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>₹ {stats.salaryPending.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ffe4e6', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Defaulters Alert</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{stats.defaultersCount} Students</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Upcoming Dues</p>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Term 2 Fees</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '8px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={36} className="text-slate-200" style={{ marginBottom: '12px' }} />
                    <h3 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '16px' }}>Revenue vs Expense Chart</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Chart visualization will be implemented here</p>
                </div>
                
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                        <AlertTriangle size={18} className="text-amber-500" />
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '14px' }}>Action Alerts</h3>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {stats.defaultersCount > 0 && (
                            <div style={{ padding: '12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginTop: '5px' }}></div>
                                <div>
                                    <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#1e293b', fontSize: '13px' }}>{stats.defaultersCount} Defaulters Found</p>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '11px' }}>Students haven't paid their recent dues.</p>
                                </div>
                            </div>
                        )}
                        
                        {stats.salaryPending > 0 && (
                            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', marginTop: '5px' }}></div>
                                <div>
                                    <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#1e293b', fontSize: '13px' }}>Pending Salaries</p>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '11px' }}>₹ {stats.salaryPending.toLocaleString('en-IN')} pending for staff.</p>
                                </div>
                            </div>
                        )}
                        
                        {stats.defaultersCount === 0 && stats.salaryPending === 0 && (
                            <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', marginTop: '5px' }}></div>
                                <div>
                                    <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#1e293b', fontSize: '13px' }}>All Clear</p>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '11px' }}>No pending action alerts.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;
