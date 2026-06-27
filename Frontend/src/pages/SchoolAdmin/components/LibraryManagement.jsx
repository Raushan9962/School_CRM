import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, FileText, ArrowRight, Library, BookOpen, Filter } from 'lucide-react';
import apiFetch from '../../../services/api';

const LibraryManagement = () => {
    const [view, setView] = useState('list');
    const [librarians, setLibrarians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

    const fetchLibrarians = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-librarians');
            const data = await res.json();
            if (data.success) {
                setLibrarians(data.data);
            }
        } catch (error) {
            console.error("Error fetching librarians:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchLibrarians();
        }
    }, [view]);

    let filteredLibrarians = librarians.filter(l => 
        l.name?.toLowerCase().includes(search.toLowerCase()) || 
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.phone?.toLowerCase().includes(search.toLowerCase())
    );

    // Inline styles for accountant dashboard exact mapping
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Library Management</h2>
                    <p style={subTitleStyle}>Manage school librarians and library staff members</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => alert("Add librarian functionality to be implemented")} style={btnPrimary}>
                        <Plus size={16} /> Add Librarian
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Library size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Librarians</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{librarians.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Active')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Active' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Active' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Staff</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{librarians.length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={16} className="text-slate-500" /> Librarian Directory
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search name/email..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '12px', width: '150px' }}
                        />
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Librarian Details</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Contact Info</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading...</td>
                                </tr>
                            ) : filteredLibrarians.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No librarians found.</td>
                                </tr>
                            ) : (
                                filteredLibrarians.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.name}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#4f46e5', background: '#e0e7ff', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold', textTransform: 'uppercase' }}>{row.role || 'Librarian'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Mail size={12} color="#94a3b8" /> {row.email}
                                            </p>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Phone size={12} color="#94a3b8" /> {row.phone || 'N/A'}
                                            </p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #bbf7d0', textTransform: 'uppercase' }}>
                                                Active
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <button style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} className="hover:underline">
                                                View Profile <ArrowRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LibraryManagement;
