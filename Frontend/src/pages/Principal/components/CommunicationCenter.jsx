import React, { useState, useEffect } from 'react';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };


const CommunicationCenter = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/principal/communications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('API not ready');
        const json = await res.json();
        setMessages(json.data);
      } catch (err) {
        // Fallback to Hardcoded Data
        setMessages([
          { id: 1, type: 'Email', subject: 'Fee Reminder Term 1', audience: 'All Parents', date: 'Yesterday', status: 'Sent' },
          { id: 2, type: 'SMS', subject: 'Holiday Tomorrow', audience: 'All Students & Staff', date: 'Today', status: 'Sent' },
          { id: 3, type: 'App Notice', subject: 'Exam Schedule', audience: 'Class 10, 12', date: 'Just Now', status: 'Draft' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-section animate-fade-in" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', marginBottom: '24px' }}>Communication Center</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <ActionBtn text="Send Notices to All" icon="📢" />
        <ActionBtn text="Notify Specific Classes" icon="📨" />
      </div>
      
      <div className="glass-panel" style={panelStyle}>
        <h3 style={panelTitleStyle}>Announcements & Circulars</h3>
        {loading ? <p style={{ color: '#64748b' }}>Loading messages...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Subject</th>
                <th style={{ padding: '12px' }}>Audience</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#1e293b', fontWeight: '500' }}>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '18px', marginRight: '8px' }}>
                      {m.type === 'Email' ? '📧' : (m.type === 'SMS' ? '📱' : '🔔')}
                    </span>
                    {m.type}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{m.subject}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{m.audience}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{m.date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                      background: m.status === 'Sent' ? '#d1fae5' : '#f1f5f9',
                      color: m.status === 'Sent' ? '#059669' : '#475569'
                    }}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ActionBtn = ({ text, icon }) => (
  <button style={{
    padding: '12px 20px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #a855f7, #7e22ce)', color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)', transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);


export default CommunicationCenter;
