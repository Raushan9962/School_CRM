import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const StaffAttendance = ({ roleFilter }) => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [search, setSearch] = useState('');

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`/school-admin/staff-attendance?date=${date}`);
            const data = await res.json();
            if (data.success) {
                let filtered = data.data;
                if (roleFilter) {
                    if (roleFilter === 'Transport Staff') {
                        filtered = filtered.filter(u => u.role === 'Transport Manager' || u.role === 'Driver' || u.role === 'Transport Staff');
                    } else {
                        filtered = filtered.filter(u => u.role === roleFilter);
                    }
                }
                setStaffList(filtered);
            }
        } catch (error) {
            console.error('Error fetching staff attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    const markAttendance = async (userId, status) => {
        try {
            const res = await apiFetch('/school-admin/staff-attendance', {
                method: 'POST',
                body: JSON.stringify({ userId, date, status })
            });
            const data = await res.json();
            if (data.success) {
                setStaffList(prev => prev.map(staff => 
                    staff.user_id === userId ? { ...staff, status: status } : staff
                ));
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Failed to mark attendance');
        }
    };

    const filteredStaff = staffList.filter(s => 
        s.name?.toLowerCase().includes(search.toLowerCase()) || 
        s.role?.toLowerCase().includes(search.toLowerCase())
    );

    const presentCount = staffList.filter(s => s.status === 'Present').length;
    const absentCount = staffList.filter(s => s.status === 'Absent').length;
    const hdCount = staffList.filter(s => s.status === 'Half Day').length;

    const kpiCards = [
        { label: 'Total Staff', value: staffList.length, active: true },
        { label: 'Present', value: presentCount, active: false },
        { label: 'Absent', value: absentCount, active: false },
        { label: 'Half Day', value: hdCount, active: false }
    ];

    const actions = (
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <CalendarIcon className="text-slate-400" size={16} />
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="focus:outline-none text-sm font-medium text-slate-700 bg-transparent"
            />
        </div>
    );

    const columns = [
        { 
            label: 'Staff Member', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} className="w-8 h-8 rounded-full border border-slate-200" />
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.name}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Role', 
            sortable: true,
            render: (row) => <span className="text-slate-600 font-medium">{row.role}</span>
        },
        { 
            label: 'Current Status', 
            sortable: true,
            render: (row) => {
                if (!row.status) {
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-bold uppercase tracking-wider">
                            <Clock size={12} /> Not Marked
                        </span>
                    );
                }
                if (row.status === 'Present') {
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold uppercase tracking-wider">
                            <CheckCircle size={12} /> Present
                        </span>
                    );
                }
                if (row.status === 'Absent') {
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[11px] font-bold uppercase tracking-wider">
                            <XCircle size={12} /> Absent
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[11px] font-bold uppercase tracking-wider">
                        {row.status}
                    </span>
                );
            }
        },
        { 
            label: 'Action', 
            render: (row) => (
                <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => markAttendance(row.user_id, 'Present')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${row.status === 'Present' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                    >
                        P
                    </button>
                    <button 
                        onClick={() => markAttendance(row.user_id, 'Absent')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${row.status === 'Absent' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                    >
                        A
                    </button>
                    <button 
                        onClick={() => markAttendance(row.user_id, 'Half Day')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${row.status === 'Half Day' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                    >
                        HD
                    </button>
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Staff Attendance"
            actions={actions}
            columns={columns} 
            data={filteredStaff} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default StaffAttendance;
