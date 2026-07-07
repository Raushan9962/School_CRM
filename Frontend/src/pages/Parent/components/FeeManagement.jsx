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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
                        <IndianRupee size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Annual Fee</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">₹{feeData.totalAnnualFee.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 shrink-0">
                        <CheckIcon size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Paid Amount</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">₹{feeData.paidAmount.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center text-rose-700 shrink-0">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pending Amount</p>
                            <h3 className="m-0 text-base font-bold text-slate-800">₹{feeData.pendingAmount.toLocaleString()}</h3>
                        </div>
                    </div>
                    {feeData.nextDueDate && (
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 pl-12 m-0">
                            <Calendar size={12} /> Next due: {feeData.nextDueDate}
                        </p>
                    )}
                </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Receipt size={18} className="text-slate-500" />
                        <h3 className="m-0 text-sm font-bold text-slate-800">Payment History</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Receipt No</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {feeData.history && feeData.history.map((record, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-[13px] font-medium text-slate-800">{record.receiptNo}</td>
                                    <td className="px-4 py-3 text-[13px] text-slate-500">{record.date}</td>
                                    <td className="px-4 py-3 text-[13px] font-bold text-slate-800">₹{record.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-md transition-colors border border-slate-300">
                                            <Download size={14} /> Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!feeData.history || feeData.history.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500 text-[13px]">
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
