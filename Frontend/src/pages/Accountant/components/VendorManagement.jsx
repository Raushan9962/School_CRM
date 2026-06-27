import React, { useState } from 'react';
import { Building, Plus, Search, CheckCircle2, AlertCircle, Phone, Mail, IndianRupee, X, FileText, Trash2, DollarSign } from 'lucide-react';

const VendorManagement = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');

    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const vendors = [
        { id: 'VND-001', name: 'Saraswati Stationers', type: 'Stationery Supplier', contact: '+91 9876543210', email: 'contact@saraswati.com', pendingDue: 15000, status: 'Active' },
        { id: 'VND-002', name: 'Rapid City Travels', type: 'Bus Contractor', contact: '+91 9123456789', email: 'info@rapidcity.com', pendingDue: 0, status: 'Active' },
        { id: 'VND-003', name: 'Global Uniforms', type: 'Uniform Supplier', contact: '+91 9988776655', email: 'sales@globaluniforms.com', pendingDue: 45000, status: 'Active' }
    ];

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

    const handleSubmitVendor = (e) => {
        e.preventDefault();
        setIsVendorModalOpen(false);
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        setIsPaymentModalOpen(false);
        setUploadedFile(null);
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0].name);
        }
    };

    const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalPending = vendors.reduce((acc, curr) => acc + curr.pendingDue, 0);

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
                            <input type="text" defaultValue={selectedVendor?.name || ''} required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Vendor Name" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Vendor Category *</label>
                            <select defaultValue={selectedVendor?.type || ''} required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                                <option value="" disabled>Select Category</option>
                                {vendorTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                            <input type="tel" defaultValue={selectedVendor?.contact || ''} required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="+91 9876543210" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                            <input type="email" defaultValue={selectedVendor?.email || ''} className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="vendor@example.com" />
                        </div>
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
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-600">Pending Amount:</span>
                        <span className="text-sm font-bold text-red-600">₹{selectedVendor?.pendingDue.toLocaleString('en-IN') || '0'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (₹) *</label>
                            <input type="number" defaultValue={selectedVendor?.pendingDue || ''} required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="e.g. 5000" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode *</label>
                            <select required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
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
                                    <td className="px-4 py-2.5 font-bold text-slate-700">{vendor.name}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{vendor.type}</td>
                                    <td className="px-4 py-2.5 text-slate-500">{vendor.contact}</td>
                                    <td className="px-4 py-2.5 font-bold text-red-600">₹{vendor.pendingDue.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-2.5 text-right flex justify-end gap-2">
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
