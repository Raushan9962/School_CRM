import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, FileText, CheckCircle2, Clock, AlertCircle, X, Download, User, Printer } from 'lucide-react';
import apiFetch from '../../../services/api';

const StudentFeeManagement = () => {
    const [activeTab, setActiveTab] = useState('list'); // list, assign, structure, invoice
    const [searchQuery, setSearchQuery] = useState('');
    
    const [studentsFees, setStudentsFees] = useState([]);
    const [feeStructures, setFeeStructures] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    
    const receiptRef = useRef(null);

    useEffect(() => {
        fetchStudentFees();
        fetchFeeStructures();
        fetchClasses();
    }, []);

    const fetchStudentFees = async () => {
        try {
            const res = await apiFetch('/accountant/student-fees');
            const data = await res.json();
            if (data.success) {
                setStudentsFees(data.data);
            }
        } catch (err) {
            console.error("Error fetching fees:", err);
        }
    };

    const fetchFeeStructures = async () => {
        try {
            const res = await apiFetch('/accountant/fee-structures');
            const data = await res.json();
            if (data.success) {
                setFeeStructures(data.data);
            }
        } catch (err) {
            console.error("Error fetching fee structures:", err);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await apiFetch('/accountant/classes');
            const data = await res.json();
            if (data.success) {
                setClasses(data.data);
            }
        } catch (err) {
            console.error("Error fetching classes:", err);
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Paid': return 'bg-emerald-50 text-emerald-700';
            case 'Partial': return 'bg-amber-50 text-amber-700';
            case 'Unpaid': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleCreateStructure = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            className: formData.get('class_name'),
            totalAmount: formData.get('total_amount')
        };
        try {
            const res = await apiFetch('/accountant/fee-structures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                showMessage('Fee structure created successfully.');
                fetchFeeStructures();
                e.target.reset();
            } else {
                alert(result.message || 'Failed to create structure');
            }
        } catch (err) {
            console.error(err);
            alert("Error creating structure");
        }
    };

    const handleAssignFee = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            studentId: formData.get('student_id'),
            feeStructureId: formData.get('fee_structure_id')
        };
        try {
            const res = await apiFetch('/accountant/student-fees/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                showMessage('Fee assigned successfully.');
                fetchStudentFees();
                setActiveTab('list');
            } else {
                alert(result.message || 'Failed to assign fee');
            }
        } catch (err) {
            console.error(err);
            alert("Error assigning fee");
        }
    };

    const handleGenerateInvoice = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            className: formData.get('class_name'),
            feeStructureId: formData.get('fee_structure_id')
        };
        try {
            const res = await apiFetch('/accountant/student-fees/bulk-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                showMessage(result.message || 'Invoices generated successfully.');
                fetchStudentFees();
                setActiveTab('list');
            } else {
                alert(result.message || 'Failed to generate invoices');
            }
        } catch (err) {
            console.error(err);
            alert("Error generating invoices");
        }
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
                    <title>Invoice - ${selectedStudent.student_name}</title>
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

    const filteredFees = studentsFees.filter(s => 
        (s.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.admission_number || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const totalCollected = studentsFees.reduce((acc, curr) => acc + parseFloat(curr.paid_amount || 0), 0);
    const totalPending = studentsFees.reduce((acc, curr) => acc + (parseFloat(curr.due_amount || 0) - parseFloat(curr.paid_amount || 0)), 0);

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
                <form onSubmit={handleAssignFee} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Student ID *</label>
                        <input type="number" name="student_id" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter Student ID" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Fee Structure *</label>
                        <select name="fee_structure_id" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                            <option value="">Select Structure</option>
                            {feeStructures.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.class_name}) - ₹{f.total_amount}</option>
                            ))}
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
                
                <form onSubmit={handleCreateStructure} className="mb-6 bg-slate-50 p-4 border border-slate-200 rounded flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Structure Name *</label>
                        <input name="name" type="text" required placeholder="e.g. Term 1 Fee" className="w-full px-3 py-2 text-sm rounded border border-slate-300 outline-none" />
                    </div>
                    <div className="w-32">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Class *</label>
                        <select name="class_name" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 outline-none bg-white">
                            <option value="">Select</option>
                            <option value="All Classes">All Classes</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Total (₹) *</label>
                        <input name="total_amount" type="number" required placeholder="0" className="w-full px-3 py-2 text-sm rounded border border-slate-300 outline-none" />
                    </div>
                    <button type="submit" className="h-9 flex items-center gap-1.5 px-4 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                        <Plus size={14} /> Create
                    </button>
                </form>

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
                            {feeStructures.map(fs => (
                                <tr key={fs.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 font-bold text-slate-700">{fs.name}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{fs.class_name}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">₹{parseFloat(fs.total_amount).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 text-right"><button className="text-blue-600 font-bold hover:underline">Edit</button></td>
                                </tr>
                            ))}
                            {feeStructures.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-slate-500">No fee structures defined.</td>
                                </tr>
                            )}
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
                            <label className="block text-xs font-bold text-slate-700 mb-1">Select Class</label>
                            <select name="class_name" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                <option value="">All Classes</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Select Fee Structure *</label>
                            <select name="fee_structure_id" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                                <option value="">Select Structure</option>
                                {feeStructures.map(f => (
                                    <option key={f.id} value={f.id}>{f.name} - ₹{f.total_amount}</option>
                                ))}
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
                        <h2 className="text-lg font-bold text-slate-800 m-0">View Invoice</h2>
                    </div>
                    <button onClick={() => setIsReceiptModalOpen(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Close</button>
                </div>
                
                <div ref={receiptRef} className="bg-white p-8 border border-slate-200">
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold uppercase tracking-widest mb-1">VidyaSetu School</h1>
                        <h2 className="text-lg font-bold mt-4 border-b pb-2">FEE INVOICE</h2>
                    </div>
                    
                    <div className="flex justify-between mb-6 text-sm">
                        <div>
                            <p><span className="font-bold">Student Name:</span> {selectedStudent.student_name}</p>
                            <p><span className="font-bold">Admission No:</span> {selectedStudent.admission_number || 'N/A'}</p>
                            <p><span className="font-bold">Class:</span> {selectedStudent.class_name || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-bold">Date:</span> {new Date(selectedStudent.created_at).toLocaleDateString()}</p>
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
                                <td className="py-2 border-b border-gray-200">{selectedStudent.fee_type} (Total Due)</td>
                                <td className="py-2 text-right border-b border-gray-200">{parseFloat(selectedStudent.due_amount).toLocaleString('en-IN')}</td>
                            </tr>
                            <tr>
                                <td className="py-2 border-b border-gray-200 font-bold">Amount Paid</td>
                                <td className="py-2 text-right border-b border-gray-200 font-bold">{parseFloat(selectedStudent.paid_amount).toLocaleString('en-IN')}</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-bold text-red-600">Remaining Balance</td>
                                <td className="py-2 text-right font-bold text-red-600">{(parseFloat(selectedStudent.due_amount) - parseFloat(selectedStudent.paid_amount)).toLocaleString('en-IN')}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="mt-12 flex justify-between items-end text-xs font-bold">
                        <div><p>___________________</p><p className="mt-1">Parent Signature</p></div>
                        <div className="text-right"><p>___________________</p><p className="mt-1">Accountant Signature</p></div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button onClick={handlePrintReceipt} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1"><Printer size={14} /> Print</button>
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
                            placeholder="Search student..." 
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
                            {filteredFees.map((student) => {
                                const due = parseFloat(student.due_amount);
                                const paid = parseFloat(student.paid_amount);
                                const remaining = due - paid;
                                return (
                                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5">
                                        <div className="font-bold text-slate-800">{student.student_name} <span className="text-slate-400 font-normal">({student.admission_number || 'N/A'})</span></div>
                                        <div className="text-[10px] text-slate-500">{student.class_name || 'N/A'}</div>
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-slate-700">{student.fee_type}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">₹{due.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 font-bold text-emerald-600">₹{paid.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 font-bold text-red-600">₹{remaining.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusStyle(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right flex justify-end gap-2">
                                        <button onClick={() => handleOpenReceipt(student)} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors">Invoice</button>
                                        <button className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition-colors border border-blue-100">Pay</button>
                                    </td>
                                </tr>
                            )})}
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
