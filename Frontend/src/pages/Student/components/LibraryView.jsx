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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Category <ChevronDown size={16} />
                    </button>
                    
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-sky-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} /> Due Date
                    </button>

                    <div className="relative">
                        <Search size={16} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search books, authors..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', outline: 'none', width: '200px' }} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #0ea5e9', borderRadius: '4px', color: '#0ea5e9', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                        Pay Fines
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b-2 border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            minWidth: '160px',
                            padding: '16px',
                            background: activeTab === tab.id ? '#e0f2fe' : 'white',
                            border: '1px solid',
                            borderColor: activeTab === tab.id ? '#0ea5e9' : '#e2e8f0',
                            borderBottom: 'none',
                            borderRadius: '8px 8px 0 0',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            position: 'relative',
                            marginBottom: '-2px',
                            borderTopWidth: activeTab === tab.id ? '3px' : '1px'
                        }}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="text-sm text-gray-600 font-medium">{tab.label}</span>
                            <span className="text-xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading library data...</div>
                ) : activeTab === 'issued' || activeTab === 'overdue' || activeTab === 'history' ? (
                    (activeTab === 'issued' ? issuedBooks : (activeTab === 'overdue' ? issuedBooks.filter(b => b.status === 'Overdue') : history)).length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No books found for this section.</div>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                    <th className="px-3 py-4 w-[60px]">S.No.</th>
                                    <th className="px-3 py-4">Book ID</th>
                                    <th className="px-3 py-4">Title & Author</th>
                                    <th className="px-3 py-4">Issued On</th>
                                    <th className="px-3 py-4">Due On</th>
                                    <th className="px-3 py-4">Fine Amount</th>
                                    <th className="px-3 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === 'issued' ? issuedBooks : (activeTab === 'overdue' ? issuedBooks.filter(b => b.status === 'Overdue') : history)).map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                        <td style={{ padding: '16px 12px', color: '#111827' }}>
                                            {row.book_id}
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="text-gray-900 font-medium">{row.title}</div>
                                            <div style={{ color: '#6b7280', fontSize: '12px' }}>{row.author}</div>
                                        </td>
                                        <td className="px-3 py-4 text-gray-600">{new Date(row.issued_on).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px 12px', color: row.status === 'Overdue' ? '#dc2626' : '#4b5563', fontWeight: row.status === 'Overdue' ? '600' : 'normal' }}>
                                            {new Date(row.due_on).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 12px', color: row.fine > 0 ? '#dc2626' : '#6b7280', fontWeight: row.fine > 0 ? 'bold' : 'normal' }}>
                                            {row.fine > 0 ? `₹ ${row.fine}` : '₹ 0'}
                                        </td>
                                        <td className="px-3 py-4 text-right">
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                                background: row.status === 'Issued' ? '#dcfce7' : (row.status === 'Returned' ? '#f1f5f9' : '#fee2e2'),
                                                color: row.status === 'Issued' ? '#166534' : (row.status === 'Returned' ? '#4b5563' : '#dc2626')
                                            }}>
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
                        <div className="p-10 text-center text-gray-500">No books available in catalog.</div>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                    <th className="px-3 py-4 w-[60px]">S.No.</th>
                                    <th className="px-3 py-4">ISBN/Code</th>
                                    <th className="px-3 py-4">Title & Author</th>
                                    <th className="px-3 py-4">Availability</th>
                                    <th className="px-3 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {catalog.map((row, idx) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-3 py-4 text-gray-500">{idx + 1}</td>
                                        <td style={{ padding: '16px 12px', color: '#111827' }}>{row.isbn || row.id}</td>
                                        <td className="px-3 py-4">
                                            <div className="text-gray-900 font-medium">{row.title}</div>
                                            <div style={{ color: '#6b7280', fontSize: '12px' }}>{row.author}</div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <span style={{ color: row.available > 0 ? '#10b981' : '#dc2626', fontWeight: '600' }}>
                                                {row.available} / {row.quantity}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-right">
                                            <button disabled={row.available === 0} style={{ padding: '6px 12px', background: row.available > 0 ? 'white' : '#f1f5f9', border: `1px solid ${row.available > 0 ? '#0ea5e9' : '#cbd5e1'}`, color: row.available > 0 ? '#0ea5e9' : '#9ca3af', borderRadius: '4px', cursor: row.available > 0 ? 'pointer' : 'not-allowed', fontWeight: '500' }}>
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
                <button onClick={fetchLibraryData} className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white border-none flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/40 hover:bg-sky-600 transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-4 py-2 border-t border-slate-200 text-gray-600 text-sm gap-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Rows per page: 
                    <select className="border-none outline-none text-gray-900 cursor-pointer bg-transparent">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{activeTab === 'available' ? catalog.length : (activeTab === 'issued' ? issuedBooks.length : history.length)} of {activeTab === 'available' ? catalog.length : (activeTab === 'issued' ? issuedBooks.length : history.length)}</div>
                <div className="flex gap-2">
                    <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }} disabled><ChevronLeft size={20} /></button>
                    <button style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default LibraryView;
