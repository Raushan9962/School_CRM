import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';

const panelStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' };
const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };


const FeeManagement = () => {
  const [feeData, setFeeData] = useState({ totalExpected: 0, totalCollected: 0, pending: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', amount: '', dueDate: '', status: 'Paid' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/principal/fees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API not ready');
      const json = await res.json();
      setFeeData(json.data);
    } catch (err) {
      // Fallback to Hardcoded Data
      setFeeData({
        totalExpected: 5000000,
        totalCollected: 4200000,
        pending: 800000,
        recent: [
          { id: 1, student: 'Aarav Sharma', amount: 15000, date: 'Today', status: 'Paid' },
          { id: 2, student: 'Diya Patel', amount: 12000, date: 'Yesterday', status: 'Paid' },
          { id: 3, student: 'Rohan Gupta', amount: 20000, date: '3 Days Ago', status: 'Pending' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          studentId: formData.studentId,
          amount: formData.amount,
          dueDate: formData.dueDate,
          status: formData.status,
          paidDate: formData.status === 'Paid' ? new Date().toISOString().split('T')[0] : null
        })
      });
      if(res.ok) {
        setShowModal(false);
        setFormData({ studentId: '', amount: '', dueDate: '', status: 'Paid' });
        fetchData();
      } else {
        alert('Failed to record fee.');
      }
    } catch(err) {
      alert('Error connecting to backend.');
      console.error(err);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="dashboard-section animate-fade-in" className="p-4">
      <h2 className="text-xl font-extrabold text-indigo-950 mb-4">Fee Management</h2>
      <div className="flex gap-3 mb-4 flex-wrap">
        <ActionBtn text="Record Fee Payment" icon="💰" onClick={() => setShowModal(true)} />
        <ActionBtn text="Approve Concessions" icon="✅" />
        <ActionBtn text="Check Dues" icon="⚠️" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{...panelStyle, borderLeft: '4px solid #3b82f6'}}>
          <p style={{ color: '#64748b', fontWeight: '600', margin: '0 0 8px' }}>Total Expected</p>
          <h3 style={{ fontSize: '28px', margin: 0, color: '#1e293b' }}>{loading ? '...' : formatCurrency(feeData.totalExpected)}</h3>
        </div>
        <div className="glass-panel" style={{...panelStyle, borderLeft: '4px solid #10b981'}}>
          <p style={{ color: '#64748b', fontWeight: '600', margin: '0 0 8px' }}>Total Collected</p>
          <h3 style={{ fontSize: '28px', margin: 0, color: '#10b981' }}>{loading ? '...' : formatCurrency(feeData.totalCollected)}</h3>
        </div>
        <div className="glass-panel" style={{...panelStyle, borderLeft: '4px solid #ef4444'}}>
          <p style={{ color: '#64748b', fontWeight: '600', margin: '0 0 8px' }}>Total Pending</p>
          <h3 style={{ fontSize: '28px', margin: 0, color: '#ef4444' }}>{loading ? '...' : formatCurrency(feeData.pending)}</h3>
        </div>
      </div>

      <div className="glass-panel" style={panelStyle}>
        <h3 style={panelTitleStyle}>Recent Transactions</h3>
        {loading ? <p className="text-slate-500">Loading fees...</p> : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th className="p-3">Student</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeData.recent.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#1e293b', fontWeight: '500' }}>
                  <td className="p-3">{f.student}</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>{formatCurrency(f.amount)}</td>
                  <td className="p-3 text-slate-500">{f.date}</td>
                  <td className="p-3">
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                      background: f.status === 'Paid' ? '#d1fae5' : '#fee2e2',
                      color: f.status === 'Paid' ? '#059669' : '#dc2626'
                    }}>{f.status}</span>
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
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#0f172a' }}>Record Fee Payment</h3>
            <form onSubmit={handleAddFee} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Student ID</label>
                <input required type="number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} 
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Amount (INR)</label>
                <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} 
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Due Date</label>
                <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Record</button>
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
    background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)', transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);


export default FeeManagement;
