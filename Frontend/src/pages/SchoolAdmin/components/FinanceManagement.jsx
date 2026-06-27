import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingDown, ReceiptText, Plus, ArrowUpRight, ArrowDownRight, Filter, Wallet, ArrowLeft } from 'lucide-react';
import apiFetch from '../../../services/api';

const FinanceManagement = () => {
    const [view, setView] = useState('overview'); // overview, collect_fee, add_expense
    const [tab, setTab] = useState('fees'); // fees, expenses
    const [fees, setFees] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [feeForm, setFeeForm] = useState({ studentId: '', amount: '', type: 'Tuition Fee', status: 'Paid', paidDate: new Date().toISOString().split('T')[0] });
    const [expenseForm, setExpenseForm] = useState({ category: 'Salary', amount: '', date: new Date().toISOString().split('T')[0], description: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [feeRes, expRes] = await Promise.all([
                apiFetch('/school-admin/fees'),
                apiFetch('/school-admin/expenses')
            ]);
            
            if (feeRes.ok) {
                const feeData = await feeRes.json();
                if (feeData.success) setFees(feeData.data);
            }
            if (expRes.ok) {
                const expData = await expRes.json();
                if (expData.success) setExpenses(expData.data);
            }
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'overview') {
            fetchData();
        }
    }, [view]);

    const handleCollectFee = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/school-admin/fees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feeForm) });
            const data = await res.json();
            if (data.success) {
                alert('Fee collected successfully!');
                setView('overview');
            } else {
                alert(data.message || 'Failed to collect fee');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/school-admin/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(expenseForm) });
            const data = await res.json();
            if (data.success) {
                alert('Expense added successfully!');
                setView('overview');
            } else {
                alert(data.message || 'Failed to add expense');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const totalRevenue = fees.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const netBalance = totalRevenue - totalExpenses;

    const filteredFees = fees.filter(f => f.student_name?.toLowerCase().includes(search.toLowerCase()) || f.type?.toLowerCase().includes(search.toLowerCase()));
    const filteredExpenses = expenses.filter(e => e.category?.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()));

    // Inline style objects mapping standard Tailwind
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
    const btnSecondary = { padding: '8px 16px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
    
    if (view === 'collect_fee' || view === 'add_expense') {
        const isFee = view === 'collect_fee';
        return (
            <div style={containerStyle} className="animate-fade-in">
                <div style={headerStyle}>
                    <div>
                        <h2 style={titleStyle}>{isFee ? 'Collect Fee' : 'Add Expense'}</h2>
                        <p style={subTitleStyle}>Fill out the details to record the transaction</p>
                    </div>
                    <button onClick={() => setView('overview')} style={btnSecondary}>
                        <ArrowLeft size={16} /> Back to Overview
                    </button>
                </div>
                
                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                    <form onSubmit={isFee ? handleCollectFee : handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {isFee ? (
                            <>
                                <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Student ID</label><input required type="number" value={feeForm.studentId} onChange={e => setFeeForm({...feeForm, studentId: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                                <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Amount (₹)</label><input required type="number" value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                                <div>
                                    <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Fee Type</label>
                                    <select value={feeForm.type} onChange={e => setFeeForm({...feeForm, type: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}}>
                                        <option value="Tuition Fee">Tuition Fee</option>
                                        <option value="Transport Fee">Transport Fee</option>
                                        <option value="Hostel Fee">Hostel Fee</option>
                                        <option value="Library Fee">Library Fee</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Date</label><input required type="date" value={feeForm.paidDate} onChange={e => setFeeForm({...feeForm, paidDate: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Category</label>
                                    <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}}>
                                        <option value="Salary">Salary</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Electricity">Electricity</option>
                                        <option value="Water">Water</option>
                                        <option value="Transport Fuel">Transport Fuel</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Amount (₹)</label><input required type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                                <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Date</label><input required type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                                <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Description</label><textarea value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px', minHeight:'80px'}} /></div>
                            </>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                            <button type="submit" style={btnPrimary}>
                                {isFee ? 'Record Payment' : 'Record Expense'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header Area */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Finance Summary</h2>
                    <p style={subTitleStyle}>Manage school revenue, expenses, and cash flow</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setView('add_expense')} style={{ ...btnSecondary, color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}>
                        <TrendingDown size={16} /> Log Expense
                    </button>
                    <button onClick={() => setView('collect_fee')} style={{ ...btnPrimary, background: '#16a34a' }}>
                        <IndianRupee size={16} /> Collect Fee
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setTab('fees')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: tab === 'fees' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: tab === 'fees' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IndianRupee size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Revenue</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>₹ {totalRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setTab('expenses')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: tab === 'expenses' ? '1px solid #ef4444' : '1px solid #e2e8f0', boxShadow: tab === 'expenses' ? '0 0 0 1px #ef4444' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingDown size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Expenses</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>₹ {totalExpenses.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setTab('net')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: tab === 'net' ? '1px solid #8b5cf6' : '1px solid #e2e8f0', boxShadow: tab === 'net' ? '0 0 0 1px #8b5cf6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ede9fe', color: '#5b21b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Net Balance</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>₹ {netBalance.toLocaleString('en-IN')}</h3>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ReceiptText size={16} className="text-slate-500" /> {tab === 'fees' || tab === 'net' ? 'Recent Fee Collections' : 'Recent Expenses'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search records..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '12px', width: '150px' }}
                        />
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                {tab === 'fees' || tab === 'net' ? (
                                    <>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Student Detail</th>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Fee Type</th>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Amount</th>
                                    </>
                                ) : (
                                    <>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Expense Detail</th>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Date</th>
                                        <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Amount</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {(tab === 'fees' || tab === 'net' ? filteredFees : filteredExpenses).map((row, idx) => (
                                <tr key={row.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                    {tab === 'fees' || tab === 'net' ? (
                                        <>
                                            <td style={{ padding: '12px 16px' }}>
                                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.student_name}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>ID: {row.student_id}</p>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                                {row.type}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                                                    <ArrowUpRight size={12} /> ₹{row.amount}
                                                </span>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{ padding: '12px 16px' }}>
                                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.category}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.description}</p>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                                {new Date(row.date).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #fecaca' }}>
                                                    <ArrowDownRight size={12} /> ₹{row.amount}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {(tab === 'fees' || tab === 'net' ? filteredFees : filteredExpenses).length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceManagement;
