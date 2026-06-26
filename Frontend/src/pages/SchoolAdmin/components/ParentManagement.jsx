import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const ParentManagement = () => {
    const [view, setView] = useState('list');
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchParents = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-parents');
            const data = await res.json();
            if (data.success) {
                setParents(data.data);
            }
        } catch (error) {
            console.error("Error fetching parents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchParents();
        }
    }, [view]);

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredParents = parents.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Active') {
        // Mock filtering for active accounts
        filteredParents = filteredParents; 
    }

    const kpiCards = [
        { label: 'Total Parents', value: parents.length, active: activeKpi === 'All', onClick: () => setActiveKpi('All') },
        { label: 'Active Accounts', value: parents.length, active: activeKpi === 'Active', onClick: () => setActiveKpi('Active') }
    ];

    const actions = (
        <button 
            onClick={() => alert("Add parent functionality to be implemented")}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
            <Plus size={16} strokeWidth={3} /> Add New Parent
        </button>
    );

    const columns = [
        { 
            label: 'Parent Details', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} className="w-10 h-10 rounded-full border border-slate-200" />
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Contact Info', 
            render: (row) => (
                <div className="text-left">
                    <p className="text-[12px] text-slate-600 flex items-center gap-1.5 m-0"><Mail size={12} className="text-slate-400" /> {row.email}</p>
                    <p className="text-[12px] text-slate-600 flex items-center gap-1.5 m-0 mt-1"><Phone size={12} className="text-slate-400" /> {row.phone || 'N/A'}</p>
                </div>
            )
        },
        { 
            label: 'Status', 
            sortable: true,
            render: (row) => (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-bold uppercase tracking-wider border border-emerald-100">
                    Active
                </span>
            )
        },
        { 
            label: 'Action', 
            render: (row) => (
                <div className="flex justify-center">
                    <button className="flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        View Profile <ArrowRight size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Parent Directory"
            actions={actions}
            columns={columns} 
            data={filteredParents} 
            kpiCards={kpiCards}
            onSearch={setSearch}
            loading={loading}
        />
    );
};

export default ParentManagement;
