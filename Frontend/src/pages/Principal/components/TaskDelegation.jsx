import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { CheckSquare, Clock, AlertCircle, Plus, Search, Filter, MoreVertical, PlayCircle, CheckCircle2 } from 'lucide-react';

const TaskDelegation = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [activeTab, setActiveTab] = useState('All');

    // Group staff by role for the dropdown
    const staffByRole = staffList.reduce((acc, staff) => {
        const role = staff.role_name || 'Other';
        if (!acc[role]) acc[role] = [];
        acc[role].push(staff);
        return acc;
    }, {});

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
                if (data.success) setTasks(data.data);
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        apiFetch('/principal/staff-list').then(r => r.json()).then(d => { if (d.success) setStaffList(d.data); });
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

    let filteredData = tasks.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        t.assignedTo.toLowerCase().includes(search.toLowerCase())
    );

    if (activeTab === 'Pending') filteredData = filteredData.filter(t => t.status === 'Pending');
    if (activeTab === 'In Progress') filteredData = filteredData.filter(t => t.status === 'In Progress');
    if (activeTab === 'Completed') filteredData = filteredData.filter(t => t.status === 'Completed');

    const kpiCards = [
        { id: 'All', label: 'Total Tasks', value: tasks.length.toString(), icon: <CheckSquare size={24} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
        { id: 'Pending', label: 'Pending Tasks', value: tasks.filter(t => t.status === 'Pending').length.toString(), icon: <Clock size={24} />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
        { id: 'In Progress', label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length.toString(), icon: <PlayCircle size={24} />, iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
        { id: 'Completed', label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length.toString(), icon: <CheckCircle2 size={24} />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' }
    ];

    const getPriorityBadge = (priority) => {
        switch(priority) {
            case 'High': return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm"><AlertCircle size={12} /> High</span>;
            case 'Medium': return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">Medium</span>;
            case 'Low': return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">Low</span>;
            default: return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">{priority}</span>;
        }
    };

    // Inline style objects matching TransportManagement
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
    const btnSecondary = { padding: '8px 16px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

    return (
        <div style={containerStyle} className="animate-fade-in pb-10">
            {/* Header Area */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Task Delegation</h2>
                    <p style={subTitleStyle}>Assign, track and manage staff responsibilities.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={btnPrimary}
                >
                    <Plus size={16} /> Assign New Task
                </button>
            </div>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {kpiCards.map(card => (
                    <div 
                        key={card.id} 
                        onClick={() => setActiveTab(card.id)}
                        style={{ 
                            background: 'white', 
                            padding: '16px', 
                            borderRadius: '8px', 
                            border: activeTab === card.id ? '1px solid #3b82f6' : '1px solid #e2e8f0', 
                            boxShadow: activeTab === card.id ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            cursor: 'pointer', 
                            transition: 'all 0.2s' 
                        }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: card.iconBg === 'bg-blue-50' ? '#eff6ff' : card.iconBg === 'bg-emerald-50' ? '#dcfce7' : card.iconBg === 'bg-purple-50' ? '#f3e8ff' : '#ffedd5', color: card.iconColor === 'text-blue-500' ? '#1d4ed8' : card.iconColor === 'text-emerald-500' ? '#166534' : card.iconColor === 'text-purple-500' ? '#6b21a8' : '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {React.cloneElement(card.icon, { size: 18 })}
                        </div>
                        <div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{card.label}</p>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Task List Table */}
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckSquare size={16} className="text-slate-500" /> Active Tasks
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '12px', width: '200px' }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Task Name & Priority</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Assignee</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Due Date</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No tasks found.</td>
                                </tr>
                            ) : (
                                filteredData.map((row) => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.title}</p>
                                            <div style={{ marginTop: '4px' }}>
                                                {getPriorityBadge(row.priority)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>{row.assignee_name || row.assignedTo}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontWeight: '500' }}>{new Date(row.dueDate).toLocaleDateString()}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <select 
                                                value={row.status}
                                                onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                                                style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', background: 'white', color: '#334155' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>Assign New Task</h3>
                        </div>
                        <form onSubmit={handleCreateTask} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Task Title *</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} placeholder="e.g., Submit monthly report" />
                            </div>
                            <div>
                                <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Select Staff Role *</label>
                                <select required name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}}>
                                    <option value="">-- Select Role --</option>
                                    {Object.keys(staffByRole).map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Priority</label>
                                    <select name="priority" value={formData.priority} onChange={handleInputChange} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}}>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Due Date *</label>
                                    <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondary}>Cancel</button>
                                <button type="submit" style={btnPrimary}>Assign Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDelegation;
