import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const AttendanceManagement = () => {
    const [search, setSearch] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [classData, setClassData] = useState([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await apiFetch('/principal/attendance/summary?date=' + date);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setClassData(data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching class attendance summary:", err);
            }
        };
        fetchAttendance();
    }, [date]);

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredData = classData.filter(d => 
        d.className?.toLowerCase().includes(search.toLowerCase()) || 
        d.classTeacher?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Highest') {
        filteredData = filteredData.filter(d => d.status === 'Excellent');
    } else if (activeKpi === 'Attention') {
        filteredData = filteredData.filter(d => d.status === 'Critical' || d.status === 'Needs Review');
    }

    // Calculate Dynamic KPIs
    let overallAvg = 0;
    let highestAttendance = { value: '-', sublabel: '-' };
    let requiresAttention = { value: '-', sublabel: '-' };

    if (classData.length > 0) {
        let totalStudents = 0;
        let totalPresent = 0;
        let maxRate = -1;
        let minRate = 101;
        let maxClass = '';
        let minClass = '';

        classData.forEach(d => {
            totalStudents += d.totalStudents;
            totalPresent += d.present;
            if (d.attendanceRate > maxRate) {
                maxRate = d.attendanceRate;
                maxClass = `${d.className}-${d.section}`;
            }
            if (d.attendanceRate < minRate) {
                minRate = d.attendanceRate;
                minClass = `${d.className}-${d.section}`;
            }
        });

        overallAvg = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
        
        if (maxRate !== -1) {
            highestAttendance = { value: maxClass, sublabel: `${maxRate}% Present` };
        }
        if (minRate !== 101) {
            requiresAttention = { value: minClass, sublabel: `${minRate}% Present` };
        }
    }

    const kpiCards = [
        { label: 'Overall Student Avg', value: `${overallAvg}%`, active: activeKpi === 'All', onClick: () => setActiveKpi('All'), sublabel: 'Today' },
        { label: 'Staff/Teacher Avg', value: '96.2%', active: false, sublabel: 'Consistent' }, // Static for now
        { label: 'Highest Attendance', value: highestAttendance.value, active: activeKpi === 'Highest', onClick: () => setActiveKpi('Highest'), sublabel: highestAttendance.sublabel },
        { label: 'Requires Attention', value: requiresAttention.value, active: activeKpi === 'Attention', onClick: () => setActiveKpi('Attention'), sublabel: requiresAttention.sublabel }
    ];

    const columns = [
        { 
            label: 'Class & Section', 
            sortable: true,
            render: (row) => (
                <div>
                    <p className="font-bold text-slate-800 m-0">{row.className} - {row.section}</p>
                    <p className="text-[11px] text-slate-500 m-0">Room: {row.id}0{row.section === 'A' ? 1 : 2}</p>
                </div>
            )
        },
        { 
            label: 'Class Teacher', 
            sortable: true,
            render: (row) => <span className="text-slate-600 font-medium">{row.classTeacher}</span>
        },
        { 
            label: 'Student Headcount', 
            render: (row) => (
                <div className="flex flex-col items-center">
                    <span className="font-bold text-slate-800">{row.totalStudents}</span>
                    <div className="flex gap-2 text-[11px] mt-1">
                        <span className="text-emerald-600 font-medium">{row.present} P</span>
                        <span className="text-rose-600 font-medium">{row.absent} A</span>
                    </div>
                </div>
            )
        },
        { 
            label: 'Attendance %', 
            sortable: true,
            render: (row) => {
                let colorClass = 'text-emerald-600';
                let Icon = TrendingUp;
                if (row.attendanceRate < 85) { colorClass = 'text-amber-500'; Icon = Minus; }
                if (row.attendanceRate < 80) { colorClass = 'text-rose-500'; Icon = TrendingDown; }
                
                return (
                    <div className={`flex items-center justify-center gap-1 font-bold ${colorClass}`}>
                        <Icon size={14} />
                        {row.attendanceRate}%
                    </div>
                );
            }
        },
        { 
            label: 'Status', 
            render: (row) => {
                let badgeClass = 'bg-emerald-100 text-emerald-700';
                if (row.status === 'Needs Review') badgeClass = 'bg-amber-100 text-amber-700';
                if (row.status === 'Critical') badgeClass = 'bg-rose-100 text-rose-700';
                
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {row.status}
                    </span>
                );
            }
        }
    ];

    const actions = (
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Calendar className="text-slate-400" size={16} />
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="focus:outline-none text-sm font-medium text-slate-700 bg-transparent"
            />
        </div>
    );

    return (
        <PremiumTable 
            title="Daily Attendance Overview"
            actions={actions}
            columns={columns} 
            data={filteredData} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default AttendanceManagement;
