import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Users, Plus, Phone } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const TransportManagement = () => {
    const [view, setView] = useState('list');
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    if (view === 'create') {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Add Transport Route</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className={labelClass}>Route Name / Area</label><input required type="text" value={form.routeName} onChange={e => setForm({...form, routeName: e.target.value})} className={inputClass} placeholder="e.g. Downtown Express" /></div>
                    <div><label className={labelClass}>Bus / Vehicle Number</label><input required type="text" value={form.busNumber} onChange={e => setForm({...form, busNumber: e.target.value})} className={inputClass} /></div>
                    <div><label className={labelClass}>Driver Name</label><input required type="text" value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})} className={inputClass} /></div>
                    <div><label className={labelClass}>Driver Phone</label><input type="text" value={form.driverPhone} onChange={e => setForm({...form, driverPhone: e.target.value})} className={inputClass} /></div>
                    <div><label className={labelClass}>Monthly Transport Fee (₹)</label><input type="number" value={form.monthlyFee} onChange={e => setForm({...form, monthlyFee: e.target.value})} className={inputClass} /></div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                        <button type="button" onClick={() => setView('list')} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">Add Route</button>
                    </div>
                </form>
            </div>
        );
    }

    const filteredRoutes = routes.filter(r => 
        r.route_name?.toLowerCase().includes(search.toLowerCase()) || 
        r.bus_number?.toLowerCase().includes(search.toLowerCase()) ||
        r.driver_name?.toLowerCase().includes(search.toLowerCase())
    );

    const kpiCards = [
        { label: 'Total Routes', value: routes.length, active: true },
        { label: 'Active Buses', value: routes.length, active: false }
    ];

    const actions = (
        <button 
            onClick={() => setView('create')} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
            <Plus size={16} strokeWidth={3} /> Add New Route
        </button>
    );

    const columns = [
        { 
            label: 'Route & Bus Details', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Bus size={20} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-800 m-0 leading-tight">{row.route_name}</p>
                        <p className="text-[11px] font-bold text-slate-500 bg-slate-100 inline-block px-1.5 rounded mt-0.5 m-0 uppercase tracking-wider">{row.bus_number}</p>
                    </div>
                </div>
            )
        },
        { 
            label: 'Driver Info', 
            sortable: true,
            render: (row) => (
                <div className="text-left">
                    <p className="font-bold text-slate-700 m-0 text-[13px]">{row.driver_name}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 m-0 mt-0.5"><Phone size={10} /> {row.driver_phone || 'N/A'}</p>
                </div>
            )
        },
        { 
            label: 'Monthly Fee', 
            sortable: true,
            render: (row) => (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[13px] font-bold border border-emerald-100">
                    ₹{row.monthly_fee || 0}
                </span>
            )
        }
    ];

    return (
        <PremiumTable 
            title="Transport Management"
            actions={actions}
            columns={columns} 
            data={filteredRoutes} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default TransportManagement;
