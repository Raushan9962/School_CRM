import React, { useState, useEffect } from 'react';
import { Plus, Trash2, IndianRupee } from 'lucide-react';

const FeeSettings = () => {
    const [fees, setFees] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        class_id: '',
        fee_type: '',
        amount: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [feesRes, classesRes] = await Promise.all([
                fetch('http://localhost:5000/api/admission/fee-structures'),
                fetch('http://localhost:5000/api/classes')
            ]);
            const feesData = await feesRes.json();
            const classesData = await classesRes.json();
            
            if (feesData.success) setFees(feesData.fees);
            if (Array.isArray(classesData)) setClasses(classesData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/admission/fee-structures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (data.success) {
                setShowForm(false);
                setFormData({ class_id: '', fee_type: '', amount: '' });
                fetchData();
            } else {
                alert(data.message || 'Failed to add fee.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this fee structure?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admission/fee-structures/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading fee settings...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Class Fee Settings</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-2"
                >
                    <Plus size={16} /> Add New Fee
                </button>
            </div>
            
            <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg text-blue-800 mb-6 text-sm">
                <p>Configure the fees for each class. When an admission request is approved, an invoice is generated dynamically based on these settings for the requested class. If no fees are configured for a class, a default ₹5000 admission fee will be applied.</p>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="font-bold mb-4">Add Fee Structure</h3>
                    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                            <select required name="class_id" value={formData.class_id} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value="">Select Class...</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label>
                            <input required type="text" name="fee_type" placeholder="e.g., Admission Fee, Library Fee" value={formData.fee_type} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                            <input required type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-gray-600">Class</th>
                            <th className="px-4 py-3 font-semibold text-gray-600">Fee Type</th>
                            <th className="px-4 py-3 font-semibold text-gray-600">Amount (₹)</th>
                            <th className="px-4 py-3 font-semibold text-gray-600 w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">No custom fee structures defined.</td>
                            </tr>
                        ) : (
                            fees.map(fee => (
                                <tr key={fee.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{fee.class_name} - {fee.class_section}</td>
                                    <td className="px-4 py-3">{fee.fee_type}</td>
                                    <td className="px-4 py-3">₹{parseFloat(fee.amount).toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => handleDelete(fee.id)}
                                            className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeeSettings;
