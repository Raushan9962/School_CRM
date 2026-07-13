import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Repeat, AlertTriangle, IndianRupee, ScanLine, CheckCircle2, UserCheck } from 'lucide-react';
import apiFetch from '../../../services/api';
import QuickIssueModal from './QuickIssueModal';

const LibrarianOverview = () => {
    // Quick Scan State
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

    const [stats, setStats] = useState({
        totalBooks: 0,
        availableBooks: 0,
        issuedBooks: 0,
        overdueBooks: 0,
        dueToday: 0,
        finesCollected: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/librarian/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl text-slate-900 font-bold">Dashboard Home</h2>
            </div>

            {/* Quick Book Scan */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 text-slate-600 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                        <ScanLine size={20} />
                    </div>
                    <div>
                        <h3 className="m-0 text-sm md:text-base font-bold text-slate-800">Smart Scan Gateway</h3>
                        <p className="m-0 text-xs text-slate-500">Scan a Student ID to view their profile and issue books</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setIsIssueModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-sm font-bold border-none cursor-pointer flex justify-center items-center gap-2 shadow-sm transition-colors"
                >
                    <UserCheck size={16} /> Scan ID to Issue / Return
                </button>
            </div>
            
            <QuickIssueModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] color-slate-500 font-bold uppercase">Total Books</p>
                        <h3 className="m-0 text-lg font-bold text-slate-800">{stats.totalBooks}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Repeat size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] color-slate-500 font-bold uppercase">Books Issued</p>
                        <h3 className="m-0 text-lg font-bold text-slate-800">{stats.issuedBooks}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase">Overdue Books</p>
                        <h3 className="m-0 text-lg font-bold text-slate-800">{stats.overdueBooks}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <IndianRupee size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase">Fines Collected</p>
                        <h3 className="m-0 text-lg font-bold text-slate-800">₹ {stats.finesCollected}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-slate-200 min-h-[300px] flex flex-col items-center justify-center">
                    <BookOpen size={36} className="text-slate-200 mb-3" />
                    <h3 className="m-0 mb-1.5 text-slate-800 text-base font-bold">Library Activity Chart</h3>
                    <p className="m-0 text-slate-500 text-xs">Chart visualization will be implemented here</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                        <AlertTriangle size={18} className="text-amber-500" />
                        <h3 className="m-0 text-slate-800 text-sm font-bold">Action Alerts</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-2.5">
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-md flex gap-2.5 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                            <div>
                                <p className="m-0 mb-0.5 font-bold text-slate-800 text-xs">{stats.overdueBooks} Overdue Books</p>
                                <p className="m-0 text-slate-500 text-[11px]">Books that have not been returned on time.</p>
                            </div>
                        </div>
                        
                        <div className="p-3 bg-red-50 border border-red-100 rounded-md flex gap-2.5 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                            <div>
                                <p className="m-0 mb-0.5 font-bold text-slate-800 text-xs">Fines Pending</p>
                                <p className="m-0 text-slate-500 text-[11px]">₹ 450 pending from 5 students.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibrarianOverview;
