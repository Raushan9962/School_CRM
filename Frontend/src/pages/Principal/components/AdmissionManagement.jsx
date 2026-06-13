import React, { useState, useEffect } from 'react';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };


const AdmissionManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/principal/admissions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('API not ready');
        const json = await res.json();
        setApplications(json.data);
      } catch (err) {
        // Fallback to Hardcoded Data
        setApplications([
          { id: 'APP-101', name: 'Kabir Khan', appliedClass: 'Class 6', date: '12 May 2026', status: 'Pending Review' },
          { id: 'APP-102', name: 'Sanya Malhotra', appliedClass: 'Class 11', date: '14 May 2026', status: 'Approved' },
          { id: 'APP-103', name: 'Vedant Joshi', appliedClass: 'Class 1', date: '15 May 2026', status: 'Docs Pending' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-section animate-fade-in" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', marginBottom: '24px' }}>Admission Management</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <ActionBtn text="Approve Admissions" icon="✅" />
        <ActionBtn text="Reject Applications" icon="❌" />
      </div>
      
      <div className="glass-panel" style={panelStyle}>
        <h3 style={panelTitleStyle}>New Applications</h3>
        {loading ? <p style={{ color: '#64748b' }}>Loading applications...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px' }}>App ID</th>
                <th style={{ padding: '12px' }}>Student Name</th>
                <th style={{ padding: '12px' }}>Applied For</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#1e293b', fontWeight: '500' }}>
                  <td style={{ padding: '12px', color: '#64748b' }}>{a.id}</td>
                  <td style={{ padding: '12px' }}>{a.name}</td>
                  <td style={{ padding: '12px' }}>{a.appliedClass}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{a.date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                      background: a.status === 'Approved' ? '#d1fae5' : (a.status === 'Pending Review' ? '#fef3c7' : '#fee2e2'),
                      color: a.status === 'Approved' ? '#059669' : (a.status === 'Pending Review' ? '#d97706' : '#dc2626')
                    }}>{a.status}</span>
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
    background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)', transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);


export default AdmissionManagement;
