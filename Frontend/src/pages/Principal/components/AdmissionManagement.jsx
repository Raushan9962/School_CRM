import React, { useState, useEffect } from 'react';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };


const AdmissionManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', classId: '' });

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/students/${formData.studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ classId: formData.classId })
      });
      if(res.ok) {
        setShowModal(false);
        setFormData({ studentId: '', classId: '' });
        fetchData();
      } else {
        alert('Failed to approve admission.');
      }
    } catch(err) {
      alert('Error connecting to backend.');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-section animate-fade-in" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1b4b', marginBottom: '24px' }}>Admission Management</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <ActionBtn text="Approve Admissions" icon="✅" onClick={() => setShowModal(true)} />
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

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(4px)'
        }}>
          <div className="animate-fade-in" style={{
            background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#0f172a' }}>Approve Admission</h3>
            <form onSubmit={handleApprove} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Application / Student ID</label>
                <input required type="number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Assign to Class ID</label>
                <input required type="number" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Approve</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
