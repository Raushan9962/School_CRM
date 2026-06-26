import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, Bell, Megaphone, Plus, Clock, CheckCircle, Minus } from 'lucide-react';
import apiFetch from '../../../services/api';
import PremiumTable from '../../../components/ui/PremiumTable';

const CommunicationCenter = () => {
    const [search, setSearch] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await apiFetch('/principal/communications');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setMessages(data.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching communications:", err);
            }
        };
        fetchMessages();
    }, []);

    const [activeKpi, setActiveKpi] = useState('All');

    let filteredData = messages.filter(m => 
        m.subject?.toLowerCase().includes(search.toLowerCase()) || 
        m.audience?.toLowerCase().includes(search.toLowerCase())
    );

    if (activeKpi === 'Email') filteredData = filteredData.filter(m => m.type === 'Email');
    if (activeKpi === 'SMS') filteredData = filteredData.filter(m => m.type === 'SMS');
    if (activeKpi === 'App Notice') filteredData = filteredData.filter(m => m.type === 'App Notice');

    const kpiCards = [
        { label: 'Total Communications', value: '1,245', active: activeKpi === 'All', onClick: () => setActiveKpi('All'), sublabel: 'This Academic Year' },
        { label: 'Emails Sent', value: '840', active: activeKpi === 'Email', onClick: () => setActiveKpi('Email'), sublabel: '98% Delivery Rate' },
        { label: 'SMS Sent', value: '312', active: activeKpi === 'SMS', onClick: () => setActiveKpi('SMS'), sublabel: '99% Delivery Rate' },
        { label: 'App Notices', value: '93', active: activeKpi === 'App Notice', onClick: () => setActiveKpi('App Notice'), sublabel: 'High Engagement' }
    ];

    const columns = [
        { 
            label: 'Type', 
            render: (row) => {
                let Icon = Bell;
                let color = 'text-blue-500 bg-blue-50 border-blue-100';
                if (row.type === 'Email') { Icon = Mail; color = 'text-emerald-500 bg-emerald-50 border-emerald-100'; }
                if (row.type === 'SMS') { Icon = Smartphone; color = 'text-purple-500 bg-purple-50 border-purple-100'; }
                
                return (
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border font-medium text-[12px] ${color}`}>
                        <Icon size={14} />
                        {row.type}
                    </div>
                );
            }
        },
        { 
            label: 'Subject', 
            sortable: true,
            render: (row) => (
                <div className="text-left max-w-[300px]">
                    <p className="font-bold text-slate-800 m-0 truncate">{row.subject}</p>
                    <p className="text-[11px] text-slate-500 m-0 truncate">By: {row.author}</p>
                </div>
            )
        },
        { 
            label: 'Audience', 
            render: (row) => <span className="text-slate-600 font-medium">{row.audience}</span>
        },
        { 
            label: 'Date', 
            sortable: true,
            render: (row) => <span className="text-slate-600 text-sm">{row.date}</span>
        },
        { 
            label: 'Status', 
            render: (row) => {
                let badgeClass = 'bg-slate-100 text-slate-600';
                let Icon = Clock;
                if (row.status === 'Sent') { badgeClass = 'bg-emerald-100 text-emerald-700'; Icon = CheckCircle; }
                if (row.status === 'Scheduled') { badgeClass = 'bg-blue-100 text-blue-700'; Icon = Clock; }
                if (row.status === 'Draft') { badgeClass = 'bg-amber-100 text-amber-700'; Icon = Minus; }
                
                return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        <Icon size={12} />
                        {row.status}
                    </span>
                );
            }
        }
    ];

    const actions = (
        <>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                <Megaphone size={16} /> New Announcement
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                <Plus size={16} /> Compose Message
            </button>
        </>
    );

    return (
        <PremiumTable 
            title="Communication Center"
            actions={actions}
            columns={columns} 
            data={filteredData} 
            kpiCards={kpiCards}
            onSearch={setSearch}
        />
    );
};

export default CommunicationCenter;
