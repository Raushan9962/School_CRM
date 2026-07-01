import React, { useState, useEffect } from 'react';
import { Plus, Trash2, IndianRupee, Edit } from 'lucide-react';

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
    const [editingFeeId, setEditingFeeId] = useState(null);
    const [editFormData, setEditFormData] = useState({ fee_type: '', amount: '' });

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

    const handleUpdateFee = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admission/fee-structures/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(editFormData)
            });
            const data = await res.json();
            if (data.success) {
                setEditingFeeId(null);
                fetchData();
            } else {
                alert(data.message || 'Failed to update');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating fee');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Class Fee Settings</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Add New Fee'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <select 
                                required
                                name="class_id"
                                value={formData.class_id}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Class...</option>
                                <option value="ALL">All Classes (Apply to all)</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                            <input 
                                required
                                type="text"
                                name="fee_type"
                                value={formData.fee_type}
                                onChange={handleChange}
                                placeholder="e.g. Tuition Fee, Library Fee"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500"><IndianRupee size={16}/></span>
                                <input 
                                    required
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full p-2 pl-8 border rounded"
                                />
                            </div>
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
                            <th className="px-4 py-3 font-semibold text-gray-600 w-32">Actions</th>
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
                                    <td className="px-4 py-3">
                                        {editingFeeId === fee.id ? (
                                            <input type="text" className="border rounded p-1 w-full text-sm" value={editFormData.fee_type} onChange={e => setEditFormData({...editFormData, fee_type: e.target.value})} />
                                        ) : (
                                            fee.fee_type
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingFeeId === fee.id ? (
                                            <input type="number" className="border rounded p-1 w-full text-sm" value={editFormData.amount} onChange={e => setEditFormData({...editFormData, amount: e.target.value})} />
                                        ) : (
                                            `₹${parseFloat(fee.amount).toFixed(2)}`
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingFeeId === fee.id ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateFee(fee.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Save</button>
                                                <button onClick={() => setEditingFeeId(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setEditingFeeId(fee.id);
                                                        setEditFormData({ fee_type: fee.fee_type, amount: fee.amount });
                                                    }}
                                                    className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(fee.id)}
                                                    className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
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
