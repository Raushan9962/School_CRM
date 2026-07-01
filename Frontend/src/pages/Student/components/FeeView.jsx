import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar, Download, Printer, FileText, CheckCircle, Clock, AlertCircle, CreditCard, Receipt } from 'lucide-react';
import apiFetch from '../../../services/api';

const FeeView = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [invoiceSource, setInvoiceSource] = useState({ type: 'pending', fee: null });
    const receiptRef = useRef(null);

    const fetchFees = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const res = await apiFetch(`/fees/student/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
                }
            }
        } catch (error) {
            console.error("Error fetching fees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFees(); }, []);

    const handleOpenInvoice = (type, fee = null) => {
        setInvoiceSource({ type, fee });
        setIsReceiptModalOpen(true);
    };

    const handlePrintReceipt = () => {
        if (!receiptRef.current) return;
        const printContent = receiptRef.current.innerHTML;
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        printWindow.document.write(`
            <html><head><title>Fee Invoice</title>
            <style>
                body { font-family: monospace; padding: 40px; background: white; }
                @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } @page { margin: 0; } }
            </style></head>
            <body>${receiptRef.current.innerHTML}
            <script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},500);}<\/script>
            </body></html>`);
        printWindow.document.close();
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const schoolName = user.schoolName || 'VidyaSetu School';

    const fineKeywords = ['fine', 'penalty', 'late', 'punishment'];
    const isFine = (desc) => fineKeywords.some(k => (desc || '').toLowerCase().includes(k));

    const paidRecords   = records.filter(r => r.status === 'Paid');
    const fineRecords   = records.filter(r => isFine(r.description));
    const pendingRegular = records.filter(r => r.status !== 'Paid' && !isFine(r.description));
    const pendingFines   = records.filter(r => r.status !== 'Paid' && isFine(r.description));

    const totalPendingAll = [...pendingRegular, ...pendingFines].reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const totalPendingRegular = pendingRegular.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const totalPaid = paidRecords.reduce((s, r) => s + parseFloat(r.amount || 0), 0);

    const tabs = [
        { id: 'all',     label: 'All Records',   count: paidRecords.length, subtext: 'Transaction history' },
        { id: 'pending', label: 'Pending Fees',  count: pendingRegular.length + pendingFines.length, subtext: 'All time' },
        { id: 'fine',    label: 'Fines',          count: fineRecords.length, subtext: 'All time' },
    ];

    // ---- Invoice Modal ----
    if (isReceiptModalOpen) {
        let invoiceFees = [];
        let invoiceTitle = 'Fee Invoice';
        if (invoiceSource.type === 'pending') {
            invoiceFees = [...pendingRegular, ...pendingFines];
            invoiceTitle = 'Pending Fee Invoice';
        } else if (invoiceSource.type === 'single') {
            invoiceFees = invoiceSource.fee ? [invoiceSource.fee] : [];
            invoiceTitle = 'Fee Invoice';
        } else if (invoiceSource.type === 'paid') {
            invoiceFees = paidRecords;
            invoiceTitle = 'Payment Receipt';
        }
        const invTotal = invoiceFees.reduce((s, f) => s + parseFloat(f.amount || 0), 0);
        const invPaid  = invoiceFees.filter(f => f.status === 'Paid').reduce((s, f) => s + parseFloat(f.amount || 0), 0);
        const invDue   = invTotal - invPaid;
        const invStatus = invDue <= 0 ? 'PAID' : (invPaid > 0 ? 'PARTIAL' : 'PENDING');

        return (
            <div className="flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden">
                {/* Header bar */}
                <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800 m-0">{invoiceTitle}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrintReceipt}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1.5">
                            <Printer size={13} /> Print
                        </button>
                        <button onClick={() => setIsReceiptModalOpen(false)}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">
                            ← Back
                        </button>
                    </div>
                </div>

                {/* Compact Invoice — two column on desktop */}
                <div className="p-4 overflow-auto">
                    <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');`}</style>
                    <div ref={receiptRef}
                        className="bg-white font-mono text-[11px] text-black mx-auto"
                        style={{ width: '384px', border: '2px solid black', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

                        {/* Top header — full width */}
                        <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>{schoolName}</div>
                                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px', color: '#555' }}>FEE INVOICE / RECEIPT</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '28px', fontFamily: '"Libre Barcode 39", monospace', lineHeight: 1 }}>*INV-{user.id || '0000'}*</div>
                                <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px' }}>ID: {user.id || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Billed To */}
                        <div style={{ borderRight: '1px solid black', borderBottom: '1px solid black', padding: '12px 14px' }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#888' }}>Billed To</div>
                            <div style={{ fontWeight: 700, fontSize: '13px' }}>{user.name || 'Student'}</div>
                            <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>ID: {user.id || 'N/A'} · Student</div>
                        </div>

                        {/* Payment Info */}
                        <div style={{ borderBottom: '1px solid black', padding: '12px 14px', background: '#f9fafb' }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#888' }}>Payment Info</div>
                            <div style={{ fontSize: '10px' }}>Date: {new Date().toLocaleDateString()}</div>
                            <div style={{ fontWeight: 700, fontSize: '12px', marginTop: '4px', color: invDue <= 0 ? '#16a34a' : '#dc2626' }}>
                                {invStatus}
                            </div>
                        </div>

                        {/* Issuer — full width */}
                        <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid black', padding: '8px 14px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '10px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#888', marginRight: '4px' }}>Issuer:</span>
                            <span style={{ fontWeight: 700 }}>{schoolName}</span>
                            <span style={{ color: '#555' }}>· 123 Education Lane, Learning City · Delhi 110001</span>
                        </div>

                        {/* Fee Table — full width */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                <thead>
                                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid black' }}>
                                        <th style={{ padding: '6px 10px', textAlign: 'left', borderRight: '1px solid black', fontWeight: 700 }}>Description</th>
                                        <th style={{ padding: '6px 10px', borderRight: '1px solid black', width: '70px', fontWeight: 700 }}>Status</th>
                                        <th style={{ padding: '6px 10px', width: '90px', textAlign: 'right', fontWeight: 700 }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceFees.map((fee, idx) => (
                                        <tr key={fee.id || idx} style={{ borderBottom: '1px solid #d1d5db' }}>
                                            <td style={{ padding: '8px 10px', borderRight: '1px solid #d1d5db' }}>
                                                <div>{fee.description || 'Academic Fee'}</div>
                                                {fee.paid_date && <div style={{ fontSize: '9px', color: '#9ca3af' }}>Paid: {new Date(fee.paid_date).toLocaleDateString()}</div>}
                                            </td>
                                            <td style={{ padding: '5px 10px', borderRight: '1px solid #d1d5db', fontSize: '9px', fontWeight: 700, color: fee.status === 'Paid' ? '#16a34a' : '#dc2626' }}>
                                                {fee.status?.toUpperCase() || 'PENDING'}
                                            </td>
                                            <td style={{ padding: '5px 10px', textAlign: 'right', fontWeight: 700 }}>₹{parseFloat(fee.amount).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                    {invPaid > 0 && (
                                        <tr style={{ borderTop: '2px solid black', background: '#f0fdf4' }}>
                                            <td colSpan="2" style={{ padding: '5px 10px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #d1d5db' }}>Total Paid</td>
                                            <td style={{ padding: '5px 10px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>₹{invPaid.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    {invDue > 0 && (
                                        <tr style={{ background: '#fef2f2' }}>
                                            <td colSpan="2" style={{ padding: '5px 10px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #d1d5db' }}>Balance Due</td>
                                            <td style={{ padding: '5px 10px', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>₹{invDue.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                    <tr style={{ borderTop: '2px solid black', background: '#f3f4f6' }}>
                                        <td colSpan="2" style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 900, borderRight: '1px solid #d1d5db' }}>Grand Total</td>
                                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 900, fontSize: '13px' }}>₹{invTotal.toLocaleString('en-IN')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer — barcode + school details */}
                        <div style={{ gridColumn: '1 / -1', borderTop: '2px solid black', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '30px', fontFamily: '"Libre Barcode 39", monospace', lineHeight: 1 }}>*{user.id || 'INV-0000'}*</div>
                            <div style={{ fontSize: '9px', textAlign: 'right', color: '#555' }}>
                                <div style={{ fontWeight: 700 }}>{schoolName}</div>
                                <div>123 Education Lane, Delhi 110001</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---- Main View ----
    return (
        <div className="flex flex-col gap-0 bg-white rounded-lg border border-slate-200 overflow-hidden">

            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-1.5 hover:bg-slate-50">
                        Filter <ChevronDown size={14} />
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-1.5 hover:bg-slate-50">
                        <Calendar size={14} /> Date Range
                    </button>
                </div>
                <button className="px-3 py-1.5 bg-white border border-sky-400 rounded text-sky-500 text-sm flex items-center gap-1.5 hover:bg-sky-50">
                    <Download size={14} /> Export
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b-2 border-slate-200">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        style={{
                            minWidth: '160px', padding: '16px',
                            background: activeTab === tab.id ? '#e0f2fe' : 'white',
                            border: '1px solid', borderColor: activeTab === tab.id ? '#0ea5e9' : '#e2e8f0',
                            borderBottom: 'none', borderRadius: '8px 8px 0 0', textAlign: 'left', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', gap: '4px',
                            position: 'relative', marginBottom: '-2px',
                            borderTopWidth: activeTab === tab.id ? '3px' : '1px'
                        }}>
                        <div className="flex justify-between items-start w-full">
                            <span className="text-sm text-gray-600 font-medium">{tab.label}</span>
                            <span className="text-xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="px-6 py-5 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading fees data...</div>
                ) : activeTab === 'all' ? (
                    /* ALL RECORDS - Transaction History only (paid transactions) */
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Transaction History</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Completed payments & receipts</p>
                            </div>
                            {paidRecords.length > 0 && (
                                <button onClick={() => handleOpenInvoice('paid')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold rounded hover:bg-blue-100">
                                    <FileText size={13} /> Full Receipt
                                </button>
                            )}
                        </div>
                        {paidRecords.length === 0 ? (
                            <div className="text-center text-slate-400 py-16">
                                <Receipt size={40} className="mx-auto mb-3 text-slate-200" />
                                <div className="font-semibold text-sm">No transactions yet</div>
                                <div className="text-xs mt-1">Completed payments will appear here</div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {paidRecords.map((row, idx) => (
                                    <div key={row.id}
                                        className="rounded-xl border border-emerald-100 overflow-hidden bg-white shadow-sm">
                                        {/* Top status bar */}
                                        <div className="bg-emerald-50 px-4 py-2 flex justify-between items-center border-b border-emerald-100">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-600" />
                                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Payment Verified</span>
                                            </div>
                                            <span className="text-[11px] text-emerald-600 font-semibold">
                                                {row.paid_date ? new Date(row.paid_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date N/A'}
                                            </span>
                                        </div>
                                        {/* Main details */}
                                        <div className="px-4 py-3 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle size={18} className="text-emerald-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800 text-sm">{row.description || 'Academic Fee'}</div>
                                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                                            <CreditCard size={10} /> Method: {row.payment_method || 'Online / Cash'}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">
                                                            Ref: {row.transaction_ref || `TXN-${row.id || idx}`}
                                                        </span>
                                                        <span className="text-[11px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                                                            SUCCESS
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                <span className="font-black text-emerald-600 text-base">₹{parseFloat(row.amount).toLocaleString('en-IN')}</span>
                                                <button onClick={() => handleOpenInvoice('single', row)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-700 shadow-sm">
                                                    <Download size={12} /> Download Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Total paid summary */}
                                <div className="flex justify-between items-center px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-lg mt-2">
                                    <span className="text-sm font-bold text-slate-700">Total Paid</span>
                                    <span className="text-base font-bold text-emerald-600">₹{totalPaid.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                ) : activeTab === 'pending' ? (
                    /* PENDING FEES - Consolidated class package + individual fines */
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Pending Payments</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Fees awaiting payment</p>
                            </div>
                        </div>

                        {pendingRegular.length === 0 && pendingFines.length === 0 ? (
                            <div className="text-center text-slate-400 py-16">
                                <CheckCircle size={40} className="mx-auto mb-3 text-slate-200" />
                                <div className="font-semibold text-sm">All fees are paid! 🎉</div>
                            </div>
                        ) : (
                            <>
                                {/* Consolidated class fee package */}
                                {pendingRegular.length > 0 && (
                                    <div className="border border-red-100 rounded-xl overflow-hidden">
                                        {/* Header */}
                                        <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                    <Clock size={15} className="text-red-500" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">Class Fee Package</div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {pendingRegular[0]?.due_date ? `Due: ${new Date(pendingRegular[0].due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'Due: N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-red-500 text-base">₹{totalPendingRegular.toLocaleString('en-IN')}</span>
                                                <button onClick={() => handleOpenInvoice('pending')}
                                                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded hover:bg-slate-50">
                                                    Invoice
                                                </button>
                                            </div>
                                        </div>
                                        {/* Breakdown */}
                                        <div className="divide-y divide-slate-100">
                                            {pendingRegular.map((fee, idx) => (
                                                <div key={fee.id || idx} className="flex justify-between items-center px-4 py-2.5">
                                                    <span className="text-sm text-slate-700">{fee.description || 'Academic Fee'}</span>
                                                    <span className="font-semibold text-slate-800 text-sm">₹{parseFloat(fee.amount).toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Pay button */}
                                        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                            <button className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                                                <CreditCard size={14} /> Pay Now — ₹{totalPendingRegular.toLocaleString('en-IN')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Pending fines */}
                                {pendingFines.map((row) => (
                                    <div key={row.id} className="border border-orange-100 rounded-xl overflow-hidden">
                                        <div className="px-4 py-3 bg-orange-50 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <AlertCircle size={15} className="text-orange-500" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{row.description || 'Fine'}</div>
                                                    <div className="text-[10px] text-orange-500 font-bold uppercase">FINE · Pending</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-orange-500">₹{parseFloat(row.amount).toLocaleString('en-IN')}</span>
                                                <button className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded hover:bg-blue-700">
                                                    Pay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Total summary + Pay All + Invoice */}
                                <div className="border border-red-200 rounded-xl overflow-hidden bg-white">
                                    <div className="px-4 py-3 flex justify-between items-center">
                                        <div>
                                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Total Amount Due</div>
                                            <div className="text-2xl font-black text-red-500 mt-0.5">₹{(pendingRegular.reduce((s,r) => s + parseFloat(r.amount||0), 0) + pendingFines.reduce((s,r) => s + parseFloat(r.amount||0), 0)).toLocaleString('en-IN')}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">{pendingRegular.length + pendingFines.length} fee item(s) pending</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenInvoice('pending')}
                                                className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1.5">
                                                <FileText size={13} /> Invoice
                                            </button>
                                            <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-md shadow-blue-200">
                                                <CreditCard size={13} /> Pay All
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                ) : activeTab === 'fine' ? (
                    /* FINES - All fine records */
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center mb-1">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Fine Records</h3>
                                <p className="text-xs text-slate-400 mt-0.5">All fines assigned to your account</p>
                            </div>
                        </div>
                        {fineRecords.length === 0 ? (
                            <div className="text-center text-slate-400 py-16">
                                <AlertCircle size={40} className="mx-auto mb-3 text-slate-200" />
                                <div className="font-semibold text-sm">No fines on your account</div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                        <th className="px-4 py-2 font-bold">S.No.</th>
                                        <th className="px-4 py-2 font-bold">Date</th>
                                        <th className="px-4 py-2 font-bold">Description</th>
                                        <th className="px-4 py-2 font-bold">Status</th>
                                        <th className="px-4 py-2 font-bold text-right">Amount</th>
                                        <th className="px-4 py-2 font-bold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {fineRecords.map((row, idx) => (
                                        <tr key={row.id} className={`border-b hover:bg-orange-50 ${row.status !== 'Paid' ? 'bg-orange-50/40' : 'bg-white'}`}>
                                            <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                                            <td className="px-4 py-2.5 text-gray-600">
                                                {new Date(row.due_date || row.paid_date || Date.now()).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-orange-600">{row.description || 'Fine'}</span>
                                                    <span className="text-[9px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">FINE</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <span style={{
                                                    padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase',
                                                    background: row.status === 'Paid' ? '#dcfce7' : '#ffedd5',
                                                    color: row.status === 'Paid' ? '#166534' : '#ea580c'
                                                }}>
                                                    {row.status === 'Paid' ? 'PAID' : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-bold text-orange-600">
                                                ₹{parseFloat(row.amount).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-2.5 text-center flex justify-center gap-2">
                                                {row.status !== 'Paid' && (
                                                    <button className="px-2 py-1 bg-blue-600 text-white text-[11px] font-bold rounded hover:bg-blue-700">
                                                        Pay
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FeeView;
