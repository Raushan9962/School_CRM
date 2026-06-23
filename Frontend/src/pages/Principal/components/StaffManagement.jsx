import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };


const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiFetch('/principal/staff', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('API not ready');
        const json = await res.json();
        setStaff(json.data);
      } catch (err) {
        // Fallback to Hardcoded Data
        setStaff([
          { id: 1, name: 'Suresh Kumar', role: 'Security Head', shift: 'Morning', status: 'Present' },
          { id: 2, name: 'Anita Das', role: 'Head Cleaner', shift: 'Morning', status: 'On Leave' },
          { id: 3, name: 'Ramesh Yadav', role: 'Maintenance', shift: 'Evening', status: 'Present' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-section animate-fade-in" className="p-6">
      <h2 className="text-2xl font-extrabold text-indigo-950 mb-6">Staff Management</h2>
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Monitor Staff" icon="👀" />
        <ActionBtn text="Approve Leave" icon="🏖️" />
      </div>
      
      <div className="glass-panel" style={panelStyle}>
        <h3 style={panelTitleStyle}>Teaching & Non-Teaching Staff</h3>
        {loading ? <p className="text-slate-500">Loading staff...</p> : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#1e293b', fontWeight: '500' }}>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 text-slate-500">{s.role}</td>
                  <td className="p-3">{s.shift}</td>
                  <td className="p-3">
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                      background: s.status === 'Present' ? '#d1fae5' : '#fee2e2',
                      color: s.status === 'Present' ? '#059669' : '#dc2626'
                    }}>{s.status}</span>
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
    background: 'linear-gradient(135deg, #64748b, #475569)', color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)', transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);


export default StaffManagement;
