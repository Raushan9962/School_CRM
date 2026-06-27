import React from 'react';

const GPSTracking = () => {
    const activeBuses = [
        { id: 'B-01', route: 'North City Circular', speed: '45 km/h', nextStop: 'Green Park Metro', eta: '5 mins', status: 'On Time' },
        { id: 'B-02', route: 'South Avenue Express', speed: '50 km/h', nextStop: 'Lajpat Nagar Market', eta: '12 mins', status: 'Delayed' },
        { id: 'V-01', route: 'East Side Pickups', speed: '35 km/h', nextStop: 'Preet Vihar', eta: '2 mins', status: 'On Time' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl text-slate-900">Live GPS Tracking</h2>
                <div className="flex gap-3">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span> On Time
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span> Delayed
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', flex: 1, minHeight: '500px' }}>
                {/* Mock Map Area */}
                <div style={{ background: '#e2e8f0', borderRadius: '16px', position: 'relative', overflow: 'hidden', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Placeholder for actual map integration (e.g. Google Maps, Leaflet) */}
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(226,232,240,1) 100%)', opacity: 0.5 }}></div>
                    <div style={{ textAlign: 'center', zIndex: 1 }}>
                        <span className="text-[48px]">🗺️</span>
                        <h3 style={{ color: '#475569', margin: '16px 0 0 0' }}>Interactive Map View</h3>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Real-time location of active vehicles</p>
                    </div>

                    {/* Mock map markers */}
                    <div style={{ position: 'absolute', top: '30%', left: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                        <div style={{ background: '#10b981', padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>B-01</div>
                        <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>📍</span>
                    </div>
                    <div style={{ position: 'absolute', top: '60%', left: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                        <div style={{ background: '#ef4444', padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>B-02</div>
                        <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>📍</span>
                    </div>
                </div>

                {/* Active Vehicles Side Panel */}
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '16px 16px 0 0' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Active Vehicles</h3>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                        {activeBuses.map((bus, idx) => (
                            <div key={idx} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', borderLeft: `4px solid ${bus.status === 'On Time' ? '#10b981' : '#ef4444'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Bus {bus.id}</h4>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: bus.status === 'On Time' ? '#10b981' : '#ef4444' }}>{bus.status}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span className="text-slate-500">Route:</span>
                                        <span style={{ color: '#334155', fontWeight: '500' }}>{bus.route}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span className="text-slate-500">Speed:</span>
                                        <span style={{ color: '#334155', fontWeight: '500' }}>{bus.speed}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span className="text-slate-500">Next Stop:</span>
                                        <span style={{ color: '#334155', fontWeight: '500' }}>{bus.nextStop}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '4px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                                        <span style={{ color: '#64748b', fontWeight: '600' }}>ETA:</span>
                                        <span style={{ color: '#2563eb', fontWeight: '600' }}>{bus.eta}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GPSTracking;
