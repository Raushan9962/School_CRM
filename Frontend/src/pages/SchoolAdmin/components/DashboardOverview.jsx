import React from 'react';

const DashboardOverview = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', margin: '0' }}>General Staff Directory</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage all administrative and general users.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Staff" value="142" icon="👥" color="#4f46e5" />
        <StatCard title="Active Today" value="130" icon="✅" color="#10b981" />
        <StatCard title="New Joinees" value="5" icon="✨" color="#f59e0b" />
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', 
        borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', 
        border: '1px solid rgba(255,255,255,0.5)' 
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Recent Staff Activity</h3>
        <p style={{ color: '#64748b' }}>Staff activity logs and directory list will appear here.</p>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ 
    background: 'white', borderRadius: '16px', padding: '20px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', 
    alignItems: 'center', gap: '16px', borderLeft: `4px solid ${color}`,
    transition: 'transform 0.2s', cursor: 'pointer'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ margin: '4px 0 0', fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>{value}</h3>
    </div>
  </div>
);

export default DashboardOverview;
