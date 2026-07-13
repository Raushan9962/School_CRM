import React, { useState, useRef } from 'react';
import { ScanLine, User, BookOpen, AlertCircle, CheckCircle2, RotateCcw, Send, Repeat, Camera } from 'lucide-react';
import apiFetch from '../../../services/api';
import BarcodeScannerComponent from './BarcodeScannerComponent';

const BookIssueReturn = () => {
    const [activeTab, setActiveTab] = useState('issue'); // 'issue' | 'return'
    
    // Issue State
    const [memberQuery, setMemberQuery] = useState('');
    const [member, setMember] = useState(null);
    const [memberError, setMemberError] = useState('');
    const [bookBarcode, setBookBarcode] = useState('');
    const [issueStatus, setIssueStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    // Return State
    const [transactionId, setTransactionId] = useState('');
    const [returnCondition, setReturnCondition] = useState('Good');
    const [returnRemarks, setReturnRemarks] = useState('');
    const [returnStatus, setReturnStatus] = useState(null);

    // Camera Scanner State
    const [showScanner, setShowScanner] = useState(null); // 'member' | 'issueBook' | 'return'

    const barcodeInputRef = useRef(null);

    const handleMemberSearch = async (e) => {
        e.preventDefault();
        if(!memberQuery.trim()) return;
        setMember(null);
        setMemberError('');
        setIssueStatus(null);
        
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch(`/librarian/search-member?query=${encodeURIComponent(memberQuery)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                setMember(data.data);
                setTimeout(() => {
                    if (barcodeInputRef.current) barcodeInputRef.current.focus();
                }, 100);
            } else {
                setMemberError(data.message || 'Member not found');
            }
        } catch (err) {
            setMemberError('Server error while searching');
        }
    };

    const handleIssueBook = async (e) => {
        e.preventDefault();
        if(!bookBarcode.trim() || !member) return;
        setIssueStatus(null);
        
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/librarian/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: member.user_id, barcode: bookBarcode })
            });
            const data = await res.json();
            
            if (data.success) {
                setIssueStatus({ type: 'success', message: `Book successfully issued until ${data.dueDate}` });
                setBookBarcode('');
                // Refresh member to show updated active issues
                const searchEvent = { preventDefault: () => {} };
                handleMemberSearch(searchEvent);
            } else {
                setIssueStatus({ type: 'error', message: data.message || 'Failed to issue book' });
            }
        } catch (err) {
            setIssueStatus({ type: 'error', message: 'Server connection failed' });
        }
    };

    const handleReturnBook = async (e) => {
        e.preventDefault();
        if(!transactionId.trim()) return;
        setReturnStatus(null);

        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/librarian/return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ transaction_id: transactionId, condition: returnCondition, remarks: returnRemarks })
            });
            const data = await res.json();
            
            if (data.success) {
                let msg = 'Book returned successfully!';
                if (data.fine > 0) msg += ` Fine applied: ₹${data.fine}`;
                setReturnStatus({ type: 'success', message: msg });
                setTransactionId('');
                setReturnRemarks('');
                setReturnCondition('Good');
            } else {
                setReturnStatus({ type: 'error', message: data.message || 'Failed to return book' });
            }
        } catch (err) {
            setReturnStatus({ type: 'error', message: 'Server connection failed' });
        }
    };

    const handleCameraScan = (decodedText) => {
        if (showScanner === 'member') {
            setMemberQuery(decodedText);
            setShowScanner(null);
            // Auto submit member search
            setTimeout(() => document.getElementById('memberSearchBtn')?.click(), 100);
        } else if (showScanner === 'issueBook') {
            setBookBarcode(decodedText);
            setShowScanner(null);
            // Auto submit book issue
            setTimeout(() => document.getElementById('issueBookBtn')?.click(), 100);
        } else if (showScanner === 'return') {
            setTransactionId(decodedText);
            setShowScanner(null);
        }
    };

    return (
        <div className="animate-fade-in space-y-4">
            {/* Camera Scanner Modal */}
            {showScanner && (
                <BarcodeScannerComponent 
                    title={showScanner === 'member' ? "Scan Member ID Card" : "Scan Book Barcode"}
                    onScan={handleCameraScan} 
                    onClose={() => setShowScanner(null)} 
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Issue / Return Books</h1>
                    <p className="text-slate-500 text-xs mt-1">Scan ID cards and book barcodes for quick processing</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('issue')}
                        className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${activeTab === 'issue' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        Issue Book
                    </button>
                    <button 
                        onClick={() => setActiveTab('return')}
                        className={`px-3 py-1.5 border rounded text-xs font-bold shadow-sm ${activeTab === 'return' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        Return Book
                    </button>
                </div>
            </div>

            {activeTab === 'issue' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* Step 1: Scan Member */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white rounded shadow-sm border border-slate-200 p-4">
                            <label className="block text-xs font-bold text-slate-700 mb-2">1. Scan Member Identity</label>
                            <form onSubmit={handleMemberSearch} className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                    <ScanLine size={16} />
                                </div>
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="Scan/Enter Student Admission No or Teacher ID..." 
                                    value={memberQuery}
                                    onChange={(e) => setMemberQuery(e.target.value)}
                                    className="w-full pl-9 pr-24 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-500 outline-none text-sm text-slate-800 font-medium"
                                />
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowScanner('member')}
                                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                                        title="Use Camera"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <button id="memberSearchBtn" type="submit" className="px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-900">Search</button>
                                </div>
                            </form>
                            {memberError && (
                                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 p-2 rounded">
                                    <AlertCircle size={14} /> {memberError}
                                </div>
                            )}
                        </div>

                        {member && (
                            <div className="bg-white rounded shadow-sm border border-slate-200 p-4">
                                <div className="flex gap-3 items-start mb-4 pb-3 border-b border-slate-100">
                                    <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
                                        {member.image ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" /> : <User size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-800 m-0 text-sm">{member.name}</h3>
                                                <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block border border-slate-200">{member.role}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase m-0">Pending Fine</p>
                                                <p className={`text-sm font-bold m-0 ${member.pendingFine > 0 ? 'text-red-600' : 'text-emerald-600'}`}>₹ {member.pendingFine}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-y-2 text-xs mb-4">
                                    {member.role === 'Student' ? (
                                        <>
                                            <p className="m-0 text-slate-500">Class: <strong className="text-slate-800">{member.class_name} {member.section}</strong></p>
                                            <p className="m-0 text-slate-500">Adm No: <strong className="text-slate-800">{member.admission_no}</strong></p>
                                            <p className="m-0 text-slate-500 col-span-2">Parents: <strong className="text-slate-800">{member.father_name} / {member.mother_name}</strong></p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="m-0 text-slate-500">Dept: <strong className="text-slate-800">{member.department}</strong></p>
                                            <p className="m-0 text-slate-500">Emp ID: <strong className="text-slate-800">{member.employee_id}</strong></p>
                                        </>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-700 mb-2 flex justify-between">
                                        Active Issues <span className="bg-slate-100 text-slate-600 px-1.5 rounded">{member.activeIssues?.length || 0}</span>
                                    </h4>
                                    {member.activeIssues?.length > 0 ? (
                                        <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                                            {member.activeIssues.map(issue => {
                                                const isOverdue = new Date(issue.due_on) < new Date();
                                                return (
                                                    <div key={issue.id} className={`p-2 rounded border flex justify-between items-center text-xs ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                                        <div>
                                                            <p className="font-bold text-slate-800 m-0">{issue.title}</p>
                                                            <p className="text-[10px] text-slate-500 m-0">ID: {issue.barcode}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] text-slate-400 uppercase font-bold m-0">Due</p>
                                                            <p className={`font-bold m-0 ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>{new Date(issue.due_on).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded">No active books.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Scan Book */}
                    <div className="md:col-span-1">
                        <div className={`bg-white rounded shadow-sm border border-slate-200 p-5 ${!member ? 'opacity-60 pointer-events-none grayscale-[50%]' : ''}`}>
                            <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">2. Scan Book to Issue</h3>
                            
                            <form onSubmit={handleIssueBook} className="relative mb-4">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                    <BookOpen size={16} className={member ? "animate-pulse text-emerald-500" : ""} />
                                </div>
                                <input 
                                    ref={barcodeInputRef}
                                    type="text" 
                                    placeholder={member ? "Scan Book Barcode..." : "Waiting for member selection..."}
                                    value={bookBarcode}
                                    onChange={(e) => setBookBarcode(e.target.value)}
                                    className="w-full pl-9 pr-20 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-500 outline-none text-sm text-slate-800 font-medium"
                                />
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button 
                                        type="button" 
                                        disabled={!member}
                                        onClick={() => setShowScanner('issueBook')}
                                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                        title="Use Camera"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <button id="issueBookBtn" type="submit" disabled={!member} className="px-3 py-1 bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded hover:bg-slate-900">Issue</button>
                                </div>
                            </form>

                            {issueStatus && (
                                <div className={`p-3 rounded text-xs flex items-start gap-2 ${issueStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {issueStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <div>
                                        <p className="font-bold m-0">{issueStatus.type === 'success' ? 'Issued successfully!' : 'Failed to issue'}</p>
                                        <p className="m-0 mt-0.5">{issueStatus.message}</p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-center py-6 bg-slate-50 border border-slate-100 border-dashed rounded text-slate-400">
                                <div className="text-center">
                                    <ScanLine size={32} className={`mx-auto mb-2 ${member ? 'text-emerald-500 opacity-50' : 'opacity-30'}`} />
                                    <p className="text-xs px-6 font-medium">
                                        {member ? "Point your scanner at the book barcode. It will auto-submit." : "Please scan a member card first."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'return' && (
                <div className="bg-white rounded shadow-sm border border-slate-200 p-5 md:w-2/3 mx-auto mt-4">
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                        <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded flex items-center justify-center">
                            <RotateCcw size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800 m-0">Process Return</h2>
                            <p className="text-xs text-slate-500 m-0">Scan barcode or enter transaction ID</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleReturnBook} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Transaction ID / Barcode *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                    <ScanLine size={16} />
                                </div>
                                <input 
                                    required
                                    autoFocus
                                    type="text" 
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="e.g. TR-1024 or scan barcode"
                                    className="w-full pl-9 pr-12 px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-500 outline-none text-sm font-medium"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowScanner('return')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                                    title="Use Camera"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Book Condition</label>
                                <select 
                                    value={returnCondition}
                                    onChange={(e) => setReturnCondition(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-slate-500 outline-none text-sm"
                                >
                                    <option value="Good">Good / Normal</option>
                                    <option value="Damaged">Damaged (Penalty applies)</option>
                                    <option value="Lost">Lost (Full cost applies)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks (Optional)</label>
                                <input 
                                    type="text" 
                                    value={returnRemarks}
                                    onChange={(e) => setReturnRemarks(e.target.value)}
                                    placeholder="Any notes..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-100 flex justify-end mt-4">
                            <button type="submit" className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-900 flex items-center gap-1.5 shadow-sm">
                                <CheckCircle2 size={14} /> Complete Return
                            </button>
                        </div>
                    </form>
                    
                    {returnStatus && (
                        <div className={`mt-4 p-3 rounded text-xs flex items-start gap-2 ${returnStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {returnStatus.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                            <div>
                                <p className="font-bold m-0">{returnStatus.type === 'success' ? 'Return Processed' : 'Return Failed'}</p>
                                <p className="m-0 mt-0.5">{returnStatus.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookIssueReturn;
