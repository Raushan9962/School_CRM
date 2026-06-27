import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { MessageSquare, Calendar, Plus, X, CheckCircle, AlertTriangle, Phone, Mail, Clock, ClipboardList } from 'lucide-react';

const ParentInteraction = () => {
    const [activeTab, setActiveTab] = useState('directory');
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [classStudents, setClassStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [ptmMeetings, setPtmMeetings] = useState([]);
    const [ptmLoading, setPtmLoading] = useState(true);
    const [isPtmModalOpen, setIsPtmModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');
    const [ptmForm, setPtmForm] = useState({
        student_id: '',
        meeting_date: '',
        meeting_time: '10:00',
        agenda: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/my-classes', { headers })
            .then(r => r.json())
            .then(d => { if (d.success) setClasses(d.data); })
            .catch(console.error);

        apiFetch('/teacher-portal/ptm-meetings', { headers })
            .then(r => r.json())
            .then(d => { if (d.success) setPtmMeetings(d.data); })
            .catch(console.error)
            .finally(() => setPtmLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedClassId) return;
        apiFetch(`/teacher-portal/class-students/${selectedClassId}`, { headers })
            .then(r => r.json())
            .then(d => { if (d.success) setClassStudents(d.data); setStudents(d.data); })
            .catch(console.error);
    }, [selectedClassId]);

    const schedulePTM = async () => {
        if (!ptmForm.student_id || !ptmForm.meeting_date || !ptmForm.agenda.trim()) {
            setMsg('error:Student, date and agenda are required.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiFetch('/teacher-portal/ptm-meetings', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(ptmForm)
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:PTM scheduled successfully!');
                setIsPtmModalOpen(false);
                setPtmForm({ student_id: '', meeting_date: '', meeting_time: '10:00', agenda: '' });
                // Refresh meetings
                apiFetch('/teacher-portal/ptm-meetings', { headers })
                    .then(r => r.json())
                    .then(d => { if (d.success) setPtmMeetings(d.data); });
            } else { setMsg('error:' + data.message); }
        } catch { setMsg('error:Network error.'); }
        finally { setSubmitting(false); setTimeout(() => setMsg(''), 4000); }
    };

    const openPtmModal = () => {
        setIsPtmModalOpen(true);
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const STATUS_STYLE = {
        'Scheduled': { bg: '#fef3c7', color: '#d97706' },
        'Completed': { bg: '#dcfce7', color: '#166534' },
        'Cancelled': { bg: '#fee2e2', color: '#dc2626' },
    };

    const upcomingPTMs = ptmMeetings.filter(m => m.status === 'Scheduled' && new Date(m.meeting_date) >= new Date()).length;

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={22} className="text-indigo-600" /> Parent Interaction & PTM
                </h2>
                <button 
                    onClick={openPtmModal} 
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Calendar size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Schedule PTM</span>
                </button>
            </div>

            {/* Status */}
            {msg && (
                <div className={`p-3 rounded-lg flex items-center gap-2 font-semibold text-sm ${isError ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* PTM Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total PTMs', value: ptmMeetings.length, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <ClipboardList size={28} className="text-indigo-600" /> },
                    { label: 'Upcoming', value: upcomingPTMs, color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={28} className="text-amber-600" /> },
                    { label: 'Completed', value: ptmMeetings.filter(m => m.status === 'Completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle size={28} className="text-emerald-600" /> },
                ].map((c, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 flex items-center gap-4 border border-slate-200 shadow-sm">
                        <div className={`${c.bg} p-3 rounded-xl flex items-center justify-center`}>
                            {c.icon}
                        </div>
                        <div>
                            <p className="m-0 mb-0.5 text-xl font-extrabold text-slate-900">{c.value}</p>
                            <p className="m-0 text-sm font-semibold text-slate-500">{c.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                {[{ id: 'directory', label: '👥 Parent Directory' }, { id: 'ptm', label: '📅 PTM History' }].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Parent Directory */}
            {activeTab === 'directory' && (
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none w-full sm:w-auto min-w-[200px] cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                            <option value="">— Select Class —</option>
                            {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                        </select>
                        <p className="m-0 text-sm font-medium text-slate-400">
                            {classStudents.length > 0 ? `${classStudents.length} students listed` : 'Select a class to view parent contacts'}
                        </p>
                    </div>

                    {classStudents.length === 0 ? (
                        <div className="bg-white rounded-xl p-10 md:p-16 text-center border-2 border-dashed border-slate-200">
                            <MessageSquare size={48} strokeWidth={1.5} className="text-slate-200 mx-auto mb-4" />
                            <h3 className="text-slate-600 font-bold m-0 mb-1 text-sm">No students found</h3>
                            <p className="text-slate-400 m-0 font-medium text-sm">Select a class to view student & parent details</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        {['#', 'Student', 'Roll No.', 'Email (Contact)', 'Action'].map(h => (
                                            <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {classStudents.map((s, i) => (
                                        <tr key={s.id || i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-3.5 text-sm font-semibold text-slate-400">{i + 1}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                                                        {s.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-sm text-slate-800">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-slate-500">{s.roll_number || '—'}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-500">
                                                {s.email ? (
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="text-slate-400" /> {s.email}
                                                    </div>
                                                ) : <span className="text-slate-300 italic">Not provided</span>}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button onClick={() => { setPtmForm(prev => ({ ...prev, student_id: s.id })); setIsPtmModalOpen(true); }}
                                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-100">
                                                    <Calendar size={14} /> Schedule PTM
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* PTM History */}
            {activeTab === 'ptm' && (
                ptmLoading ? (
                    <div className="text-center p-12 text-slate-400 font-medium">Loading PTM records...</div>
                ) : ptmMeetings.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-slate-200">
                        <Calendar size={48} strokeWidth={1.5} className="text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-600 font-bold m-0 mb-1 text-sm">No PTM meetings yet</h3>
                        <p className="text-slate-400 m-0 text-sm font-medium">Schedule a PTM meeting using the button above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {ptmMeetings.map((m, i) => {
                            const isPast = new Date(m.meeting_date) < new Date();
                            const statusColor = isPast ? 'bg-slate-100 text-slate-600 border-slate-200' : (m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200');
                            return (
                                <div key={m.id || i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className={`p-4 border-b flex justify-between items-start ${isPast ? 'bg-slate-50/50 border-slate-100' : 'bg-indigo-50/30 border-indigo-50'}`}>
                                        <div>
                                            <p className="m-0 mb-1 font-bold text-slate-900 text-[15px]">{m.student_name}</p>
                                            <p className="m-0 text-xs font-medium text-slate-500">
                                                Class {m.class_name} {m.section} <span className="mx-1">•</span> Roll: {m.roll_number}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor}`}>{isPast ? 'Closed' : m.status}</span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                        <div className="flex gap-2 items-center text-[13px] font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <Calendar size={14} className="text-indigo-500" />
                                            {m.meeting_date ? new Date(m.meeting_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                            {m.meeting_time && <span className="text-slate-400 ml-1">at {m.meeting_time}</span>}
                                        </div>
                                        <div>
                                            <p className="m-0 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Agenda</p>
                                            <p className="m-0 text-[13px] text-slate-600 font-medium leading-relaxed">
                                                {m.agenda}
                                            </p>
                                        </div>
                                        {m.notes && (
                                            <div className="mt-1 pt-3 border-t border-slate-100">
                                                <p className="m-0 text-[13px] text-slate-500 font-medium italic">Notes: {m.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {/* Schedule PTM Modal */}
            {isPtmModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-4 md:p-5 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsPtmModalOpen(false)} className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                            <X size={16} />
                        </button>
                        <h3 className="m-0 mb-4 text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={20} className="text-indigo-600" /> Schedule PTM Meeting
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-bold text-slate-700">Select Class First</label>
                                <select value={selectedClassId} onChange={e => { setSelectedClassId(e.target.value); if (e.target.value) apiFetch(`/teacher-portal/students-by-class?classId=${e.target.value}`, { headers }).then(r => r.json()).then(d => { if (d.success) setStudents(d.data); }); }}
                                    className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 cursor-pointer">
                                    <option value="">— Select Class —</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>Class {c.name} {c.section}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-bold text-slate-700">Select Student <span className="text-red-500">*</span></label>
                                <select value={ptmForm.student_id} onChange={e => setPtmForm(p => ({ ...p, student_id: e.target.value }))}
                                    className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
                                    <option value="">— Select Student —</option>
                                    {(students.length > 0 ? students : classStudents).map(s => <option key={s.id} value={s.id}>{s.name} (Roll: {s.roll_number})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1.5 text-sm font-bold text-slate-700">Meeting Date <span className="text-red-500">*</span></label>
                                    <input type="date" value={ptmForm.meeting_date} onChange={e => setPtmForm(p => ({ ...p, meeting_date: e.target.value }))} min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-text" />
                                </div>
                                <div>
                                    <label className="block mb-1.5 text-sm font-bold text-slate-700">Meeting Time</label>
                                    <input type="time" value={ptmForm.meeting_time} onChange={e => setPtmForm(p => ({ ...p, meeting_time: e.target.value }))}
                                        className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-text" />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-bold text-slate-700">Agenda / Topic <span className="text-red-500">*</span></label>
                                <textarea value={ptmForm.agenda} onChange={e => setPtmForm(p => ({ ...p, agenda: e.target.value }))} rows={3}
                                    placeholder="e.g. Discuss Term 1 results and general performance..."
                                    className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400" />
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button onClick={() => setIsPtmModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors">Cancel</button>
                                <button onClick={schedulePTM} disabled={submitting} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold transition-colors shadow-sm">
                                    {submitting ? 'Scheduling...' : 'Confirm PTM Schedule'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentInteraction;
