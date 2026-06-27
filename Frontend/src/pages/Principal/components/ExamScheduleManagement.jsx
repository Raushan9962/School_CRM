import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { FileText, Plus, Calendar, Clock, Edit2 } from 'lucide-react';

const ExamScheduleManagement = () => {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: 'Unit Test',
        date: '',
        classId: '',
        subjectId: '',
        totalMarks: 100
    });

    const fetchData = async () => {
        try {
            const [exRes, clsRes, subRes] = await Promise.all([
                apiFetch('/principal/exams'),
                apiFetch('/principal/classes'),
                apiFetch('/principal/subjects')
            ]);
            
            const exData = await exRes.json();
            const clsData = await clsRes.json();
            const subData = await subRes.json();
            
            if (exData.success || exData.data) setExams(exData.data || []);
            if (clsData.success) setClasses(clsData.data);
            if (subData.success) setSubjects(subData.data);
        } catch (err) {
            console.error("Failed to fetch exam data", err);
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
        setFormData({ name: 'Unit Test', date: '', classId: '', subjectId: '', totalMarks: 100 });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to save exam", err);
        }
    };

    if (loading) return <div className="p-5 text-center text-slate-500">Loading exam schedules...</div>;

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="animate-fade-in p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800 m-0">Exam Schedule Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Schedule and manage school-wide examinations.</p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 border-none cursor-pointer"
                >
                    <Plus size={18} /> Schedule Exam
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Exam Name</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Class</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Subject</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {exams.length === 0 ? (
                            <tr><td colSpan="6" className="p-5 text-center text-slate-500">No exams scheduled yet.</td></tr>
                        ) : (
                            exams.map(exam => (
                                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <FileText size={16} className="text-indigo-500" /> {exam.name}
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-700">{exam.classes}</td>
                                    <td className="p-4 text-sm text-slate-600">{exam.subject}</td>
                                    <td className="p-4 text-sm text-slate-700 font-medium">
                                        {exam.date !== 'N/A' ? new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg text-xs font-semibold border border-indigo-100 cursor-pointer">Manage</button>
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
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Schedule Examination</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Exam Type</label>
                                <select name="name" value={formData.name} onChange={handleInputChange} className={inputClass} required>
                                    <option value="Unit Test">Unit Test</option>
                                    <option value="Monthly Test">Monthly Test</option>
                                    <option value="Mid Term Exam">Mid Term Exam</option>
                                    <option value="Pre-Board Exam">Pre-Board Exam</option>
                                    <option value="Annual Exam">Annual Exam</option>
                                    <option value="Practical Exam">Practical Exam</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Class</label>
                                    <select name="classId" value={formData.classId} onChange={handleInputChange} className={inputClass}>
                                        <option value="">All Classes</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Subject</label>
                                    <select name="subjectId" value={formData.subjectId} onChange={handleInputChange} className={inputClass}>
                                        <option value="">All Subjects</option>
                                        {subjects.filter(s => !formData.classId || s.class_id.toString() === formData.classId.toString()).map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Total Marks</label>
                                    <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleInputChange} className={inputClass} required min="1" />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg bg-white cursor-pointer hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium cursor-pointer hover:bg-indigo-700 border-none">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamScheduleManagement;
