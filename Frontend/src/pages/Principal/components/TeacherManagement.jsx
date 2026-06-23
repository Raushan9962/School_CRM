import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', subject: '', experience: '' });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/principal/teachers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API not ready');
      const json = await res.json();
      setTeachers(json.data);
    } catch (err) {
      setTeachers([
        { id: 1, name: 'Mr. Vivek Singh', subject: 'Mathematics', exp: '8 Years', status: 'Present' },
        { id: 2, name: 'Mrs. Neha Roy', subject: 'Physics', exp: '5 Years', status: 'On Leave' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          employeeId: 'EMP-' + Math.floor(Math.random() * 100000),
          subject: formData.subject,
          experience: formData.experience,
          schoolId: 1 // Example school id
        })
      });
      if(res.ok) {
        setShowModal(false);
        setFormData({ firstName: '', lastName: '', subject: '', experience: '' });
        fetchTeachers();
      } else {
        alert('Failed to add teacher.');
      }
    } catch(err) {
      alert('Error connecting to backend.');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-section animate-fade-in" className="p-6">
      <h2 className="text-2xl font-extrabold text-indigo-950 mb-6">Teacher Management</h2>
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Add New Teacher" icon="➕" onClick={() => setShowModal(true)} />
        <ActionBtn text="Approve Leave" icon="🏖️" />
        <ActionBtn text="View Performance" icon="📊" />
      </div>
      
      <div className="glass-panel" style={panelStyle}>
        <h3 style={panelTitleStyle}>Teacher Directory</h3>
        {loading ? <p className="text-slate-500">Loading teachers...</p> : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th className="p-3">Name</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, idx) => (
                <tr key={t.id || idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#1e293b', fontWeight: '500' }}>
                  <td className="p-3">{t.name}</td>
                  <td className="p-3 text-slate-500">{t.subject}</td>
                  <td className="p-3">{t.exp}</td>
                  <td className="p-3">
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                      background: t.status === 'Present' ? '#d1fae5' : '#fee2e2',
                      color: t.status === 'Present' ? '#059669' : '#dc2626'
                    }}>{t.status}</span>
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
          <div className="animate-fade-in" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#0f172a' }}>Add New Teacher</h3>
            <form onSubmit={handleAddTeacher} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Specialization</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Experience (Years)</label>
                <input required type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({ text, icon, onClick }) => (
  <button onClick={onClick} style={{
    padding: '12px 20px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)', transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);

export default TeacherManagement;
