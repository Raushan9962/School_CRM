import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle2, AlertCircle, FileText, Upload, ChevronRight, Activity, Users, Trash2 } from 'lucide-react';
import apiFetch from '../../../services/api';

const CRMSubscription = () => {
    const [payments, setPayments] = useState([]);
    const [planDetails, setPlanDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [view, setView] = useState('list'); // list or form
    const [uploadedFile, setUploadedFile] = useState(null);
    
    const [formData, setFormData] = useState({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: 'Bank Transfer',
        transactionId: '',
    });

    useEffect(() => {
        if (view === 'list') {
            fetchPayments();
        }
    }, [view]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/accountant/crm-subscription');
            const data = await res.json();
            if (data.success) {
                setPayments(data.data || []);
                setPlanDetails(data.planDetails || null);
            }
        } catch (error) {
            console.error("Error fetching CRM payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const submissionData = {
                ...formData,
                planId: 1, 
                invoiceUrl: uploadedFile ? `https://storage.vidyasetu.com/proofs/${uploadedFile}` : ''
            };

            const res = await apiFetch('/accountant/crm-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });
            const data = await res.json();
            if (data.success) {
                setView('list');
                setUploadedFile(null);
                setFormData({
                    amount: '',
                    paymentDate: new Date().toISOString().split('T')[0],
                    paymentMode: 'Bank Transfer',
                    transactionId: '',
                });
            } else {
                alert(data.message || 'Failed to record payment');
            }
        } catch (error) {
            console.error("Error recording payment:", error);
            alert("Error recording payment");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate totals
    let totalSubscriptionAmount = 0;
    if (planDetails) {
        totalSubscriptionAmount = planDetails.billing_cycle === 'Yearly' 
            ? parseFloat(planDetails.yearly_price || 0) 
            : parseFloat(planDetails.monthly_price || 0);
    }
    const totalPaid = payments.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    const pendingAmount = totalSubscriptionAmount - totalPaid;

    const handleOpenForm = () => {
        setFormData(prev => ({
            ...prev,
            amount: pendingAmount > 0 ? pendingAmount : ''
        }));
        setView('form');
    };

    if (view === 'form') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Record CRM Payment</h2>
                        <p className="text-xs text-slate-500 mt-1">Log payment made to VidyaSetu CRM Super Admin</p>
                    </div>
                    <button 
                        onClick={() => setView('list')}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors"
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-600">Pending Amount:</span>
                        <span className="text-sm font-bold text-red-600">₹{pendingAmount > 0 ? pendingAmount.toLocaleString('en-IN') : '0'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (₹) *</label>
                            <input 
                                type="number" 
                                required
                                value={formData.amount}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="e.g. 50000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date *</label>
                            <input 
                                type="date" 
                                required
                                value={formData.paymentDate}
                                onChange={e => setFormData({...formData, paymentDate: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode *</label>
                            <select 
                                value={formData.paymentMode}
                                onChange={e => setFormData({...formData, paymentMode: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                                <option value="UPI">UPI</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Transaction / UTR ID</label>
                            <input 
                                type="text" 
                                value={formData.transactionId}
                                onChange={e => setFormData({...formData, transactionId: e.target.value})}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Upload Payment Proof</label>
                        {!uploadedFile ? (
                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-slate-200 border-dashed rounded cursor-pointer bg-slate-50 hover:bg-slate-100">
                                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                    <Upload className="w-4 h-4 text-slate-400 mb-1" />
                                    <p className="text-xs text-slate-500"><span className="text-blue-600 font-semibold">Upload file</span></p>
                                </div>
                                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-2 border border-emerald-200 bg-emerald-50 rounded">
                                <span className="text-xs font-medium text-emerald-700 truncate">{uploadedFile}</span>
                                <button type="button" onClick={() => setUploadedFile(null)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button 
                            type="button" 
                            onClick={() => setView('list')}
                            className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1 disabled:opacity-70"
                        >
                            {submitting ? 'Recording...' : <><CheckCircle2 size={14} /> Record Payment</>}
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
                    <h1 className="text-xl font-bold text-slate-800 m-0">CRM Subscription</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage school subscription data and payments.</p>
                </div>
                <button 
                    onClick={handleOpenForm}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <DollarSign size={16} /> Record Payment
                </button>
            </div>

            {/* Simple Stats & Plan Details */}
            {planDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white border border-slate-200 rounded p-3">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Active Plan</p>
                        <p className="text-sm font-bold text-slate-800 m-0">{planDetails.plan_name}</p>
                        <p className="text-xs text-slate-500">{planDetails.max_students} Students • {planDetails.billing_cycle}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded p-3">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Cost</p>
                        <p className="text-base font-bold text-slate-800 m-0">₹{totalSubscriptionAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded p-3">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Paid</p>
                        <p className="text-base font-bold text-emerald-600 m-0">₹{totalPaid.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded p-3">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Pending</p>
                        <p className="text-base font-bold text-red-600 m-0">₹{pendingAmount > 0 ? pendingAmount.toLocaleString('en-IN') : '0'}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                        <FileText size={16} className="text-blue-600" /> Payment History
                    </h3>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center text-slate-500 text-sm font-medium">Loading records...</div>
                ) : payments.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-slate-400 mb-2 flex justify-center"><AlertCircle size={24}/></div>
                        <p className="text-sm text-slate-600 font-medium">No payments recorded yet.</p>
                        <button onClick={handleOpenForm} className="mt-3 text-blue-600 text-sm font-semibold hover:underline">Record first payment</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold">Date</th>
                                    <th className="px-4 py-2 font-bold">Amount</th>
                                    <th className="px-4 py-2 font-bold">Mode</th>
                                    <th className="px-4 py-2 font-bold">Trans ID</th>
                                    <th className="px-4 py-2 font-bold">Status</th>
                                    <th className="px-4 py-2 font-bold">Proof</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5 font-medium text-slate-700">{new Date(payment.payment_date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">₹{parseFloat(payment.amount).toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-2.5 text-slate-600">{payment.payment_mode}</td>
                                        <td className="px-4 py-2.5 text-slate-500 font-mono">{payment.transaction_id || '-'}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${payment.status === 'Completed' || payment.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {payment.status || 'Success'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            {payment.invoice_url ? (
                                                <a href={payment.invoice_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a>
                                            ) : (
                                                <span className="text-slate-400">N/A</span>
                                            )}
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

export default CRMSubscription;
