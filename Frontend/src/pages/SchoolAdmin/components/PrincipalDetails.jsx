import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const PrincipalDetails = () => {
    const [view, setView] = useState('list');
    const [principals, setPrincipals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchPrincipals = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-users');
            const data = await res.json();
            if (data.success) {
                const allUsers = data.data;
                const principalUsers = allUsers.filter(u => u.role === 'Principal');
                setPrincipals(principalUsers);
            }
        } catch (error) {
            console.error("Error fetching principals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchPrincipals();
        }
    }, [view]);

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredPrincipals = principals.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Active') {
        filteredPrincipals = filteredPrincipals;
    }

    const kpiCards = [
        { label: 'Total Principals', value: principals.length, active: activeKpi === 'All', onClick: () => setActiveKpi('All') },
        { label: 'Active Profiles', value: principals.length, active: activeKpi === 'Active', onClick: () => setActiveKpi('Active') }
    ];

    const actions = (
        <button 
            onClick={() => alert("Add principal functionality to be implemented")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
            <Plus size={16} strokeWidth={3} /> Add Principal
        </button>
    );

    const columns = [
        { 
            label: 'Principal Details', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} className="w-10 h-10 rounded-full border border-slate-200" />
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                        <p className="text-[11px] font-bold text-blue-600 bg-blue-50 inline-block px-1.5 rounded mt-0.5 m-0 uppercase tracking-wider">{row.role}</p>
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
                        View Details <ArrowRight size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Principal Details"
            actions={actions}
            columns={columns} 
            data={filteredPrincipals} 
            kpiCards={kpiCards}
            onSearch={setSearch}
            loading={loading}
        />
    );
};

export default PrincipalDetails;
