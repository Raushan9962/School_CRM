import React, { useState, useEffect } from 'react';
import { Users, BookOpen, User, Plus } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const ClassManagement = () => {
    const [search, setSearch] = useState('');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        room: '',
        stream: 'General',
        classTeacher: 'Unassigned',
        studentCount: 0
    });

    const fetchClasses = async () => {
        try {
            const res = await apiFetch('/classes');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setClasses(data);
                else if (data.data) setClasses(data.data);
            }
        } catch (err) {
            console.error("Error fetching classes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only send name and section since other columns might not exist in the DB yet
            const payload = {
                name: formData.name,
                section: formData.section
            };
            const res = await apiFetch('/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', section: '', room: '', stream: 'General', classTeacher: 'Unassigned', studentCount: 0 });
                fetchClasses();
            } else {
                alert('Failed to add class.');
            }
        } catch (err) {
            console.error("Error adding class:", err);
            alert('Error adding class.');
        }
    };

    const filteredData = classes.filter(c => {
        const cName = c.name || '';
        const cTeacher = c.classTeacher || c.class_teacher || 'Unassigned';
        return cName.toLowerCase().includes(search.toLowerCase()) || 
               cTeacher.toLowerCase().includes(search.toLowerCase());
    });

    const totalClasses = classes.length;
    const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
    const avgClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
    const classTeachers = new Set(classes.filter(c => {
        const teacher = c.classTeacher || c.class_teacher || 'Unassigned';
        return teacher !== 'Unassigned';
    }).map(c => c.classTeacher || c.class_teacher)).size;

    const kpiCards = [
        { label: 'Total Classes', value: totalClasses.toString(), active: true, sublabel: 'Across all grades' },
        { label: 'Total Students', value: totalStudents.toString(), active: false, sublabel: 'Enrolled' },
        { label: 'Average Class Size', value: avgClassSize.toString(), active: false, sublabel: 'Students/Class' },
        { label: 'Class Teachers', value: classTeachers.toString(), active: false, sublabel: 'Assigned' }
    ];

    const columns = [
        { 
            label: 'Class Name', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <BookOpen size={18} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                        <p className="text-[11px] text-slate-500 m-0">ID: {row.id}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Section', 
            render: (row) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[12px] border border-blue-100">
                    {row.section}
                </span>
            )
        },
        { 
            label: 'Class Teacher', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <User size={14} className="text-slate-400" />
                    {row.classTeacher || row.class_teacher || 'Unassigned'}
                </div>
            )
        },
        { 
            label: 'Students', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Users size={14} className="text-slate-400" />
                    {row.studentCount || 0}
                </div>
            )
        },
        { 
            label: 'Room', 
            render: (row) => <span className="text-slate-600 font-medium">Room {row.room}</span>
        },
        { 
            label: 'Stream', 
            render: (row) => {
                let badgeClass = 'bg-slate-100 text-slate-600';
                if (row.stream === 'Science') badgeClass = 'bg-emerald-100 text-emerald-700';
                if (row.stream === 'Commerce') badgeClass = 'bg-purple-100 text-purple-700';
                
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {row.stream || 'General'}
                    </span>
                );
            }
        },
        { 
            label: 'Actions', 
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                    <button className="text-rose-600 hover:text-rose-800 font-semibold text-sm">Delete</button>
                </div>
            )
        }
    ];

    const actions = (
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 cursor-pointer">
            <Plus size={16} /> Add New Class
        </button>
    );

    return (
        <div className="animate-fade-in relative">
            <PremiumTable 
                title="Class Management"
                actions={actions}
                columns={columns} 
                data={filteredData} 
                kpiCards={kpiCards}
                onSearch={setSearch}
            />
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Add New Class</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Class Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., Class 10" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Section</label>
                                    <input type="text" name="section" value={formData.section} onChange={handleInputChange} required placeholder="e.g., A" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Room No</label>
                                    <input type="text" name="room" value={formData.room} onChange={handleInputChange} placeholder="e.g., 101" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Stream (Optional)</label>
                                <select name="stream" value={formData.stream} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="General">General</option>
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg cursor-pointer">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer border-none">Save Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
