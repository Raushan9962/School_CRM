import React, { useState } from 'react';
import apiFetch from '../../../services/api';
import { Paperclip, CheckCircle, AlertTriangle } from 'lucide-react';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Other'];

const LeaveRequest = () => {
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    
    const [form, setForm] = useState({
        leave_type: 'Sick Leave',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submitLeave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');
        
        try {
            // First try generic staff route
            let res = await apiFetch('/staff/leaves', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            
            if(res.status === 404) {
                // Fallback to teacher portal if staff route doesn't work for this user yet
                res = await apiFetch('/teacher-portal/leaves', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                });
            }

            const data = await res.json();
            if (data.success) {
                setMsg('success:Leave application submitted successfully!');
                setForm({ leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
                // Reset file input if needed
                const fileInput = document.getElementById('leaveAttachment');
                if (fileInput) fileInput.value = '';
            } else { 
                setMsg('error:' + data.message); 
            }
        } catch (err) { 
            setMsg('error:Network error while submitting leave.'); 
        } finally { 
            setSubmitting(false); 
            setTimeout(() => setMsg(''), 4000); 
        }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Leave Request</h2>
            <p className="text-sm text-slate-500 mb-6">Fill in the details below to apply for a leave.</p>

            {msg && (
                <div className={`p-4 mb-6 rounded-lg text-sm font-bold flex items-center gap-2 border ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            <form onSubmit={submitLeave} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Leave Type *</label>
                    <select required name="leave_type" value={form.leave_type} onChange={handleChange} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-slate-400">
                        {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-bold text-slate-700">Date of Start *</label>
                        <input required type="date" name="start_date" value={form.start_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-slate-400" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-bold text-slate-700">Date of End *</label>
                        <input required type="date" name="end_date" value={form.end_date} onChange={handleChange} min={form.start_date || new Date().toISOString().split('T')[0]} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-slate-400" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Reason *</label>
                    <textarea required name="reason" value={form.reason} onChange={handleChange} rows={4} placeholder="Please explain why you need this leave..." className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-slate-400 resize-none"></textarea>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Attached Application (Optional)</label>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-200 text-sm font-bold">
                            <Paperclip size={16} /> Choose File
                            <input type="file" id="leaveAttachment" className="hidden" />
                        </label>
                        <span className="text-xs text-slate-400 font-medium">Upload PDF, JPG or PNG (Max 5MB)</span>
                    </div>
                </div>

                <div className="mt-4 pt-5 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm tracking-wide shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50">
                        {submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveRequest;
