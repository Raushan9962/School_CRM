import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Paperclip, CheckCircle } from 'lucide-react';
import apiFetch from '../../../../services/api';

const TeacherPlanner = () => {
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [planners, setPlanners] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        class: '',
        section: '',
        subject: '',
        topic: '',
        date: '',
        homeAssignment: '',
        plan: '',
        attachment: null
    });

    useEffect(() => {
        if (view === 'list') {
            fetchPlanners();
        }
    }, [view]);

    const fetchPlanners = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/academic/planners');
            if (res.success) {
                setPlanners(res.data);
            }
        } catch (error) {
            console.error('Error fetching planners', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this planner?')) return;
        try {
            const res = await apiFetch(`/academic/planners/${id}`, { method: 'DELETE' });
            if (res.success) {
                fetchPlanners();
            } else {
                alert('Failed to delete planner');
            }
        } catch (error) {
            console.error('Error deleting planner', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const submitData = new FormData();
            submitData.append('className', formData.class);
            submitData.append('section', formData.section);
            submitData.append('subject', formData.subject);
            submitData.append('topic', formData.topic);
            submitData.append('date', formData.date);
            submitData.append('homeAssignment', formData.homeAssignment);
            submitData.append('plan', formData.plan);
            if (formData.attachment) {
                submitData.append('attachment', formData.attachment);
            }

            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/academic/planners`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });
            const data = await res.json();
            
            if (data.success) {
                alert("Planner saved successfully!");
                setFormData({ class: '', section: '', subject: '', topic: '', date: '', homeAssignment: '', plan: '', attachment: null });
                setView('list');
            } else {
                alert("Failed to save planner");
            }
        } catch (error) {
            console.error('Error saving planner', error);
            alert("Error saving planner");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {/* Header / Tabs */}
            <div className="flex gap-4 border-b border-slate-200 mb-6 pb-2">
                <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${view === 'list' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Planner List
                </button>
                <button
                    onClick={() => setView('create')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition flex items-center gap-2 ${view === 'create' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Plus size={16} /> Create Planner
                </button>
            </div>

            {/* List View */}
            {view === 'list' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-700 text-sm">
                                <th className="p-3 border-b border-slate-200">Sl</th>
                                <th className="p-3 border-b border-slate-200">Class</th>
                                <th className="p-3 border-b border-slate-200">Section</th>
                                <th className="p-3 border-b border-slate-200">Subject</th>
                                <th className="p-3 border-b border-slate-200">Teacher</th>
                                <th className="p-3 border-b border-slate-200">Date</th>
                                <th className="p-3 border-b border-slate-200">Topic</th>
                                <th className="p-3 border-b border-slate-200">Plan</th>
                                <th className="p-3 border-b border-slate-200 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" className="text-center p-4">Loading...</td></tr>
                            ) : planners.length === 0 ? (
                                <tr><td colSpan="9" className="text-center p-4 text-slate-500">No planners found.</td></tr>
                            ) : planners.map((item, index) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                                    <td className="p-3 text-slate-600">{index + 1}</td>
                                    <td className="p-3 text-slate-800">{item.class_name}</td>
                                    <td className="p-3 text-slate-600">{item.section}</td>
                                    <td className="p-3 font-medium text-slate-900">{item.subject}</td>
                                    <td className="p-3 text-slate-600">{item.teacher_name}</td>
                                    <td className="p-3 text-slate-600">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-slate-800">{item.topic}</td>
                                    <td className="p-3 text-slate-500 truncate max-w-[150px]">{item.plan}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-2">
                                            {item.attachment_url && (
                                                <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${item.attachment_url}`} target="_blank" rel="noreferrer" className="p-1.5 text-slate-900 hover:bg-slate-100 rounded transition"><Eye size={16} /></a>
                                            )}
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create View */}
            {view === 'create' && (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
                            <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900">
                                <option value="">Select Class</option>
                                <option>Class 10</option>
                                <option>Class 9</option>
                                <option>Class 8</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Section</label>
                            <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900">
                                <option value="">Select Section</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                            <input value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} type="text" required placeholder="Enter Subject" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                            <input value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} type="date" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                        <input value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} type="text" required placeholder="Enter Topic" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Home Assignment</label>
                        <textarea value={formData.homeAssignment} onChange={(e) => setFormData({...formData, homeAssignment: e.target.value})} rows="2" placeholder="Describe home assignment..." className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Plan</label>
                        <textarea value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} rows="4" required placeholder="Describe your teaching plan..." className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Attachment</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 transition border border-slate-300">
                                <Paperclip size={18} />
                                <span>Choose File</span>
                                <input type="file" className="hidden" onChange={(e) => setFormData({...formData, attachment: e.target.files[0]})} />
                            </label>
                            <span className="text-sm text-slate-500">
                                {formData.attachment ? formData.attachment.name : 'No file chosen'}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-2 font-medium">
                            <CheckCircle size={18} />
                            Save Planner
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TeacherPlanner;
