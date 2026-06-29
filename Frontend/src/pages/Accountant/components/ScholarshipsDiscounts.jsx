import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2, XCircle, Award } from 'lucide-react';
import apiFetch from '../../../services/api';

const ScholarshipsDiscounts = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [grants, setGrants] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGrants();
        fetchStudents();
    }, []);

    const fetchGrants = async () => {
        try {
            const res = await apiFetch('/accountant/scholarships');
            const data = await res.json();
            if (data.success) {
                setGrants(data.data);
            }
        } catch (err) {
            console.error("Error fetching grants:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await apiFetch('/accountant/students');
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const grantData = {
            studentId: formData.get('student_id'),
            grantType: formData.get('grant_type'),
            valueType: formData.get('value_type'),
            value: formData.get('value'),
            validTill: formData.get('valid_till'),
            remarks: formData.get('remarks')
        };
        try {
            const res = await apiFetch('/accountant/scholarships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grantData)
            });
            const data = await res.json();
            if (data.success) {
                fetchGrants();
                setView('list');
            } else {
                alert(data.message || 'Failed to assign grant');
            }
        } catch (err) {
            console.error("Error assigning grant:", err);
            alert("Error assigning grant");
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await apiFetch(`/accountant/scholarships/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                fetchGrants();
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Error updating status");
        }
    };

    if (view === 'form') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-3xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">Assign Scholarship / Discount</h2>
                        <p className="text-xs text-slate-500 mt-1">Grant fee concessions to deserving students</p>
                    </div>
                    <button onClick={() => setView('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>

                <form onSubmit={handleAssignSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Student ID *</label>
                            <input name="student_id" type="number" required placeholder="Enter Student ID (e.g. 1)" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Grant Type *</label>
                            <select name="grant_type" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                <option value="">Select Type</option>
                                <option value="Merit Scholarship">Merit Scholarship</option>
                                <option value="Sibling Discount">Sibling Discount</option>
                                <option value="Sports Concession">Sports Concession</option>
                                <option value="Staff Child Discount">Staff Child Discount</option>
                                <option value="Custom Concession">Custom Concession</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Value Type</label>
                                <select name="value_type" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                    <option value="fixed">Fixed Amount (₹)</option>
                                    <option value="percent">Percentage (%)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Value *</label>
                                <input name="value" type="number" required placeholder="0" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Valid Till *</label>
                            <select name="valid_till" required className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                                <option value="Current Academic Session">Current Academic Session</option>
                                <option value="Specific Month">Specific Month</option>
                                <option value="Lifetime">Lifetime / Until Graduation</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Remarks</label>
                        <input name="remarks" type="text" placeholder="Optional notes for approval" className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Assign Grant
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Scholarships & Discounts</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage student fee concessions and grants</p>
                </div>
                <button 
                    onClick={() => setView('form')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <Plus size={16} /> Assign Discount
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Active Grants</p>
                    <p className="text-xl font-bold text-slate-800 m-0">{grants.filter(g => g.status === 'Approved').length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Pending Approvals</p>
                    <p className="text-xl font-bold text-amber-600 m-0">{grants.filter(g => g.status === 'Pending Approval').length}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 m-0">
                        <Award size={16} className="text-blue-600" /> Granted Scholarships & Discounts
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-48 pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold">Student</th>
                                <th className="px-4 py-2 font-bold">Class</th>
                                <th className="px-4 py-2 font-bold">Grant Type</th>
                                <th className="px-4 py-2 font-bold">Amount / %</th>
                                <th className="px-4 py-2 font-bold">Valid Till</th>
                                <th className="px-4 py-2 font-bold">Status</th>
                                <th className="px-4 py-2 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {grants.map((grant) => (
                                <tr key={grant.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <p className="font-bold text-slate-700 m-0">{grant.student_name}</p>
                                        <p className="text-[10px] text-slate-500 m-0 font-mono mt-0.5">ID: {grant.student_roll || grant.student_id}</p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 font-medium">--</td>
                                    <td className="px-4 py-3 font-medium text-slate-700">{grant.grant_type}</td>
                                    <td className="px-4 py-3 font-bold text-emerald-600">
                                        {grant.value_type === 'percent' ? `${grant.value}% off` : `₹ ${parseFloat(grant.value).toLocaleString('en-IN')}`}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{grant.valid_till}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            grant.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                            grant.status === 'Revoked' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {grant.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {grant.status === 'Approved' ? (
                                            <button onClick={() => handleStatusUpdate(grant.id, 'Revoked')} className="px-2.5 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded text-xs font-bold transition-colors">Revoke</button>
                                        ) : grant.status === 'Pending Approval' ? (
                                            <div className="flex gap-1 justify-end">
                                                <button onClick={() => handleStatusUpdate(grant.id, 'Approved')} className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-xs font-bold transition-colors">Approve</button>
                                                <button onClick={() => handleStatusUpdate(grant.id, 'Revoked')} className="px-2.5 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded text-xs font-bold transition-colors">Reject</button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 font-medium">--</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {grants.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-slate-500 text-sm">No grants found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipsDiscounts;
