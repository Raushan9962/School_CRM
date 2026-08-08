import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Book, CheckCircle, Clock, Plus, AlertCircle } from 'lucide-react';

const SyllabusTracking = () => {
    const [syllabusList, setSyllabusList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        classId: '',
        subjectId: '',
        chapterName: '',
        status: 'Pending',
        completionDate: ''
    });

    const fetchData = async () => {
        try {
            const [sylRes, clsRes, subRes] = await Promise.all([
                apiFetch('/principal/syllabus'),
                apiFetch('/classes'),
                apiFetch('/subjects')
            ]);
            
            const sylData = await sylRes.json();
            const clsData = await clsRes.json();
            const subData = await subRes.json();
            
            if (sylData.success) setSyllabusList(sylData.data);
            if (clsData.success) setClasses(clsData.data);
            if (subData.success) setSubjects(subData.data);
        } catch (err) {
            console.error("Failed to fetch syllabus data", err);
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
        setFormData({ classId: '', subjectId: '', chapterName: '', status: 'Pending', completionDate: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/syllabus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to save syllabus", err);
        }
    };

    if (loading) return <div className="p-5 text-center text-slate-500">Loading syllabus tracking...</div>;

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Completed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> Completed</span>;
            case 'In Progress': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> In Progress</span>;
            default: return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><AlertCircle size={14}/> Pending</span>;
        }
    };

    return (
        <div className="animate-fade-in p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 m-0">Syllabus Tracking</h2>
                    <p className="text-slate-500 text-sm mt-1">Monitor chapter-wise completion across all subjects.</p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 border-none cursor-pointer"
                >
                    <Plus size={18} /> Log Chapter Progress
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Class</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Subject</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Chapter/Topic Name</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Teacher</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Completion Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {syllabusList.length === 0 ? (
                            <tr><td colSpan="6" className="p-5 text-center text-slate-500">No syllabus progress logged yet.</td></tr>
                        ) : (
                            syllabusList.map(syl => (
                                <tr key={syl.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-slate-800">{syl.class_name} ({syl.section})</td>
                                    <td className="p-4 text-sm text-slate-600 flex items-center gap-2"><Book size={16} className="text-blue-500"/> {syl.subject_name}</td>
                                    <td className="p-4 text-sm font-medium text-slate-800">{syl.chapter_name}</td>
                                    <td className="p-4 text-sm text-slate-600">{syl.teacher_name || 'N/A'}</td>
                                    <td className="p-4 text-sm">{getStatusBadge(syl.status)}</td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {syl.completion_date ? new Date(syl.completion_date).toLocaleDateString() : '-'}
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
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Log Chapter Progress</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Class</label>
                                <select name="classId" value={formData.classId} onChange={handleInputChange} className={inputClass} required>
                                    <option value="">Select...</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Subject</label>
                                <select name="subjectId" value={formData.subjectId} onChange={handleInputChange} className={inputClass} required>
                                    <option value="">Select Subject...</option>
                                    {subjects.filter(s => s.class_id.toString() === formData.classId.toString()).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Chapter / Topic Name</label>
                                <input type="text" name="chapterName" value={formData.chapterName} onChange={handleInputChange} className={inputClass} required placeholder="e.g. Algebra Ch-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className={inputClass}>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Completion Date</label>
                                    <input type="date" name="completionDate" value={formData.completionDate} onChange={handleInputChange} className={inputClass} disabled={formData.status !== 'Completed'} />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg bg-white cursor-pointer hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 border-none">Save Progress</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyllabusTracking;
