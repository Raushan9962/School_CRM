import React, { useState, useEffect } from 'react';
import { IndianRupee, Users, FileText, CheckCircle2, Clock, Calculator, Plus } from 'lucide-react';
import apiFetch from '../../../services/api';

const SalaryManagement = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [staffList, setStaffList] = useState([]);

    const [formData, setFormData] = useState({
        staffId: '',
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        basicSalary: '',
        allowances: '0',
        deductions: '0',
        paymentDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (view === 'list') {
            fetchPayrolls();
        } else if (view === 'form' && staffList.length === 0) {
            fetchStaff();
        }
    }, [view]);

    const fetchPayrolls = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/accountant/payroll');
            const data = await res.json();
            if (data.success) {
                setPayrolls(data.data);
            }
        } catch (error) {
            console.error("Error fetching payrolls:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await apiFetch('/users/staff'); // Assuming endpoint exists
            const data = await res.json();
            if (data.success) {
                setStaffList(data.data);
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    };

    const handleProcess = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiFetch('/accountant/payroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    staffId: formData.staffId,
                    month: formData.month,
                    year: formData.year,
                    basicSalary: parseFloat(formData.basicSalary),
                    allowances: parseFloat(formData.allowances || 0),
                    deductions: parseFloat(formData.deductions || 0),
                    paymentDate: formData.paymentDate
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Payroll processed successfully!');
                setView('list');
                setFormData({
                    ...formData,
                    staffId: '',
                    basicSalary: '',
                    allowances: '0',
                    deductions: '0'
                });
            } else {
                alert(data.message || 'Failed to process payroll');
            }
        } catch (error) {
            console.error("Error processing payroll:", error);
            alert("Error processing payroll");
        } finally {
            setSubmitting(false);
        }
    };

    const calculateNet = () => {
        const basic = parseFloat(formData.basicSalary) || 0;
        const allow = parseFloat(formData.allowances) || 0;
        const deduc = parseFloat(formData.deductions) || 0;
        return basic + allow - deduc;
    };

    const totalSalaryDisbursed = payrolls.reduce((acc, curr) => acc + parseFloat(curr.net_salary || 0), 0);

    if (view === 'form') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Process Staff Salary</h2>
                        <p className="text-xs text-slate-500 mt-1">Generate and record payroll for a staff member</p>
                    </div>
                    <button onClick={() => setView('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>

                <form onSubmit={handleProcess} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Select Staff *</label>
                            <select 
                                value={formData.staffId}
                                onChange={e => setFormData({...formData, staffId: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="">-- Choose Staff --</option>
                                {staffList.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.role_name})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Month</label>
                                <select 
                                    value={formData.month}
                                    onChange={e => setFormData({...formData, month: e.target.value})}
                                    className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                                <input 
                                    type="number" 
                                    value={formData.year}
                                    onChange={e => setFormData({...formData, year: e.target.value})}
                                    className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Basic Salary (₹) *</label>
                            <input 
                                type="number" 
                                required
                                value={formData.basicSalary}
                                onChange={e => setFormData({...formData, basicSalary: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                placeholder="0" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Allowances (₹)</label>
                            <input 
                                type="number" 
                                value={formData.allowances}
                                onChange={e => setFormData({...formData, allowances: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                placeholder="0" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Deductions (₹)</label>
                            <input 
                                type="number" 
                                value={formData.deductions}
                                onChange={e => setFormData({...formData, deductions: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-red-500 outline-none" 
                                placeholder="0" 
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center mt-2">
                        <span className="text-xs font-semibold text-slate-600">Net Payable Salary:</span>
                        <span className="text-sm font-bold text-blue-600">₹{calculateNet().toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date *</label>
                        <input 
                            type="date" 
                            required
                            value={formData.paymentDate}
                            onChange={e => setFormData({...formData, paymentDate: e.target.value})}
                            className="w-full md:w-1/2 px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                        />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1 disabled:opacity-70">
                            {submitting ? 'Processing...' : <><CheckCircle2 size={14} /> Process Salary</>}
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
                    <h1 className="text-xl font-bold text-slate-800 m-0">Payroll & Salary</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage staff salaries, deductions and payslips</p>
                </div>
                <button 
                    onClick={() => setView('form')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <Calculator size={16} /> Process Payroll
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Salary Disbursed</p>
                    <p className="text-base font-bold text-slate-800 m-0">₹{totalSalaryDisbursed.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Payroll Records</p>
                    <p className="text-base font-bold text-slate-800 m-0">{payrolls.length}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 bg-slate-50/50">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-sm m-0">Payroll History</h3>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center text-slate-500 text-sm">Loading payroll records...</div>
                ) : payrolls.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No payroll records found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold">Staff</th>
                                    <th className="px-4 py-2 font-bold">Period</th>
                                    <th className="px-4 py-2 font-bold">Basic</th>
                                    <th className="px-4 py-2 font-bold">Allw/Ded</th>
                                    <th className="px-4 py-2 font-bold">Net Salary</th>
                                    <th className="px-4 py-2 font-bold">Status</th>
                                    <th className="px-4 py-2 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {payrolls.map((payroll) => (
                                    <tr key={payroll.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5">
                                            <div className="font-bold text-slate-800">{payroll.staff_name}</div>
                                            <div className="text-[10px] text-slate-500">{payroll.role}</div>
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-700">{payroll.month} {payroll.year}</td>
                                        <td className="px-4 py-2.5 font-medium text-slate-600">₹{parseFloat(payroll.basic_salary).toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-2.5">
                                            <div className="text-emerald-600">+₹{parseFloat(payroll.allowances).toLocaleString('en-IN')}</div>
                                            <div className="text-red-600">-₹{parseFloat(payroll.deductions).toLocaleString('en-IN')}</div>
                                        </td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">₹{parseFloat(payroll.net_salary).toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-2.5">
                                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase rounded">
                                                {payroll.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <button className="text-blue-600 font-bold hover:underline">Payslip</button>
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

export default SalaryManagement;
