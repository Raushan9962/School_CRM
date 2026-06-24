import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import StaffForm from './StaffForm';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const StaffManagement = () => {
    const [view, setView] = useState('list'); // 'list' | 'create'
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-users');
            const data = await res.json();
            if (data.success) {
                const allUsers = data.data;
                const filteredStaff = allUsers.filter(u => 
                    u.role !== 'Student' && 
                    u.role !== 'Teacher' && 
                    u.role !== 'Parent' && 
                    u.role !== 'School Admin' &&
                    u.role !== 'Super Admin'
                );
                setStaff(filteredStaff);
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchStaff();
        }
    }, [view]);

    if (view === 'create') {
        return (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Staff Management</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage accountants, librarians, wardens, HR, and other staff.</p>
                    </div>
                    <div>
                        <button 
                            onClick={() => setView('list')}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm transition-colors text-sm"
                        >
                            Back to List
                        </button>
                    </div>
                </div>
                <StaffForm onSave={() => setView('list')} onCancel={() => setView('list')} />
            </div>
        );
    }

    const filteredStaffList = staff.filter(s => 
        s.name?.toLowerCase().includes(search.toLowerCase()) || 
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.role?.toLowerCase().includes(search.toLowerCase())
    );

    const kpiCards = [
        { label: 'Total Staff', value: staff.length, active: true },
        { label: 'Accountants', value: staff.filter(s => s.role === 'Accountant').length, active: false },
        { label: 'Librarians', value: staff.filter(s => s.role === 'Librarian').length, active: false }
    ];

    const actions = (
        <button 
            onClick={() => setView('create')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
            <Plus size={16} strokeWidth={3} /> Add New Staff
        </button>
    );

    const columns = [
        { 
            label: 'Staff Member', 
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
                        View Profile <ArrowRight size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Staff Directory"
            actions={actions}
            columns={columns} 
            data={filteredStaffList} 
            kpiCards={kpiCards}
            onSearch={setSearch}
            loading={loading}
        />
    );
};

export default StaffManagement;
