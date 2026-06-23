import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };


const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiFetch('/principal/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('API not ready');
        const json = await res.json();
        setEvents(json.data);
      } catch (err) {
        // Fallback to Hardcoded Data
        setEvents([
          { id: 1, title: 'Annual Sports Day', type: 'Sports', date: '25 Nov 2026', time: '09:00 AM' },
          { id: 2, title: 'Diwali Break', type: 'Holiday', date: '10 Nov - 14 Nov 2026', time: 'All Day' },
          { id: 3, title: 'Science Exhibition', type: 'Academic', date: '05 Dec 2026', time: '10:00 AM' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-section animate-fade-in" className="p-6">
      <h2 className="text-2xl font-extrabold text-indigo-950 mb-6">Events Management</h2>
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Create Events" icon="🎉" />
        <ActionBtn text="Publish Calendars" icon="📅" />
      </div>
      
      <div className="glass-panel" style={panelStyle}>
        <h3 style={panelTitleStyle}>School Events & Holidays</h3>
        {loading ? <p className="text-slate-500">Loading events...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', borderLeft: `4px solid ${e.type === 'Holiday' ? '#ef4444' : (e.type === 'Sports' ? '#3b82f6' : '#8b5cf6')}` }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e293b' }}>{e.title}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{e.date} • {e.time}</p>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#f1f5f9', color: '#475569' }}>
                  {e.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ActionBtn = ({ text, icon }) => (
  <button style={{
    padding: '12px 20px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);


export default EventsManagement;
