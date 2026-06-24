import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingDown, ReceiptText, Plus, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

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
            
            const feeData = await feeRes.json();
            const expData = await expRes.json();
            
            if (feeData.success) setFees(feeData.data);
            if (expData.success) setExpenses(expData.data);
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
            const res = await apiFetch('/school-admin/fees', {
                method: 'POST',
                body: JSON.stringify(feeForm)
            });
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
            const res = await apiFetch('/school-admin/expenses', {
                method: 'POST',
                body: JSON.stringify(expenseForm)
            });
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

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    if (view === 'collect_fee') {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Collect Fee</h3>
                <form onSubmit={handleCollectFee} className="space-y-4">
                    <div><label className={labelClass}>Student ID</label><input required type="number" value={feeForm.studentId} onChange={e => setFeeForm({...feeForm, studentId: e.target.value})} className={inputClass} /></div>
                    <div><label className={labelClass}>Amount (₹)</label><input required type="number" value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} className={inputClass} /></div>
                    <div>
                        <label className={labelClass}>Fee Type</label>
                        <select value={feeForm.type} onChange={e => setFeeForm({...feeForm, type: e.target.value})} className={inputClass}>
                            <option value="Tuition Fee">Tuition Fee</option>
                            <option value="Transport Fee">Transport Fee</option>
                            <option value="Hostel Fee">Hostel Fee</option>
                            <option value="Library Fee">Library Fee</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div><label className={labelClass}>Date</label><input required type="date" value={feeForm.paidDate} onChange={e => setFeeForm({...feeForm, paidDate: e.target.value})} className={inputClass} /></div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                        <button type="button" onClick={() => setView('overview')} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">Record Payment</button>
                    </div>
                </form>
            </div>
        );
    }

    if (view === 'add_expense') {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Add Expense</h3>
                <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                        <label className={labelClass}>Category</label>
                        <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className={inputClass}>
                            <option value="Salary">Salary</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Water">Water</option>
                            <option value="Transport Fuel">Transport Fuel</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div><label className={labelClass}>Amount (₹)</label><input required type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className={inputClass} /></div>
                    <div><label className={labelClass}>Date</label><input required type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className={inputClass} /></div>
                    <div><label className={labelClass}>Description</label><textarea value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className={inputClass} rows="3" /></div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                        <button type="button" onClick={() => setView('overview')} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors">Record Expense</button>
                    </div>
                </form>
            </div>
        );
    }

    const totalRevenue = fees.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const netBalance = totalRevenue - totalExpenses;

    const kpiCards = [
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, active: tab === 'fees', onClick: () => setTab('fees') },
        { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, active: tab === 'expenses', onClick: () => setTab('expenses') },
        { label: 'Net Balance', value: `₹${netBalance.toLocaleString()}`, active: false }
    ];

    const actions = (
        <div className="flex gap-2">
            <button onClick={() => setView('add_expense')} className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                <TrendingDown size={16} /> Expense
            </button>
            <button onClick={() => setView('collect_fee')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                <IndianRupee size={16} /> Collect Fee
            </button>
        </div>
    );

    const feeColumns = [
        { 
            label: 'Student', 
            sortable: true,
            render: (row) => (
                <div className="text-left">
                    <p className="font-bold text-slate-800 m-0 leading-tight">{row.student_name}</p>
                    <p className="text-[11px] font-bold text-slate-500 bg-slate-100 inline-block px-1.5 rounded mt-0.5 m-0 uppercase tracking-wider">ID: {row.student_id}</p>
                </div>
            )
        },
        { label: 'Type', sortable: true, key: 'type' },
        { 
            label: 'Amount', 
            sortable: true,
            render: (row) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[13px] font-bold border border-emerald-100">
                    <ArrowUpRight size={14} className="text-emerald-500" /> ₹{row.amount}
                </span>
            )
        }
    ];

    const expenseColumns = [
        { 
            label: 'Expense Details', 
            sortable: true,
            render: (row) => (
                <div className="text-left">
                    <p className="font-bold text-slate-800 m-0 leading-tight">{row.category}</p>
                    <p className="text-[12px] text-slate-500 m-0 truncate max-w-[200px]">{row.description}</p>
                </div>
            )
        },
        { 
            label: 'Date', 
            sortable: true,
            render: (row) => (
                <span className="text-[13px] font-medium text-slate-600">{new Date(row.date).toLocaleDateString()}</span>
            )
        },
        { 
            label: 'Amount', 
            sortable: true,
            render: (row) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-[13px] font-bold border border-rose-100">
                    <ArrowDownRight size={14} className="text-rose-500" /> ₹{row.amount}
                </span>
            )
        }
    ];

    const filteredFees = fees.filter(f => 
        f.student_name?.toLowerCase().includes(search.toLowerCase()) || 
        f.type?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredExpenses = expenses.filter(e => 
        e.category?.toLowerCase().includes(search.toLowerCase()) || 
        e.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PremiumTable 
            title="Finance Management"
            actions={actions}
            columns={tab === 'fees' ? feeColumns : expenseColumns} 
            data={tab === 'fees' ? filteredFees : filteredExpenses} 
            kpiCards={kpiCards}
            onSearch={setSearch}
            loading={loading}
        />
    );
};

export default FinanceManagement;
