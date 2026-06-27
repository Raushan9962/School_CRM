import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { AlertOctagon, UserX, Smartphone, Clock, MessageSquare, AlertTriangle, Search, Plus } from 'lucide-react';

const DisciplineManagement = () => {
    const [logs, setLogs] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        studentId: '',
        incidentType: 'Late Coming',
        description: '',
        incidentDate: new Date().toISOString().split('T')[0],
        actionTaken: 'Warning'
    });

    const fetchData = async () => {
        try {
            const [logsRes, stdRes] = await Promise.all([
                apiFetch('/principal/discipline'),
                apiFetch('/principal/students') // Use principal's student list
            ]);
            
            const logsData = await logsRes.json();
            const stdData = await stdRes.json();
            
            if (logsData.success) setLogs(logsData.data);
            if (stdData.data) setStudents(stdData.data);
        } catch (err) {
            console.error("Failed to fetch discipline data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateNew = () => {
        setFormData({
            studentId: '',
            incidentType: 'Late Coming',
            description: '',
            incidentDate: new Date().toISOString().split('T')[0],
            actionTaken: 'Warning'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/discipline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to log discipline issue", err);
        }
    };

    if (loading) return <div className="p-5 text-center text-slate-500">Loading discipline logs...</div>;

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    const getIcon = (type) => {
        switch(type) {
            case 'Late Coming': return <Clock size={16} className="text-amber-500" />;
            case 'Misbehavior': return <AlertOctagon size={16} className="text-rose-500" />;
            case 'Absenteeism': return <UserX size={16} className="text-indigo-500" />;
            case 'Mobile Use': return <Smartphone size={16} className="text-blue-500" />;
            case 'Bullying': return <AlertTriangle size={16} className="text-red-600" />;
            default: return <MessageSquare size={16} className="text-slate-500" />;
        }
    };

    return (
        <div className="animate-fade-in p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 m-0">Discipline Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Record and track student disciplinary incidents.</p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 border-none cursor-pointer"
                >
                    <Plus size={18} /> Log Incident
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search by student name..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Student Details</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Incident Type</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Description</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Reported By</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Action Taken</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.length === 0 ? (
                            <tr><td colSpan="6" className="p-5 text-center text-slate-500">No disciplinary incidents logged.</td></tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm text-slate-600 font-medium">
                                        {new Date(log.incident_date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-sm">{log.student_name}</div>
                                        <div className="text-xs text-slate-500">{log.class_name} ({log.section})</div>
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        {getIcon(log.incident_type)} {log.incident_type}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={log.description}>
                                        {log.description}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {log.reporter_name || 'System'}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                                            {log.action_taken}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 animate-fade-in">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Log Disciplinary Incident</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Student</label>
                                <select name="studentId" value={formData.studentId} onChange={handleInputChange} className={inputClass} required>
                                    <option value="">Select Student...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.className})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Incident Type</label>
                                    <select name="incidentType" value={formData.incidentType} onChange={handleInputChange} className={inputClass} required>
                                        <option value="Late Coming">Late Coming</option>
                                        <option value="Misbehavior">Misbehavior</option>
                                        <option value="Absenteeism">Absenteeism</option>
                                        <option value="Cheating">Cheating</option>
                                        <option value="Bullying">Bullying</option>
                                        <option value="Mobile Use">Mobile Use</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Date</label>
                                    <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} className={inputClass} required />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Description / Details</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className={`${inputClass} resize-none`} rows="3" required placeholder="What happened?"></textarea>
                            </div>
                            <div>
                                <label className={labelClass}>Initial Action Taken</label>
                                <select name="actionTaken" value={formData.actionTaken} onChange={handleInputChange} className={inputClass} required>
                                    <option value="Warning">Verbal Warning</option>
                                    <option value="Parent Notified">Parent Notified</option>
                                    <option value="Detention">Detention</option>
                                    <option value="Suspension">Suspension</option>
                                    <option value="Pending Review">Pending Review</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg bg-white cursor-pointer hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-lg font-medium cursor-pointer hover:bg-rose-700 border-none">Log Incident</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisciplineManagement;
