import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, Download, AlertCircle, Calendar, CreditCard, Receipt } from 'lucide-react';

const FeeManagement = ({ childId }) => {
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/parent/children/${childId}/fees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFeeData(response.data);
            } catch (error) {
                console.error("Error fetching fee data", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) fetchFees();
    }, [childId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading fee data...</div>;
    if (!feeData) return <div className="p-8 text-center text-rose-500">Failed to load fee data.</div>;

    const percentagePaid = Math.round((feeData.paidAmount / feeData.totalAnnualFee) * 100) || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
                    <p className="text-slate-500">View and pay your child's school fees online.</p>
                </div>
                {feeData.pendingAmount > 0 && (
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                        <CreditCard size={18} />
                        Pay Fees Now
                    </button>
                )}
            </div>

            {/* Fee Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <IndianRupee size={80} />
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Total Annual Fee</p>
                    <h3 className="text-3xl font-bold text-slate-800">₹{feeData.totalAnnualFee.toLocaleString()}</h3>
                    
                    <div className="mt-6">
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                            <span>Paid: {percentagePaid}%</span>
                            <span>Remaining: {100 - percentagePaid}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${percentagePaid}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-slate-500">Paid Amount</p>
                            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckIcon size={16} /></span>
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-600">₹{feeData.paidAmount.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between border-l-4 border-l-rose-500">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-slate-500">Pending Amount</p>
                            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><AlertCircle size={16} /></span>
                        </div>
                        <h3 className="text-2xl font-bold text-rose-600">₹{feeData.pendingAmount.toLocaleString()}</h3>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <Calendar size={14} /> Next due date: {feeData.nextDueDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Receipt size={18} className="text-slate-500" />
                        Payment History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Receipt No</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {feeData.history && feeData.history.map((record, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{record.receiptNo}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{record.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                            <Download size={16} /> Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!feeData.history || feeData.history.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No payment history found.
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

// Helper Icon
const CheckIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
    </svg>
);

export default FeeManagement;
