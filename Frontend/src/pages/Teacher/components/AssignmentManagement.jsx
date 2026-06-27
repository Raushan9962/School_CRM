import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, Plus, X, CheckCircle, AlertTriangle, Clock, Users, ClipboardList } from 'lucide-react';

const AssignmentManagement = () => {
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({ title: '', description: '', class_id: '', subject_id: '', due_date: '', max_marks: '10' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
        try {
            const [asnRes, clsRes] = await Promise.all([
                apiFetch('/teacher-portal/assignments', { headers }).then(r => r.json()),
                apiFetch('/teacher-portal/my-classes', { headers }).then(r => r.json())
            ]);
            if (asnRes.success) setAssignments(asnRes.data);
            if (clsRes.success) setClasses(clsRes.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const createAssignment = async () => {
        if (!form.title || !form.class_id || !form.due_date) {
            setMsg('error:Title, Class, and Due Date are required.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiFetch('/teacher-portal/assignments', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Assignment created successfully!');
                setIsModalOpen(false);
                setForm({ title: '', description: '', class_id: '', subject_id: '', due_date: '', max_marks: '10' });
                fetchAll();
            } else {
                setMsg('error:' + (data.message || 'Failed to create.'));
            }
        } catch (e) {
            setMsg('error:Network error.');
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg(''), 4000);
        }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const totalAssignments = assignments.length;
    const activeAssignments = assignments.filter(a => (a.status || 'Active') === 'Active').length;
    const overdue = assignments.filter(a => a.due_date && new Date(a.due_date) < new Date() && (a.status || 'Active') === 'Active').length;

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="m-0 text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={22} className="text-indigo-600" /> Assignments & Homework
                </h2>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Plus size={18} strokeWidth={2.5} /> Create Assignment
                </button>
            </div>

            {/* Status Message */}
            {msg && (
                <div className={`p-3 rounded-xl flex items-center gap-2 font-semibold text-sm border ${
                    isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Assignments', value: totalAssignments, color: 'text-blue-600', bg: 'bg-blue-50', icon: <ClipboardList size={28} className="text-blue-600" /> },
                    { label: 'Active', value: activeAssignments, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle size={28} className="text-emerald-600" /> },
                    { label: 'Overdue', value: overdue, color: 'text-red-600', bg: 'bg-red-50', icon: <AlertTriangle size={28} className="text-red-600" /> },
                ].map((c, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 flex items-center gap-4 border border-slate-200 shadow-sm">
                        <div className={`${c.bg} p-2.5 rounded-xl flex items-center justify-center`}>
                            {c.icon}
                        </div>
                        <div>
                            <p className="m-0 mb-1 text-xl font-extrabold text-slate-900">{c.value}</p>
                            <p className="m-0 text-[13px] font-bold text-slate-500">{c.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assignment Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="m-0 text-sm font-bold text-slate-900">All Assignments</h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{assignments.length} total</span>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-slate-400 font-medium">Loading...</div>
                ) : assignments.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <BookOpen size={48} strokeWidth={1.5} className="text-slate-200 mb-4" />
                        <h3 className="text-slate-600 font-bold m-0 mb-1 text-sm">No assignments yet</h3>
                        <p className="text-slate-400 m-0 text-sm">Create your first assignment!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['Assignment', 'Class', 'Due Date', 'Submissions', 'Status'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {assignments.map((a, i) => {
                                    const isPastDue = a.due_date && new Date(a.due_date) < new Date();
                                    const status = isPastDue ? 'Closed' : (a.status || 'Active');
                                    const statusClasses = status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200';
                                    const submitted = parseInt(a.submitted_count) || 0;
                                    const total = parseInt(a.total_students) || 0;
                                    const pending = Math.max(0, total - submitted);
                                    
                                    return (
                                        <tr key={a.id || i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="m-0 mb-1 font-bold text-[14px] text-slate-800">{a.title}</p>
                                                <p className="m-0 text-xs text-slate-500 font-medium">{a.subject_name || 'General'} • {a.max_marks} marks</p>
                                            </td>
                                            <td className="px-5 py-4 text-[13px] font-bold text-slate-600">
                                                {a.class_name ? `Class ${a.class_name} ${a.section || ''}` : '—'}
                                            </td>
                                            <td className={`px-5 py-4 text-[13px] ${isPastDue ? 'text-red-600 font-bold' : 'text-slate-600 font-medium'}`}>
                                                <div className="flex items-center gap-1.5">
                                                    {isPastDue && <Clock size={14} />}
                                                    {a.due_date ? new Date(a.due_date).toLocaleDateString('en-IN') : '—'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                {total > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[14px] font-bold text-emerald-500">{submitted}</span>
                                                        <span className="text-slate-300">/</span>
                                                        <span className="text-[13px] font-semibold text-slate-500">{total}</span>
                                                        {pending > 0 && <span className="text-xs text-red-500 font-bold ml-1">({pending} pending)</span>}
                                                    </div>
                                                ) : <span className="text-slate-300 text-[13px] font-medium">—</span>}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusClasses}`}>{status}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-4 md:p-5 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="m-0 text-lg font-bold text-slate-900">Create New Assignment</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="block mb-2 text-[13px] font-bold text-slate-700">Select Class <span className="text-red-500">*</span></label>
                                <select name="class_id" value={form.class_id} onChange={handleChange} 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white cursor-pointer">
                                    <option value="">— Choose Class —</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-[13px] font-bold text-slate-700">Assignment Title <span className="text-red-500">*</span></label>
                                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Chapter 4 – Exercise 4.1" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text" />
                            </div>
                            <div>
                                <label className="block mb-2 text-[13px] font-bold text-slate-700">Instructions (Optional)</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="What should students do?" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block mb-2 text-[13px] font-bold text-slate-700">Due Date <span className="text-red-500">*</span></label>
                                    <input type="date" name="due_date" value={form.due_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-[13px] font-bold text-slate-700">Total Marks</label>
                                    <input type="number" name="max_marks" value={form.max_marks} onChange={handleChange} min={1} 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors">Cancel</button>
                                <button onClick={createAssignment} disabled={submitting} className={`flex-[2] py-3.5 rounded-xl text-white font-bold flex justify-center items-center gap-2 transition-colors shadow-sm ${submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {submitting ? 'Creating...' : <><Plus size={18} strokeWidth={2.5} /> Create Assignment</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentManagement;
