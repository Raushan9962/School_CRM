import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, FileText, ArrowRight, Filter, ShieldCheck } from 'lucide-react';
import apiFetch from '../../../services/api';

const PrincipalDetails = () => {
    const [view, setView] = useState('list');
    const [principals, setPrincipals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

    const fetchPrincipals = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-users');
            const data = await res.json();
            if (data.success) {
                const allUsers = data.data;
                const principalUsers = allUsers.filter(u => u.role === 'Principal');
                setPrincipals(principalUsers);
            }
        } catch (error) {
            console.error("Error fetching principals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchPrincipals();
        }
    }, [view]);

    let filteredPrincipals = principals.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>Principal Management</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Manage principal accounts and access</p>
                </div>
                <button 
                    onClick={() => alert("Add principal functionality to be implemented")} 
                    style={{ padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <Plus size={16} /> Add Principal
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Principals</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{principals.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Active')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Active' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Active' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Profiles</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{principals.length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} className="text-slate-500" /> Principal Directory
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search principal..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '12px', width: '200px' }}
                        />
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Principal Details</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Contact Info</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading records...</td>
                                </tr>
                            ) : filteredPrincipals.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No records found.</td>
                                </tr>
                            ) : (
                                filteredPrincipals.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.name}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>Principal Account</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                                                    <Mail size={12} color="#94a3b8" /> {row.email}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                                                    <Phone size={12} color="#94a3b8" /> {row.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #bbf7d0', textTransform: 'uppercase' }}>
                                                Active
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
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

export default PrincipalDetails;
