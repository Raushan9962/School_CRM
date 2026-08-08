import React, { useState, useEffect } from 'react';
import { Users, Plus, Filter, ArrowRight, ArrowLeft } from 'lucide-react';
import apiFetch from '../../../services/api';
import StaffForm from './StaffForm';

const GenericRoleManagement = ({ roleName, title, description }) => {
    const [view, setView] = useState('list');
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');
    const [selectedStaff, setSelectedStaff] = useState(null);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/users/school-users');
            const data = await res.json();
            if (data.success) {
                let filtered;
                if (roleName === 'Transport Staff') {
                    filtered = data.data.filter(u => u.role === 'Transport Manager' || u.role === 'Driver' || u.role === 'Transport Staff');
                } else {
                    filtered = data.data.filter(u => u.role === roleName);
                }
                setStaff(filtered);
            }
        } catch (error) {
            console.error(`Error fetching ${roleName}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchStaff();
        }
    }, [view, roleName]);

    // Inline style objects mapping standard Tailwind
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
    const btnSecondary = { padding: '8px 16px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

    if (view === 'create') {
        return (
            <div style={containerStyle} className="animate-fade-in">
                <div style={headerStyle}>
                    <div>
                        <h2 style={titleStyle}>{title}</h2>
                        <p style={subTitleStyle}>{description}</p>
                    </div>
                    <button onClick={() => setView('list')} style={btnSecondary}>
                        <ArrowLeft size={16} /> Back to List
                    </button>
                </div>
                <StaffForm onSave={() => { setView('list'); fetchStaff(); }} onCancel={() => setView('list')} initialRole={roleName} />
            </div>
        );
    }

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this ${roleName}?`)) {
            try {
                const res = await apiFetch(`/users/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    setView('list');
                    setSelectedStaff(null);
                    fetchStaff();
                } else {
                    alert(data.message || 'Failed to delete');
                }
            } catch (err) {
                console.error(err);
                alert('Error deleting user');
            }
        }
    };

    if (view === 'profile' && selectedStaff) {
        return (
            <div style={containerStyle} className="animate-fade-in">
                <div style={headerStyle}>
                    <div>
                        <h2 style={titleStyle}>{selectedStaff.name}'s Profile</h2>
                        <p style={subTitleStyle}>{selectedStaff.role} Details</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleDelete(selectedStaff.id)} style={{ ...btnSecondary, color: '#ef4444', borderColor: '#fca5a5' }}>
                            Delete {roleName}
                        </button>
                        <button onClick={() => { setView('list'); setSelectedStaff(null); }} style={btnSecondary}>
                            <ArrowLeft size={16} /> Back to List
                        </button>
                    </div>
                </div>
                
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden', maxWidth: '800px' }}>
                    <div style={{ background: '#f8fafc', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #e2e8f0' }}>
                        <img src={selectedStaff.image || `https://api.dicebear.com/5.x/initials/svg?seed=${selectedStaff.name}`} alt={selectedStaff.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#1e293b', fontWeight: 'bold' }}>{selectedStaff.name}</h3>
                            <p style={{ margin: 0, fontSize: '12px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>{selectedStaff.role}</p>
                            <span style={{ display: 'inline-block', marginTop: '8px', padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #bbf7d0', textTransform: 'uppercase' }}>Active</span>
                        </div>
                    </div>
                    
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div>
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Contact Information</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Email Address</p>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>{selectedStaff.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Phone Number</p>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>{selectedStaff.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Employment Details</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Employee ID</p>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>{selectedStaff.employee_id || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Joined Date</p>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>{selectedStaff.created_at ? new Date(selectedStaff.created_at).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    let filteredStaff = staff.filter(u => 
        u.name?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase())
    );

    const showAddButton = roleName !== 'Principal' || staff.length === 0;

    return (
        <div style={containerStyle} className="animate-fade-in">
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>{title}</h2>
                    <p style={subTitleStyle}>{description}</p>
                </div>
                {showAddButton && (
                    <button onClick={() => setView('create')} style={btnPrimary}>
                        <Plus size={16} /> Add {roleName}
                    </button>
                )}
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
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total {roleName}s</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{staff.length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} className="text-slate-500" /> {roleName} Directory
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search staff..." 
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
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Staff Details</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Contact Info</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading records...</td>
                                </tr>
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No records found.</td>
                                </tr>
                            ) : (
                                filteredStaff.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={row.image || `https://api.dicebear.com/5.x/initials/svg?seed=${row.name}`} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.name}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>{row.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.phone || 'N/A'}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>{row.email || 'N/A'}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #bbf7d0', textTransform: 'uppercase' }}>
                                                Active
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <button onClick={() => { setSelectedStaff(row); setView('profile'); }} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }} className="hover:underline">
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

export default GenericRoleManagement;
