import React, { useState, useEffect } from 'react';
import { Check, X, Clock, FileText } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const ProfileUpdatesManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/profile-updates/requests');
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const res = await apiFetch(`/profile-updates/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Request ${action}d successfully`);
                fetchRequests();
            } else {
                alert(data.message || `Error processing request`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredRequests = requests.filter(r => 
        r.name?.toLowerCase().includes(search.toLowerCase()) || 
        r.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Reviewed') {
        // Mock reviewed logic since real endpoint doesn't have it
        filteredRequests = [];
    }

    const kpiCards = [
        { label: 'Total Pending', value: requests.length, active: activeKpi === 'All', onClick: () => setActiveKpi('All') },
        { label: 'Reviewed Today', value: '0', active: activeKpi === 'Reviewed', onClick: () => setActiveKpi('Reviewed') },
        { label: 'Avg Approval Time', value: '2 hrs', active: activeKpi === 'Time', onClick: () => setActiveKpi('Time') }
    ];

    const columns = [
        { 
            label: 'Student Info', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                        {row.name?.charAt(0) || 'S'}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                        <p className="text-[11px] text-slate-500 m-0">{row.email}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Requested Changes', 
            render: (row) => {
                const changes = typeof row.requested_changes === 'string' ? JSON.parse(row.requested_changes || '{}') : row.requested_changes || {};
                const keys = Object.keys(changes);
                return (
                    <div className="text-left">
                        {keys.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {keys.map((k, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                                        {k}: {changes[k]}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 italic text-xs">No specific changes</span>
                        )}
                    </div>
                )
            }
        },
        { 
            label: 'Date Submitted', 
            sortable: true,
            render: (row) => (
                <div className="text-center text-slate-600 font-medium">
                    {new Date(row.created_at).toLocaleDateString()}
                </div>
            )
        },
        { 
            label: 'Actions', 
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button 
                        onClick={() => handleAction(row.id, 'Approve')}
                        className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-xs font-bold transition-colors"
                    >
                        <Check size={12} strokeWidth={3} /> Approve
                    </button>
                    <button 
                        onClick={() => handleAction(row.id, 'Reject')}
                        className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded text-xs font-bold transition-colors"
                    >
                        <X size={12} strokeWidth={3} /> Reject
                    </button>
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Profile Update Requests"
            columns={columns} 
            data={filteredRequests} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default ProfileUpdatesManagement;
