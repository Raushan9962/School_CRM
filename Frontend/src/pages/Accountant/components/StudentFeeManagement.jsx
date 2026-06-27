import React, { useState, useRef } from 'react';
import { Search, Plus, FileText, CheckCircle2, Clock, AlertCircle, X, Download, User, Printer } from 'lucide-react';

const StudentFeeManagement = () => {
    const [activeTab, setActiveTab] = useState('list'); // list, assign, structure, invoice
    const [searchQuery, setSearchQuery] = useState('');
    
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    
    const receiptRef = useRef(null);

    const studentsFees = [
        { id: 'ST-001', name: 'Aarav Patel', fatherName: 'Rajesh Patel', class: '10-A', feeType: 'Term 1 Fee', due: 25000, paid: 25000, remaining: 0, status: 'Paid' },
        { id: 'ST-002', name: 'Diya Sharma', fatherName: 'Vikram Sharma', class: '9-B', feeType: 'Term 1 Fee', due: 22000, paid: 10000, remaining: 12000, status: 'Partial' },
        { id: 'ST-003', name: 'Rohan Gupta', fatherName: 'Anil Gupta', class: '10-A', feeType: 'Term 2 Fee', due: 25000, paid: 0, remaining: 25000, status: 'Unpaid' }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Paid': return 'bg-emerald-50 text-emerald-700';
            case 'Partial': return 'bg-amber-50 text-amber-700';
            case 'Unpaid': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleGenerateInvoice = (e) => {
        e.preventDefault();
        setMessage('Invoices generated successfully.');
        setActiveTab('list');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleOpenReceipt = (student) => {
        setSelectedStudent(student);
        setIsReceiptModalOpen(true);
    };

    const handlePrintReceipt = () => {
        if (!receiptRef.current) return;
        const printContent = receiptRef.current.innerHTML;
        const printWindow = window.open('', '_blank', 'width=800,height=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${selectedStudent.id}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { font-family: monospace; padding: 40px; background: white; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            @page { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const filteredFees = studentsFees.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalCollected = studentsFees.reduce((acc, curr) => acc + curr.paid, 0);
    const totalPending = studentsFees.reduce((acc, curr) => acc + curr.remaining, 0);

    // Assign Fee Structure Form
    if (activeTab === 'assign') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Assign Fee Structure</h2>
                        <p className="text-xs text-slate-500 mt-1">Assign a predefined fee structure to a student</p>
                    </div>
                    <button onClick={() => setActiveTab('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setActiveTab('list'); }} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Search Student *</label>
                        <input type="text" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. ST-001 or Name" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Fee Structure *</label>
                        <select required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                            <option value="">Select Structure</option>
                            <option value="1">Term 1 Fee (₹25,000)</option>
                            <option value="2">Term 2 Fee (₹25,000)</option>
                            <option value="3">Annual Transport Fee (₹12,000)</option>
                        </select>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setActiveTab('list')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1"><CheckCircle2 size={14} /> Assign Fee</button>
                    </div>
                </form>
            </div>
        );
    }

    // Fee Structures List
    if (activeTab === 'structure') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-4xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Manage Fee Structures</h2>
                        <p className="text-xs text-slate-500 mt-1">Create and manage standardized fee templates</p>
                    </div>
                    <button onClick={() => setActiveTab('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>
                
                <div className="flex justify-end mb-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 shadow-sm"><Plus size={14} /> Create New Structure</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold">Structure Name</th>
                                <th className="px-4 py-2 font-bold">Class / Grade</th>
                                <th className="px-4 py-2 font-bold">Total Amount</th>
                                <th className="px-4 py-2 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-2.5 font-bold text-slate-700">Term 1 Core Fee</td>
                                <td className="px-4 py-2.5 text-slate-600">Class 10</td>
                                <td className="px-4 py-2.5 font-bold text-slate-800">₹25,000</td>
                                <td className="px-4 py-2.5 text-right"><button className="text-blue-600 font-bold hover:underline">Edit</button></td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-2.5 font-bold text-slate-700">Annual Transport</td>
                                <td className="px-4 py-2.5 text-slate-600">All Classes</td>
                                <td className="px-4 py-2.5 font-bold text-slate-800">₹12,000</td>
                                <td className="px-4 py-2.5 text-right"><button className="text-blue-600 font-bold hover:underline">Edit</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Generate Invoice Form
    if (activeTab === 'invoice') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Generate Bulk Invoices</h2>
                        <p className="text-xs text-slate-500 mt-1">Generate invoices for an entire class or specific fee type</p>
                    </div>
                    <button onClick={() => setActiveTab('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>
                <form onSubmit={handleGenerateInvoice} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Select Class / Grade</label>
                            <select className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                                <option value="all">All Classes</option>
                                <option value="10">Class 10</option>
                                <option value="9">Class 9</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Select Fee Structure</label>
                            <select required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                                <option value="">Select Structure</option>
                                <option value="1">Term 1 Core Fee</option>
                                <option value="2">Annual Transport</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setActiveTab('list')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1"><FileText size={14} /> Generate</button>
                    </div>
                </form>
            </div>
        );
    }

    // Receipt Modal
    if (isReceiptModalOpen && selectedStudent) {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">View Receipt</h2>
                    </div>
                    <button onClick={() => setIsReceiptModalOpen(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Close</button>
                </div>
                
                <div ref={receiptRef} className="bg-white p-8 border border-slate-200">
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold uppercase tracking-widest mb-1">VidyaSetu School</h1>
                        <p className="text-xs text-gray-500">123 Education Lane, Learning City</p>
                        <h2 className="text-lg font-bold mt-4 border-b pb-2">FEE RECEIPT</h2>
                    </div>
                    
                    <div className="flex justify-between mb-6 text-sm">
                        <div>
                            <p><span className="font-bold">Student Name:</span> {selectedStudent.name}</p>
                            <p><span className="font-bold">Student ID:</span> {selectedStudent.id}</p>
                            <p><span className="font-bold">Class:</span> {selectedStudent.class}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
                            <p><span className="font-bold">Status:</span> {selectedStudent.status}</p>
                        </div>
                    </div>
                    
                    <table className="w-full text-left mb-6 text-sm">
                        <thead className="border-y border-black font-bold">
                            <tr>
                                <th className="py-2">Description</th>
                                <th className="py-2 text-right">Amount (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 border-b border-gray-200">{selectedStudent.feeType} (Total Due)</td>
                                <td className="py-2 text-right border-b border-gray-200">{selectedStudent.due.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr>
                                <td className="py-2 border-b border-gray-200 font-bold">Amount Paid</td>
                                <td className="py-2 text-right border-b border-gray-200 font-bold">{selectedStudent.paid.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-bold text-red-600">Remaining Balance</td>
                                <td className="py-2 text-right font-bold text-red-600">{selectedStudent.remaining.toLocaleString('en-IN')}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="mt-12 flex justify-between items-end text-xs font-bold">
                        <div><p>___________________</p><p className="mt-1">Parent Signature</p></div>
                        <div className="text-right"><p>___________________</p><p className="mt-1">Accountant Signature</p></div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button onClick={handlePrintReceipt} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1"><Printer size={14} /> Print Receipt</button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Student Fee Management</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage and assign fee structures to students</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('invoice')} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-xs font-bold hover:bg-slate-50 shadow-sm">
                        Generate Invoices
                    </button>
                    <button onClick={() => setActiveTab('structure')} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-xs font-bold hover:bg-slate-50 shadow-sm">
                        Fee Structures
                    </button>
                    <button onClick={() => setActiveTab('assign')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 shadow-sm">
                        <Plus size={14} /> Assign Fee
                    </button>
                </div>
            </div>

            {message && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} /> {message}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Fee Collected</p>
                    <p className="text-base font-bold text-emerald-600 m-0">₹{totalCollected.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Fee Pending</p>
                    <p className="text-base font-bold text-red-600 m-0">₹{totalPending.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                        <User size={16} className="text-blue-600" /> Fee Records
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-48 pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold">Student</th>
                                <th className="px-4 py-2 font-bold">Fee Type</th>
                                <th className="px-4 py-2 font-bold">Total Due</th>
                                <th className="px-4 py-2 font-bold">Paid</th>
                                <th className="px-4 py-2 font-bold">Remaining</th>
                                <th className="px-4 py-2 font-bold">Status</th>
                                <th className="px-4 py-2 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {filteredFees.map((student) => (
                                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5">
                                        <div className="font-bold text-slate-800">{student.name} <span className="text-slate-400 font-normal">({student.id})</span></div>
                                        <div className="text-[10px] text-slate-500">{student.class}</div>
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-slate-700">{student.feeType}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">₹{student.due.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 font-bold text-emerald-600">₹{student.paid.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 font-bold text-red-600">₹{student.remaining.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusStyle(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right flex justify-end gap-2">
                                        <button onClick={() => handleOpenReceipt(student)} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors">Receipt</button>
                                        <button className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition-colors border border-blue-100">Pay</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredFees.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">No fee records found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentFeeManagement;
