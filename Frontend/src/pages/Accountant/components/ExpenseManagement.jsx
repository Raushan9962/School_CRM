import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingDown, Plus, CheckCircle2, Clock, Calendar, FileText } from 'lucide-react';
import apiFetch from '../../../services/api';

const ExpenseManagement = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        'Electricity', 'Internet', 'Water', 'Stationery', 'Maintenance', 'Event Expenses', 'Transport Expenses', 'Miscellaneous'
    ];

    const [formData, setFormData] = useState({
        category: 'Maintenance',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        vendorId: '',
        description: '',
        billUrl: ''
    });

    useEffect(() => {
        if (view === 'list') {
            fetchExpenses();
        }
    }, [view]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/accountant/expenses');
            const data = await res.json();
            if (data.success) {
                setExpenses(data.data);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiFetch('/accountant/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    vendorId: formData.vendorId ? parseInt(formData.vendorId) : null
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Expense recorded successfully!');
                setView('list');
                setFormData({
                    category: 'Maintenance',
                    amount: '',
                    expenseDate: new Date().toISOString().split('T')[0],
                    vendorId: '',
                    description: '',
                    billUrl: ''
                });
            } else {
                alert(data.message || 'Failed to record expense');
            }
        } catch (error) {
            console.error("Error recording expense:", error);
            alert("Error recording expense");
        } finally {
            setSubmitting(false);
        }
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

    if (view === 'form') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Record New Expense</h2>
                        <p className="text-xs text-slate-500 mt-1">Log a school operational expense</p>
                    </div>
                    <button onClick={() => setView('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Expense Category *</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹) *</label>
                            <input 
                                type="number" 
                                value={formData.amount}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                placeholder="0.00" 
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Expense Date *</label>
                            <input 
                                type="date" 
                                value={formData.expenseDate}
                                onChange={e => setFormData({...formData, expenseDate: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                            <input 
                                type="text" 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Brief details about expense" 
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 disabled:opacity-70 flex items-center gap-1">
                            {submitting ? 'Recording...' : <><CheckCircle2 size={14} /> Record Expense</>}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Expense Management</h1>
                    <p className="text-slate-500 text-xs mt-1">Track and manage school expenditures</p>
                </div>
                <button 
                    onClick={() => setView('form')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <Plus size={16} /> Record Expense
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Expenses Recorded</p>
                    <p className="text-base font-bold text-slate-800 m-0">{expenses.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Expense Amount</p>
                    <p className="text-base font-bold text-red-600 m-0">₹{totalExpense.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 bg-slate-50/50">
                    <TrendingDown size={16} className="text-red-500" />
                    <h3 className="font-bold text-slate-800 text-sm m-0">Recent Expenses</h3>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center text-slate-500 text-sm">Loading expenses...</div>
                ) : expenses.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No expenses recorded yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold">Date</th>
                                    <th className="px-4 py-2 font-bold">Category</th>
                                    <th className="px-4 py-2 font-bold">Description</th>
                                    <th className="px-4 py-2 font-bold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5 font-medium text-slate-700 whitespace-nowrap">
                                            {new Date(expense.expense_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">{expense.category}</td>
                                        <td className="px-4 py-2.5 text-slate-600 truncate max-w-[300px]">{expense.description || '-'}</td>
                                        <td className="px-4 py-2.5 font-bold text-red-600 text-right">
                                            ₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseManagement;
