import React, { useState, useEffect } from 'react';
import { Check, X, FileText } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const LeaveManagement = ({ roleFilter }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/school-admin/leaves');
            const data = await res.json();
            if (data.success) {
                let filtered = data.data;
                if (roleFilter) {
                    if (roleFilter === 'Transport Staff') {
                        filtered = filtered.filter(l => l.role === 'Transport Manager' || l.role === 'Driver' || l.role === 'Transport Staff');
                    } else {
                        filtered = filtered.filter(l => l.role === roleFilter);
                    }
                }
                setLeaves(filtered);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await apiFetch(`/school-admin/leaves/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
            } else {
                alert(data.message || 'Failed to update leave status');
            }
        } catch (error) {
            console.error('Error updating leave:', error);
        }
    };

    const filteredLeaves = leaves.filter(l => 
        l.applicant_name?.toLowerCase().includes(search.toLowerCase()) || 
        l.applicant_role?.toLowerCase().includes(search.toLowerCase())
    );

    const kpiCards = [
        { label: 'Total Requests', value: leaves.length, active: true },
        { label: 'Pending', value: leaves.filter(l => l.status === 'Pending').length, active: false },
        { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length, active: false },
        { label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length, active: false }
    ];

    const columns = [
        { 
            label: 'Applicant Details', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.applicant_image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.applicant_name}`} alt={row.applicant_name} className="w-8 h-8 rounded-full border border-slate-200" />
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.applicant_name}</p>
                        <p className="text-[11px] text-blue-600 font-semibold m-0">{row.applicant_role}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Leave Type & Days', 
            sortable: true,
            render: (row) => (
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <FileText size={12} className="text-slate-400" />
                        <span className="font-bold text-slate-700">{row.type}</span>
                    </div>
                    <p className="m-0 text-[11px] text-slate-500 font-medium">{row.days} Day(s)</p>
                </div>
            )
        },
        { 
            label: 'Duration', 
            render: (row) => (
                <div className="text-center text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-100 rounded px-2 py-1 inline-block">
                    <span>{new Date(row.from_date).toLocaleDateString()}</span>
                    <span className="mx-1 text-slate-400">to</span>
                    <span>{new Date(row.to_date).toLocaleDateString()}</span>
                </div>
            )
        },
        { 
            label: 'Reason', 
            render: (row) => <span className="text-xs text-slate-600 line-clamp-2 max-w-[200px] text-left">{row.reason || 'N/A'}</span>
        },
        { 
            label: 'Status', 
            sortable: true,
            render: (row) => {
                let bg = 'bg-amber-100 text-amber-700';
                if (row.status === 'Approved') bg = 'bg-emerald-100 text-emerald-700';
                if (row.status === 'Rejected') bg = 'bg-rose-100 text-rose-700';
                
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${bg}`}>
                        {row.status}
                    </span>
                );
            }
        },
        { 
            label: 'Actions', 
            render: (row) => (
                <div className="flex justify-center gap-2">
                    {row.status === 'Pending' ? (
                        <>
                            <button 
                                onClick={() => updateStatus(row.id, 'Approved')}
                                className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-xs font-bold transition-colors"
                            >
                                <Check size={12} strokeWidth={3} /> Approve
                            </button>
                            <button 
                                onClick={() => updateStatus(row.id, 'Rejected')}
                                className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded text-xs font-bold transition-colors"
                            >
                                <X size={12} strokeWidth={3} /> Reject
                            </button>
                        </>
                    ) : (
                        <span className="text-[11px] text-slate-400 italic">No actions</span>
                    )}
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Leave Requests"
            columns={columns} 
            data={filteredLeaves} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default LeaveManagement;
