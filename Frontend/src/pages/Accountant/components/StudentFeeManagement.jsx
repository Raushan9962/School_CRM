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
    const [editingStructureId, setEditingStructureId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', totalAmount: '' });
    const [selectedClassForBulk, setSelectedClassForBulk] = useState('');
    const [selectedFeeStructuresForBulk, setSelectedFeeStructuresForBulk] = useState([]);
    const [isFeeDropdownOpen, setIsFeeDropdownOpen] = useState(false);
    
    // Payment Modal State
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [selectedStudentForPay, setSelectedStudentForPay] = useState(null);
    const [paymentFormData, setPaymentFormData] = useState({ payment_method: 'Cash', transaction_ref: '' });
    
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

    const handleOpenPayModal = (student) => {
        setSelectedStudentForPay(student);
        setPaymentFormData({ payment_method: 'Cash', transaction_ref: '' });
        setIsPayModalOpen(true);
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        
        // Find all unpaid or partial fees for this student
        const feesToPay = studentsFees.filter(f => 
            f.student_name === selectedStudentForPay.student_name && 
            f.admission_number === selectedStudentForPay.admission_number &&
            f.status !== 'Paid'
        );

        if (feesToPay.length === 0) {
            alert("No pending fees to pay.");
            setIsPayModalOpen(false);
            return;
        }

        try {
            // Process payment for all unpaid fees
            await Promise.all(feesToPay.map(fee => 
                apiFetch(`/accountant/student-fees/${fee.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        status: 'Paid', 
                        payment_method: paymentFormData.payment_method,
                        transaction_ref: paymentFormData.transaction_ref
                    })
                })
            ));
            
            showMessage('Payment processed successfully.');
            fetchStudentFees();
            setIsPayModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Error processing payment");
        }
    };

    const handleGenerateInvoice = async (e) => {
        e.preventDefault();
        if (selectedFeeStructuresForBulk.length === 0) {
            alert('Please select at least one fee structure.');
            return;
        }
        const data = {
            className: selectedClassForBulk,
            feeStructureIds: selectedFeeStructuresForBulk
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
        if (student.status === 'TEMPLATE') {
            setSelectedStudent({ info: student, fees: [student] });
        } else {
            const studentFeesList = studentsFees.filter(s => s.student_name === student.student_name && s.admission_number === student.admission_number);
            setSelectedStudent({ info: student, fees: studentFeesList });
        }
        setIsReceiptModalOpen(true);
    };

    const handlePrintReceipt = () => {
        if (!receiptRef.current) return;
        const printContent = receiptRef.current.innerHTML;
        const printWindow = window.open('', '_blank', 'width=800,height=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${selectedStudent.info ? selectedStudent.info.student_name : 'Student'}</title>
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
                                    <td className="px-4 py-2.5 font-bold text-slate-700">
                                        {editingStructureId === fs.id ? (
                                            <input type="text" className="border rounded p-1 w-full text-sm font-normal" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                                        ) : (
                                            fs.name
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-600">{fs.class_name}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">
                                        {editingStructureId === fs.id ? (
                                            <input type="number" className="border rounded p-1 w-full text-sm font-normal" value={editFormData.totalAmount} onChange={e => setEditFormData({...editFormData, totalAmount: e.target.value})} />
                                        ) : (
                                            `₹${parseFloat(fs.total_amount).toLocaleString('en-IN')}`
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        {editingStructureId === fs.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => {
                                                    fetch(`\${import.meta.env.VITE_API_BASE_URL}/accountant/fee-structures/${fs.id}`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                                                        body: JSON.stringify(editFormData)
                                                    }).then(r => r.json()).then(d => {
                                                        if(d.success) { showMessage('Updated successfully.'); setEditingStructureId(null); fetchFeeStructures(); }
                                                        else showMessage(d.message || 'Update failed', 'error');
                                                    });
                                                }} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Save</button>
                                                <button onClick={() => setEditingStructureId(null)} className="text-xs bg-slate-300 text-slate-700 px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => {
                                                    setEditingStructureId(fs.id);
                                                    setEditFormData({ name: fs.name, totalAmount: fs.total_amount });
                                                }} className="text-blue-600 font-bold hover:underline">Edit</button>
                                                <button onClick={() => {
                                                    const templateObj = {
                                                        id: `FS-${fs.id}`,
                                                        student_name: 'Template Invoice',
                                                        class_name: fs.class_name,
                                                        admission_number: 'N/A',
                                                        created_at: new Date().toISOString(),
                                                        status: 'TEMPLATE',
                                                        fee_type: fs.name,
                                                        due_amount: fs.total_amount,
                                                        paid_amount: 0
                                                    };
                                                    setSelectedStudent({ info: templateObj, fees: [templateObj] });
                                                    setIsReceiptModalOpen(true);
                                                }} className="text-emerald-600 font-bold hover:underline flex items-center gap-1">Invoice</button>
                                            </div>
                                        )}
                                    </td>
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
        let displayStructures = [];
        if (selectedClassForBulk) {
            const classStructures = feeStructures.filter(f => f.class_name === selectedClassForBulk);
            displayStructures = classStructures.map(f => ({ ...f, ids: [f.id] }));
        } else {
            const grouped = {};
            feeStructures.forEach(f => {
                if (!grouped[f.name]) {
                    grouped[f.name] = { ...f, ids: [] };
                }
                grouped[f.name].ids.push(f.id);
            });
            displayStructures = Object.values(grouped);
        }

        const handleSelectAllFees = () => {
            const allVisibleIds = displayStructures.flatMap(f => f.ids);
            const isAllSelected = allVisibleIds.every(id => selectedFeeStructuresForBulk.includes(id));
            if (isAllSelected && allVisibleIds.length > 0) {
                setSelectedFeeStructuresForBulk([]);
            } else {
                setSelectedFeeStructuresForBulk(allVisibleIds);
            }
        };

        const toggleFeeSelection = (ids) => {
            const isSelected = ids.every(id => selectedFeeStructuresForBulk.includes(id));
            if (isSelected) {
                setSelectedFeeStructuresForBulk(selectedFeeStructuresForBulk.filter(feeId => !ids.includes(feeId)));
            } else {
                const newIds = ids.filter(id => !selectedFeeStructuresForBulk.includes(id));
                setSelectedFeeStructuresForBulk([...selectedFeeStructuresForBulk, ...newIds]);
            }
        };

        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Generate Bulk Invoices</h2>
                        <p className="text-xs text-slate-500 mt-1">Generate invoices for an entire class or specific fee types</p>
                    </div>
                    <button onClick={() => setActiveTab('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>
                <form onSubmit={handleGenerateInvoice} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Select Class</label>
                            <select 
                                name="class_name" 
                                value={selectedClassForBulk}
                                onChange={(e) => {
                                    setSelectedClassForBulk(e.target.value);
                                    setSelectedFeeStructuresForBulk([]); // Reset on class change
                                }}
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">All Classes</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Select Fee Structures *</label>
                            <div 
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 bg-white cursor-pointer flex justify-between items-center"
                                onClick={() => setIsFeeDropdownOpen(!isFeeDropdownOpen)}
                            >
                                <span className="truncate">
                                    {selectedFeeStructuresForBulk.length === 0 
                                        ? 'Select Structures' 
                                        : `${displayStructures.filter(f => f.ids.every(id => selectedFeeStructuresForBulk.includes(id))).length} Selected`}
                                </span>
                                <span>▼</span>
                            </div>
                            
                            {isFeeDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded shadow-lg max-h-60 overflow-y-auto">
                                    <div className="p-2 border-b border-slate-100">
                                        <button 
                                            type="button" 
                                            onClick={handleSelectAllFees}
                                            className="text-xs font-bold text-blue-600 hover:underline w-full text-left"
                                        >
                                            {displayStructures.length > 0 && displayStructures.flatMap(f => f.ids).every(id => selectedFeeStructuresForBulk.includes(id)) ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    {displayStructures.length === 0 ? (
                                        <div className="p-3 text-xs text-slate-500 text-center">No fee structures available.</div>
                                    ) : (
                                        displayStructures.map((f, index) => (
                                            <div 
                                                key={index} 
                                                className="px-3 py-2 flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
                                                onClick={() => toggleFeeSelection(f.ids)}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={f.ids.every(id => selectedFeeStructuresForBulk.includes(id))} 
                                                    readOnly 
                                                    className="w-3.5 h-3.5"
                                                />
                                                <span className="text-sm text-slate-700">{f.name} - ₹{f.total_amount}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
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
        const info = selectedStudent.info || selectedStudent;
        const fees = selectedStudent.fees || [selectedStudent];
        const totalDue = fees.reduce((sum, f) => sum + parseFloat(f.due_amount || 0), 0);
        const totalPaid = fees.reduce((sum, f) => sum + parseFloat(f.paid_amount || 0), 0);
        const totalRemaining = totalDue - totalPaid;
        const invoiceStatus = totalRemaining <= 0 ? 'PAID' : (totalPaid > 0 ? 'PARTIAL' : 'PENDING');

        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">View Invoice</h2>
                    </div>
                    <button onClick={() => setIsReceiptModalOpen(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Close</button>
                </div>
                
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');`}</style>
                <div className="overflow-auto pb-4">
                    <div ref={receiptRef} className="bg-white font-mono text-[11px] text-black mx-auto"
                        style={{ width: '384px', border: '2px solid black', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        
                        {/* Top header — full width */}
                        <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>{JSON.parse(localStorage.getItem('user') || '{}').schoolName || 'VidyaSetu'}</div>
                                <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px', color: '#555' }}>FEE INVOICE / RECEIPT</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '28px', fontFamily: '"Libre Barcode 39", monospace', lineHeight: 1 }}>*INV-{info.id || '0000'}*</div>
                                <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px' }}>ID: {info.id || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Billed To */}
                        <div style={{ borderRight: '1px solid black', borderBottom: '1px solid black', padding: '12px 14px' }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#888' }}>Billed To</div>
                            <div style={{ fontWeight: 700, fontSize: '13px' }}>{info.student_name || 'Class: ' + (info.class_name || 'N/A')}</div>
                            <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{info.student_name ? `ID: ${info.admission_number || 'N/A'} · Student` : 'Fee Structure Invoice'}</div>
                        </div>

                        {/* Payment Info */}
                        <div style={{ borderBottom: '1px solid black', padding: '12px 14px', background: '#f9fafb' }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#888' }}>Payment Info</div>
                            <div style={{ fontSize: '10px' }}>Date: {new Date(info.created_at || Date.now()).toLocaleDateString()}</div>
                            <div style={{ fontWeight: 700, fontSize: '12px', marginTop: '4px', color: totalRemaining <= 0 ? '#16a34a' : (totalPaid > 0 ? '#ca8a04' : '#dc2626') }}>
                                STATUS: {invoiceStatus}
                            </div>
                        </div>

                        {/* Issuer — full width */}
                        <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid black', padding: '8px 14px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '10px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#888', marginRight: '4px' }}>Issuer:</span>
                            <span style={{ fontWeight: 700 }}>{JSON.parse(localStorage.getItem('user') || '{}').schoolName || 'VidyaSetu School'}</span>
                            <span style={{ color: '#555' }}>· 123 Education Lane, Learning City · Delhi 110001</span>
                        </div>

                        {/* Fee Table — full width */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                <thead>
                                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid black' }}>
                                        <th style={{ padding: '6px 10px', textAlign: 'left', borderRight: '1px solid black', fontWeight: 700 }}>Description</th>
                                        <th style={{ padding: '6px 10px', borderRight: '1px solid black', width: '70px', fontWeight: 700 }}>Status</th>
                                        <th style={{ padding: '6px 10px', textAlign: 'right', width: '80px', fontWeight: 700 }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fees.map((fee, idx) => {
                                        const due = parseFloat(fee.due_amount || 0);
                                        const paid = parseFloat(fee.paid_amount || 0);
                                        const rem = due - paid;
                                        const fStatus = rem <= 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'PENDING');
                                        return (
                                        <tr key={idx} style={{ borderBottom: '1px solid black' }}>
                                            <td style={{ padding: '8px 10px', borderRight: '1px solid black' }}>
                                                <div style={{ fontWeight: 700 }}>{fee.fee_type || fee.description || 'Academic Fee'}</div>
                                            </td>
                                            <td style={{ padding: '8px 10px', borderRight: '1px solid black', fontWeight: 700, fontSize: '10px' }}>
                                                {fStatus}
                                            </td>
                                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                                                ₹{due.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Summary */}
                        <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', borderBottom: '2px solid black' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '11px' }}>
                                <span>Total Amount:</span>
                                <span>₹{totalDue.toLocaleString('en-IN')}</span>
                            </div>
                            {totalPaid > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '11px', color: '#16a34a' }}>
                                    <span>Amount Paid:</span>
                                    <span>- ₹{totalPaid.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '14px', fontWeight: 900, marginTop: '4px', paddingTop: '6px', borderTop: '1px solid #ccc' }}>
                                <span>Balance Due:</span>
                                <span>₹{totalRemaining.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Footer Barcode */}
                        <div style={{ gridColumn: '1 / -1', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '32px', fontFamily: '"Libre Barcode 39", monospace', lineHeight: 1 }}>*{info.id || '0000'}*</div>
                            <div style={{ textAlign: 'right', fontSize: '9px', color: '#666' }}>
                                <div style={{ fontWeight: 700, color: '#000', marginBottom: '2px' }}>VidyaSetu School</div>
                                <div>123 Education Lane</div>
                                <div>Thank you!</div>
                            </div>
                        </div>
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
                            {Object.values(filteredFees.reduce((acc, curr) => {
                                const key = curr.student_name + '_' + curr.admission_number;
                                if (!acc[key]) {
                                    acc[key] = {
                                        ...curr,
                                        due_amount: 0,
                                        paid_amount: 0,
                                        fee_type: 'Consolidated Fees'
                                    };
                                }
                                acc[key].due_amount += parseFloat(curr.due_amount || 0);
                                acc[key].paid_amount += parseFloat(curr.paid_amount || 0);
                                return acc;
                            }, {})).map((student) => {
                                const due = student.due_amount;
                                const paid = student.paid_amount;
                                const remaining = due - paid;
                                const status = remaining <= 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'UNPAID');
                                
                                return (
                                <tr key={student.student_name + student.admission_number} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5">
                                        <div className="font-bold text-slate-800">{student.student_name} <span className="text-slate-400 font-normal">({student.admission_number || 'N/A'})</span></div>
                                        <div className="text-[10px] text-slate-500">{student.class_name || 'N/A'}</div>
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-slate-700">{student.fee_type}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">₹{due.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 font-bold text-emerald-600">₹{paid.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 font-bold text-red-600">₹{remaining.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusStyle(status)}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right flex justify-end gap-2">
                                        <button onClick={() => handleOpenReceipt(student)} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors">Invoice</button>
                                        {remaining > 0 && (
                                            <button onClick={() => handleOpenPayModal(student)} className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition-colors border border-blue-100">Pay</button>
                                        )}
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

            {/* Payment Modal */}
            {isPayModalOpen && selectedStudentForPay && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">Verify & Process Payment</h3>
                            <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleProcessPayment} className="p-4 space-y-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Student Details</div>
                                <div className="font-bold text-slate-800">{selectedStudentForPay.student_name}</div>
                                <div className="text-xs text-slate-500">ID: {selectedStudentForPay.admission_number || 'N/A'}</div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
                                <select 
                                    value={paymentFormData.payment_method}
                                    onChange={(e) => setPaymentFormData({...paymentFormData, payment_method: e.target.value})}
                                    className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white" required>
                                    <option value="Cash">Cash</option>
                                    <option value="Online">Online / UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Ref / Cheque No. (Optional)</label>
                                <input 
                                    type="text" 
                                    value={paymentFormData.transaction_ref}
                                    onChange={(e) => setPaymentFormData({...paymentFormData, transaction_ref: e.target.value})}
                                    placeholder="e.g. TXN-123456" 
                                    className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsPayModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Confirm Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFeeManagement;
