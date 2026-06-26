import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { CheckSquare, Clock, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import PremiumTable from '../../../components/ui/PremiumTable';

const TaskDelegation = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
    });

    const fetchTasks = async () => {
        try {
            const res = await apiFetch('/principal/tasks');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setTasks(data.data);
                }
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await apiFetch(`/principal/tasks/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchTasks();
        } catch (err) {
            console.error("Error updating task status:", err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            setFormData({ title: '', assignedTo: '', priority: 'Medium', dueDate: '' });
            fetchTasks();
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredData = tasks.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        t.assignedTo.toLowerCase().includes(search.toLowerCase())
    );

    const kpiCards = [
        { label: 'Total Tasks', value: tasks.length.toString(), active: false, sublabel: 'Assigned' },
        { label: 'Pending', value: tasks.filter(t => t.status === 'Pending').length.toString(), active: true, sublabel: 'Awaiting start' },
        { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length.toString(), active: false, sublabel: 'Being worked on' },
        { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length.toString(), active: false, sublabel: 'Done' }
    ];

    const columns = [
        { 
            label: 'Task Details', 
            render: (row) => (
                <div>
                    <p className="font-bold text-slate-800 m-0">{row.title}</p>
                    <p className="text-[11px] text-slate-500 m-0">ID: {row.id}</p>
                </div>
            )
        },
        { 
            label: 'Assigned To', 
            render: (row) => <span className="font-medium text-slate-700">{row.assignedTo}</span>
        },
        { 
            label: 'Priority', 
            render: (row) => {
                const colors = {
                    'High': 'bg-rose-100 text-rose-700',
                    'Medium': 'bg-amber-100 text-amber-700',
                    'Low': 'bg-emerald-100 text-emerald-700'
                };
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${colors[row.priority] || 'bg-slate-100 text-slate-700'}`}>
                        {row.priority}
                    </span>
                );
            }
        },
        { 
            label: 'Due Date', 
            render: (row) => <span className="text-slate-600 font-medium">{new Date(row.dueDate).toLocaleDateString()}</span>
        },
        { 
            label: 'Status', 
            render: (row) => (
                <select 
                    value={row.status}
                    onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border outline-none ${
                        row.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        row.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            )
        }
    ];

    const actions = (
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
            <Plus size={16} /> Assign Task
        </button>
    );

    return (
        <div className="animate-fade-in p-2">
            <PremiumTable 
                title="Task Delegation"
                actions={actions}
                columns={columns} 
                data={filteredData} 
                kpiCards={kpiCards}
                onSearch={setSearch}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Assign New Task</h3>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Submit monthly report" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                                <input required type="text" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} placeholder="e.g., Dr. Anil Mehra" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                    <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border text-slate-700 rounded-lg hover:bg-slate-50 font-medium cursor-pointer">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer border-none">Assign Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDelegation;
