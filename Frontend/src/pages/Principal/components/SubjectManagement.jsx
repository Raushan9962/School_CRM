import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { BookOpen, Edit2, Trash2, Plus } from 'lucide-react';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        classId: '',
        teacherId: ''
    });

    const fetchData = async () => {
        try {
            const [subRes, clsRes, tchrRes] = await Promise.all([
                apiFetch('/principal/subjects'),
                apiFetch('/principal/classes'),
                apiFetch('/school-admin/teachers') // using school admin's teacher list for simplicity
            ]);
            
            if (subRes.ok) {
                const subData = await subRes.json();
                if (subData.success) setSubjects(subData.data || []);
            } else {
                setSubjects([]);
            }

            if (clsRes.ok) {
                const clsData = await clsRes.json();
                if (clsData.success) setClasses(clsData.data);
            }

            if (tchrRes.ok) {
                const tchrData = await tchrRes.json();
                if (tchrData.success) setTeachers(tchrData.data);
            }
        } catch (err) {
            console.error("Failed to fetch subjects data", err);
            setSubjects([]);
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
        setFormData({ name: '', code: '', classId: '', teacherId: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to save subject", err);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading subjects...</div>;

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="animate-fade-in p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 m-0">Subject Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Create subjects and map them to classes and teachers.</p>
                </div>
                <button 
                    onClick={handleCreateNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 border-none cursor-pointer"
                >
                    <Plus size={18} /> Add New Subject
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">No subjects created yet.</div>
                ) : (
                    subjects.map(sub => (
                        <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 m-0 text-lg">{sub.name}</h3>
                                        <p className="text-xs font-semibold text-slate-500 m-0 mt-1 uppercase tracking-wider">{sub.code || 'NO CODE'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3 flex-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Class</span>
                                    <span className="font-semibold text-slate-700">{sub.class_name ? `${sub.class_name} (${sub.section})` : 'Unassigned'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Teacher</span>
                                    <span className="font-semibold text-slate-700">{sub.teacher_name || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Create New Subject</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Subject Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Mathematics" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Subject Code</label>
                                <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. MTH101" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Assign Class</label>
                                <select name="classId" value={formData.classId} onChange={handleInputChange} className={inputClass}>
                                    <option value="">Select a class...</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Assign Teacher</label>
                                <select name="teacherId" value={formData.teacherId} onChange={handleInputChange} className={inputClass}>
                                    <option value="">Select a teacher...</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.teacher_id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg bg-white cursor-pointer hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 border-none">Create Subject</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;
