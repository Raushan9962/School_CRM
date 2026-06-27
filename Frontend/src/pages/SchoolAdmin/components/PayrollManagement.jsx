import React, { useState, useEffect } from 'react';
import { IndianRupee, Download, CheckCircle, Clock, FileText, CheckCircle2, Check, Filter } from 'lucide-react';
import apiFetch from '../../../services/api';

const PayrollManagement = ({ roleFilter }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('all');

    useEffect(() => {
        const fetchPayroll = async () => {
            setLoading(true);
            try {
                // Fetch staff and their payroll details
                const res = await apiFetch('/users/school-users');
                const data = await res.json();
                if (data.success) {
                    const allUsers = data.data;
                    let staffOnly = allUsers.filter(u => 
                        u.role !== 'Student' && 
                        u.role !== 'Parent' && 
                        u.role !== 'School Admin' &&
                        u.role !== 'Super Admin'
                    );

                    if (roleFilter) {
                        if (roleFilter === 'Transport Staff') {
                            staffOnly = staffOnly.filter(u => u.role === 'Transport Manager' || u.role === 'Driver' || u.role === 'Transport Staff');
                        } else {
                            staffOnly = staffOnly.filter(u => u.role === roleFilter);
                        }
                    }
                    
                    // Add mock payroll data for the UI
                    const staffWithPayroll = staffOnly.map(s => ({
                        ...s,
                        basicSalary: s.basicSalary || Math.floor(Math.random() * 30000) + 15000,
                        allowances: Math.floor(Math.random() * 5000) + 2000,
                        deductions: Math.floor(Math.random() * 2000) + 500,
                        status: Math.random() > 0.5 ? 'Processed' : 'Pending',
                        lastProcessed: '2026-05-31'
                    }));
                    setStaff(staffWithPayroll);
                }
            } catch (error) {
                console.error("Error fetching payroll data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, [roleFilter]);

    const filteredStaff = staff.filter(s => 
        (tab === 'all' || s.status.toLowerCase() === tab) &&
        (s.name?.toLowerCase().includes(search.toLowerCase()) || 
         s.role?.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPayroll = staff.reduce((acc, s) => acc + (s.basicSalary + s.allowances - s.deductions), 0);
    const processedPayroll = staff.filter(s => s.status === 'Processed').reduce((acc, s) => acc + (s.basicSalary + s.allowances - s.deductions), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>Salary & Payroll</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'white', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <Download size={14} /> Export CSV
                    </button>
                    <button style={{ background: '#1e293b', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <IndianRupee size={14} /> Process All
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setTab('all')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: tab === 'all' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: tab === 'all' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IndianRupee size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Payroll</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>₹{totalPayroll.toLocaleString()}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setTab('processed')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: tab === 'processed' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: tab === 'processed' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Processed</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>₹{processedPayroll.toLocaleString()}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setTab('pending')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: tab === 'pending' ? '1px solid #f59e0b' : '1px solid #e2e8f0', boxShadow: tab === 'pending' ? '0 0 0 1px #f59e0b' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>₹{(totalPayroll - processedPayroll).toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} className="text-slate-500" /> Payroll Records
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search employee..." 
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
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Employee</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Net Salary</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading payroll data...</td>
                                </tr>
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No records found.</td>
                                </tr>
                            ) : (
                                filteredStaff.map((row, idx) => {
                                    const net = row.basicSalary + row.allowances - row.deductions;
                                    return (
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
                                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>₹{net.toLocaleString()}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>Base: ₹{row.basicSalary.toLocaleString()} | Allow: ₹{row.allowances.toLocaleString()} | Ded: ₹{row.deductions.toLocaleString()}</p>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ 
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                                                    background: row.status === 'Processed' ? '#dcfce7' : '#fef3c7',
                                                    color: row.status === 'Processed' ? '#166534' : '#92400e',
                                                    border: `1px solid ${row.status === 'Processed' ? '#bbf7d0' : '#fde68a'}`
                                                }}>
                                                    {row.status === 'Processed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                {row.status === 'Pending' ? (
                                                    <button style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <Check size={14} /> Process
                                                    </button>
                                                ) : (
                                                    <button style={{ background: 'white', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} className="hover:bg-slate-50">
                                                        <FileText size={14} /> Slip
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PayrollManagement;
