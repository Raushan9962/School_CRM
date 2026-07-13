import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiFetch from '../../../services/api';

const LibrarySettings = () => {
    const [settings, setSettings] = useState({
        max_books_student: 2,
        max_books_teacher: 5,
        issue_duration_student: 7,
        issue_duration_teacher: 30,
        fine_per_day: 5.00
    });
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/librarian/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setSettings({
                    max_books_student: data.data.max_books_student || 2,
                    max_books_teacher: data.data.max_books_teacher || 5,
                    issue_duration_student: data.data.issue_duration_student || 7,
                    issue_duration_teacher: data.data.issue_duration_teacher || 30,
                    fine_per_day: data.data.fine_per_day || 5.00
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveStatus(null);
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/librarian/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(settings)
            });
            const data = await res.json();
            if (data.success) {
                setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
                setTimeout(() => setSaveStatus(null), 3000);
            } else {
                setSaveStatus({ type: 'error', message: data.message || 'Error saving settings' });
            }
        } catch (err) {
            setSaveStatus({ type: 'error', message: 'Server connection failed' });
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
    }

    const inputCls = "w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 font-semibold text-slate-800";
    const labelCls = "block text-sm font-bold text-slate-700 mb-1.5";

    return (
        <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                    <Settings size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 m-0">Library Settings</h2>
                    <p className="text-slate-500 m-0">Configure issuance rules, limits, and fine calculations</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    
                    {/* Student Rules */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Student Issuance Rules</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelCls}>Max Books Allowed</label>
                                <div className="relative">
                                    <input 
                                        type="number" min="1" name="max_books_student" 
                                        value={settings.max_books_student} onChange={handleChange} 
                                        className={inputCls} 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">books</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Maximum number of books a student can hold at one time.</p>
                            </div>
                            <div>
                                <label className={labelCls}>Issue Duration</label>
                                <div className="relative">
                                    <input 
                                        type="number" min="1" name="issue_duration_student" 
                                        value={settings.issue_duration_student} onChange={handleChange} 
                                        className={inputCls} 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">days</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Number of days before the book becomes overdue.</p>
                            </div>
                        </div>
                    </div>

                    {/* Teacher/Staff Rules */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Teacher & Staff Rules</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelCls}>Max Books Allowed</label>
                                <div className="relative">
                                    <input 
                                        type="number" min="1" name="max_books_teacher" 
                                        value={settings.max_books_teacher} onChange={handleChange} 
                                        className={inputCls} 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">books</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Issue Duration</label>
                                <div className="relative">
                                    <input 
                                        type="number" min="1" name="issue_duration_teacher" 
                                        value={settings.issue_duration_teacher} onChange={handleChange} 
                                        className={inputCls} 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">days</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fines */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Fine & Penalty Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelCls}>Fine Per Day (Overdue)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                                    <input 
                                        type="number" min="0" step="0.5" name="fine_per_day" 
                                        value={settings.fine_per_day} onChange={handleChange} 
                                        className={`${inputCls} pl-8`} 
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Amount charged per day after the due date.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {saveStatus && (
                    <div className={`mx-6 md:mx-8 mb-4 p-4 rounded-xl border flex items-center gap-3 ${saveStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {saveStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold">{saveStatus.message}</span>
                    </div>
                )}

                <div className="px-6 py-5 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-sm">
                        <Save size={18} /> Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LibrarySettings;
