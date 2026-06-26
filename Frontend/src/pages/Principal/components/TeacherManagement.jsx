import React, { useState, useEffect } from 'react';
import { UserPlus, BookOpen, GraduationCap, CheckCircle, Clock, Heart, Award } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const TeacherManagement = () => {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await apiFetch('/principal/teachers');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setTeachers(data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching teachers:", err);
            }
        };
        fetchTeachers();
    }, []);

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredData = teachers.filter(t => 
        t.name?.toLowerCase().includes(search.toLowerCase()) || 
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.id?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Present') filteredData = filteredData.filter(t => t.status === 'Present');
    if (activeKpi === 'On Leave') filteredData = filteredData.filter(t => t.status === 'On Leave' || t.status === 'Half Day');

    const totalTeachers = teachers.length;
    const presentTeachers = teachers.filter(t => t.status === 'Present').length;
    const onLeaveTeachers = teachers.filter(t => ['On Leave', 'Half Day'].includes(t.status)).length;
    
    let totalExp = 0;
    let expCount = 0;
    teachers.forEach(t => {
        const expMatch = String(t.experience || t.exp || '').match(/(\d+)/);
        if (expMatch) {
            totalExp += parseInt(expMatch[1], 10);
            expCount++;
        }
    });
    const avgExp = expCount > 0 ? (totalExp / expCount).toFixed(1) : 0;
    const attendancePct = totalTeachers > 0 ? Math.round((presentTeachers / totalTeachers) * 100) : 0;

    const kpiCards = [
        { label: 'Total Teachers', value: totalTeachers.toString(), active: activeKpi === 'All', onClick: () => setActiveKpi('All'), sublabel: 'Full Time' },
        { label: 'Present Today', value: presentTeachers.toString(), active: activeKpi === 'Present', onClick: () => setActiveKpi('Present'), sublabel: `${attendancePct}% Attendance` },
        { label: 'On Leave', value: onLeaveTeachers.toString(), active: activeKpi === 'On Leave', onClick: () => setActiveKpi('On Leave'), sublabel: 'Approved' },
        { label: 'Avg Experience', value: `${avgExp} Yrs`, active: activeKpi === 'Experience', onClick: () => setActiveKpi('Experience'), sublabel: 'Highly Qualified' }
    ];

    const columns = [
        { 
            label: 'Teacher Profile', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.avatarSeed}&backgroundColor=0284c7`} alt={row.name} className="w-10 h-10 rounded-full border border-slate-200" />
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                        <p className="text-[11px] text-slate-500 m-0 font-medium">ID: {row.id}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Subject', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <BookOpen size={14} className="text-blue-500" />
                    {row.subject}
                </div>
            )
        },
        { 
            label: 'Qualifications & Exp', 
            render: (row) => (
                <div className="text-left">
                    <div className="flex items-center gap-1 text-slate-700 font-bold text-[12px]">
                        <Award size={12} className="text-amber-500" />
                        {row.experience}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <GraduationCap size={12} />
                        {row.qualifications}
                    </div>
                </div>
            )
        },
        { 
            label: 'Today\'s Status', 
            render: (row) => {
                let badgeClass = 'bg-slate-100 text-slate-600';
                let Icon = Clock;
                if (row.status === 'Present') { badgeClass = 'bg-emerald-100 text-emerald-700'; Icon = CheckCircle; }
                if (row.status === 'On Leave') { badgeClass = 'bg-rose-100 text-rose-700'; Icon = Heart; }
                if (row.status === 'Half Day') { badgeClass = 'bg-amber-100 text-amber-700'; Icon = Clock; }
                
                return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        <Icon size={12} />
                        {row.status}
                    </span>
                );
            }
        },
        { 
            label: 'Actions', 
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button className="px-3 py-1 bg-white border border-slate-200 text-blue-600 rounded hover:bg-blue-50 font-semibold text-xs transition-colors">Profile</button>
                    <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-50 font-semibold text-xs transition-colors">Schedule</button>
                </div>
            )
        }
    ];

    const actions = (
        <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
            <UserPlus size={16} /> Add New Teacher
        </button>
    );

    return (
        <div className="relative">
            <PremiumTable 
                title="Teacher Directory"
                actions={actions}
                columns={columns} 
                data={filteredData} 
                kpiCards={kpiCards}
                onSearch={setSearch}
            />

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 m-0">Add New Teacher</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form className="p-6 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">First Name</label>
                                    <input type="text" placeholder="e.g. Rajesh" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Last Name</label>
                                    <input type="text" placeholder="e.g. Kumar" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Subject Specialization</label>
                                <input type="text" placeholder="e.g. Physics" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Experience (Years)</label>
                                <input type="number" placeholder="e.g. 5" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">Save Teacher</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;
