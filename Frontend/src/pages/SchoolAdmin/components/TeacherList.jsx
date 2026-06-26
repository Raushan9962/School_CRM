import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-teachers');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setTeachers(data.data);
                }
            } else {
                console.warn("Failed to fetch teachers, status:", res.status);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredTeachers = teachers.filter(t => 
        t.name?.toLowerCase().includes(search.toLowerCase()) || 
        t.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
        t.subject?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Active') filteredTeachers = filteredTeachers.filter(t => t.is_active);
    if (activeKpi === 'Inactive') filteredTeachers = filteredTeachers.filter(t => !t.is_active);
    if (activeKpi === 'New This Month') filteredTeachers = filteredTeachers.filter(t => t.created_at && new Date(t.created_at) > new Date(Date.now() - 30*24*60*60*1000));

    const kpiCards = [
        { label: 'All Teachers', value: teachers.length, active: activeKpi === 'All', onClick: () => setActiveKpi('All') },
        { label: 'Active', value: teachers.filter(t => t.is_active).length, active: activeKpi === 'Active', onClick: () => setActiveKpi('Active') },
        { label: 'Inactive', value: teachers.filter(t => !t.is_active).length, active: activeKpi === 'Inactive', onClick: () => setActiveKpi('Inactive') },
        { label: 'New This Month', value: teachers.filter(t => t.created_at && new Date(t.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length, active: activeKpi === 'New This Month', onClick: () => setActiveKpi('New This Month') }
    ];

    const columns = [
        { 
            label: 'Teacher Details', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.image || 'https://via.placeholder.com/40'} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                        <p className="text-[11px] text-slate-500 m-0 uppercase tracking-wide">{row.qualification || 'N/A'}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Emp ID', 
            key: 'employee_id', 
            sortable: true,
            ribbonKey: row => row.created_at && new Date(row.created_at) > new Date(Date.now() - 7*24*60*60*1000) ? 'New' : null,
            render: (row) => <span className="font-medium text-slate-700">{row.employee_id}</span>
        },
        { 
            label: 'Subject', 
            render: (row) => (
                <div className="text-center">
                    <p className="m-0 font-bold text-slate-700">{row.subject || 'N/A'}</p>
                    <p className="m-0 text-[11px] text-slate-500">{row.class_assigned}</p>
                </div>
            )
        },
        { 
            label: 'Contact', 
            render: (row) => (
                <div className="text-left">
                    <p className="m-0 text-slate-700 font-medium">{row.phone || 'N/A'}</p>
                    <p className="m-0 text-[11px] text-slate-500">{row.email || 'N/A'}</p>
                </div>
            )
        },
        { 
            label: 'Experience', 
            render: (row) => <span className="text-slate-600 font-medium">{row.experience || '0'} Yrs</span>
        },
        { 
            label: 'Status', 
            render: (row) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${row.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        { 
            label: 'Actions', 
            render: (row) => (
                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Profile"><Eye size={14} strokeWidth={2.5}/></button>
                    <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit"><Edit2 size={14} strokeWidth={2.5}/></button>
                    <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete"><Trash2 size={14} strokeWidth={2.5}/></button>
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            columns={columns} 
            data={filteredTeachers} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default TeacherList;
