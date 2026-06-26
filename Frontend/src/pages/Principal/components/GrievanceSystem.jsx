import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { AlertTriangle, Plus, Search, MessageSquare } from 'lucide-react';
import PremiumTable from '../../../components/ui/PremiumTable';

const GrievanceSystem = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        subject: '',
        raisedBy: '',
        category: 'Academic'
    });

    const fetchGrievances = async () => {
        try {
            const res = await apiFetch('/principal/grievances');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setGrievances(data.data);
                }
            }
        } catch (err) {
            console.error("Error fetching grievances:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await apiFetch(`/principal/grievances/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchGrievances();
        } catch (err) {
            console.error("Error updating grievance status:", err);
        }
    };

    const handleCreateGrievance = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/grievances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            setFormData({ subject: '', raisedBy: '', category: 'Academic' });
            fetchGrievances();
        } catch (err) {
            console.error("Error creating grievance:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredData = grievances.filter(g => 
        g.subject.toLowerCase().includes(search.toLowerCase()) || 
        g.raisedBy.toLowerCase().includes(search.toLowerCase())
    );

    const kpiCards = [
        { label: 'Total Complaints', value: grievances.length.toString(), active: false, sublabel: 'Received' },
        { label: 'Open', value: grievances.filter(g => g.status === 'Open').length.toString(), active: true, sublabel: 'Needs attention' },
        { label: 'Investigating', value: grievances.filter(g => g.status === 'Investigating').length.toString(), active: false, sublabel: 'Under review' },
        { label: 'Resolved', value: grievances.filter(g => g.status === 'Resolved').length.toString(), active: false, sublabel: 'Closed' }
    ];

    const columns = [
        { 
            label: 'Subject', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex justify-center items-center text-slate-400">
                        <MessageSquare size={14} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 m-0">{row.subject}</p>
                        <p className="text-[11px] text-slate-500 m-0">ID: {row.id}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Raised By', 
            render: (row) => <span className="font-medium text-slate-700">{row.raisedBy}</span>
        },
        { 
            label: 'Category', 
            render: (row) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px] border border-purple-100 uppercase tracking-wider">
                    {row.category}
                </span>
            )
        },
        { 
            label: 'Date', 
            render: (row) => <span className="text-slate-600 font-medium">{new Date(row.date).toLocaleDateString()}</span>
        },
        { 
            label: 'Status', 
            render: (row) => (
                <select 
                    value={row.status}
                    onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border outline-none ${
                        row.status === 'Open' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        row.status === 'Investigating' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                >
                    <option value="Open">Open</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved</option>
                </select>
            )
        }
    ];

    const actions = (
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-colors shadow-sm"
        >
            <Plus size={16} /> Log Grievance
        </button>
    );

    return (
        <div className="animate-fade-in p-2">
            <PremiumTable 
                title="Grievances & Complaints"
                actions={actions}
                columns={columns} 
                data={filteredData} 
                kpiCards={kpiCards}
                onSearch={setSearch}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Log New Grievance</h3>
                        <form onSubmit={handleCreateGrievance} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject / Issue</label>
                                <input required type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Brief description of the issue" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Raised By</label>
                                <input required type="text" name="raisedBy" value={formData.raisedBy} onChange={handleInputChange} placeholder="e.g., Parent (Class 10), Student Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500">
                                    <option value="Academic">Academic</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Discipline">Discipline</option>
                                    <option value="IT Support">IT Support</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border text-slate-700 rounded-lg hover:bg-slate-50 font-medium cursor-pointer">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 cursor-pointer border-none">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GrievanceSystem;
