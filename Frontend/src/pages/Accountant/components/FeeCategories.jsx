import React, { useState } from 'react';
import { Plus, Tag, Calendar, Edit2, X, CheckCircle2 } from 'lucide-react';

const FeeCategories = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingCategory, setEditingCategory] = useState(null);
    
    const [categories, setCategories] = useState([
        { id: 1, name: 'Tuition Fee', type: 'Recurring', description: 'Monthly/Termly academic fee', status: 'Active' },
        { id: 2, name: 'Admission Fee', type: 'One-time', description: 'Charged at the time of new admission', status: 'Active' },
        { id: 3, name: 'Exam Fee', type: 'Recurring', description: 'Term examination charges', status: 'Active' },
        { id: 4, name: 'Transport Fee', type: 'Recurring', description: 'Monthly bus service charges', status: 'Active' },
        { id: 5, name: 'Hostel Fee', type: 'Recurring', description: 'Boarding and lodging charges', status: 'Active' },
        { id: 6, name: 'Library Fee', type: 'Annual', description: 'Yearly library maintenance', status: 'Active' },
        { id: 7, name: 'Activity Fee', type: 'Annual', description: 'Sports and co-curricular activities', status: 'Active' },
        { id: 8, name: 'Fine/Penalty', type: 'Conditional', description: 'Late fee or disciplinary fines', status: 'Active' }
    ]);

    const handleAddClick = () => {
        setEditingCategory(null);
        setView('form');
    };

    const handleEditClick = (cat) => {
        setEditingCategory(cat);
        setView('form');
    };

    const handleSave = (e) => {
        e.preventDefault();
        setView('list');
    };

    if (view === 'form') {
        return (
            <div className="animate-fade-in bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 max-w-2xl">
                <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Define fee types for students</p>
                    </div>
                    <button onClick={() => setView('list')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Back</button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
                            <input 
                                type="text" 
                                defaultValue={editingCategory?.name || ''} 
                                required 
                                placeholder="e.g. Tuition Fee" 
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Collection Type *</label>
                            <select 
                                defaultValue={editingCategory?.type || ''} 
                                required 
                                className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="One-time">One-time</option>
                                <option value="Recurring">Recurring (Monthly/Termly)</option>
                                <option value="Annual">Annual</option>
                                <option value="Conditional">Conditional (Fines/Penalties)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                        <textarea 
                            defaultValue={editingCategory?.description || ''} 
                            rows="2" 
                            placeholder="Brief description of this fee category..." 
                            className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                        <select 
                            defaultValue={editingCategory?.status || 'Active'} 
                            className="w-full md:w-1/2 px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Save Category
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
                    <h1 className="text-xl font-bold text-slate-800 m-0">Fee Categories</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage all types of fees applicable to students</p>
                </div>
                <button 
                    onClick={handleAddClick}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                    <Plus size={16} /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-col gap-2 relative group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Tag size={14} className="text-blue-500" />
                                <h3 className="m-0 text-sm font-bold text-slate-800">{cat.name}</h3>
                            </div>
                            <button 
                                onClick={() => handleEditClick(cat)}
                                className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 size={12} />
                            </button>
                        </div>
                        
                        <p className="m-0 text-[11px] text-slate-500 leading-snug flex-1">
                            {cat.description}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-600 font-bold uppercase flex items-center gap-1">
                                <Calendar size={10} /> {cat.type}
                            </span>
                            <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {cat.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeeCategories;
