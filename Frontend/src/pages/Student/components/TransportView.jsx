import React from 'react';

const TransportView = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Transport Details</h2>
                <button style={{ padding: '8px 16px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(16,185,129,0.2)' }}>
                    📍 Track Bus Live
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🚌</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Assigned Bus</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Bus 12 (City Center)</h3>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🛑</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Route</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Route 12</h3>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⏰</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Pickup / Drop</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>07:30 AM / 03:45 PM</h3>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💰</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Transport Fee Status</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#10b981' }}>Paid</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1e293b' }}>Driver Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👨‍✈️</div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>Mr. Ramesh Kumar</h4>
                            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>Experience: 8 Years</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>Contact</span>
                                    <span style={{ color: '#1e293b', fontWeight: '500', fontSize: '14px' }}>+91 9876543210</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>Bus No.</span>
                                    <span style={{ color: '#1e293b', fontWeight: '500', fontSize: '14px' }}>MH 12 AB 1234</span>
                                </div>
                            </div>
                        </div>
                        <button style={{ width: '100%', padding: '10px', background: 'white', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
                            📞 Call Driver
                        </button>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1e293b' }}>Route Schedule</h3>
                    <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px dashed #cbd5e1', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[
                            { time: '07:00 AM', stop: 'School Campus', status: 'Start', isCurrent: false },
                            { time: '07:15 AM', stop: 'Station Road', status: 'Passed', isCurrent: false },
                            { time: '07:30 AM', stop: 'Central Park Gate', status: 'Your Stop', isCurrent: true },
                            { time: '07:45 AM', stop: 'City Mall Junction', status: 'Upcoming', isCurrent: false },
                            { time: '08:00 AM', stop: 'School Campus', status: 'End', isCurrent: false }
                        ].map((stop, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-33px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: stop.isCurrent ? '#3b82f6' : (stop.status === 'Passed' || stop.status === 'Start' ? '#10b981' : '#cbd5e1'), border: '4px solid white', boxShadow: '0 0 0 1px #e2e8f0' }}></div>
                                <div style={{ background: stop.isCurrent ? '#eff6ff' : '#f8fafc', padding: '16px', borderRadius: '12px', border: stop.isCurrent ? '1px solid #bfdbfe' : '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '15px', color: stop.isCurrent ? '#1d4ed8' : '#1e293b' }}>{stop.stop}</h4>
                                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: stop.isCurrent ? '#3b82f6' : (stop.status === 'Passed' || stop.status === 'Start' ? '#dcfce7' : '#f1f5f9'), color: stop.isCurrent ? 'white' : (stop.status === 'Passed' || stop.status === 'Start' ? '#166534' : '#64748b'), fontWeight: '600' }}>
                                            {stop.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Expected Time: {stop.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportView;
