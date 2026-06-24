import React, { useState, useEffect } from 'react';
import { IndianRupee, Download, CheckCircle, Clock, FileText } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const PayrollManagement = ({ roleFilter }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('all');

    useEffect(() => {
        const fetchPayroll = async () => {
            setLoading(true);
            try {
                // Fetch staff and their payroll details
                const res = await apiFetch('/users/school-users');
                const data = await res.json();
                if (data.success) {
                    const allUsers = data.data;
                    let staffOnly = allUsers.filter(u => 
                        u.role !== 'Student' && 
                        u.role !== 'Parent' && 
                        u.role !== 'School Admin' &&
                        u.role !== 'Super Admin'
                    );

                    if (roleFilter) {
                        if (roleFilter === 'Transport Staff') {
                            staffOnly = staffOnly.filter(u => u.role === 'Transport Manager' || u.role === 'Driver' || u.role === 'Transport Staff');
                        } else {
                            staffOnly = staffOnly.filter(u => u.role === roleFilter);
                        }
                    }
                    
                    // Add mock payroll data for the UI
                    const staffWithPayroll = staffOnly.map(s => ({
                        ...s,
                        basicSalary: s.basicSalary || Math.floor(Math.random() * 30000) + 15000,
                        allowances: Math.floor(Math.random() * 5000) + 2000,
                        deductions: Math.floor(Math.random() * 2000) + 500,
                        status: Math.random() > 0.5 ? 'Processed' : 'Pending',
                        lastProcessed: '2026-05-31'
                    }));
                    setStaff(staffWithPayroll);
                }
            } catch (error) {
                console.error("Error fetching payroll data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, []);

    const filteredStaff = staff.filter(s => 
        (tab === 'all' || s.status.toLowerCase() === tab) &&
        (s.name?.toLowerCase().includes(search.toLowerCase()) || 
         s.role?.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPayroll = staff.reduce((acc, s) => acc + (s.basicSalary + s.allowances - s.deductions), 0);
    const processedPayroll = staff.filter(s => s.status === 'Processed').reduce((acc, s) => acc + (s.basicSalary + s.allowances - s.deductions), 0);

    const kpiCards = [
        { label: 'Total Payroll (Monthly)', value: `₹${totalPayroll.toLocaleString()}`, active: tab === 'all', onClick: () => setTab('all') },
        { label: 'Processed', value: `₹${processedPayroll.toLocaleString()}`, active: tab === 'processed', onClick: () => setTab('processed') },
        { label: 'Pending Processing', value: `₹${(totalPayroll - processedPayroll).toLocaleString()}`, active: tab === 'pending', onClick: () => setTab('pending') }
    ];

    const actions = (
        <div className="flex gap-2">
            <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                <Download size={16} /> Export CSV
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                <IndianRupee size={16} /> Process All
            </button>
        </div>
    );

    const columns = [
        { 
            label: 'Employee', 
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
            label: 'Net Salary', 
            sortable: true,
            render: (row) => {
                const net = row.basicSalary + row.allowances - row.deductions;
                return (
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">₹{net.toLocaleString()}</p>
                        <p className="text-[11px] text-slate-500 m-0">Basic: ₹{row.basicSalary.toLocaleString()}</p>
                    </div>
                );
            }
        },
        { 
            label: 'Status', 
            sortable: true,
            render: (row) => {
                if (row.status === 'Processed') {
                    return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-100">
                            <CheckCircle size={14} className="text-emerald-500" /> Processed
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-100">
                        <Clock size={14} className="text-amber-500" /> Pending
                    </span>
                );
            }
        },
        { 
            label: 'Action', 
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button className="flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Payslip">
                        <FileText size={16} />
                    </button>
                    {row.status === 'Pending' && (
                        <button className="flex items-center justify-center p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Process Salary">
                            <IndianRupee size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Payroll Management"
            actions={actions}
            columns={columns} 
            data={filteredStaff} 
            kpiCards={kpiCards}
            onSearch={setSearch}
            loading={loading}
        />
    );
};

export default PayrollManagement;
