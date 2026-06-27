import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Users, Plus, Phone, Filter, ArrowLeft, Navigation } from 'lucide-react';
import apiFetch from '../../../services/api';

const TransportManagement = () => {
    const [view, setView] = useState('list');
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeKpi, setActiveKpi] = useState('All');

    const [form, setForm] = useState({ routeName: '', busNumber: '', driverName: '', driverPhone: '', monthlyFee: '' });

    const fetchRoutes = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/school-admin/routes');
            const data = await res.json();
            if (data.success) {
                setRoutes(data.data);
            }
        } catch (error) {
            console.error('Error fetching routes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchRoutes();
        }
    }, [view]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/school-admin/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                alert('Route added successfully!');
                setView('list');
            } else {
                alert(data.message || 'Failed to add route');
            }
        } catch (error) {
            console.error(error);
        }
    };

    let filteredRoutes = routes.filter(r => 
        r.route_name?.toLowerCase().includes(search.toLowerCase()) || 
        r.bus_number?.toLowerCase().includes(search.toLowerCase()) ||
        r.driver_name?.toLowerCase().includes(search.toLowerCase())
    );

    // Inline style objects mapping standard Tailwind
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
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
                        <h2 style={titleStyle}>Add Transport Route</h2>
                        <p style={subTitleStyle}>Configure a new bus route and assign a driver</p>
                    </div>
                    <button onClick={() => setView('list')} style={btnSecondary}>
                        <ArrowLeft size={16} /> Back to Routes
                    </button>
                </div>
                
                <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Route Name / Area</label><input required type="text" value={form.routeName} onChange={e => setForm({...form, routeName: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} placeholder="e.g. Downtown Express" /></div>
                        <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Bus / Vehicle Number</label><input required type="text" value={form.busNumber} onChange={e => setForm({...form, busNumber: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                        <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Driver Name</label><input required type="text" value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                        <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Driver Phone</label><input type="text" value={form.driverPhone} onChange={e => setForm({...form, driverPhone: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                        <div><label style={{display:'block', fontSize:'12px', fontWeight:'bold', color:'#475569', marginBottom:'6px'}}>Monthly Transport Fee (₹)</label><input type="number" value={form.monthlyFee} onChange={e => setForm({...form, monthlyFee: e.target.value})} style={{width:'100%', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', outline:'none', fontSize:'13px'}} /></div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                            <button type="submit" style={btnPrimary}>
                                Add Route
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle} className="animate-fade-in">
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Transport Management</h2>
                    <p style={subTitleStyle}>Manage school bus routes, drivers, and transport fees</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setView('create')} style={btnPrimary}>
                        <Plus size={16} /> Add New Route
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div 
                    onClick={() => setActiveKpi('All')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'All' ? '1px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: activeKpi === 'All' ? '0 0 0 1px #3b82f6' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Navigation size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Routes</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{routes.length}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveKpi('Active')}
                    style={{ background: 'white', padding: '16px', borderRadius: '8px', border: activeKpi === 'Active' ? '1px solid #10b981' : '1px solid #e2e8f0', boxShadow: activeKpi === 'Active' ? '0 0 0 1px #10b981' : '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bus size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Buses</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{routes.length}</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} className="text-slate-500" /> Active Routes
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px' }}>
                        <Filter size={14} color="#64748b" />
                        <input 
                            type="text" 
                            placeholder="Search routes..." 
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
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Route Details</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Driver Info</th>
                                <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Monthly Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading...</td>
                                </tr>
                            ) : filteredRoutes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No routes found.</td>
                                </tr>
                            ) : (
                                filteredRoutes.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.route_name}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Bus size={12} className="text-slate-400" /> Bus: <span style={{ fontWeight: 'bold', color: '#334155' }}>{row.bus_number}</span>
                                            </p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{row.driver_name}</p>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Phone size={12} className="text-slate-400" /> {row.driver_phone || 'N/A'}
                                            </p>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #fde68a' }}>
                                                ₹ {row.monthly_fee || 0}
                                            </span>
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

export default TransportManagement;
