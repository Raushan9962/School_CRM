import React, { useState, useEffect } from 'react';

const panelStyle = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  border: '1px solid rgba(255,255,255,0.5)'
};

const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };

const DashboardOverview = () => {
  const [data, setData] = useState({
    stats: { students: 0, teachers: 0, classes: 0, attendance: '0%' },
    notices: [],
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/principal/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('API not ready');
        const json = await res.json();
        setData({ stats: json.stats, notices: json.notices, loading: false });
      } catch (err) {
        // Fallback to Hardcoded Data
        setData({
          stats: { students: 1240, teachers: 85, classes: 42, attendance: '92%' },
          notices: [
            { id: 1, title: 'Sports Day Announcement', date: 'Today' },
            { id: 2, title: 'Parent-Teacher Meeting', date: 'Next Week' },
            { id: 3, title: 'Term 2 Exam Schedule Released', date: 'In 2 days' }
          ],
          loading: false
        });
      }
    };
    fetchData();
  }, []);

  if (data.loading) return <div style={{ padding: '24px', color: '#64748b' }}>Loading dashboard data...</div>;

  return (
    <div className="dashboard-section animate-fade-in" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', marginBottom: '24px' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Students" value={data.stats.students.toLocaleString()} icon="👨‍🎓" color="#4f46e5" />
        <StatCard title="Total Teachers" value={data.stats.teachers.toString()} icon="👨‍🏫" color="#0ea5e9" />
        <StatCard title="Total Classes" value={data.stats.classes.toString()} icon="🏫" color="#8b5cf6" />
        <StatCard title="Today's Attendance" value={data.stats.attendance} icon="✅" color="#10b981" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Fee Collection Summary</h3>
          <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '48px', marginBottom: '10px' }}>📊</span>
            <p>API Data Required for Graph</p>
          </div>
        </div>
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Recent Notices & Events</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#334155' }}>
            {data.notices.map((n, i) => (
              <li key={n.id} style={{ padding: '12px 0', borderBottom: i !== data.notices.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>{n.title}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>{n.date}</span>
              </li>
            ))}
          </ul>
        </div>
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
