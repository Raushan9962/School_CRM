import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { ClipboardList, Plus, X, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';

const BEHAVIOR_OPTIONS = ['Excellent', 'Very Good', 'Good', 'Average', 'Needs Improvement'];

const TeacherDiary = () => {
    const [entries, setEntries] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({
        date: new Date().toISOString().split('T')[0],
        class_id: '',
        subject_id: '',
        topics_covered: '',
        topics_planned: '',
        homework_assigned: '',
        class_behavior: 'Good',
        special_notes: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [diaryRes, clsRes] = await Promise.all([
                apiFetch('/teacher-portal/diary', { headers }).then(r => r.json()),
                apiFetch('/teacher-portal/my-classes', { headers }).then(r => r.json())
            ]);
            if (diaryRes.success) setEntries(diaryRes.data);
            if (clsRes.success) setClasses(clsRes.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submitEntry = async () => {
        if (!form.class_id || !form.topics_covered.trim()) {
            setMsg('error:Class and Topics Covered are required.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiFetch('/teacher-portal/diary', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Diary entry saved!');
                setIsModalOpen(false);
                setForm({ date: new Date().toISOString().split('T')[0], class_id: '', subject_id: '', topics_covered: '', topics_planned: '', homework_assigned: '', class_behavior: 'Good', special_notes: '' });
                fetchData();
            } else {
                setMsg('error:' + (data.message || 'Failed.'));
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

    const behaviorColor = {
        'Excellent': '#059669', 'Very Good': '#10b981', 'Good': '#3b82f6',
        'Average': '#f59e0b', 'Needs Improvement': '#ef4444'
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="m-0 text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList size={22} className="text-indigo-600" /> Teacher Diary / Lesson Plan
                </h2>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <Plus size={18} strokeWidth={2.5} /> Add Today's Entry
                </button>
            </div>

            {/* Status */}
            {msg && (
                <div className={`p-3 rounded-xl flex items-center gap-2 font-semibold text-sm border ${
                    isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* Info Banner */}
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 flex gap-3 items-start">
                <BookOpen size={18} className="text-sky-600 shrink-0 mt-0.5" />
                <p className="m-0 text-[13px] text-sky-700 font-medium leading-relaxed">
                    Daily diary entries can be reviewed by the Principal. Submit your lesson plan every day — topics covered, tomorrow's plan, homework assigned, and class behavior.
                </p>
            </div>

            {/* Diary Entries */}
            {loading ? (
                <div className="text-center p-16 text-slate-400 font-medium">Loading diary...</div>
            ) : entries.length === 0 ? (
                <div className="bg-white rounded-lg p-16 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
                    <ClipboardList size={48} strokeWidth={1.5} className="text-slate-300 mb-4" />
                    <h3 className="text-slate-500 font-bold m-0 mb-2 text-sm">No diary entries yet</h3>
                    <p className="text-slate-400 m-0 text-sm">Start adding your daily lesson plans here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {entries.map((entry, i) => {
                        const bColor = behaviorColor[entry.class_behavior] || '#6366f1';
                        // Map hex to tailwind classes for the badge (we'll just use inline style for background color to be safe, or predefined classes if possible. Given behaviorColor is dynamically mapping hex, we'll keep inline style for just the badge color since it's dynamic).
                        return (
                            <div key={entry.id || i} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Entry Header */}
                                <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="bg-indigo-50 text-indigo-600 px-3.5 py-2 rounded-xl font-extrabold text-sm whitespace-nowrap text-center min-w-[70px]">
                                            {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="flex-1">
                                            <p className="m-0 font-bold text-[15px] text-slate-800">
                                                Class {entry.class_name} {entry.section || ''}
                                                {entry.subject_name && <span className="text-indigo-600"> — {entry.subject_name}</span>}
                                            </p>
                                            <p className="m-0 text-xs font-medium text-slate-500 mt-0.5">
                                                {new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: bColor + '20', color: bColor }}>
                                                🏫 {entry.class_behavior || 'Good'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sm:hidden w-full text-right">
                                        <span className="px-3 py-1.5 rounded-full text-xs font-bold inline-block" style={{ background: bColor + '20', color: bColor }}>
                                            🏫 {entry.class_behavior || 'Good'}
                                        </span>
                                    </div>
                                </div>
                                {/* Entry Content */}
                                <div className="p-4 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="m-0 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <span>✅</span> Topics Covered Today
                                        </p>
                                        <p className="m-0 text-[14px] font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{entry.topics_covered || '—'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="m-0 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <span>📅</span> Planned for Tomorrow
                                        </p>
                                        <p className="m-0 text-[14px] font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{entry.topics_planned || '—'}</p>
                                    </div>
                                    {entry.homework_assigned && (
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="m-0 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                <span>📚</span> Homework Assigned
                                            </p>
                                            <p className="m-0 text-[14px] font-medium text-slate-700 leading-relaxed">{entry.homework_assigned}</p>
                                        </div>
                                    )}
                                    {entry.special_notes && (
                                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                            <p className="m-0 mb-2 text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                                                <span>📝</span> Special Notes
                                            </p>
                                            <p className="m-0 text-[14px] font-medium text-amber-800 leading-relaxed italic">{entry.special_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-4 md:p-5 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="m-0 text-lg font-bold text-slate-900">Add Diary Entry</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block mb-2 text-[13px] font-bold text-slate-700">Date</label>
                                    <input type="date" name="date" value={form.date} onChange={handleChange} max={new Date().toISOString().split('T')[0]} 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-[13px] font-bold text-slate-700">Class <span className="text-red-500">*</span></label>
                                    <select name="class_id" value={form.class_id} onChange={handleChange} 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer bg-white">
                                        <option value="">— Select Class —</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-[13px] font-bold text-slate-700">Topics Covered Today <span className="text-red-500">*</span></label>
                                <textarea name="topics_covered" value={form.topics_covered} onChange={handleChange} rows={3} placeholder="e.g. Introduction to Linear Equations..." 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400" />
                            </div>
                            <div>
                                <label className="block mb-2 text-[13px] font-bold text-slate-700">Planned for Tomorrow</label>
                                <textarea name="topics_planned" value={form.topics_planned} onChange={handleChange} rows={2} placeholder="e.g. Word problems on linear equations..." 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400" />
                            </div>
                            <div>
                                <label className="block mb-2 text-[13px] font-bold text-slate-700">Homework Assigned</label>
                                <input type="text" name="homework_assigned" value={form.homework_assigned} onChange={handleChange} placeholder="e.g. Exercise 4.1 – Q1 to Q10" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text placeholder:text-slate-400" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block mb-2 text-[13px] font-bold text-slate-700">Class Behavior</label>
                                    <select name="class_behavior" value={form.class_behavior} onChange={handleChange} 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer bg-white">
                                        {BEHAVIOR_OPTIONS.map(b => <option key={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-[13px] font-bold text-slate-700">Special Notes</label>
                                    <input type="text" name="special_notes" value={form.special_notes} onChange={handleChange} placeholder="Any incident, absent students..." 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-text placeholder:text-slate-400" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors">Cancel</button>
                                <button onClick={submitEntry} disabled={submitting} className={`flex-[2] py-3.5 rounded-xl text-white font-bold flex justify-center items-center gap-2 transition-colors shadow-sm ${submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {submitting ? 'Saving...' : <><Plus size={18} strokeWidth={2.5} /> Save Diary Entry</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDiary;
