import React from 'react';

const TransportOverview = () => {
    const stats = [
        { label: 'Total Buses', value: '45', icon: '🚌', color: 'from-blue-500 to-blue-600', shadow: 'rgba(59, 130, 246, 0.3)' },
        { label: 'Active Routes', value: '24', icon: '🗺️', color: 'from-emerald-500 to-emerald-600', shadow: 'rgba(16, 185, 129, 0.3)' },
        { label: 'Total Drivers', value: '50', icon: '👨‍✈️', color: 'from-violet-500 to-violet-600', shadow: 'rgba(139, 92, 246, 0.3)' },
        { label: 'Students Using Transport', value: '1,250', icon: '👨‍🎓', color: 'from-amber-500 to-amber-600', shadow: 'rgba(245, 158, 11, 0.3)' },
        { label: 'Today\'s Trips', value: '48', icon: '🚦', color: 'from-cyan-500 to-cyan-600', shadow: 'rgba(6, 182, 212, 0.3)' },
        { label: 'Vehicles Under Maintenance', value: '3', icon: '🔧', color: 'from-rose-500 to-rose-600', shadow: 'rgba(225, 29, 72, 0.3)' },
        { label: 'Pending Transport Requests', value: '12', icon: '📨', color: 'from-fuchsia-500 to-fuchsia-600', shadow: 'rgba(217, 70, 239, 0.3)' }
    ];

    // Helper for gradient colors since Tailwind classes might not be fully loaded dynamically without full setup
    const getGradient = (colorString) => {
        const colorMap = {
            'from-blue-500 to-blue-600': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            'from-emerald-500 to-emerald-600': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'from-violet-500 to-violet-600': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            'from-amber-500 to-amber-600': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'from-cyan-500 to-cyan-600': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            'from-rose-500 to-rose-600': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
            'from-fuchsia-500 to-fuchsia-600': 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
        };
        return colorMap[colorString] || 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
    };

    return (
        <div className="flex flex-col gap-6">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} style={{ 
                        background: getGradient(stat.color), 
                        padding: '24px', 
                        borderRadius: '16px', 
                        color: 'white', 
                        boxShadow: `0 10px 15px -3px ${stat.shadow}`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>{stat.label}</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{stat.value}</p>
                        </div>
                        <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '80px', opacity: 0.15, zIndex: 0 }}>
                            {stat.icon}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Recent Transport Requests</h3>
                    <ul className="list-none p-0 m-0">
                        <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: '600', color: '#334155', fontSize: '14px' }}>New Route Assignment</p>
                                <span className="text-xs text-slate-500">Aarav Patel (Class 10-A)</span>
                            </div>
                            <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#d97706', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>Pending</span>
                        </li>
                        <li style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: '600', color: '#334155', fontSize: '14px' }}>Stop Change</p>
                                <span className="text-xs text-slate-500">Diya Sharma (Class 9-B)</span>
                            </div>
                            <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>Approved</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Maintenance Alerts</h3>
                    <ul className="list-none p-0 m-0">
                        <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px' }}>🔧</span>
                            <div>
                                <p style={{ margin: 0, fontWeight: '600', color: '#334155', fontSize: '14px' }}>Bus 04 - Routine Service</p>
                                <span style={{ fontSize: '12px', color: '#ef4444' }}>Overdue by 2 days</span>
                            </div>
                        </li>
                        <li style={{ padding: '12px 0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px' }}>⚠️</span>
                            <div>
                                <p style={{ margin: 0, fontWeight: '600', color: '#334155', fontSize: '14px' }}>License Expiry (Rajesh Kumar)</p>
                                <span style={{ fontSize: '12px', color: '#f59e0b' }}>Expires in 10 days</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TransportOverview;
