import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, CheckCircle2, AlertCircle, Phone, Mail, IndianRupee, X, FileText, Trash2, DollarSign } from 'lucide-react';
import apiFetch from '../../../services/api';

const VendorManagement = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await apiFetch('/accountant/vendors');
            const data = await res.json();
            if (data.success) {
                setVendors(data.data);
            }
        } catch (err) {
            console.error("Error fetching vendors:", err);
        } finally {
            setLoading(false);
        }
    };

    const vendorTypes = ['Stationery Supplier', 'Bus Contractor', 'Uniform Supplier', 'Maintenance Vendor', 'Event Management', 'IT Equipment'];

    const handleAddVendor = () => {
        setSelectedVendor(null);
        setIsVendorModalOpen(true);
    };

    const handleEditVendor = (vendor) => {
        setSelectedVendor(vendor);
        setIsVendorModalOpen(true);
    };

    const handlePayVendor = (vendor) => {
        setSelectedVendor(vendor);
        setIsPaymentModalOpen(true);
    };

    const handleSubmitVendor = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newVendor = {
            name: e.target.name.value,
            type: e.target.type.value,
            contact: e.target.contact.value,
            email: e.target.email.value,
            pending_due: e.target.pending_due.value,
            bank_name: e.target.bank_name.value,
            account_name: e.target.account_name.value,
            account_number: e.target.account_number.value,
            ifsc_code: e.target.ifsc_code.value,
            upi_id: e.target.upi_id.value,
        };
        try {
            const res = await apiFetch('/accountant/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVendor)
            });
            const data = await res.json();
            if (data.success) {
                fetchVendors();
                setIsVendorModalOpen(false);
            } else {
                alert((data.message || 'Failed to add vendor') + (data.error ? ' : ' + data.error : ''));
            }
        } catch (err) {
            console.error("Error adding vendor:", err);
            alert("Error adding vendor");
        }
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const paymentData = {
            amount: formData.get('amount'),
            paymentDate: formData.get('payment_date'),
            paymentMethod: formData.get('payment_method')
        };
        try {
            const res = await apiFetch(`/accountant/vendors/${selectedVendor.id}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
            const data = await res.json();
            if (data.success) {
                fetchVendors();
                setIsPaymentModalOpen(false);
                setUploadedFile(null);
            } else {
                alert(data.message || 'Failed to record payment');
            }
        } catch (err) {
            console.error("Error recording payment:", err);
            alert("Error recording payment");
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0].name);
        }
    };

    const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalPending = vendors.reduce((acc, curr) => acc + parseFloat(curr.pending_due || 0), 0);

    // Vendor Modal (Inline Form style)
    if (isVendorModalOpen) {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">{selectedVendor ? 'Edit Vendor' : 'Register New Vendor'}</h2>
                        <p className="text-xs text-slate-500 mt-1">Enter vendor details to maintain records</p>
                    </div>
                    <button 
                        onClick={() => setIsVendorModalOpen(false)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors"
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmitVendor} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Business Name *</label>
                            <input name="name" type="text" defaultValue={selectedVendor?.name || ''} required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Vendor Name" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Vendor Category *</label>
                            <select name="type" defaultValue={selectedVendor?.type || ''} required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                                <option value="" disabled>Select Category</option>
                                {vendorTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Contact No. *</label>
                            <input name="contact" type="tel" defaultValue={selectedVendor?.contact || ''} required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="+91 9876543210" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email ID</label>
                            <input name="email" type="email" defaultValue={selectedVendor?.email || ''} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="vendor@example.com" />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4 mt-2">
                        <h3 className="text-sm font-bold text-slate-700 mb-3">Bank Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                                <input name="bank_name" type="text" defaultValue={selectedVendor?.bank_name || ''} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. HDFC Bank" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Account Name</label>
                                <input name="account_name" type="text" defaultValue={selectedVendor?.account_name || ''} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Name on account" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                                <input name="account_number" type="text" defaultValue={selectedVendor?.account_number || ''} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Account No." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                                <input name="ifsc_code" type="text" defaultValue={selectedVendor?.ifsc_code || ''} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="IFSC Code" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID</label>
                            <input name="upi_id" type="text" defaultValue={selectedVendor?.upi_id || ''} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="vendor@upi" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Opening Pending Due (₹)</label>
                        <input name="pending_due" type="number" defaultValue={selectedVendor?.pending_due || 0} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="0" />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsVendorModalOpen(false)} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700">Save Vendor</button>
                    </div>
                </form>
            </div>
        );
    }

    // Payment Modal (Inline Form style)
    if (isPaymentModalOpen) {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Record Vendor Payment</h2>
                        <p className="text-xs text-slate-500 mt-1">Paying to: <span className="font-bold text-blue-600">{selectedVendor?.name}</span></p>
                    </div>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center mb-4">
                        <span className="text-xs font-semibold text-slate-600">Pending Due:</span>
                        <span className="text-sm font-bold text-red-600">₹{parseFloat(selectedVendor?.pending_due || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                        <h3 className="text-sm font-bold text-blue-800 mb-2">Vendor Bank Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-white p-3 rounded border border-blue-100 shadow-sm">
                                <span className="block font-bold text-slate-700 mb-1 border-b pb-1">Bank Transfer</span>
                                <div className="grid grid-cols-2 gap-1 mt-2 text-slate-600">
                                    <span className="font-semibold">Bank:</span> <span>{selectedVendor?.bank_name || 'N/A'}</span>
                                    <span className="font-semibold">Name:</span> <span>{selectedVendor?.account_name || 'N/A'}</span>
                                    <span className="font-semibold">A/c No:</span> <span className="font-mono font-bold">{selectedVendor?.account_number || 'N/A'}</span>
                                    <span className="font-semibold">IFSC:</span> <span className="font-mono">{selectedVendor?.ifsc_code || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-100 shadow-sm">
                                <span className="block font-bold text-slate-700 mb-1 border-b pb-1">UPI Details</span>
                                <div className="mt-2 text-slate-600">
                                    <span className="font-semibold block mb-1">UPI ID:</span> 
                                    <span className="font-mono font-bold text-sm bg-slate-50 px-2 py-1 rounded border">{selectedVendor?.upi_id || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (₹) *</label>
                            <input name="amount" type="number" required max={selectedVendor?.pending_due} defaultValue={selectedVendor?.pending_due} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date *</label>
                            <input name="payment_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
                            <select name="payment_method" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none bg-white">
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="UPI">UPI</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700">Confirm Payment</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Vendor Management</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage suppliers, contractors, and their payments</p>
                </div>
                <button 
                    onClick={handleAddVendor}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <Plus size={16} /> Add Vendor
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Vendors</p>
                    <p className="text-base font-bold text-slate-800 m-0">{vendors.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Pending Dues</p>
                    <p className="text-base font-bold text-red-600 m-0">₹{totalPending.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                        <Building size={16} className="text-blue-600" /> Vendor List
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
                                <th className="px-4 py-2 font-bold">Vendor Name</th>
                                <th className="px-4 py-2 font-bold">Category</th>
                                <th className="px-4 py-2 font-bold">Contact</th>
                                <th className="px-4 py-2 font-bold">Pending Dues</th>
                                <th className="px-4 py-2 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{vendor.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{vendor.type}</td>
                                    <td className="px-4 py-3 text-slate-600">{vendor.contact}</td>
                                    <td className="px-4 py-3 font-bold text-red-600">₹{parseFloat(vendor.pending_due || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEditVendor(vendor)} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors">Edit</button>
                                        <button onClick={() => handlePayVendor(vendor)} className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition-colors border border-blue-100">Pay</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVendors.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">No vendors found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorManagement;
