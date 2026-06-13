import React, { useState, useEffect } from 'react';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };


const ExaminationManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/principal/exams', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('API not ready');
        const json = await res.json();
        setExams(json.data);
      } catch (err) {
        // Fallback to Hardcoded Data
        setExams([
          { id: 1, name: 'Term 1 Final', classes: '1 to 12', date: '15 Oct 2026', status: 'Completed' },
          { id: 2, name: 'Term 2 Unit Test', classes: '9 to 12', date: '20 Nov 2026', status: 'Upcoming' },
          { id: 3, name: 'Pre-Boards', classes: '10, 12', date: '05 Jan 2027', status: 'Scheduled' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-section animate-fade-in" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', marginBottom: '24px' }}>Examination Management</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <ActionBtn text="Create Exams" icon="📝" />
        <ActionBtn text="Publish Results" icon="📢" />
        <ActionBtn text="Analyze Performance" icon="📈" />
      </div>
      
      <div className="glass-panel" style={panelStyle}>
        <h3 style={panelTitleStyle}>Exam Schedules & Results</h3>
        {loading ? <p style={{ color: '#64748b' }}>Loading exams...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px' }}>Exam Name</th>
                <th style={{ padding: '12px' }}>Classes</th>
                <th style={{ padding: '12px' }}>Start Date</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#1e293b', fontWeight: '500' }}>
                  <td style={{ padding: '12px' }}>{e.name}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{e.classes}</td>
                  <td style={{ padding: '12px' }}>{e.date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                      background: e.status === 'Completed' ? '#d1fae5' : (e.status === 'Upcoming' ? '#fef3c7' : '#e0e7ff'),
                      color: e.status === 'Completed' ? '#059669' : (e.status === 'Upcoming' ? '#d97706' : '#4f46e5')
                    }}>{e.status}</span>
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
    background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);


export default ExaminationManagement;
