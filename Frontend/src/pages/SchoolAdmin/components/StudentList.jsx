import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('');

    const fetchStudents = async () => {
        setLoading(true);
        try {
            let url = '/users/school-students';
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (filterClass) params.append('classId', filterClass);
            if (params.toString()) url += `?${params.toString()}`;

            const res = await apiFetch(url);
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [search, filterClass]);

    const kpiCards = [
        { label: 'All Students', value: students.length, active: filterClass === '' },
        { label: 'Active', value: students.filter(s => s.is_active).length, active: false },
        { label: 'Inactive', value: students.filter(s => !s.is_active).length, active: false },
        { label: 'Transport Users', value: students.filter(s => s.transport_required).length, active: false }
    ];

    const columns = [
        { 
            label: 'Student Details', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.image || 'https://via.placeholder.com/40'} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                        <p className="text-[11px] text-slate-500 m-0 uppercase tracking-wide">{row.gender} • {row.blood_group || 'N/A'}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Adm No.', 
            key: 'admission_no', 
            sortable: true,
            ribbonKey: row => row.created_at && new Date(row.created_at) > new Date(Date.now() - 7*24*60*60*1000) ? 'New' : null,
            render: (row) => <span className="font-medium text-slate-700">{row.admission_no}</span>
        },
        { 
            label: 'Class & Sec', 
            render: (row) => (
                <div className="text-center">
                    <p className="m-0 font-bold text-slate-700">{row.class_name || 'N/A'} - {row.class_section || row.section || 'A'}</p>
                    <p className="m-0 text-[11px] text-slate-500">Roll: {row.roll_number || 'N/A'}</p>
                </div>
            )
        },
        { 
            label: 'Parent Contact', 
            render: (row) => (
                <div className="text-center">
                    <p className="m-0 font-medium text-slate-700">{row.father_name || row.guardian_name || 'N/A'}</p>
                    <p className="m-0 text-[11px] text-slate-500">{row.parent_phone}</p>
                </div>
            )
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
                    <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit Student"><Edit2 size={14} strokeWidth={2.5}/></button>
                    <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete Student"><Trash2 size={14} strokeWidth={2.5}/></button>
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            columns={columns} 
            data={students} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default StudentList;
