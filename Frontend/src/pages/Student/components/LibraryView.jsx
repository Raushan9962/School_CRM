import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight, BookOpen, Clock, AlertCircle } from 'lucide-react';
import apiFetch from '../../../services/api';

const LibraryView = () => {
    const [activeTab, setActiveTab] = useState('issued');
    const [transactions, setTransactions] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLibraryData = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                
                // Fetch transactions
                const txRes = await apiFetch(`/books/transactions/user/${user.id}`);
                if (txRes.ok) {
                    const txData = await txRes.json();
                    setTransactions(txData);
                }

                // Fetch catalog
                const catRes = await apiFetch(`/books`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCatalog(catData);
                }
            }
        } catch (error) {
            console.error("Error fetching library data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLibraryData();
    }, []);

    const issuedBooks = transactions.filter(t => t.status === 'Issued' || t.status === 'Overdue');
    const overdueFines = issuedBooks.reduce((acc, t) => acc + Number(t.fine || 0), 0);
    const history = transactions.filter(t => t.status === 'Returned');

    const tabs = [
        { id: 'issued', label: 'Issued Books', count: issuedBooks.length, subtext: 'Currently Borrowed' },
        { id: 'overdue', label: 'Overdue/Fines', count: `₹ ${overdueFines}`, subtext: `${issuedBooks.filter(t => t.status === 'Overdue').length} Book(s) Overdue` },
        { id: 'history', label: 'History', count: history.length, subtext: 'Books Read' },
        { id: 'available', label: 'Available Books', count: catalog.length, subtext: 'In Library' }
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Category <ChevronDown size={14} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-blue-600 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={14} /> Due Date
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search books, authors..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-48" />
                    </div>
                    <button className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                        Pay Fines
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[160px] p-4 text-left cursor-pointer flex flex-col gap-1 relative -mb-[1px] border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className={`text-xs font-bold ${activeTab === tab.id ? 'text-blue-700' : 'text-slate-600'}`}>{tab.label}</span>
                            <span className={`text-lg font-bold leading-none ${activeTab === tab.id ? 'text-blue-800' : 'text-slate-800'}`}>{tab.count}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading library data...</div>
                ) : activeTab === 'issued' || activeTab === 'overdue' || activeTab === 'history' ? (
                    (activeTab === 'issued' ? issuedBooks : (activeTab === 'overdue' ? issuedBooks.filter(b => b.status === 'Overdue') : history)).length === 0 ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">No books found for this section.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                    <th className="px-4 py-2 font-bold">Book ID</th>
                                    <th className="px-4 py-2 font-bold">Title & Author</th>
                                    <th className="px-4 py-2 font-bold">Issued On</th>
                                    <th className="px-4 py-2 font-bold">Due On</th>
                                    <th className="px-4 py-2 font-bold text-right">Fine Amount</th>
                                    <th className="px-4 py-2 font-bold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {(activeTab === 'issued' ? issuedBooks : (activeTab === 'overdue' ? issuedBooks.filter(b => b.status === 'Overdue') : history)).map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">
                                            {row.book_id}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <div className="font-bold text-slate-800">{row.title}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">{row.author}</div>
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-600">{new Date(row.issued_on).toLocaleDateString()}</td>
                                        <td className={`px-4 py-2.5 ${row.status === 'Overdue' ? 'text-red-600 font-bold' : 'text-slate-600 font-medium'}`}>
                                            {new Date(row.due_on).toLocaleDateString()}
                                        </td>
                                        <td className={`px-4 py-2.5 text-right ${row.fine > 0 ? 'text-red-600 font-bold' : 'text-slate-500 font-medium'}`}>
                                            {row.fine > 0 ? `₹ ${row.fine}` : '₹ 0'}
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                row.status === 'Issued' ? 'bg-emerald-50 text-emerald-600' : 
                                                (row.status === 'Returned' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-600')
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : activeTab === 'available' ? (
                    catalog.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">No books available in catalog.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                    <th className="px-4 py-2 font-bold">ISBN/Code</th>
                                    <th className="px-4 py-2 font-bold">Title & Author</th>
                                    <th className="px-4 py-2 font-bold text-center">Availability</th>
                                    <th className="px-4 py-2 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {catalog.map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-800">{row.isbn || row.id}</td>
                                        <td className="px-4 py-2.5">
                                            <div className="font-bold text-slate-800">{row.title}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">{row.author}</div>
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className={`font-bold ${row.available > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {row.available} / {row.quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <button disabled={row.available === 0} className={`px-3 py-1.5 rounded font-bold transition-colors inline-flex items-center gap-1.5 border ${
                                                row.available > 0 ? 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}>
                                                {row.available > 0 ? 'Reserve' : 'Waitlist'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : null}
                
                {/* Floating Action Button */}
                <button onClick={fetchLibraryData} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] font-bold gap-4">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-slate-700 bg-transparent font-bold cursor-pointer">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{activeTab === 'available' ? catalog.length : (activeTab === 'issued' ? issuedBooks.length : history.length)} of {activeTab === 'available' ? catalog.length : (activeTab === 'issued' ? issuedBooks.length : history.length)}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default LibraryView;
