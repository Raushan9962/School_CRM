import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import apiFetch from '../../../../services/api';

const PeriodManagement = () => {
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [periods, setPeriods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: ''
    });

    useEffect(() => {
        if (view === 'list') {
            fetchPeriods();
        }
    }, [view]);

    const fetchPeriods = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/academic/periods');
            if (res.success) {
                setPeriods(res.data);
            }
        } catch (error) {
            console.error('Error fetching periods', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this period?')) return;
        try {
            const res = await apiFetch(`/academic/periods/${id}`, { method: 'DELETE' });
            if (res.success) {
                fetchPeriods();
            } else {
                alert('Failed to delete period');
            }
        } catch (error) {
            console.error('Error deleting period', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/academic/periods', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            if (res.success) {
                alert("Period created successfully!");
                setFormData({ startTime: '', endTime: '' });
                setView('list');
            } else {
                alert('Failed to create period');
            }
        } catch (error) {
            console.error('Error creating period', error);
            alert('Error creating period');
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
                    Period List
                </button>
                <button
                    onClick={() => setView('create')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition flex items-center gap-2 ${view === 'create' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Plus size={16} /> Create Period
                </button>
            </div>

            {/* List View */}
            {view === 'list' && (
                <div className="max-w-3xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-700 text-sm">
                                <th className="p-4 border-b border-slate-200">Sl</th>
                                <th className="p-4 border-b border-slate-200">Start Time</th>
                                <th className="p-4 border-b border-slate-200">End Time</th>
                                <th className="p-4 border-b border-slate-200 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
                            ) : periods.length === 0 ? (
                                <tr><td colSpan="4" className="text-center p-4 text-slate-500">No periods found.</td></tr>
                            ) : periods.map((item, index) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 text-slate-600">{index + 1}</td>
                                    <td className="p-4 font-medium text-slate-900">{item.start_time}</td>
                                    <td className="p-4 font-medium text-slate-900">{item.end_time}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
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
                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Add New Period</h3>
                                <p className="text-sm text-slate-500">Define the start and end time for the period</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                                <input value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} type="time" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                                <input value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} type="time" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-2 font-medium">
                            <CheckCircle size={18} />
                            Save Period
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PeriodManagement;
