import React, { useState, useEffect } from 'react';
import { Search, Receipt, CreditCard, Banknote, FileText, CheckCircle2 } from 'lucide-react';
import apiFetch from '../../../services/api';

const FeeCollection = () => {
    const [view, setView] = useState('collect'); // 'collect' or 'history'
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const [paymentData, setPaymentData] = useState({
        paymentMode: 'Cash',
        amountPaid: '',
        transactionId: ''
    });

    useEffect(() => {
        if (view === 'history') {
            fetchReceipts();
        }
    }, [view]);

    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/accountant/fees/receipts');
            const data = await res.json();
            if (data.success) {
                setReceipts(data.data);
            }
        } catch (error) {
            console.error("Error fetching receipts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        setSearchResult(null);
        try {
            const res = await apiFetch(`/users/school-students?search=${searchQuery}`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const student = data.data[0];
                setSearchResult({
                    ...student,
                    totalDue: 25000,
                    feesBreakdown: [
                        { head: 'Tuition Fee (Q1)', amount: 15000 },
                        { head: 'Transport Fee', amount: 5000 },
                        { head: 'Activity Fee', amount: 5000 }
                    ]
                });
                setPaymentData(p => ({ ...p, amountPaid: 25000 }));
            } else {
                alert("No student found");
            }
        } catch (error) {
            console.error("Error searching student:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCollect = async (e) => {
        e.preventDefault();
        if (!searchResult || !paymentData.amountPaid) return;
        setSubmitting(true);
        try {
            const res = await apiFetch('/accountant/fees/collect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: searchResult.id,
                    paymentMode: paymentData.paymentMode,
                    totalAmount: searchResult.totalDue,
                    amountPaid: parseFloat(paymentData.amountPaid),
                    transactionId: paymentData.transactionId
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Receipt Generated: ${data.data.receipt_number}`);
                setSearchResult(null);
                setSearchQuery('');
                setPaymentData({ paymentMode: 'Cash', amountPaid: '', transactionId: '' });
                setView('history');
            } else {
                alert(data.message || 'Failed to collect fee');
            }
        } catch (error) {
            console.error("Error collecting fee:", error);
            alert("Error collecting fee");
        } finally {
            setSubmitting(false);
        }
    };

    const totalCollected = receipts.reduce((acc, curr) => acc + parseFloat(curr.amount_paid || 0), 0);

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Fee Collection Desk</h1>
                    <p className="text-slate-500 text-xs mt-1">Accept payments and generate fee receipts</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setView('collect')} 
                        className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${view === 'collect' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        Collect Fees
                    </button>
                    <button 
                        onClick={() => setView('history')} 
                        className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${view === 'history' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        Collection History
                    </button>
                </div>
            </div>

            {view === 'collect' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {/* Search & Breakdowns */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white rounded shadow-sm border border-slate-200 p-4">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Search Student *</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Name or ID" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                />
                                <button onClick={handleSearch} disabled={loading} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">
                                    {loading ? '...' : <Search size={14} />}
                                </button>
                            </div>
                        </div>

                        {searchResult && (
                            <div className="bg-white rounded shadow-sm border border-slate-200 p-4">
                                <div className="mb-3 pb-3 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800 m-0 text-sm">{searchResult.name}</h3>
                                    <p className="text-xs text-slate-500 m-0">ID: ST-{searchResult.id} | Class: {searchResult.class_name}</p>
                                </div>
                                <h4 className="text-xs font-bold text-slate-700 mb-2">Pending Fees Breakdown</h4>
                                <div className="space-y-1 mb-3">
                                    {searchResult.feesBreakdown.map((fee, idx) => (
                                        <div key={idx} className="flex justify-between text-xs text-slate-600">
                                            <span>{fee.head}</span>
                                            <span className="font-medium">₹{fee.amount.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <span className="text-xs font-bold text-slate-800">Total Due</span>
                                    <span className="text-sm font-bold text-red-600">₹{searchResult.totalDue.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Form */}
                    <div className="md:col-span-2">
                        {searchResult ? (
                            <div className="bg-white rounded shadow-sm border border-slate-200 p-5">
                                <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">Record Payment</h3>
                                <form onSubmit={handleCollect} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paying (₹) *</label>
                                            <input 
                                                type="number" 
                                                required 
                                                value={paymentData.amountPaid}
                                                onChange={e => setPaymentData({...paymentData, amountPaid: e.target.value})}
                                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode *</label>
                                            <select 
                                                value={paymentData.paymentMode}
                                                onChange={e => setPaymentData({...paymentData, paymentMode: e.target.value})}
                                                required 
                                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                            >
                                                <option value="Cash">Cash</option>
                                                <option value="Online">Online / UPI</option>
                                                <option value="Card">Credit/Debit Card</option>
                                                <option value="Cheque">Cheque</option>
                                            </select>
                                        </div>
                                    </div>

                                    {paymentData.paymentMode !== 'Cash' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Transaction ID / Cheque No.</label>
                                            <input 
                                                type="text" 
                                                value={paymentData.transactionId}
                                                onChange={e => setPaymentData({...paymentData, transactionId: e.target.value})}
                                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                                            />
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                                        <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 flex items-center gap-1 disabled:opacity-70">
                                            {submitting ? 'Processing...' : <><Receipt size={14} /> Generate Receipt</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white rounded shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                                <Banknote size={48} className="text-slate-300 mb-3" />
                                <h3 className="text-slate-500 font-bold text-sm">No Student Selected</h3>
                                <p className="text-xs text-slate-400">Search for a student to view their dues and collect fees.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {view === 'history' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white border border-slate-200 rounded p-3">
                            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Fee Collected</p>
                            <p className="text-base font-bold text-emerald-600 m-0">₹{totalCollected.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded p-3">
                            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Receipts Generated</p>
                            <p className="text-base font-bold text-slate-800 m-0">{receipts.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow-sm border border-slate-200">
                        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                                <FileText size={16} className="text-blue-600" /> Recent Transactions
                            </h3>
                        </div>
                        
                        {loading ? (
                            <div className="p-8 text-center text-slate-500 text-sm">Loading receipts...</div>
                        ) : receipts.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">No recent fee collections found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                            <th className="px-4 py-2 font-bold">Receipt No</th>
                                            <th className="px-4 py-2 font-bold">Student</th>
                                            <th className="px-4 py-2 font-bold">Amount Paid</th>
                                            <th className="px-4 py-2 font-bold">Mode</th>
                                            <th className="px-4 py-2 font-bold">Date</th>
                                            <th className="px-4 py-2 font-bold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs">
                                        {receipts.map((rcpt) => (
                                            <tr key={rcpt.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-2.5 font-bold text-slate-800">{rcpt.receipt_number}</td>
                                                <td className="px-4 py-2.5 text-slate-700">{rcpt.student_name}</td>
                                                <td className="px-4 py-2.5 font-bold text-emerald-600">₹{parseFloat(rcpt.amount_paid).toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold uppercase rounded">
                                                        {rcpt.payment_mode}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-slate-600">{new Date(rcpt.payment_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <button className="text-blue-600 font-bold hover:underline">Print</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeCollection;
