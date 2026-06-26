import React, { useState, useEffect } from 'react';
import { Users, BookOpen, User, Plus } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const ClassManagement = () => {
    const [search, setSearch] = useState('');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await apiFetch('/principal/classes');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setClasses(data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const filteredData = classes.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.classTeacher.toLowerCase().includes(search.toLowerCase())
    );

    const totalClasses = classes.length;
    const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
    const avgClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
    const classTeachers = new Set(classes.filter(c => c.classTeacher !== 'Unassigned').map(c => c.classTeacher)).size;

    const kpiCards = [
        { label: 'Total Classes', value: totalClasses.toString(), active: true, sublabel: 'Across all grades' },
        { label: 'Total Students', value: totalStudents.toString(), active: false, sublabel: 'Enrolled' },
        { label: 'Average Class Size', value: avgClassSize.toString(), active: false, sublabel: 'Students/Class' },
        { label: 'Class Teachers', value: classTeachers.toString(), active: false, sublabel: 'Assigned' }
    ];

    const columns = [
        { 
            label: 'Class Name', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <BookOpen size={18} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                        <p className="text-[11px] text-slate-500 m-0">ID: {row.id}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Section', 
            render: (row) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[12px] border border-blue-100">
                    {row.section}
                </span>
            )
        },
        { 
            label: 'Class Teacher', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <User size={14} className="text-slate-400" />
                    {row.classTeacher}
                </div>
            )
        },
        { 
            label: 'Students', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Users size={14} className="text-slate-400" />
                    {row.studentCount}
                </div>
            )
        },
        { 
            label: 'Room', 
            render: (row) => <span className="text-slate-600 font-medium">Room {row.room}</span>
        },
        { 
            label: 'Stream', 
            render: (row) => {
                let badgeClass = 'bg-slate-100 text-slate-600';
                if (row.stream === 'Science') badgeClass = 'bg-emerald-100 text-emerald-700';
                if (row.stream === 'Commerce') badgeClass = 'bg-purple-100 text-purple-700';
                
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {row.stream}
                    </span>
                );
            }
        },
        { 
            label: 'Actions', 
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
                    <button className="text-rose-600 hover:text-rose-800 font-semibold text-sm">Delete</button>
                </div>
            )
        }
    ];

    const actions = (
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Plus size={16} /> Add New Class
        </button>
    );

    return (
        <PremiumTable 
            title="Class Management"
            actions={actions}
            columns={columns} 
            data={filteredData} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default ClassManagement;
